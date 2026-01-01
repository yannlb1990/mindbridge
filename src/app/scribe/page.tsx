'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useDemoData } from '@/hooks/useDemoData';
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
} from 'lucide-react';

type RecordingState = 'idle' | 'recording' | 'paused' | 'processing' | 'complete';
type NoteFormat = 'SOAP' | 'DAP' | 'BIRP' | 'narrative';

export default function ScribePage() {
  const { clients } = useDemoData();
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<NoteFormat>('SOAP');
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [generatedNote, setGeneratedNote] = useState('');

  // Demo transcript
  const demoTranscript = `Clinician: Hi Emma, how have you been since our last session?

Emma: I've been doing okay, I think. The meal plan has been helping.

Clinician: That's great to hear. Can you tell me more about how you've been following it?

Emma: Well, I managed to eat breakfast every day this week, which is a big improvement. Lunch is still hard sometimes.

Clinician: That's really positive progress. What makes lunch more challenging?

Emma: I think it's because I'm at school and I feel like everyone is watching me eat. It makes me anxious.

Clinician: I understand. That anxiety about eating in social situations is something we can work on. Have you been using any of the coping strategies we discussed?

Emma: Yes, the breathing exercises help a bit. And I've been trying to sit with my friends instead of alone.

Clinician: Those are excellent steps. How have your friends been supportive?

Emma: They're really nice about it. They don't make comments about what I'm eating anymore.`;

  // Demo generated SOAP note
  const demoSOAPNote = `**SUBJECTIVE:**
Client reports positive progress with meal plan adherence. Successfully eating breakfast daily. Continues to experience anxiety around eating at school, particularly during lunch. Notes improvement when using coping strategies including breathing exercises and social support.

**OBJECTIVE:**
Client presented with appropriate affect. Good engagement in session. Reports using prescribed coping strategies. Social support system appears functional and supportive.

**ASSESSMENT:**
Anorexia Nervosa, Restricting Type - showing improvement with structured meal plan. Social anxiety around eating remains a focus area. Client demonstrating increased insight and willingness to implement behavioral strategies.

**PLAN:**
1. Continue current meal plan with focus on lunch compliance
2. Practice anxiety management techniques before lunch
3. Gradual exposure to eating in social settings
4. Review progress with family in next family session
5. Follow-up individual session in one week`;

  const handleStartRecording = () => {
    if (!selectedClient) {
      alert('Please select a client first');
      return;
    }
    setRecordingState('recording');
    // In real implementation, start audio recording here
  };

  const handlePauseRecording = () => {
    setRecordingState('paused');
  };

  const handleResumeRecording = () => {
    setRecordingState('recording');
  };

  const handleStopRecording = () => {
    setRecordingState('processing');
    // Simulate processing
    setTimeout(() => {
      setTranscript(demoTranscript);
      setRecordingState('complete');
    }, 2000);
  };

  const handleGenerateNote = () => {
    setRecordingState('processing');
    setTimeout(() => {
      setGeneratedNote(demoSOAPNote);
      setRecordingState('complete');
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen">
      <Header
        title="AI Scribe"
        subtitle="Record sessions and generate clinical notes automatically"
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
              {/* Client Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Select Client
                </label>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="w-full px-4 py-2.5 border border-beige rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-sage"
                  disabled={recordingState !== 'idle'}
                >
                  <option value="">Choose a client...</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.first_name} {client.last_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Note Format Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Note Format
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['SOAP', 'DAP', 'BIRP', 'narrative'] as NoteFormat[]).map((format) => (
                    <Button
                      key={format}
                      variant={selectedFormat === format ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setSelectedFormat(format)}
                      disabled={recordingState !== 'idle' && recordingState !== 'complete'}
                    >
                      {format}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Recording Controls */}
              <div className="flex flex-col items-center py-8">
                {/* Timer */}
                <div className="text-4xl font-mono font-bold text-text-primary mb-6">
                  {formatTime(recordingTime)}
                </div>

                {/* Status Indicator */}
                <div className="mb-6">
                  {recordingState === 'idle' && (
                    <Badge variant="default">Ready to Record</Badge>
                  )}
                  {recordingState === 'recording' && (
                    <Badge variant="error" className="animate-pulse">
                      <span className="w-2 h-2 bg-coral-dark rounded-full mr-2 animate-pulse" />
                      Recording
                    </Badge>
                  )}
                  {recordingState === 'paused' && (
                    <Badge variant="warning">Paused</Badge>
                  )}
                  {recordingState === 'processing' && (
                    <Badge variant="info">
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      Processing
                    </Badge>
                  )}
                  {recordingState === 'complete' && (
                    <Badge variant="success">
                      <Check className="w-3 h-3 mr-1" />
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
                        Stop
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
                        Stop
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
                        setRecordingTime(0);
                      }}
                      leftIcon={<RefreshCw className="w-5 h-5" />}
                    >
                      New Recording
                    </Button>
                  )}
                </div>

                {/* Demo Mode Note */}
                <p className="text-sm text-text-muted mt-6 text-center">
                  Demo Mode: Recording simulation. In production, this would capture real audio.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Instructions / Info Panel */}
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-sage-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sage font-semibold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">Select Client</p>
                    <p className="text-sm text-text-secondary">Choose the client for this session</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-sage-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sage font-semibold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">Record Session</p>
                    <p className="text-sm text-text-secondary">Audio is transcribed in real-time</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-sage-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sage font-semibold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">Generate Note</p>
                    <p className="text-sm text-text-secondary">AI creates a clinical note in your chosen format</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-sage-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sage font-semibold">4</span>
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">Review & Sign</p>
                    <p className="text-sm text-text-secondary">Edit as needed and sign the note</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-calm/10 rounded-lg">
                <p className="text-sm text-calm-dark">
                  <strong>Privacy:</strong> All recordings are processed securely and encrypted. Audio is not stored after transcription.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transcript & Generated Note */}
        {(transcript || generatedNote) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Transcript */}
            {transcript && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Transcript</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" leftIcon={<Copy className="w-4 h-4" />}>
                      Copy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-sand rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-text-primary font-sans">
                      {transcript}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generated Note */}
            {generatedNote && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Generated {selectedFormat} Note</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" leftIcon={<Copy className="w-4 h-4" />}>
                      Copy
                    </Button>
                    <Button variant="ghost" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-sand rounded-lg p-4 max-h-96 overflow-y-auto">
                    <div className="prose prose-sm max-w-none">
                      {generatedNote.split('\n').map((line, i) => {
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return (
                            <h4 key={i} className="font-semibold text-text-primary mt-4 first:mt-0">
                              {line.replace(/\*\*/g, '')}
                            </h4>
                          );
                        }
                        return (
                          <p key={i} className="text-sm text-text-secondary my-1">
                            {line}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button className="flex-1" leftIcon={<Check className="w-4 h-4" />}>
                      Save & Sign Note
                    </Button>
                    <Button variant="secondary" leftIcon={<FileText className="w-4 h-4" />}>
                      Edit First
                    </Button>
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
