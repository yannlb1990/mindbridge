'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useAgeTheme } from '@/components/client/AgeThemeProvider';
import { supabase, isEffectiveDemo } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { ClipboardList, CheckCircle2, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';

// Assessment question banks
const QUESTIONS: Record<string, { text: string; min: number; max: number; labels: string[] }[]> = {
  'PHQ-9': [
    { text: 'Little interest or pleasure in doing things', min: 0, max: 3, labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
    { text: 'Feeling down, depressed, or hopeless', min: 0, max: 3, labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
    { text: 'Trouble falling or staying asleep, or sleeping too much', min: 0, max: 3, labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
    { text: 'Feeling tired or having little energy', min: 0, max: 3, labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
    { text: 'Poor appetite or overeating', min: 0, max: 3, labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
    { text: 'Feeling bad about yourself — or that you are a failure', min: 0, max: 3, labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
    { text: 'Trouble concentrating on things, such as reading or watching TV', min: 0, max: 3, labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
    { text: 'Moving or speaking so slowly (or being fidgety/restless)', min: 0, max: 3, labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
    { text: 'Thoughts that you would be better off dead, or of hurting yourself', min: 0, max: 3, labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
  ],
  'GAD-7': [
    { text: 'Feeling nervous, anxious, or on edge', min: 0, max: 3, labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
    { text: 'Not being able to stop or control worrying', min: 0, max: 3, labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
    { text: 'Worrying too much about different things', min: 0, max: 3, labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
    { text: 'Trouble relaxing', min: 0, max: 3, labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
    { text: 'Being so restless it is hard to sit still', min: 0, max: 3, labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
    { text: 'Becoming easily annoyed or irritable', min: 0, max: 3, labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
    { text: 'Feeling afraid, as if something awful might happen', min: 0, max: 3, labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
  ],
  'K10': [
    { text: 'About how often did you feel tired out for no good reason?', min: 1, max: 5, labels: ['None of the time', 'A little of the time', 'Some of the time', 'Most of the time', 'All of the time'] },
    { text: 'About how often did you feel nervous?', min: 1, max: 5, labels: ['None of the time', 'A little of the time', 'Some of the time', 'Most of the time', 'All of the time'] },
    { text: 'About how often did you feel so nervous that nothing could calm you down?', min: 1, max: 5, labels: ['None of the time', 'A little of the time', 'Some of the time', 'Most of the time', 'All of the time'] },
    { text: 'About how often did you feel hopeless?', min: 1, max: 5, labels: ['None of the time', 'A little of the time', 'Some of the time', 'Most of the time', 'All of the time'] },
    { text: 'About how often did you feel restless or fidgety?', min: 1, max: 5, labels: ['None of the time', 'A little of the time', 'Some of the time', 'Most of the time', 'All of the time'] },
    { text: 'About how often did you feel so restless you could not sit still?', min: 1, max: 5, labels: ['None of the time', 'A little of the time', 'Some of the time', 'Most of the time', 'All of the time'] },
    { text: 'About how often did you feel depressed?', min: 1, max: 5, labels: ['None of the time', 'A little of the time', 'Some of the time', 'Most of the time', 'All of the time'] },
    { text: 'About how often did you feel that everything was an effort?', min: 1, max: 5, labels: ['None of the time', 'A little of the time', 'Some of the time', 'Most of the time', 'All of the time'] },
    { text: 'About how often did you feel so sad that nothing could cheer you up?', min: 1, max: 5, labels: ['None of the time', 'A little of the time', 'Some of the time', 'Most of the time', 'All of the time'] },
    { text: 'About how often did you feel worthless?', min: 1, max: 5, labels: ['None of the time', 'A little of the time', 'Some of the time', 'Most of the time', 'All of the time'] },
  ],
};

// Fallback generic questions for assessment types without defined banks
function getGenericQuestions(type: string, count: number) {
  return Array.from({ length: count }, (_, i) => ({
    text: `Question ${i + 1} — ${type}`,
    min: 0,
    max: 3,
    labels: ['Not at all', 'Somewhat', 'Moderately', 'Severely'],
  }));
}

const ASSESSMENT_QUESTION_COUNTS: Record<string, number> = {
  'PHQ-9': 9, 'GAD-7': 7, 'K10': 10, 'EDE-Q': 28, 'DASS-21': 21, 'CORE-10': 10,
};

interface PendingAssessment {
  id: string;
  assessment_type: string;
  sent_at: string;
}

export default function ClientAssessmentsPage() {
  const { user } = useAuthStore();
  const theme = useAgeTheme();
  const [pending, setPending] = useState<PendingAssessment[]>([]);
  const [completed, setCompleted] = useState<{ id: string; assessment_type: string; score: number; severity: string; completed_at: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Taking an assessment
  const [activeAssessment, setActiveAssessment] = useState<PendingAssessment | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);

  const demo = isEffectiveDemo(user?.id);

  const fetchAssessments = useCallback(async () => {
    if (demo || !user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('id, assessment_type, status, score, severity, sent_at, completed_at')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPending((data || []).filter((a: any) => a.status === 'pending').map((a: any) => ({
        id: a.id,
        assessment_type: a.assessment_type,
        sent_at: a.sent_at ?? a.created_at,
      })));

      setCompleted((data || []).filter((a: any) => a.status === 'completed').map((a: any) => ({
        id: a.id,
        assessment_type: a.assessment_type,
        score: a.score,
        severity: a.severity,
        completed_at: a.completed_at,
      })));
    } catch (err) {
      console.error('Failed to fetch assessments:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user, demo]);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  const getQuestions = (type: string) => {
    if (QUESTIONS[type]) return QUESTIONS[type];
    return getGenericQuestions(type, ASSESSMENT_QUESTION_COUNTS[type] ?? 10);
  };

  const startAssessment = (assessment: PendingAssessment) => {
    setActiveAssessment(assessment);
    setCurrentQuestion(0);
    setResponses({});
    setSubmitDone(false);
  };

  const handleAnswer = (value: number) => {
    setResponses((prev) => ({ ...prev, [currentQuestion]: value }));
  };

  const goNext = () => {
    const questions = getQuestions(activeAssessment!.assessment_type);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
    }
  };

  const goPrev = () => {
    if (currentQuestion > 0) setCurrentQuestion((q) => q - 1);
  };

  const handleSubmit = async () => {
    if (!activeAssessment || !user) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/assessments/complete', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId: activeAssessment.id,
          clientId: user.id,
          responses,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSubmitDone(true);
      await fetchAssessments();
    } catch (err) {
      console.error('Failed to submit assessment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Render the active assessment questionnaire
  if (activeAssessment) {
    const questions = getQuestions(activeAssessment.assessment_type);
    const q = questions[currentQuestion];
    const answered = responses[currentQuestion] !== undefined;
    const allAnswered = questions.every((_, i) => responses[i] !== undefined);
    const isLast = currentQuestion === questions.length - 1;

    if (submitDone) {
      return (
        <div className={cn('min-h-screen flex flex-col items-center justify-center p-6', theme.pageBg)}>
          <div className="w-full max-w-md text-center">
            <div className={cn('w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4', theme.accentBg + '/20')}>
              <CheckCircle2 className={cn('w-10 h-10', theme.accentBg)} />
            </div>
            <h2 className={cn('text-2xl font-bold mb-2', theme.primaryText)}>Done!</h2>
            <p className="text-text-secondary mb-6">Your {activeAssessment.assessment_type} assessment has been submitted. Your therapist will review the results.</p>
            <button
              onClick={() => setActiveAssessment(null)}
              className={cn('px-6 py-3 rounded-xl font-medium text-white', theme.primaryButton)}
            >
              Back to Assessments
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className={cn('min-h-screen flex flex-col p-6', theme.pageBg)}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setActiveAssessment(null)} className="p-2 hover:bg-sand rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-text-muted" />
          </button>
          <div className="text-center">
            <p className={cn('font-semibold', theme.primaryText)}>{activeAssessment.assessment_type}</p>
            <p className="text-sm text-text-muted">{currentQuestion + 1} of {questions.length}</p>
          </div>
          <div className="w-9" />
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-beige rounded-full mb-8">
          <div
            className={cn('h-full rounded-full transition-all duration-300', theme.primaryButton)}
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="flex-1">
          <p className={cn('text-lg font-medium mb-6 leading-relaxed', theme.primaryText)}>{q.text}</p>

          <div className="space-y-3">
            {q.labels.map((label, idx) => {
              const value = q.min + idx;
              const selected = responses[currentQuestion] === value;
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(value)}
                  className={cn(
                    'w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all',
                    selected
                      ? cn(theme.primaryButton.replace('bg-', 'border-').replace('hover:', ''), 'border-opacity-100 bg-sage/10 font-medium')
                      : 'border-beige hover:border-sage/50'
                  )}
                >
                  <span className={selected ? theme.primaryText : 'text-text-primary'}>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {currentQuestion > 0 && (
            <button
              onClick={goPrev}
              className="flex-1 py-3 rounded-xl border-2 border-beige font-medium text-text-secondary hover:border-sage/50 transition-all flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}
          {!isLast ? (
            <button
              onClick={goNext}
              disabled={!answered}
              className={cn(
                'flex-1 py-3 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-2',
                answered ? theme.primaryButton : 'bg-beige text-text-muted cursor-not-allowed'
              )}
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className={cn(
                'flex-1 py-3 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-2',
                allAnswered && !submitting ? theme.primaryButton : 'bg-beige text-text-muted cursor-not-allowed'
              )}
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen p-6', theme.pageBg)}>
      <h1 className={cn('text-2xl font-bold mb-6', theme.primaryText)}>Assessments</h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-text-muted" />
        </div>
      ) : (
        <>
          {/* Pending */}
          {(demo ? [] : pending).length > 0 && (
            <div className="mb-8">
              <h2 className={cn('text-lg font-semibold mb-3', theme.primaryText)}>To Complete</h2>
              <div className="space-y-3">
                {pending.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => startAssessment(a)}
                    className="w-full text-left p-4 bg-white border-2 border-sage/30 rounded-xl hover:border-sage transition-all flex items-center gap-4"
                  >
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', theme.accentBg + '/10')}>
                      <ClipboardList className={cn('w-6 h-6', theme.accentBg)} />
                    </div>
                    <div className="flex-1">
                      <p className={cn('font-semibold', theme.primaryText)}>{a.assessment_type}</p>
                      <p className="text-sm text-text-muted">Requested by your therapist</p>
                    </div>
                    <div className={cn('px-3 py-1 rounded-full text-sm font-medium text-white', theme.primaryButton)}>
                      Start
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Completed */}
          <div>
            <h2 className={cn('text-lg font-semibold mb-3', theme.primaryText)}>Completed</h2>
            {completed.length === 0 && !demo ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-beige">
                <ClipboardList className="w-12 h-12 text-text-muted mx-auto mb-3" />
                <p className="text-text-secondary">No completed assessments yet</p>
                {pending.length === 0 && (
                  <p className="text-sm text-text-muted mt-1">Your therapist will send you assessments to complete here</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {completed.map((a) => (
                  <div key={a.id} className="p-4 bg-white rounded-xl border border-beige flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-sage" />
                    </div>
                    <div className="flex-1">
                      <p className={cn('font-medium', theme.primaryText)}>{a.assessment_type}</p>
                      <p className="text-sm text-text-muted">
                        {a.completed_at ? new Date(a.completed_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-text-primary">Score: {a.score}</p>
                      <p className="text-sm text-text-muted">{a.severity}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
