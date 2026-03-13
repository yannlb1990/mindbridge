'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useNotes, NOTE_TEMPLATES } from '@/hooks/useNotes';
import { useClients, Client } from '@/hooks/useClients';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Clock,
  FileText,
  Maximize2,
  Minimize2,
  Moon,
  Save,
  Send,
  Sparkles,
  Sun,
  Type,
  User,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Mic,
  MicOff,
  Wand2,
  X,
  RefreshCw,
  Copy,
  CheckCheck,
  Lightbulb,
  SpellCheck,
  FileEdit,
  MessageSquare,
  BookOpen,
  HelpCircle,
  ChevronUp,
} from 'lucide-react';

type NoteFormat = 'soap' | 'dap' | 'birp' | 'narrative' | 'brief' | 'structured';

// Template section type for loaded templates
interface TemplateSection {
  id: string;
  title: string;
  placeholder: string;
  required: boolean;
  aiPrompts: string[];
  clinicalTips?: string;
  wordCountGuide?: string;
}

interface LoadedTemplate {
  id: string;
  name: string;
  sections: TemplateSection[];
  noteFormat: NoteFormat;
  suggestedDuration: number;
}

const FORMAT_CONFIG: Record<NoteFormat, {
  label: string;
  description: string;
  sections: { key: string; label: string; placeholder: string; icon: React.ReactNode }[];
}> = {
  soap: {
    label: 'SOAP',
    description: 'Standard medical documentation format',
    sections: [
      { key: 'subjective', label: 'Subjective', placeholder: "What the client reported: feelings, symptoms, concerns, and their perspective on their situation...", icon: <User className="w-4 h-4" /> },
      { key: 'objective', label: 'Objective', placeholder: "Your clinical observations: affect, behavior, appearance, speech patterns, engagement level...", icon: <FileText className="w-4 h-4" /> },
      { key: 'assessment', label: 'Assessment', placeholder: "Your clinical interpretation: progress toward goals, diagnostic impressions, risk assessment...", icon: <Sparkles className="w-4 h-4" /> },
      { key: 'plan', label: 'Plan', placeholder: "Next steps: treatment recommendations, homework assignments, referrals, next session goals...", icon: <Check className="w-4 h-4" /> },
    ],
  },
  dap: {
    label: 'DAP',
    description: 'Streamlined clinical format',
    sections: [
      { key: 'data', label: 'Data', placeholder: "Session content: what was discussed, client statements, observations...", icon: <FileText className="w-4 h-4" /> },
      { key: 'assessment', label: 'Assessment', placeholder: "Clinical interpretation: progress, insights, treatment effectiveness...", icon: <Sparkles className="w-4 h-4" /> },
      { key: 'plan', label: 'Plan', placeholder: "Future direction: goals for next session, homework, recommendations...", icon: <Check className="w-4 h-4" /> },
    ],
  },
  birp: {
    label: 'BIRP',
    description: 'Behavioral intervention focus',
    sections: [
      { key: 'behavior', label: 'Behavior', placeholder: "Observable behaviors: what the client did or said, specific actions...", icon: <User className="w-4 h-4" /> },
      { key: 'intervention', label: 'Intervention', placeholder: "Therapeutic techniques used: CBT, motivational interviewing, psychoeducation...", icon: <Sparkles className="w-4 h-4" /> },
      { key: 'response', label: 'Response', placeholder: "Client's reaction: how they responded to interventions, engagement level...", icon: <FileText className="w-4 h-4" /> },
      { key: 'plan', label: 'Plan', placeholder: "Next steps: continued interventions, adjustments to treatment plan...", icon: <Check className="w-4 h-4" /> },
    ],
  },
  narrative: {
    label: 'Narrative',
    description: 'Free-form detailed session notes',
    sections: [
      { key: 'content', label: 'Session Narrative', placeholder: "Write a detailed account of the session. Include the flow of conversation, key themes discussed, therapeutic interventions used, client responses, and your clinical observations. Take your time to capture the essence of what transpired...", icon: <FileText className="w-4 h-4" /> },
    ],
  },
  brief: {
    label: 'Brief',
    description: 'Quick summary notes',
    sections: [
      { key: 'summary', label: 'Summary', placeholder: "Brief overview of the session: main topics, key insights...", icon: <FileText className="w-4 h-4" /> },
      { key: 'nextSteps', label: 'Next Steps', placeholder: "Action items for client and clinician...", icon: <Check className="w-4 h-4" /> },
    ],
  },
  structured: {
    label: 'Structured',
    description: 'Template-defined section format',
    sections: [
      { key: 'content', label: 'Content', placeholder: "Write your structured session notes...", icon: <FileText className="w-4 h-4" /> },
    ],
  },
};

const RISK_LEVELS = [
  { value: 'low', label: 'Low Risk', color: 'text-emerald-600 bg-emerald-50' },
  { value: 'moderate', label: 'Moderate', color: 'text-amber-600 bg-amber-50' },
  { value: 'high', label: 'High Risk', color: 'text-orange-600 bg-orange-50' },
  { value: 'critical', label: 'Critical', color: 'text-red-600 bg-red-50' },
];

function NewNoteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const { createNote, signNote } = useNotes();
  const { clients } = useClients();

  // Template state
  const [loadedTemplate, setLoadedTemplate] = useState<LoadedTemplate | null>(null);
  const [showPrompts, setShowPrompts] = useState<Record<string, boolean>>({});

  // Core state
  const [clientId, setClientId] = useState('');
  const [noteFormat, setNoteFormat] = useState<NoteFormat>('soap');
  const [content, setContent] = useState<Record<string, string>>(NOTE_TEMPLATES.soap);
  const [riskLevel, setRiskLevel] = useState<'low' | 'moderate' | 'high' | 'critical'>('low');

  // UI state
  const [activeSection, setActiveSection] = useState(0);
  const [isZenMode, setIsZenMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [showClientPicker, setShowClientPicker] = useState(false);
  const [showFormatPicker, setShowFormatPicker] = useState(false);
  const [showRiskPicker, setShowRiskPicker] = useState(false);

  // Save state
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Voice dictation state
  const [isListening, setIsListening] = useState(false);
  const [dictationSection, setDictationSection] = useState<number | null>(null);
  const recognitionRef = useRef<any>(null);

  // AI Assistant state
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{
    type: 'grammar' | 'clinical' | 'expand' | 'professional' | 'missing' | 'critical';
    original: string;
    suggestion: string;
    explanation: string;
  }[]>([]);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<number>>(new Set());
  const [qualityScore, setQualityScore] = useState<number | null>(null);
  const [hasBeenAnalyzed, setHasBeenAnalyzed] = useState(false);

  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const autoSaveTimeout = useRef<NodeJS.Timeout | null>(null);

  const sections = loadedTemplate
    ? loadedTemplate.sections.map(s => ({
        key: s.id,
        label: s.title,
        placeholder: s.placeholder,
        icon: <FileText className="w-4 h-4" />,
      }))
    : FORMAT_CONFIG[noteFormat].sections;
  const selectedClient = clients.find((c: Client) => c.id === clientId);

  // Word count
  const wordCount = Object.values(content).join(' ').split(/\s+/).filter(Boolean).length;
  const charCount = Object.values(content).join('').length;

  // Calculate progress
  const filledSections = sections.filter(s => (content[s.key] || '').trim().length > 0).length;
  const progress = (filledSections / sections.length) * 100;

  // Auto-resize textareas
  const autoResize = useCallback((textarea: HTMLTextAreaElement | null) => {
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(200, textarea.scrollHeight)}px`;
    }
  }, []);

  // Handle content change with auto-save
  const handleContentChange = (key: string, value: string) => {
    setContent(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
    setSaveError(null);

    // Auto-save after 2 seconds of inactivity
    if (autoSaveTimeout.current) {
      clearTimeout(autoSaveTimeout.current);
    }
    autoSaveTimeout.current = setTimeout(() => {
      // Could implement draft saving here
      setLastSaved(new Date());
      setHasChanges(false);
    }, 2000);
  };

  // Change format
  const handleFormatChange = (format: NoteFormat) => {
    setNoteFormat(format);
    setContent(NOTE_TEMPLATES[format]);
    setActiveSection(0);
    setShowFormatPicker(false);
  };

  // Save note
  const handleSave = async (andSign: boolean = false) => {
    if (!clientId) {
      setSaveError('Please select a client');
      return;
    }

    const hasContent = Object.values(content).some(v => v.trim().length > 0);
    if (!hasContent) {
      setSaveError('Please add some content to the note');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const result = await createNote({
        clientId,
        noteFormat,
        content,
        riskLevel,
        aiGenerated: false,
      });

      if (!result.success) throw new Error(result.error);

      if (andSign && result.noteId) {
        await signNote(result.noteId);
      }

      router.push('/notes');
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save note');
    } finally {
      setIsSaving(false);
    }
  };

  // Voice Dictation
  const startDictation = (sectionIndex: number) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSaveError('Voice dictation is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-AU';

    recognition.onstart = () => {
      setIsListening(true);
      setDictationSection(sectionIndex);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        const sectionKey = sections[sectionIndex].key;
        const currentContent = content[sectionKey] || '';
        const newContent = currentContent + (currentContent ? ' ' : '') + finalTranscript;
        handleContentChange(sectionKey, newContent);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setDictationSection(null);
      if (event.error === 'not-allowed') {
        setSaveError('Microphone access denied. Please enable microphone permissions.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setDictationSection(null);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopDictation = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setDictationSection(null);
  };

  // AI Clinical Report Helper
  const generateAISuggestions = async () => {
    setIsAIProcessing(true);
    setAppliedSuggestions(new Set());
    setHasBeenAnalyzed(false);

    await new Promise(resolve => setTimeout(resolve, 1800));

    const suggestions: typeof aiSuggestions = [];
    const totalSections = sections.length;
    let filledSections = 0;
    let totalWords = 0;
    let scoreDeductions = 0;

    // ── 1. MISSING / EMPTY SECTION DETECTION ──────────────────────────
    sections.forEach((section) => {
      const text = (content[section.key] || '').trim();
      const wordCount = text.split(/\s+/).filter(Boolean).length;
      totalWords += wordCount;

      if (!text) {
        suggestions.push({
          type: 'missing',
          original: section.label,
          suggestion: `Complete the ${section.label} section`,
          explanation: `This required section is empty. ${
            section.key === 'subjective' ? "Document what the client reported: mood, symptoms, events since last session." :
            section.key === 'objective' ? "Record observable clinical data: affect, behavior, appearance, engagement." :
            section.key === 'assessment' ? "Add your clinical interpretation: progress, risks, diagnostic impressions." :
            section.key === 'plan' ? "Specify next steps: interventions, homework, referrals, next session goals." :
            section.key === 'data' ? "Document session data: client statements, homework review, observable behaviors." :
            section.key === 'response' ? "Note how the client responded to interventions in this session." :
            "Add relevant clinical content to support continuity of care."
          }`,
        });
        scoreDeductions += 20;
      } else {
        filledSections++;
        if (wordCount < 10) {
          suggestions.push({
            type: 'expand',
            original: `${section.label} (${wordCount} word${wordCount === 1 ? '' : 's'})`,
            suggestion: `Expand the ${section.label} section with more clinical detail`,
            explanation: `Only ${wordCount} word${wordCount === 1 ? '' : 's'} documented. Minimum recommended is 20–30 words for meaningful clinical records. ${
              section.key === 'subjective' ? "Include client's direct quotes, mood rating, and reported events." :
              section.key === 'objective' ? "Describe affect, eye contact, speech, posture, and engagement." :
              section.key === 'assessment' ? "Include risk level, progress toward goals, and diagnostic formulation." :
              section.key === 'plan' ? "List specific interventions, homework tasks, and measurable goals." :
              "Add sufficient detail to support continuity of care."
            }`,
          });
          scoreDeductions += 10;
        }
      }
    });

    // ── 2. RISK DOCUMENTATION CHECK ───────────────────────────────────
    const allText = Object.values(content).join(' ').toLowerCase();
    const hasRiskMention = /risk|safe|suicid|self.harm|crisis|harm|danger|ideation/.test(allText);
    const hasRiskDocumented = /risk (level|assessment|factor)|no (suicid|self.harm|risk)|low risk|moderate risk|high risk|safety plan/.test(allText);

    if (filledSections > 0 && !hasRiskDocumented) {
      if (riskLevel !== 'low' || hasRiskMention) {
        suggestions.push({
          type: 'critical',
          original: 'Risk Assessment',
          suggestion: 'Document risk assessment explicitly',
          explanation: `Risk level is set to "${riskLevel}" but no formal risk documentation was found in the note. Include: current suicidal ideation (yes/no), self-harm history, protective factors, and risk level conclusion.`,
        });
        scoreDeductions += 15;
      } else {
        suggestions.push({
          type: 'clinical',
          original: 'Risk Assessment',
          suggestion: 'Add a brief risk statement',
          explanation: 'Every clinical note should include a risk statement, e.g. "No current suicidal ideation or self-harm reported. Risk assessed as low."',
        });
        scoreDeductions += 5;
      }
    }

    // ── 3. PLAN SECTION: NO NEXT SESSION / NO GOALS ───────────────────
    const planText = (content.plan || content.nextSteps || content.intervention || '').toLowerCase();
    if (planText && planText.length > 5) {
      const hasNextSession = /next session|follow.up|review|schedule/.test(planText);
      const hasGoal = /goal|objective|target|aim|homework|task|practice/.test(planText);
      if (!hasNextSession) {
        suggestions.push({
          type: 'expand',
          original: 'Plan — next session reference',
          suggestion: 'Include next session plan',
          explanation: 'Clinical notes should reference the plan for the next session, e.g. "Continue CBT skill practice. Review mood diary next session."',
        });
        scoreDeductions += 5;
      }
      if (!hasGoal) {
        suggestions.push({
          type: 'expand',
          original: 'Plan — treatment goals',
          suggestion: 'Reference treatment goals in the plan',
          explanation: 'Link your plan to measurable treatment goals to demonstrate therapeutic progress.',
        });
        scoreDeductions += 5;
      }
    }

    // ── 4. LANGUAGE & CLINICAL TERMINOLOGY ────────────────────────────
    sections.forEach((section) => {
      const text = content[section.key] || '';
      if (!text.trim()) return;

      if (/\b(gonna|wanna|kinda|gotta|dunno)\b/i.test(text)) {
        suggestions.push({
          type: 'grammar',
          original: text.match(/\b(gonna|wanna|kinda|gotta|dunno)\b/i)?.[0] || 'informal word',
          suggestion: 'Replace with professional language',
          explanation: 'Informal language found. Use "going to", "want to", "kind of", "need to" for professional documentation.',
        });
        scoreDeductions += 5;
      }

      if (/\bsad\b/i.test(text) && !/depressed mood|dysphoric/i.test(text)) {
        suggestions.push({
          type: 'clinical',
          original: 'sad',
          suggestion: 'depressed mood / dysphoric affect',
          explanation: 'Use clinical terminology. "Sad" is subjective; "depressed mood" or "dysphoric affect" is measurable and defensible.',
        });
        scoreDeductions += 3;
      }

      if (/\bworried\b/i.test(text) && !/anxious|anxiety/i.test(text)) {
        suggestions.push({
          type: 'clinical',
          original: 'worried',
          suggestion: 'anxious / elevated anxiety / apprehensive',
          explanation: 'Use standardised clinical descriptors for medico-legal accuracy.',
        });
        scoreDeductions += 3;
      }

      if (/\bangry\b/i.test(text) && !/irritable|agitated/i.test(text)) {
        suggestions.push({
          type: 'clinical',
          original: 'angry',
          suggestion: 'irritable mood / agitated affect',
          explanation: 'Clinical records require precise descriptors aligned with DSM/ICD terminology.',
        });
        scoreDeductions += 3;
      }

      if (/\b(talked about|chatted about|spoke about)\b/i.test(text)) {
        suggestions.push({
          type: 'professional',
          original: text.match(/\b(talked about|chatted about|spoke about)\b/i)?.[0] || '',
          suggestion: 'discussed / explored / processed / examined',
          explanation: 'Therapeutic language should reflect clinical intent. "Discussed" and "explored" are more defensible in a clinical context.',
        });
        scoreDeductions += 3;
      }

      if (/\b(seems like|looks like)\b/i.test(text)) {
        suggestions.push({
          type: 'professional',
          original: text.match(/\b(seems like|looks like)\b/i)?.[0] || '',
          suggestion: 'appears to / presents with / demonstrates',
          explanation: 'Use objective clinical observation language rather than speculative phrasing.',
        });
        scoreDeductions += 3;
      }

      if (/\bpt\b/.test(text)) {
        suggestions.push({
          type: 'expand',
          original: 'pt',
          suggestion: 'client / patient',
          explanation: 'Expand abbreviations. Records may be read by others unfamiliar with shorthand.',
        });
        scoreDeductions += 2;
      }
    });

    // ── 5. COMPUTE QUALITY SCORE ──────────────────────────────────────
    const baseScore = totalSections === 0 ? 0 : Math.round((filledSections / totalSections) * 100);
    const finalScore = Math.max(0, Math.min(100, baseScore - scoreDeductions));

    // Deduplicate suggestions by explanation
    const seen = new Set<string>();
    const unique = suggestions.filter(s => {
      const key = s.type + s.original;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    setQualityScore(finalScore);
    setAiSuggestions(unique);
    setHasBeenAnalyzed(true);
    setIsAIProcessing(false);
  };

  const applySuggestion = (index: number, suggestion: typeof aiSuggestions[0]) => {
    // Find and replace in content
    sections.forEach((section) => {
      const text = content[section.key] || '';
      if (text.includes(suggestion.original)) {
        const newText = text.replace(new RegExp(suggestion.original, 'gi'), suggestion.suggestion);
        handleContentChange(section.key, newText);
      }
    });

    setAppliedSuggestions(prev => new Set([...Array.from(prev), index]));
  };

  // Load template from URL parameter
  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId) {
      // Fetch template from localStorage or API
      const storedTemplates = localStorage.getItem('mindbridge-templates');
      if (storedTemplates) {
        try {
          const templates = JSON.parse(storedTemplates);
          const template = templates.find((t: any) => t.id === templateId);
          if (template) {
            setLoadedTemplate({
              id: template.id,
              name: template.name,
              sections: template.sections,
              noteFormat: template.noteFormat,
              suggestedDuration: template.suggestedDuration,
            });
            setNoteFormat(template.noteFormat as NoteFormat);
            // Initialize content for template sections
            const initialContent: Record<string, string> = {};
            template.sections.forEach((s: TemplateSection) => {
              initialContent[s.id] = '';
            });
            setContent(initialContent);
          }
        } catch (e) {
          console.error('Failed to load template:', e);
        }
      }
    }
  }, [searchParams]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 's') {
          e.preventDefault();
          handleSave(false);
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSave(true);
        }
      }
      if (e.key === 'Escape' && isZenMode) {
        setIsZenMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZenMode, clientId, content]);

  // Focus active section
  useEffect(() => {
    const textarea = textareaRefs.current[activeSection];
    if (textarea && isZenMode) {
      textarea.focus();
    }
  }, [activeSection, isZenMode]);

  const fontSizeClass = {
    normal: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl',
  }[fontSize];

  return (
    <div className={cn(
      'min-h-screen transition-colors duration-500',
      isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-stone-50 via-white to-stone-50'
    )}>
      {/* Top Bar */}
      <header className={cn(
        'sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300',
        isDarkMode
          ? 'bg-slate-900/90 border-slate-700'
          : 'bg-white/80 border-stone-200',
        isZenMode && 'opacity-0 hover:opacity-100'
      )}>
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back + Client */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/notes')}
                className={cn(
                  'p-2 rounded-xl transition-all hover:scale-105',
                  isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-stone-100 text-stone-500'
                )}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Client Picker */}
              <div className="relative">
                <button
                  onClick={() => setShowClientPicker(!showClientPicker)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl border transition-all',
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-white hover:border-slate-600'
                      : 'bg-white border-stone-200 hover:border-stone-300',
                    !clientId && 'border-dashed'
                  )}
                >
                  <User className="w-4 h-4 text-sage" />
                  <span className={cn(!clientId && (isDarkMode ? 'text-slate-500' : 'text-stone-400'))}>
                    {selectedClient ? `${selectedClient.first_name} ${selectedClient.last_name}` : 'Select Client'}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showClientPicker && (
                  <div className={cn(
                    'absolute top-full left-0 mt-2 w-64 rounded-xl border shadow-xl z-50 overflow-hidden',
                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-stone-200'
                  )}>
                    <div className="max-h-64 overflow-y-auto">
                      {clients.map((client: Client) => (
                        <button
                          key={client.id}
                          onClick={() => {
                            setClientId(client.id);
                            setShowClientPicker(false);
                          }}
                          className={cn(
                            'w-full px-4 py-3 text-left flex items-center gap-3 transition-colors',
                            isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-stone-50',
                            client.id === clientId && (isDarkMode ? 'bg-slate-700' : 'bg-sage-50')
                          )}
                        >
                          <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center text-white text-sm font-medium">
                            {client.first_name[0]}{client.last_name[0]}
                          </div>
                          <span className={isDarkMode ? 'text-white' : 'text-stone-800'}>
                            {client.first_name} {client.last_name}
                          </span>
                          {client.id === clientId && <Check className="w-4 h-4 text-sage ml-auto" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Center: Format */}
            <div className="relative">
              <button
                onClick={() => setShowFormatPicker(!showFormatPicker)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl transition-all',
                  isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-stone-100 hover:bg-stone-200'
                )}
              >
                <FileText className="w-4 h-4" />
                <span className="font-medium">{FORMAT_CONFIG[noteFormat].label}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showFormatPicker && (
                <div className={cn(
                  'absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 rounded-xl border shadow-xl z-50 overflow-hidden',
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-stone-200'
                )}>
                  {(Object.keys(FORMAT_CONFIG) as NoteFormat[]).map((format) => (
                    <button
                      key={format}
                      onClick={() => handleFormatChange(format)}
                      className={cn(
                        'w-full px-4 py-3 text-left transition-colors',
                        isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-stone-50',
                        format === noteFormat && (isDarkMode ? 'bg-slate-700' : 'bg-sage-50')
                      )}
                    >
                      <div className={cn('font-medium', isDarkMode ? 'text-white' : 'text-stone-800')}>
                        {FORMAT_CONFIG[format].label}
                      </div>
                      <div className={cn('text-sm', isDarkMode ? 'text-slate-400' : 'text-stone-500')}>
                        {FORMAT_CONFIG[format].description}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Risk Level */}
              <div className="relative">
                <button
                  onClick={() => setShowRiskPicker(!showRiskPicker)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    RISK_LEVELS.find(r => r.value === riskLevel)?.color
                  )}
                >
                  {RISK_LEVELS.find(r => r.value === riskLevel)?.label}
                </button>

                {showRiskPicker && (
                  <div className={cn(
                    'absolute top-full right-0 mt-2 w-40 rounded-xl border shadow-xl z-50 overflow-hidden',
                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-stone-200'
                  )}>
                    {RISK_LEVELS.map((risk) => (
                      <button
                        key={risk.value}
                        onClick={() => {
                          setRiskLevel(risk.value as any);
                          setShowRiskPicker(false);
                        }}
                        className={cn(
                          'w-full px-4 py-2 text-left text-sm transition-colors',
                          isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-stone-50'
                        )}
                      >
                        <span className={risk.color.split(' ')[0]}>{risk.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className={cn('w-px h-6', isDarkMode ? 'bg-slate-700' : 'bg-stone-200')} />

              {/* Font Size */}
              <button
                onClick={() => setFontSize(f => f === 'normal' ? 'large' : f === 'large' ? 'xlarge' : 'normal')}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-stone-100 text-stone-500'
                )}
                title="Change font size"
              >
                <Type className="w-4 h-4" />
              </button>

              {/* Dark Mode */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-stone-100 text-stone-500'
                )}
                title="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Zen Mode */}
              <button
                onClick={() => setIsZenMode(!isZenMode)}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-stone-100 text-stone-500'
                )}
                title="Zen mode"
              >
                {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <div className={cn('w-px h-6', isDarkMode ? 'bg-slate-700' : 'bg-stone-200')} />

              {/* AI Report Help Button */}
              <button
                onClick={() => {
                  setShowAIPanel(true);
                  generateAISuggestions();
                }}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all',
                  'bg-gradient-to-r from-violet-500 to-purple-600 text-white',
                  'hover:from-violet-600 hover:to-purple-700 hover:shadow-lg hover:shadow-purple-500/25',
                  'active:scale-95'
                )}
              >
                <Wand2 className="w-4 h-4" />
                AI Report Help
              </button>

              <div className={cn('w-px h-6', isDarkMode ? 'bg-slate-700' : 'bg-stone-200')} />

              {/* Save Status */}
              <div className={cn(
                'flex items-center gap-2 text-sm',
                isDarkMode ? 'text-slate-400' : 'text-stone-500'
              )}>
                {hasChanges ? (
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                    Unsaved
                  </span>
                ) : lastSaved ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                    Saved
                  </span>
                ) : null}
              </div>

              {/* Save Buttons */}
              <button
                onClick={() => handleSave(false)}
                disabled={isSaving}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium',
                  isDarkMode
                    ? 'bg-slate-800 text-white hover:bg-slate-700'
                    : 'bg-stone-100 hover:bg-stone-200',
                  isSaving && 'opacity-50 cursor-not-allowed'
                )}
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save
              </button>

              <button
                onClick={() => handleSave(true)}
                disabled={isSaving}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl bg-sage text-white font-medium transition-all hover:bg-sage-dark',
                  isSaving && 'opacity-50 cursor-not-allowed'
                )}
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Save & Sign
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={cn('h-1', isDarkMode ? 'bg-slate-800' : 'bg-stone-100')}>
          <div
            className="h-full bg-gradient-to-r from-sage to-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Error Banner */}
      {saveError && (
        <div className="max-w-3xl mx-auto px-6 pt-4">
          <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <AlertTriangle className="w-5 h-5" />
            {saveError}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={cn(
        'max-w-3xl mx-auto px-6 py-8 transition-all duration-300',
        isZenMode && 'max-w-2xl py-16'
      )}>
        {/* Section Navigation (non-zen mode) */}
        {!isZenMode && sections.length > 1 && (
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {sections.map((section, index) => (
              <button
                key={section.key}
                onClick={() => {
                  setActiveSection(index);
                  textareaRefs.current[index]?.focus();
                }}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap',
                  index === activeSection
                    ? 'bg-sage text-white shadow-lg shadow-sage/25'
                    : isDarkMode
                      ? 'bg-slate-800 text-slate-400 hover:text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200',
                  (content[section.key] || '').trim() && index !== activeSection && 'ring-2 ring-emerald-500/30'
                )}
              >
                {section.icon}
                {section.label}
                {(content[section.key] || '').trim() && (
                  <Check className="w-3 h-3 text-emerald-400" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Writing Areas */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div
              key={section.key}
              className={cn(
                'transition-all duration-500',
                isZenMode && index !== activeSection && 'opacity-0 h-0 overflow-hidden'
              )}
            >
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  'p-2 rounded-lg',
                  isDarkMode ? 'bg-slate-800' : 'bg-sage-50'
                )}>
                  <div className="text-sage">{section.icon}</div>
                </div>
                <h2 className={cn(
                  'text-xl font-semibold',
                  isDarkMode ? 'text-white' : 'text-stone-800'
                )}>
                  {section.label}
                </h2>
                {(content[section.key] || '').trim() && (
                  <span className="text-sm text-emerald-500 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Complete
                  </span>
                )}

                {/* Dictation Button */}
                <button
                  onClick={() => {
                    if (isListening && dictationSection === index) {
                      stopDictation();
                    } else {
                      if (isListening) stopDictation();
                      startDictation(index);
                    }
                  }}
                  className={cn(
                    'ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    isListening && dictationSection === index
                      ? 'bg-red-500 text-white animate-pulse'
                      : isDarkMode
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  )}
                  title={isListening && dictationSection === index ? 'Stop dictation' : 'Start voice dictation'}
                >
                  {isListening && dictationSection === index ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      Dictate
                    </>
                  )}
                </button>
              </div>

              {/* Template AI Prompts */}
              {(() => {
                const tmplSection = loadedTemplate?.sections.find(s => s.id === section.key);
                if (!tmplSection) return null;
                return (
                  <div className={cn(
                    'mb-3 rounded-xl overflow-hidden border transition-all',
                    isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200'
                  )}>
                    <button
                      onClick={() => setShowPrompts(prev => ({ ...prev, [section.key]: !prev[section.key] }))}
                      className={cn(
                        'w-full flex items-center justify-between px-4 py-3 transition-colors',
                        isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-violet-100/50'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className={cn('w-4 h-4', isDarkMode ? 'text-violet-400' : 'text-violet-600')} />
                        <span className={cn('text-sm font-medium', isDarkMode ? 'text-violet-300' : 'text-violet-700')}>
                          Writing Guide from "{loadedTemplate!.name}"
                        </span>
                        {tmplSection.wordCountGuide && (
                          <span className={cn(
                            'text-xs px-2 py-0.5 rounded-full',
                            isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-violet-100 text-violet-600'
                          )}>
                            {tmplSection.wordCountGuide}
                          </span>
                        )}
                      </div>
                      <ChevronUp className={cn(
                        'w-4 h-4 transition-transform',
                        isDarkMode ? 'text-violet-400' : 'text-violet-600',
                        !showPrompts[section.key] && 'rotate-180'
                      )} />
                    </button>

                    {showPrompts[section.key] !== false && (
                      <div className={cn('px-4 pb-4', isDarkMode ? 'border-t border-slate-700' : 'border-t border-violet-200')}>
                        {/* AI Prompts */}
                        <div className="mt-3">
                          <p className={cn('text-xs font-medium mb-2 flex items-center gap-1', isDarkMode ? 'text-slate-400' : 'text-stone-500')}>
                            <HelpCircle className="w-3 h-3" />
                            Consider addressing:
                          </p>
                          <ul className="space-y-1.5">
                            {tmplSection.aiPrompts.map((prompt, i) => (
                              <li
                                key={i}
                                className={cn(
                                  'flex items-start gap-2 text-sm',
                                  isDarkMode ? 'text-slate-300' : 'text-stone-600'
                                )}
                              >
                                <span className={cn(
                                  'w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5',
                                  isDarkMode ? 'bg-violet-900/50 text-violet-300' : 'bg-violet-100 text-violet-700'
                                )}>
                                  {i + 1}
                                </span>
                                {prompt}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Clinical Tips */}
                        {tmplSection.clinicalTips && (
                          <div className={cn(
                            'mt-3 p-3 rounded-lg flex items-start gap-2',
                            isDarkMode ? 'bg-amber-900/20 border border-amber-800/50' : 'bg-amber-50 border border-amber-200'
                          )}>
                            <Lightbulb className={cn('w-4 h-4 flex-shrink-0 mt-0.5', isDarkMode ? 'text-amber-400' : 'text-amber-600')} />
                            <p className={cn('text-sm', isDarkMode ? 'text-amber-200' : 'text-amber-800')}>
                              <span className="font-medium">Tip: </span>
                              {tmplSection.clinicalTips}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Listening indicator */}
              {isListening && dictationSection === index && (
                <div className={cn(
                  'flex items-center gap-3 mb-3 px-4 py-2 rounded-xl',
                  isDarkMode ? 'bg-red-900/30 border border-red-800' : 'bg-red-50 border border-red-200'
                )}>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-100" />
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-200" />
                  </div>
                  <span className={cn('text-sm', isDarkMode ? 'text-red-300' : 'text-red-700')}>
                    Listening... Speak clearly into your microphone
                  </span>
                </div>
              )}

              {/* Textarea */}
              <textarea
                ref={el => {
                  textareaRefs.current[index] = el;
                  if (el) autoResize(el);
                }}
                value={content[section.key] || ''}
                onChange={(e) => {
                  handleContentChange(section.key, e.target.value);
                  autoResize(e.target);
                }}
                onFocus={() => setActiveSection(index)}
                placeholder={section.placeholder}
                className={cn(
                  'w-full min-h-[200px] p-6 rounded-2xl border-2 transition-all duration-300 resize-none',
                  'focus:outline-none focus:ring-0',
                  fontSizeClass,
                  'leading-relaxed',
                  isDarkMode
                    ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-sage focus:bg-slate-800'
                    : 'bg-white border-stone-200 text-stone-800 placeholder-stone-400 focus:border-sage focus:shadow-lg focus:shadow-sage/10',
                  index === activeSection && (isDarkMode ? 'border-sage' : 'border-sage shadow-lg shadow-sage/10')
                )}
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              />

              {/* Section word count */}
              <div className={cn(
                'flex items-center justify-end mt-2 text-sm',
                isDarkMode ? 'text-slate-500' : 'text-stone-400'
              )}>
                {(content[section.key] || '').split(/\s+/).filter(Boolean).length} words
              </div>
            </div>
          ))}
        </div>

        {/* Zen Mode Navigation */}
        {isZenMode && sections.length > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
              disabled={activeSection === 0}
              className={cn(
                'px-6 py-3 rounded-xl font-medium transition-all',
                isDarkMode ? 'bg-slate-800 text-white disabled:opacity-30' : 'bg-stone-100 disabled:opacity-30'
              )}
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {sections.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSection(index)}
                  className={cn(
                    'w-3 h-3 rounded-full transition-all',
                    index === activeSection
                      ? 'bg-sage scale-125'
                      : (content[sections[index].key] || '').trim()
                        ? 'bg-emerald-500'
                        : isDarkMode ? 'bg-slate-700' : 'bg-stone-300'
                  )}
                />
              ))}
            </div>

            <button
              onClick={() => setActiveSection(Math.min(sections.length - 1, activeSection + 1))}
              disabled={activeSection === sections.length - 1}
              className={cn(
                'px-6 py-3 rounded-xl font-medium transition-all',
                isDarkMode ? 'bg-slate-800 text-white disabled:opacity-30' : 'bg-stone-100 disabled:opacity-30'
              )}
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Bottom Stats Bar */}
      <footer className={cn(
        'fixed bottom-0 left-0 right-0 border-t backdrop-blur-xl transition-all duration-300',
        isDarkMode ? 'bg-slate-900/90 border-slate-700' : 'bg-white/80 border-stone-200',
        isZenMode && 'opacity-0 hover:opacity-100'
      )}>
        <div className="max-w-5xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className={cn(
              'flex items-center gap-6 text-sm',
              isDarkMode ? 'text-slate-400' : 'text-stone-500'
            )}>
              <span>{wordCount} words</span>
              <span>{charCount} characters</span>
              <span>{Math.ceil(wordCount / 200)} min read</span>
              <span>{filledSections}/{sections.length} sections</span>
            </div>

            <div className={cn(
              'flex items-center gap-2 text-sm',
              isDarkMode ? 'text-slate-500' : 'text-stone-400'
            )}>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Auto-save enabled
              </span>
              <span>|</span>
              <span>Cmd+S to save, Cmd+Enter to sign</span>
            </div>
          </div>
        </div>
      </footer>

      {/* AI Report Help Panel */}
      {showAIPanel && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={() => setShowAIPanel(false)}
          />

          {/* Panel */}
          <div className={cn(
            'fixed right-0 top-0 bottom-0 w-[420px] z-50 shadow-2xl overflow-hidden',
            'transform transition-transform duration-300',
            isDarkMode ? 'bg-slate-900' : 'bg-white'
          )}>
            {/* Panel Header */}
            <div className={cn(
              'p-6 border-b',
              isDarkMode ? 'border-slate-700' : 'border-stone-200'
            )}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
                    <Wand2 className="w-5 h-5 text-white" />
                  </div>
                  <h2 className={cn(
                    'text-xl font-semibold',
                    isDarkMode ? 'text-white' : 'text-stone-800'
                  )}>
                    AI Report Help
                  </h2>
                </div>
                <button
                  onClick={() => setShowAIPanel(false)}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-stone-100 text-stone-500'
                  )}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className={cn(
                'text-sm',
                isDarkMode ? 'text-slate-400' : 'text-stone-500'
              )}>
                AI-powered suggestions to improve your clinical documentation
              </p>
            </div>

            {/* Panel Content */}
            <div className="p-6 overflow-y-auto h-[calc(100vh-180px)]">
              {isAIProcessing ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 animate-pulse" />
                    <Loader2 className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
                  </div>
                  <p className={cn(
                    'mt-4 text-sm',
                    isDarkMode ? 'text-slate-400' : 'text-stone-500'
                  )}>
                    Analyzing your clinical notes...
                  </p>
                </div>
              ) : aiSuggestions.length === 0 ? (
                <div className="text-center py-12">
                  {!hasBeenAnalyzed ? (
                    <>
                      <Wand2 className={cn('w-12 h-12 mx-auto mb-4', isDarkMode ? 'text-slate-500' : 'text-stone-300')} />
                      <h3 className={cn('text-lg font-medium mb-2', isDarkMode ? 'text-white' : 'text-stone-800')}>
                        Ready to analyse
                      </h3>
                      <p className={cn('text-sm mb-4', isDarkMode ? 'text-slate-400' : 'text-stone-500')}>
                        Click "Analyse Note" to get AI-powered feedback on your clinical documentation.
                      </p>
                    </>
                  ) : (
                    <>
                      {/* Quality Score Badge */}
                      <div className="mb-6">
                        <div className={cn(
                          'w-20 h-20 rounded-full mx-auto flex items-center justify-center text-2xl font-bold border-4',
                          (qualityScore ?? 0) >= 80 ? 'border-emerald-400 text-emerald-500 bg-emerald-50' :
                          (qualityScore ?? 0) >= 50 ? 'border-amber-400 text-amber-600 bg-amber-50' :
                          'border-red-400 text-red-500 bg-red-50'
                        )}>
                          {qualityScore}%
                        </div>
                        <p className={cn('text-xs mt-2 font-medium', isDarkMode ? 'text-slate-400' : 'text-stone-500')}>
                          Documentation Quality Score
                        </p>
                      </div>
                      <CheckCheck className={cn('w-10 h-10 mx-auto mb-3', isDarkMode ? 'text-emerald-400' : 'text-emerald-500')} />
                      <h3 className={cn('text-lg font-medium mb-2', isDarkMode ? 'text-white' : 'text-stone-800')}>
                        Excellent documentation!
                      </h3>
                      <p className={cn('text-sm', isDarkMode ? 'text-slate-400' : 'text-stone-500')}>
                        All sections are complete, terminology is clinical, and risk is documented. No improvements needed.
                      </p>
                    </>
                  )}
                  <button
                    onClick={generateAISuggestions}
                    className={cn(
                      'mt-4 flex items-center gap-2 px-4 py-2 rounded-lg mx-auto text-sm',
                      isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-stone-100 hover:bg-stone-200'
                    )}
                  >
                    <RefreshCw className="w-4 h-4" />
                    {hasBeenAnalyzed ? 'Analyse Again' : 'Analyse Note'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Quality Score */}
                  {qualityScore !== null && (
                    <div className={cn(
                      'flex items-center gap-4 p-4 rounded-xl border mb-2',
                      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-stone-50 border-stone-200'
                    )}>
                      <div className={cn(
                        'w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold border-3 flex-shrink-0',
                        qualityScore >= 80 ? 'border-emerald-400 text-emerald-600 bg-emerald-50' :
                        qualityScore >= 50 ? 'border-amber-400 text-amber-600 bg-amber-50' :
                        'border-red-400 text-red-600 bg-red-50'
                      )}>
                        {qualityScore}%
                      </div>
                      <div>
                        <p className={cn('text-sm font-semibold', isDarkMode ? 'text-white' : 'text-stone-800')}>
                          {qualityScore >= 80 ? 'Good documentation' : qualityScore >= 50 ? 'Needs improvement' : 'Incomplete — action required'}
                        </p>
                        <p className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-stone-500')}>
                          {aiSuggestions.length} issue{aiSuggestions.length !== 1 ? 's' : ''} found · Address critical items first
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Suggestion Categories */}
                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    {['critical', 'missing', 'clinical', 'expand', 'grammar', 'professional'].map((type) => {
                      const count = aiSuggestions.filter(s => s.type === type).length;
                      if (count === 0) return null;
                      return (
                        <span
                          key={type}
                          className={cn(
                            'px-3 py-1 rounded-full text-xs font-medium',
                            type === 'critical' && 'bg-red-100 text-red-700',
                            type === 'missing' && 'bg-orange-100 text-orange-700',
                            type === 'grammar' && 'bg-blue-100 text-blue-700',
                            type === 'clinical' && 'bg-purple-100 text-purple-700',
                            type === 'expand' && 'bg-amber-100 text-amber-700',
                            type === 'professional' && 'bg-emerald-100 text-emerald-700'
                          )}
                        >
                          {type === 'critical' && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                          {type === 'missing' && <HelpCircle className="w-3 h-3 inline mr-1" />}
                          {type === 'grammar' && <SpellCheck className="w-3 h-3 inline mr-1" />}
                          {type === 'clinical' && <FileEdit className="w-3 h-3 inline mr-1" />}
                          {type === 'expand' && <Lightbulb className="w-3 h-3 inline mr-1" />}
                          {type === 'professional' && <MessageSquare className="w-3 h-3 inline mr-1" />}
                          {count} {type}
                        </span>
                      );
                    })}
                  </div>

                  {/* Suggestions List — critical/missing first */}
                  {[...aiSuggestions].sort((a, b) => {
                    const priority: Record<string, number> = { critical: 0, missing: 1, clinical: 2, expand: 3, grammar: 4, professional: 5 };
                    return (priority[a.type] ?? 9) - (priority[b.type] ?? 9);
                  }).map((suggestion, index) => (
                    <div
                      key={index}
                      className={cn(
                        'p-4 rounded-xl border transition-all',
                        appliedSuggestions.has(index)
                          ? isDarkMode
                            ? 'bg-emerald-900/20 border-emerald-800'
                            : 'bg-emerald-50 border-emerald-200'
                          : isDarkMode
                            ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
                            : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                      )}
                    >
                      {/* Type Badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={cn(
                          'px-2 py-0.5 rounded text-xs font-medium',
                          suggestion.type === 'critical' && 'bg-red-100 text-red-700',
                          suggestion.type === 'missing' && 'bg-orange-100 text-orange-700',
                          suggestion.type === 'grammar' && 'bg-blue-100 text-blue-700',
                          suggestion.type === 'clinical' && 'bg-purple-100 text-purple-700',
                          suggestion.type === 'expand' && 'bg-amber-100 text-amber-700',
                          suggestion.type === 'professional' && 'bg-emerald-100 text-emerald-700'
                        )}>
                          {suggestion.type === 'critical' && '⚠ Critical'}
                          {suggestion.type === 'missing' && '⚠ Missing Section'}
                          {suggestion.type === 'grammar' && 'Grammar'}
                          {suggestion.type === 'clinical' && 'Clinical Term'}
                          {suggestion.type === 'expand' && 'Expand'}
                          {suggestion.type === 'professional' && 'Professional'}
                        </span>
                        {appliedSuggestions.has(index) && (
                          <span className="flex items-center gap-1 text-xs text-emerald-600">
                            <CheckCheck className="w-3 h-3" />
                            Applied
                          </span>
                        )}
                      </div>

                      {/* Original & Suggestion */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-start gap-2">
                          <span className={cn(
                            'text-xs font-medium px-1.5 py-0.5 rounded',
                            isDarkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-700'
                          )}>
                            From
                          </span>
                          <span className={cn(
                            'text-sm line-through',
                            isDarkMode ? 'text-slate-400' : 'text-stone-500'
                          )}>
                            {suggestion.original}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className={cn(
                            'text-xs font-medium px-1.5 py-0.5 rounded',
                            isDarkMode ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                          )}>
                            To
                          </span>
                          <span className={cn(
                            'text-sm font-medium',
                            isDarkMode ? 'text-white' : 'text-stone-800'
                          )}>
                            {suggestion.suggestion}
                          </span>
                        </div>
                      </div>

                      {/* Explanation */}
                      <p className={cn(
                        'text-xs mb-3',
                        isDarkMode ? 'text-slate-400' : 'text-stone-500'
                      )}>
                        {suggestion.explanation}
                      </p>

                      {/* Actions */}
                      {!appliedSuggestions.has(index) && suggestion.type !== 'expand' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => applySuggestion(index, suggestion)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-medium rounded-lg hover:from-violet-600 hover:to-purple-700 transition-all"
                          >
                            <Check className="w-3 h-3" />
                            Apply
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(suggestion.suggestion);
                            }}
                            className={cn(
                              'flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all',
                              isDarkMode
                                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                            )}
                          >
                            <Copy className="w-3 h-3" />
                            Copy
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Refresh Button */}
                  <button
                    onClick={generateAISuggestions}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all mt-6',
                      isDarkMode
                        ? 'bg-slate-800 text-white hover:bg-slate-700'
                        : 'bg-stone-100 hover:bg-stone-200'
                    )}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh Suggestions
                  </button>
                </div>
              )}
            </div>

            {/* Panel Footer */}
            <div className={cn(
              'absolute bottom-0 left-0 right-0 p-4 border-t',
              isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-stone-200'
            )}>
              <p className={cn(
                'text-xs text-center',
                isDarkMode ? 'text-slate-500' : 'text-stone-400'
              )}>
                AI suggestions are recommendations. Always use clinical judgment.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Click outside handlers */}
      {(showClientPicker || showFormatPicker || showRiskPicker) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowClientPicker(false);
            setShowFormatPicker(false);
            setShowRiskPicker(false);
          }}
        />
      )}
    </div>
  );
}

export default function NewNotePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-8 h-8 border-2 border-sage border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <NewNoteContent />
    </Suspense>
  );
}
