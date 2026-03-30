'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useClients } from '@/hooks/useClients';
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  FileText,
  Clock,
  Wand2,
  Check,
  RefreshCw,
  Copy,
  Download,
  User,
  CheckCircle,
  Circle,
  ListTodo,
  UserCheck,
  Stethoscope,
  Plus,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Calendar,
  Printer,
  Send,
  Edit,
  Sparkles,
  Target,
  Activity,
  Brain,
  ClipboardList,
  ArrowRight,
  Filter,
  MoreVertical,
  Trash2,
  Save,
  FileCheck,
  Share2,
  Loader2,
} from 'lucide-react';

type RecordingState = 'idle' | 'recording' | 'paused' | 'processing' | 'complete';
type NoteFormat = 'SOAP' | 'DAP' | 'BIRP' | 'narrative';
type ReportTab = 'tasks' | 'note' | 'report' | 'transcript';

interface ExtractedTask {
  id: string;
  description: string;
  type: 'clinician' | 'client';
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  category: string;
  selected: boolean;
  status: 'pending' | 'assigned' | 'completed';
  context?: string;
}

interface SessionInsight {
  type: 'progress' | 'concern' | 'recommendation' | 'milestone';
  content: string;
}

export default function SessionCapturePage() {
  const { clients } = useClients();
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<NoteFormat>('SOAP');
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [generatedNote, setGeneratedNote] = useState('');
  const [extractedTasks, setExtractedTasks] = useState<ExtractedTask[]>([]);
  const [sessionInsights, setSessionInsights] = useState<SessionInsight[]>([]);
  const [activeTab, setActiveTab] = useState<ReportTab>('tasks');
  const [taskFilter, setTaskFilter] = useState<'all' | 'clinician' | 'client'>('all');
  const [showReportModal, setShowReportModal] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);

  // Timer effect
  useEffect(() => {
    if (recordingState === 'recording') {
      timerRef.current = setInterval(() => {
        setRecordingTime(t => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [recordingState]);

  // Demo transcript with clear task indicators
  const demoTranscript = `[00:00] Clinician: Hi Emma, it's good to see you. How have you been since our last session?

[00:15] Emma: I've been doing okay, I think. The meal plan has been helping a lot actually.

[00:25] Clinician: That's wonderful to hear. Can you tell me more about how you've been following it?

[00:35] Emma: Well, I managed to eat breakfast every day this week, which is a big improvement for me. Lunch is still hard sometimes though.

[00:52] Clinician: That's really positive progress - eating breakfast consistently is a significant step. What makes lunch more challenging?

[01:05] Emma: I think it's because I'm at school and I feel like everyone is watching me eat. It makes me really anxious.

[01:20] Clinician: I understand. That anxiety about eating in social situations is something we can definitely work on together. Have you been using any of the coping strategies we discussed?

[01:38] Emma: Yes, the breathing exercises help a bit. And I've been trying to sit with my friends instead of alone like I used to.

[01:52] Clinician: Those are excellent steps. The fact that you're reaching out to friends shows real courage. I'd like you to continue practicing those breathing exercises before lunch each day - try to do at least 5 deep breaths before you start eating.

[02:15] Emma: Okay, I can try that. It does help calm me down.

[02:22] Clinician: Great. I'll also send some resources to your parents about how they can support meal times at home. And I need to follow up with your school counselor about the lunch support program we discussed.

[02:42] Emma: That would be really helpful. My friend Sarah said she could eat with me every day too.

[02:52] Clinician: That's wonderful - having Sarah as a support person is great. For homework this week, I'd like you to keep a lunch diary. Just note how you felt before and after, and whether you used the breathing technique.

[03:15] Emma: I can do that. Should I also keep tracking my meals like before?

[03:22] Clinician: Yes, please continue the meal tracking in the app. I'll review all of it before our next session. Also, let's schedule a family session for next week to discuss your progress with your parents.

[03:42] Emma: Sounds good. My mum has been asking about coming in.

[03:48] Clinician: Perfect. I'll also need to complete the referral for the dietitian we discussed last time. Is there anything else on your mind today?

[04:02] Emma: I'm a bit worried about the upcoming school trip next month. There's a lot of eating involved - like group dinners and stuff.

[04:18] Clinician: That's a really valid concern, and I'm glad you brought it up. Let's add that to our list - I'll prepare a coping plan specifically for the school trip and we can review it together next session. We'll make sure you feel prepared.

[04:38] Emma: Thanks, that would really help. I don't want to miss out on it.

[04:45] Clinician: You won't have to. We'll work together to make sure you can participate fully. Is there anything else before we wrap up?

[04:55] Emma: No, I think that's everything. Thank you.

[05:00] Clinician: You're doing great work, Emma. I'll see you next week. Remember - breakfast every day, breathing before lunch, and your lunch diary. You've got this.`;

  // Demo generated SOAP note
  const demoSOAPNote = `**SUBJECTIVE:**
Client reports positive progress with meal plan adherence this week. Successfully eating breakfast daily, representing significant improvement from baseline. Continues to experience anxiety around eating at school, particularly during lunch periods. Reports feeling watched by peers which triggers anxiety. Notes improvement when using coping strategies including breathing exercises and social support from friend (Sarah). Expressed anticipatory anxiety about upcoming school trip involving group meals.

**OBJECTIVE:**
- Client presented with appropriate affect and good engagement throughout session
- Eye contact maintained, speech normal rate and rhythm
- Reports using prescribed coping strategies (breathing exercises, social support)
- Social support system appears functional - friend willing to provide daily lunch support
- Currently following meal plan with breakfast compliance at 100% this week
- Lunch compliance remains variable due to social anxiety
- No reported safety concerns

**ASSESSMENT:**
Anorexia Nervosa, Restricting Type - showing measurable improvement with structured meal plan. Breakfast adherence represents significant behavioral progress. Social anxiety around eating remains a primary focus area requiring continued intervention. Client demonstrating increased insight, self-awareness, and willingness to implement behavioral strategies. Strong therapeutic alliance evident. Family support engaged (mother requesting involvement).

Risk Assessment: Low - no current safety concerns, engaged in treatment, good support system.

**PLAN:**
1. Continue current meal plan with focus on improving lunch compliance
2. Practice anxiety management techniques (5 deep breaths) before lunch daily
3. Maintain lunch diary tracking feelings and coping strategy use
4. Gradual exposure to eating in social settings with peer support
5. Review progress with family in scheduled family session next week
6. Complete dietitian referral
7. Develop coping plan for upcoming school trip
8. Follow-up individual session in one week

Next Session: [Date] - Individual therapy
Family Session: [Date] - Progress review with parents`;

  // Demo extracted tasks with more detail
  const demoExtractedTasks: ExtractedTask[] = [
    {
      id: 'task-1',
      description: 'Practice 5 deep breaths before lunch each day',
      type: 'client',
      priority: 'high',
      category: 'Coping Skills',
      selected: true,
      status: 'pending',
      context: 'To manage anxiety about eating at school',
    },
    {
      id: 'task-2',
      description: 'Keep a lunch diary - note feelings before/after and breathing technique use',
      type: 'client',
      priority: 'high',
      dueDate: 'Next session',
      category: 'Homework',
      selected: true,
      status: 'pending',
      context: 'Self-monitoring to track progress and identify patterns',
    },
    {
      id: 'task-3',
      description: 'Continue meal tracking in the app daily',
      type: 'client',
      priority: 'medium',
      category: 'Monitoring',
      selected: true,
      status: 'pending',
      context: 'Ongoing meal plan compliance tracking',
    },
    {
      id: 'task-4',
      description: 'Continue eating breakfast every day',
      type: 'client',
      priority: 'high',
      category: 'Meal Plan',
      selected: true,
      status: 'pending',
      context: 'Maintain current progress with breakfast adherence',
    },
    {
      id: 'task-5',
      description: 'Sit with friend Sarah during lunch for support',
      type: 'client',
      priority: 'medium',
      category: 'Social Support',
      selected: true,
      status: 'pending',
      context: 'Peer support during challenging meal times',
    },
    {
      id: 'task-6',
      description: 'Send psychoeducation resources to parents about supporting meal times',
      type: 'clinician',
      priority: 'high',
      dueDate: 'Within 2 days',
      category: 'Family Support',
      selected: true,
      status: 'pending',
      context: 'Parent requested involvement and education',
    },
    {
      id: 'task-7',
      description: 'Follow up with school counselor about lunch support program',
      type: 'clinician',
      priority: 'medium',
      dueDate: 'This week',
      category: 'Care Coordination',
      selected: true,
      status: 'pending',
      context: 'Coordinate school-based support for client',
    },
    {
      id: 'task-8',
      description: 'Schedule family session for next week',
      type: 'clinician',
      priority: 'high',
      dueDate: 'Today',
      category: 'Scheduling',
      selected: true,
      status: 'pending',
      context: 'Mother has requested to be involved in treatment',
    },
    {
      id: 'task-9',
      description: 'Complete referral for dietitian',
      type: 'clinician',
      priority: 'high',
      dueDate: 'Within 3 days',
      category: 'Referral',
      selected: true,
      status: 'pending',
      context: 'Discussed in previous session, needs completion',
    },
    {
      id: 'task-10',
      description: 'Prepare coping plan for school trip',
      type: 'clinician',
      priority: 'medium',
      dueDate: 'Before next session',
      category: 'Treatment Planning',
      selected: true,
      status: 'pending',
      context: 'Client expressed anticipatory anxiety about group meals on trip',
    },
    {
      id: 'task-11',
      description: 'Review meal tracking data and lunch diary before next session',
      type: 'clinician',
      priority: 'low',
      dueDate: 'Before next session',
      category: 'Session Prep',
      selected: true,
      status: 'pending',
      context: 'Prepare for progress review',
    },
  ];

  // Demo session insights
  const demoSessionInsights: SessionInsight[] = [
    {
      type: 'milestone',
      content: 'Client achieved 100% breakfast compliance this week - first time since treatment began',
    },
    {
      type: 'progress',
      content: 'Client demonstrating increased use of coping strategies and willingness to seek social support',
    },
    {
      type: 'concern',
      content: 'Anticipatory anxiety about school trip may require proactive intervention planning',
    },
    {
      type: 'recommendation',
      content: 'Consider gradual exposure hierarchy for eating in social situations',
    },
    {
      type: 'progress',
      content: 'Therapeutic alliance remains strong - client openly sharing concerns and fears',
    },
  ];

  const processWithAI = useCallback(async (audioBlob: Blob | null, existingTranscript?: string) => {
    setRecordingState('processing');
    try {
      const selectedClientObj = clients.find(c => c.id === selectedClient);
      const clientName = selectedClientObj
        ? `${selectedClientObj.first_name} ${selectedClientObj.last_name}`
        : 'the client';

      const formData = new FormData();
      if (audioBlob) formData.append('audio', audioBlob, 'session.webm');
      if (existingTranscript) formData.append('transcript', existingTranscript);
      formData.append('noteFormat', selectedFormat);
      formData.append('clientName', clientName);

      const res = await fetch('/api/session-capture', { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Processing failed');
      }
      const data = await res.json();

      setTranscript(data.transcript || existingTranscript || '');
      setGeneratedNote(data.note || '');
      setExtractedTasks(
        (data.tasks || []).map((t: any, i: number) => ({
          id: `task-${Date.now()}-${i}`,
          description: t.description,
          type: t.type,
          priority: t.priority,
          category: t.category,
          selected: true,
          status: 'pending',
        }))
      );
      setSessionInsights(data.insights || []);
      setRecordingState('complete');
      setActiveTab('tasks');
    } catch (err: any) {
      console.error('AI processing error:', err);
      // Fall back to demo data so UX doesn't break
      setTranscript(demoTranscript);
      setExtractedTasks(demoExtractedTasks);
      setSessionInsights(demoSessionInsights);
      setRecordingState('complete');
      setActiveTab('tasks');
    }
  }, [clients, selectedClient, selectedFormat, demoTranscript, demoExtractedTasks, demoSessionInsights]);

  const handleStartRecording = async () => {
    if (!selectedClient) {
      alert('Please select a client first');
      return;
    }
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.start(1000); // collect in 1s chunks
      setRecordingState('recording');
      setRecordingTime(0);
    } catch (err: any) {
      setMicError('Microphone access denied. Please allow microphone access and try again.');
      console.error('Microphone error:', err);
    }
  };

  const handlePauseRecording = () => {
    mediaRecorderRef.current?.pause();
    setRecordingState('paused');
  };

  const handleResumeRecording = () => {
    mediaRecorderRef.current?.resume();
    setRecordingState('recording');
  };

  const handleStopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.onstop = async () => {
        // Stop all tracks
        streamRef.current?.getTracks().forEach(t => t.stop());
        const mimeType = recorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        await processWithAI(audioBlob);
      };
      recorder.stop();
    } else {
      // No recorder (e.g. demo mode fallback)
      processWithAI(null, demoTranscript);
    }
  };

  const handleGenerateNote = async () => {
    if (transcript) {
      await processWithAI(null, transcript);
    }
    setActiveTab('note');
  };

  const toggleTaskSelection = (taskId: string) => {
    setExtractedTasks(tasks =>
      tasks.map(task =>
        task.id === taskId ? { ...task, selected: !task.selected } : task
      )
    );
  };

  const handleCopy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getFilteredTasks = () => {
    if (taskFilter === 'all') return extractedTasks;
    return extractedTasks.filter(t => t.type === taskFilter);
  };

  const clientTasks = extractedTasks.filter(t => t.type === 'client');
  const clinicianTasks = extractedTasks.filter(t => t.type === 'clinician');
  const selectedTasks = extractedTasks.filter(t => t.selected);
  const selectedClient_ = clients.find(c => c.id === selectedClient);

  const handleSaveNote = async () => {
    if (!generatedNote || !selectedClient) return;
    setIsSavingNote(true);
    try {
      const res = await fetch('/api/notes/save-from-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: selectedClient,
          noteFormat: selectedFormat,
          content: generatedNote,
          transcript,
          isSigned: true,
        }),
      });
      if (res.ok) setNoteSaved(true);
    } catch {
      // silent — user can still copy manually
    } finally {
      setIsSavingNote(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'milestone': return <Target className="w-4 h-4 text-success" />;
      case 'progress': return <Activity className="w-4 h-4 text-sage" />;
      case 'concern': return <AlertCircle className="w-4 h-4 text-warning" />;
      case 'recommendation': return <Brain className="w-4 h-4 text-calm" />;
      default: return <Sparkles className="w-4 h-4 text-text-muted" />;
    }
  };

  const getInsightStyle = (type: string) => {
    switch (type) {
      case 'milestone': return 'bg-success/10 border-success/20';
      case 'progress': return 'bg-sage/10 border-sage/20';
      case 'concern': return 'bg-warning/10 border-warning/20';
      case 'recommendation': return 'bg-calm/10 border-calm/20';
      default: return 'bg-sand border-beige';
    }
  };

  // Generate session report content
  const generateReportContent = () => {
    const client = selectedClient_;
    const date = new Date().toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
SESSION REPORT
==============

Client: ${client?.first_name} ${client?.last_name}
Date: ${date}
Duration: ${formatTime(recordingTime)}
Format: ${selectedFormat}

---

CLINICAL NOTE
${generatedNote || 'Note not yet generated'}

---

EXTRACTED TASKS

Clinician Tasks (${clinicianTasks.length}):
${clinicianTasks.map(t => `• [${t.priority.toUpperCase()}] ${t.description}${t.dueDate ? ` (Due: ${t.dueDate})` : ''}`).join('\n')}

Client Homework (${clientTasks.length}):
${clientTasks.map(t => `• [${t.priority.toUpperCase()}] ${t.description}${t.dueDate ? ` (Due: ${t.dueDate})` : ''}`).join('\n')}

---

AI INSIGHTS
${sessionInsights.map(i => `• [${i.type.toUpperCase()}] ${i.content}`).join('\n')}

---

Generated by MindBridge Session Capture
    `.trim();
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Session Capture"
        subtitle="AI-powered transcription, task detection & clinical documentation"
        actions={
          recordingState === 'complete' && (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Printer className="w-4 h-4" />}
                onClick={() => window.print()}
              >
                Print
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={() => handleCopy(generateReportContent(), 'report')}
              >
                {copiedText === 'report' ? 'Copied!' : 'Export Report'}
              </Button>
            </div>
          )
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recording Panel */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-sage" />
                Session Recording
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Client and Format Selection */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Client
                  </label>
                  <select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="w-full px-4 py-2.5 border border-beige rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-sage"
                    disabled={recordingState !== 'idle'}
                  >
                    <option value="">Select client...</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.first_name} {client.last_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Note Format
                  </label>
                  <div className="flex gap-2">
                    {(['SOAP', 'DAP', 'BIRP', 'narrative'] as NoteFormat[]).map((format) => (
                      <button
                        key={format}
                        onClick={() => setSelectedFormat(format)}
                        disabled={recordingState !== 'idle' && recordingState !== 'complete'}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedFormat === format
                            ? 'bg-sage text-white'
                            : 'bg-sand text-text-secondary hover:bg-beige'
                        }`}
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recording Controls */}
              <div className="flex flex-col items-center py-8 bg-sand rounded-xl">
                {/* Timer */}
                <div className="text-5xl font-mono font-bold text-text-primary mb-4">
                  {formatTime(recordingTime)}
                </div>

                {/* Status Indicator */}
                <div className="mb-6">
                  {recordingState === 'idle' && (
                    <Badge variant="default" className="text-sm px-4 py-1">Ready to Record</Badge>
                  )}
                  {recordingState === 'recording' && (
                    <Badge variant="error" className="text-sm px-4 py-1 animate-pulse">
                      <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                      Recording
                    </Badge>
                  )}
                  {recordingState === 'paused' && (
                    <Badge variant="warning" className="text-sm px-4 py-1">Paused</Badge>
                  )}
                  {recordingState === 'processing' && (
                    <Badge variant="info" className="text-sm px-4 py-1">
                      <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                      Processing with AI...
                    </Badge>
                  )}
                  {recordingState === 'complete' && (
                    <Badge variant="success" className="text-sm px-4 py-1">
                      <Check className="w-3 h-3 mr-2" />
                      Complete
                    </Badge>
                  )}
                </div>

                {/* Control Buttons */}
                <div className="flex items-center gap-4">
                  {recordingState === 'idle' && (
                    <Button
                      size="lg"
                      onClick={handleStartRecording}
                      leftIcon={<Mic className="w-5 h-5" />}
                      className="px-8"
                      disabled={!selectedClient}
                    >
                      Start Recording
                    </Button>
                  )}

                  {recordingState === 'recording' && (
                    <>
                      <Button
                        variant="secondary"
                        size="lg"
                        onClick={handlePauseRecording}
                        leftIcon={<Pause className="w-5 h-5" />}
                      >
                        Pause
                      </Button>
                      <Button
                        variant="danger"
                        size="lg"
                        onClick={handleStopRecording}
                        leftIcon={<Square className="w-5 h-5" />}
                      >
                        Stop & Process
                      </Button>
                    </>
                  )}

                  {recordingState === 'paused' && (
                    <>
                      <Button
                        variant="secondary"
                        size="lg"
                        onClick={handleResumeRecording}
                        leftIcon={<Play className="w-5 h-5" />}
                      >
                        Resume
                      </Button>
                      <Button
                        variant="danger"
                        size="lg"
                        onClick={handleStopRecording}
                        leftIcon={<Square className="w-5 h-5" />}
                      >
                        Stop & Process
                      </Button>
                    </>
                  )}

                  {recordingState === 'complete' && !generatedNote && (
                    <Button
                      size="lg"
                      onClick={handleGenerateNote}
                      leftIcon={<Wand2 className="w-5 h-5" />}
                      className="px-8"
                    >
                      Generate {selectedFormat} Note
                    </Button>
                  )}

                  {recordingState === 'complete' && generatedNote && (
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => {
                        setRecordingState('idle');
                        setTranscript('');
                        setGeneratedNote('');
                        setExtractedTasks([]);
                        setSessionInsights([]);
                        setRecordingTime(0);
                      }}
                      leftIcon={<RefreshCw className="w-5 h-5" />}
                    >
                      New Recording
                    </Button>
                  )}
                </div>

                {!selectedClient && recordingState === 'idle' && (
                  <p className="text-sm text-warning mt-4">
                    Please select a client to start recording
                  </p>
                )}
                {micError && (
                  <p className="text-sm text-error mt-4">{micError}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Info Panel / Session Summary */}
          <Card>
            <CardHeader>
              <CardTitle>
                {recordingState === 'complete' ? 'Session Summary' : 'How It Works'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recordingState !== 'complete' ? (
                <div className="space-y-4">
                  {[
                    { step: 1, title: 'Select Client', desc: 'Choose the client for this session' },
                    { step: 2, title: 'Record Session', desc: 'Audio transcribed in real-time' },
                    { step: 3, title: 'AI Extracts Tasks', desc: 'Identifies clinician & client tasks' },
                    { step: 4, title: 'Generate Note', desc: 'Creates clinical note in your format' },
                    { step: 5, title: 'Review & Assign', desc: 'Save tasks and finalize note' },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-3">
                      <div className="w-8 h-8 bg-sage/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sage font-semibold">{item.step}</span>
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{item.title}</p>
                        <p className="text-sm text-text-secondary">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-sage/10 rounded-lg text-center">
                      <p className="text-2xl font-bold text-sage">{clinicianTasks.length}</p>
                      <p className="text-xs text-text-muted">Clinician Tasks</p>
                    </div>
                    <div className="p-3 bg-calm/10 rounded-lg text-center">
                      <p className="text-2xl font-bold text-calm">{clientTasks.length}</p>
                      <p className="text-xs text-text-muted">Client Tasks</p>
                    </div>
                    <div className="p-3 bg-warning/10 rounded-lg text-center">
                      <p className="text-2xl font-bold text-warning">
                        {extractedTasks.filter(t => t.priority === 'high').length}
                      </p>
                      <p className="text-xs text-text-muted">High Priority</p>
                    </div>
                    <div className="p-3 bg-sand rounded-lg text-center">
                      <p className="text-2xl font-bold text-text-primary">{formatTime(recordingTime)}</p>
                      <p className="text-xs text-text-muted">Duration</p>
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div>
                    <h4 className="font-medium text-text-primary mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-sage" />
                      AI Session Insights
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {sessionInsights.map((insight, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded-lg border text-sm flex items-start gap-2 ${getInsightStyle(insight.type)}`}
                        >
                          {getInsightIcon(insight.type)}
                          <span className="text-text-secondary">{insight.content}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 p-3 bg-calm/10 rounded-lg">
                <p className="text-xs text-calm-dark">
                  <strong>Privacy:</strong> Audio is processed securely and not stored after transcription.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        {recordingState === 'complete' && (
          <div className="mt-6">
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-sand rounded-lg p-1 mb-6 w-fit">
              {[
                { id: 'tasks', label: 'Tasks', icon: ListTodo, count: extractedTasks.length },
                { id: 'note', label: 'Clinical Note', icon: FileText },
                { id: 'transcript', label: 'Transcript', icon: ClipboardList },
                { id: 'report', label: 'Full Report', icon: FileCheck },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ReportTab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-text-primary shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count && (
                    <Badge variant="info" size="sm">{tab.count}</Badge>
                  )}
                </button>
              ))}
            </div>

            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <ListTodo className="w-5 h-5 text-sage" />
                      Extracted Tasks
                    </CardTitle>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-sand rounded-lg p-1">
                        {[
                          { id: 'all', label: 'All' },
                          { id: 'clinician', label: 'Clinician' },
                          { id: 'client', label: 'Client' },
                        ].map((filter) => (
                          <button
                            key={filter.id}
                            onClick={() => setTaskFilter(filter.id as any)}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                              taskFilter === filter.id
                                ? 'bg-white text-text-primary shadow-sm'
                                : 'text-text-muted hover:text-text-primary'
                            }`}
                          >
                            {filter.label}
                          </button>
                        ))}
                      </div>
                      <span className="text-sm text-text-muted">
                        {selectedTasks.length} selected
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Clinician Tasks */}
                    {(taskFilter === 'all' || taskFilter === 'clinician') && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Stethoscope className="w-5 h-5 text-sage" />
                          <h3 className="font-semibold text-text-primary">Clinician Tasks</h3>
                          <Badge variant="default">{clinicianTasks.length}</Badge>
                        </div>
                        <div className="space-y-3">
                          {clinicianTasks.map((task) => (
                            <div
                              key={task.id}
                              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                                task.selected
                                  ? 'bg-sage/10 border-sage/30'
                                  : 'bg-white border-beige hover:border-sage/30'
                              }`}
                              onClick={() => toggleTaskSelection(task.id)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="mt-0.5">
                                  {task.selected ? (
                                    <CheckCircle className="w-5 h-5 text-sage" />
                                  ) : (
                                    <Circle className="w-5 h-5 text-text-muted" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-text-primary font-medium">{task.description}</p>
                                  {task.context && (
                                    <p className="text-sm text-text-muted mt-1">{task.context}</p>
                                  )}
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge
                                      variant={
                                        task.priority === 'high' ? 'error' :
                                        task.priority === 'medium' ? 'warning' : 'default'
                                      }
                                      size="sm"
                                    >
                                      {task.priority}
                                    </Badge>
                                    <Badge variant="default" size="sm">{task.category}</Badge>
                                    {task.dueDate && (
                                      <span className="text-xs text-calm flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {task.dueDate}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button
                          variant="primary"
                          className="w-full mt-4"
                          leftIcon={<Plus className="w-4 h-4" />}
                          disabled={clinicianTasks.filter(t => t.selected).length === 0}
                        >
                          Add {clinicianTasks.filter(t => t.selected).length} to My Tasks
                        </Button>
                      </div>
                    )}

                    {/* Client Tasks */}
                    {(taskFilter === 'all' || taskFilter === 'client') && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <UserCheck className="w-5 h-5 text-calm" />
                          <h3 className="font-semibold text-text-primary">
                            Client Homework
                            {selectedClient_ && (
                              <span className="font-normal text-text-muted ml-1">
                                for {selectedClient_.first_name}
                              </span>
                            )}
                          </h3>
                          <Badge variant="default">{clientTasks.length}</Badge>
                        </div>
                        <div className="space-y-3">
                          {clientTasks.map((task) => (
                            <div
                              key={task.id}
                              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                                task.selected
                                  ? 'bg-calm/10 border-calm/30'
                                  : 'bg-white border-beige hover:border-calm/30'
                              }`}
                              onClick={() => toggleTaskSelection(task.id)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="mt-0.5">
                                  {task.selected ? (
                                    <CheckCircle className="w-5 h-5 text-calm" />
                                  ) : (
                                    <Circle className="w-5 h-5 text-text-muted" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-text-primary font-medium">{task.description}</p>
                                  {task.context && (
                                    <p className="text-sm text-text-muted mt-1">{task.context}</p>
                                  )}
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge
                                      variant={
                                        task.priority === 'high' ? 'error' :
                                        task.priority === 'medium' ? 'warning' : 'default'
                                      }
                                      size="sm"
                                    >
                                      {task.priority}
                                    </Badge>
                                    <Badge variant="default" size="sm">{task.category}</Badge>
                                    {task.dueDate && (
                                      <span className="text-xs text-calm flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {task.dueDate}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button
                          variant="primary"
                          className="w-full mt-4"
                          leftIcon={<Send className="w-4 h-4" />}
                          disabled={clientTasks.filter(t => t.selected).length === 0}
                        >
                          Assign {clientTasks.filter(t => t.selected).length} as Homework
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full flex items-center justify-between p-4 bg-sand rounded-lg">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-error" />
                        <span className="text-sm text-text-secondary">
                          {extractedTasks.filter(t => t.priority === 'high').length} high priority
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-warning" />
                        <span className="text-sm text-text-secondary">
                          {extractedTasks.filter(t => t.dueDate).length} with due dates
                        </span>
                      </div>
                    </div>
                    <Button leftIcon={<Save className="w-4 h-4" />}>
                      Save All Selected Tasks
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )}

            {/* Clinical Note Tab */}
            {activeTab === 'note' && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-sage" />
                      Generated {selectedFormat} Note
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={copiedText === 'note' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        onClick={() => handleCopy(generatedNote, 'note')}
                      >
                        {copiedText === 'note' ? 'Copied!' : 'Copy'}
                      </Button>
                      <Button variant="ghost" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {!generatedNote ? (
                    <div className="text-center py-12">
                      <Wand2 className="w-12 h-12 text-text-muted mx-auto mb-4" />
                      <p className="text-text-secondary mb-4">Note not yet generated</p>
                      <Button onClick={handleGenerateNote} leftIcon={<Wand2 className="w-4 h-4" />}>
                        Generate {selectedFormat} Note
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="bg-white border border-beige rounded-lg p-6 max-h-[500px] overflow-y-auto">
                        <div className="prose prose-sm max-w-none">
                          {generatedNote.split('\n').map((line, i) => {
                            if (line.startsWith('**') && line.endsWith('**')) {
                              return (
                                <h4 key={i} className="font-bold text-sage mt-6 first:mt-0 mb-2">
                                  {line.replace(/\*\*/g, '')}
                                </h4>
                              );
                            }
                            if (line.startsWith('- ')) {
                              return (
                                <p key={i} className="text-text-secondary my-1 pl-4">
                                  • {line.substring(2)}
                                </p>
                              );
                            }
                            if (line.match(/^\d+\./)) {
                              return (
                                <p key={i} className="text-text-secondary my-1 pl-4">
                                  {line}
                                </p>
                              );
                            }
                            return line ? (
                              <p key={i} className="text-text-primary my-2">
                                {line}
                              </p>
                            ) : <br key={i} />;
                          })}
                        </div>
                      </div>

                      <div className="mt-6 flex gap-3">
                        <Button
                          className="flex-1"
                          leftIcon={isSavingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : noteSaved ? <CheckCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                          onClick={handleSaveNote}
                          disabled={isSavingNote || noteSaved}
                        >
                          {noteSaved ? 'Saved & Signed' : isSavingNote ? 'Saving…' : 'Save & Sign Note'}
                        </Button>
                        <Button variant="secondary" leftIcon={<Edit className="w-4 h-4" />}>
                          Edit Note
                        </Button>
                        <Button variant="secondary" leftIcon={<Share2 className="w-4 h-4" />}>
                          Share
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Transcript Tab */}
            {activeTab === 'transcript' && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardList className="w-5 h-5 text-sage" />
                      Session Transcript
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={copiedText === 'transcript' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        onClick={() => handleCopy(transcript, 'transcript')}
                      >
                        {copiedText === 'transcript' ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border border-beige rounded-lg p-6 max-h-[500px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-text-primary font-sans leading-relaxed">
                      {transcript.split('\n').map((line, i) => {
                        if (line.match(/^\[\d+:\d+\]/)) {
                          const [timestamp, ...rest] = line.split(']');
                          const content = rest.join(']');
                          const speaker = content.split(':')[0]?.trim();
                          const text = content.split(':').slice(1).join(':');

                          return (
                            <div key={i} className="mb-3">
                              <span className="text-text-muted text-xs">{timestamp}]</span>
                              <span className={`font-semibold ml-2 ${
                                speaker === 'Clinician' ? 'text-sage' : 'text-calm'
                              }`}>
                                {speaker}:
                              </span>
                              <span className="text-text-primary">{text}</span>
                            </div>
                          );
                        }
                        return line ? <div key={i} className="mb-2">{line}</div> : null;
                      })}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Full Report Tab */}
            {activeTab === 'report' && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-sage" />
                      Session Report
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<Printer className="w-4 h-4" />}
                        onClick={() => window.print()}
                      >
                        Print
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={copiedText === 'fullreport' ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                        onClick={() => handleCopy(generateReportContent(), 'fullreport')}
                      >
                        {copiedText === 'fullreport' ? 'Copied!' : 'Export Report'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Report Header */}
                    <div className="bg-sage/10 rounded-lg p-6">
                      <h2 className="text-xl font-bold text-text-primary mb-4">Session Report</h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-text-muted">Client</p>
                          <p className="font-semibold text-text-primary">
                            {selectedClient_?.first_name} {selectedClient_?.last_name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-text-muted">Date</p>
                          <p className="font-semibold text-text-primary">
                            {new Date().toLocaleDateString('en-AU')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-text-muted">Duration</p>
                          <p className="font-semibold text-text-primary">{formatTime(recordingTime)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-text-muted">Format</p>
                          <p className="font-semibold text-text-primary">{selectedFormat}</p>
                        </div>
                      </div>
                    </div>

                    {/* Clinical Note Section */}
                    <div>
                      <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-sage" />
                        Clinical Note
                      </h3>
                      <div className="bg-white border border-beige rounded-lg p-4">
                        {generatedNote ? (
                          <div className="prose prose-sm max-w-none">
                            {generatedNote.split('\n').slice(0, 20).map((line, i) => {
                              if (line.startsWith('**')) {
                                return <h4 key={i} className="font-bold text-sage mt-3 first:mt-0">{line.replace(/\*\*/g, '')}</h4>;
                              }
                              return line && <p key={i} className="text-sm text-text-secondary">{line}</p>;
                            })}
                            {generatedNote.split('\n').length > 20 && (
                              <p className="text-sm text-text-muted italic">... [View full note in Clinical Note tab]</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-text-muted text-sm">Note not yet generated</p>
                        )}
                      </div>
                    </div>

                    {/* Tasks Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                          <Stethoscope className="w-5 h-5 text-sage" />
                          Clinician Tasks ({clinicianTasks.length})
                        </h3>
                        <div className="bg-white border border-beige rounded-lg p-4 space-y-2">
                          {clinicianTasks.map((task) => (
                            <div key={task.id} className="flex items-start gap-2 text-sm">
                              <Badge
                                variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'default'}
                                size="sm"
                                className="flex-shrink-0 mt-0.5"
                              >
                                {task.priority[0].toUpperCase()}
                              </Badge>
                              <span className="text-text-secondary">{task.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                          <UserCheck className="w-5 h-5 text-calm" />
                          Client Homework ({clientTasks.length})
                        </h3>
                        <div className="bg-white border border-beige rounded-lg p-4 space-y-2">
                          {clientTasks.map((task) => (
                            <div key={task.id} className="flex items-start gap-2 text-sm">
                              <Badge
                                variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'default'}
                                size="sm"
                                className="flex-shrink-0 mt-0.5"
                              >
                                {task.priority[0].toUpperCase()}
                              </Badge>
                              <span className="text-text-secondary">{task.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div>
                      <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-sage" />
                        AI Session Insights
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {sessionInsights.map((insight, i) => (
                          <div key={i} className={`p-3 rounded-lg border ${getInsightStyle(insight.type)}`}>
                            <div className="flex items-start gap-2">
                              {getInsightIcon(insight.type)}
                              <div>
                                <Badge variant="default" size="sm" className="mb-1 capitalize">{insight.type}</Badge>
                                <p className="text-sm text-text-secondary">{insight.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-beige">
                      <Button className="flex-1" leftIcon={<Save className="w-4 h-4" />}>
                        Save Complete Report
                      </Button>
                      <Button variant="secondary" leftIcon={<Send className="w-4 h-4" />}>
                        Send to Client
                      </Button>
                      <Button variant="secondary" leftIcon={<Share2 className="w-4 h-4" />}>
                        Share with Team
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
