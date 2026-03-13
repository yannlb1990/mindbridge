'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAgeTheme } from '@/components/client/AgeThemeProvider';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, ChevronLeft, ChevronRight, Star, RotateCcw, Loader2,
  Wind, Smile, Package, Archive, Zap, Sun, LayoutGrid, MessageCircle,
  AlertTriangle, CheckCircle, ArrowRight, Check,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useEmotionSessions } from '@/hooks/useEmotionSessions';
import type { EmotionCoachResponse } from '@/app/api/emotion-coach/route';

// ─────────────────────────────────────────────────────────────────────────────
// Game registry
// ─────────────────────────────────────────────────────────────────────────────

const GAMES = [
  {
    id: 'breathing',
    name: 'Belly Breathing',
    desc: 'Guided breathing exercise to reduce stress and feel calm',
    bg: 'bg-calm/10',
    border: 'border-calm/30',
    badge: 'Calming',
    badgeColor: 'bg-calm/15 text-calm-dark',
    iconBg: 'bg-calm/20',
    iconColor: 'text-calm-dark',
  },
  {
    id: 'feelings',
    name: 'How Do I Feel?',
    desc: 'Identify and explore your current emotions',
    bg: 'bg-coral/10',
    border: 'border-coral/30',
    badge: 'Emotions',
    badgeColor: 'bg-coral/15 text-coral-dark',
    iconBg: 'bg-coral/20',
    iconColor: 'text-coral-dark',
  },
  {
    id: 'calm-kit',
    name: 'Calm Down Kit',
    desc: 'Step-by-step coping tools for difficult moments',
    bg: 'bg-sage/10',
    border: 'border-sage/30',
    badge: 'Coping',
    badgeColor: 'bg-sage/15 text-sage-dark',
    iconBg: 'bg-sage/20',
    iconColor: 'text-sage-dark',
  },
  {
    id: 'worry-jar',
    name: 'Worry Jar',
    desc: 'Write down worries to free up mental space',
    bg: 'bg-gold/10',
    border: 'border-gold/30',
    badge: 'Worry',
    badgeColor: 'bg-gold/15 text-gold-dark',
    iconBg: 'bg-gold/20',
    iconColor: 'text-gold-dark',
  },
  {
    id: 'superpowers',
    name: 'My Strengths',
    desc: 'Identify and celebrate your personal strengths',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    badge: 'Strengths',
    badgeColor: 'bg-yellow-100 text-yellow-700',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-700',
  },
  {
    id: 'happy-place',
    name: 'Safe Place',
    desc: 'Guided visualisation to a calm, safe space',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    badge: 'Relaxation',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
  },
  {
    id: 'memory',
    name: 'Feelings Memory',
    desc: 'Match emotion pairs — a fun way to build emotional vocabulary',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    badge: 'Game',
    badgeColor: 'bg-purple-100 text-purple-700',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    id: 'emotion-coach',
    name: 'Emotion Coach',
    desc: 'Reflect on a situation and receive personalised AI guidance',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    badge: 'AI Guide',
    badgeColor: 'bg-violet-100 text-violet-700',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
  },
] as const;

type GameId = (typeof GAMES)[number]['id'];

const GAME_ICONS: Record<GameId, React.FC<{ className?: string }>> = {
  breathing:       Wind,
  feelings:        Smile,
  'calm-kit':      Package,
  'worry-jar':     Archive,
  superpowers:     Zap,
  'happy-place':   Sun,
  memory:          LayoutGrid,
  'emotion-coach': MessageCircle,
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. BELLY BREATHING
// ─────────────────────────────────────────────────────────────────────────────

type BreathPhase = 'idle' | 'inhale' | 'hold' | 'exhale';

const BREATH_CONFIG: Record<Exclude<BreathPhase, 'idle'>, { seconds: number; next: BreathPhase; text: string; targetSize: number }> = {
  inhale: { seconds: 4, next: 'hold',   text: 'Breathe in…',   targetSize: 200 },
  hold:   { seconds: 2, next: 'exhale', text: 'Hold…',          targetSize: 200 },
  exhale: { seconds: 5, next: 'inhale', text: 'Breathe out…',  targetSize: 96  },
};
const MAX_ROUNDS = 4;

function BellyBreathing() {
  const [phase, setPhase] = useState<BreathPhase>('idle');
  const [count, setCount] = useState(0);
  const [round, setRound] = useState(0);
  const [done, setDone] = useState(false);

  // Advance phase after duration
  useEffect(() => {
    if (phase === 'idle') return;
    const cfg = BREATH_CONFIG[phase];
    const t = setTimeout(() => {
      if (phase === 'exhale') {
        const next = round + 1;
        if (next >= MAX_ROUNDS) { setPhase('idle'); setDone(true); return; }
        setRound(next);
      }
      setPhase(cfg.next);
    }, cfg.seconds * 1000);
    return () => clearTimeout(t);
  }, [phase, round]);

  // Countdown tick
  useEffect(() => {
    if (phase === 'idle') return;
    const secs = BREATH_CONFIG[phase].seconds;
    setCount(secs);
    const interval = setInterval(() => setCount((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(interval);
  }, [phase]);

  const circleSize = phase === 'idle' ? 96 : BREATH_CONFIG[phase].targetSize;
  const transitionMs = phase === 'inhale' ? 4000 : phase === 'exhale' ? 5000 : 300;

  const start = () => { setPhase('inhale'); setRound(0); setDone(false); };
  const stop  = () => { setPhase('idle'); setRound(0); setDone(false); };

  return (
    <div className="flex flex-col items-center gap-6 py-4 min-h-[420px] justify-center">
      {done ? (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-calm/20 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-calm-dark" />
          </div>
          <p className="text-2xl font-bold text-text-primary">Well done!</p>
          <p className="text-base text-text-secondary">You completed {MAX_ROUNDS} full breathing cycles.<br/>Notice how your body feels now.</p>
          <button onClick={start} className="mt-2 px-8 py-3 bg-calm text-white rounded-2xl font-bold text-base">
            Try again
          </button>
        </div>
      ) : (
        <>
          <p className="text-lg font-semibold text-text-primary text-center">
            {phase === 'idle' ? 'Watch the bubble and breathe with it!' : BREATH_CONFIG[phase].text}
          </p>

          {/* Animated bubble */}
          <div
            className="rounded-full bg-calm/40 border-4 border-calm flex items-center justify-center shadow-large"
            style={{
              width: circleSize,
              height: circleSize,
              transition: `width ${transitionMs}ms ease-in-out, height ${transitionMs}ms ease-in-out`,
            }}
          >
            {phase === 'idle'
              ? <Wind className="w-10 h-10 text-calm-dark opacity-60" />
              : <span className="text-4xl font-bold text-calm-dark">{count}</span>
            }
          </div>

          {phase !== 'idle' && (
            <p className="text-sm text-text-muted">Round {round + 1} of {MAX_ROUNDS}</p>
          )}

          {phase === 'idle' ? (
            <button onClick={start} className="px-8 py-4 bg-calm text-white rounded-2xl font-bold text-xl shadow-medium">
              Start breathing
            </button>
          ) : (
            <button onClick={stop} className="text-sm text-text-muted underline">Stop</button>
          )}
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. FEELINGS WHEEL
// ─────────────────────────────────────────────────────────────────────────────

const FEELINGS = [
  { id: 'happy',    emoji: '😄', name: 'Happy',    body: 'Your chest feels warm and full.',           tip: 'Share it! Tell someone what made you happy.' },
  { id: 'sad',      emoji: '😢', name: 'Sad',      body: 'You might feel heavy or want to cry.',      tip: "It's okay to cry. Be gentle with yourself." },
  { id: 'angry',    emoji: '😡', name: 'Angry',    body: 'Your body gets hot and tense.',              tip: 'Squeeze something soft, then breathe slowly.' },
  { id: 'scared',   emoji: '😨', name: 'Scared',   body: 'Your heart beats fast and tummy flips.',    tip: 'Tell a safe adult. You are not alone.' },
  { id: 'worried',  emoji: '😟', name: 'Worried',  body: 'Your tummy feels tight.',                    tip: 'Write the worry down, then breathe it out.' },
  { id: 'excited',  emoji: '🤩', name: 'Excited',  body: 'Your body feels buzzy and full of energy.', tip: 'Move your body — jump, dance, wiggle!' },
  { id: 'calm',     emoji: '😌', name: 'Calm',     body: 'Your body feels soft and easy.',             tip: 'Notice what helped you feel this way 🌿' },
  { id: 'confused', emoji: '🤔', name: 'Confused', body: 'Your head might feel fuzzy.',               tip: "Saying 'I don't understand' is really brave!" },
  { id: 'silly',    emoji: '🤪', name: 'Silly',    body: 'You might giggle or feel wiggly.',           tip: 'Laughter is great medicine — enjoy it!' },
  { id: 'lonely',   emoji: '🥺', name: 'Lonely',   body: 'You feel a quiet, empty kind of sad.',      tip: 'Reach out to someone you trust 💌' },
];

function FeelingsWheel() {
  const [selected, setSelected] = useState<(typeof FEELINGS)[0] | null>(null);

  return (
    <div className="space-y-5">
      <p className="text-base font-semibold text-text-primary text-center">
        Tap on how you are feeling right now
      </p>

      <div className="grid grid-cols-5 gap-2">
        {FEELINGS.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelected(selected?.id === f.id ? null : f)}
            className={cn(
              'flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all',
              selected?.id === f.id
                ? 'border-coral bg-coral/20 scale-105 shadow-sm'
                : 'border-transparent hover:bg-sand'
            )}
          >
            <span className="text-3xl">{f.emoji}</span>
            <span className="text-xs font-medium text-text-secondary text-center leading-tight">{f.name}</span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="bg-white rounded-2xl shadow-medium p-5 space-y-3 border-2 border-coral/30 animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3">
            <span className="text-5xl">{selected.emoji}</span>
            <div>
              <p className="text-xl font-bold text-text-primary">Feeling {selected.name}</p>
              <p className="text-sm text-text-muted">That&apos;s a totally normal feeling.</p>
            </div>
          </div>
          <div className="bg-coral/10 rounded-xl p-3">
            <p className="text-xs font-semibold text-coral-dark uppercase tracking-wide mb-1">In your body</p>
            <p className="text-sm text-text-primary">{selected.body}</p>
          </div>
          <div className="bg-sage-50 rounded-xl p-3">
            <p className="text-xs font-semibold text-sage-dark uppercase tracking-wide mb-1">What can help</p>
            <p className="text-sm text-text-primary">{selected.tip}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CALM DOWN KIT
// ─────────────────────────────────────────────────────────────────────────────

const COPING_STRATEGIES = [
  {
    name: 'Balloon Breathing',
    emoji: '🎈',
    color: 'bg-calm/20',
    steps: [
      'Put one hand on your tummy',
      'Breathe in slowly — your tummy pushes OUT like a balloon',
      'Hold for 2 seconds',
      'Breathe out slowly — balloon gets smaller',
      'Do this 5 times and notice how calm you feel!',
    ],
  },
  {
    name: '5-4-3-2-1 Grounding',
    emoji: '⭐',
    color: 'bg-gold/20',
    steps: [
      '5 things you can SEE — look around slowly',
      '4 things you can TOUCH — feel them',
      '3 things you can HEAR — listen carefully',
      '2 things you can SMELL — sniff the air!',
      '1 thing you can TASTE — notice it',
    ],
  },
  {
    name: 'Muscle Squeeze',
    emoji: '💪',
    color: 'bg-coral/20',
    steps: [
      'Make your hands into tight fists',
      'Squeeze as hard as you can — count to 5',
      'LET GO! Let your hands go completely floppy',
      'Do the same with your shoulders — squeeze, hold, release',
      'Notice how relaxed and soft your body feels!',
    ],
  },
  {
    name: 'Cold Water Reset',
    emoji: '💧',
    color: 'bg-blue-100',
    steps: [
      'Go to a sink or grab a cold drink',
      'Splash cold water on your wrists or face',
      'Or hold something cold (ice, cold drink)',
      'Focus all your attention on the coldness',
      'Big feelings start to quiet down quickly!',
    ],
  },
  {
    name: 'Think of Something Nice',
    emoji: '🌈',
    color: 'bg-yellow-50',
    steps: [
      'Close your eyes and take one slow breath',
      'Picture your favourite place or person',
      'Imagine all the colours and sounds there',
      'What can you smell? What does it feel like?',
      'Stay there in your mind for 1 whole minute',
    ],
  },
];

function CalmDownKit() {
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const strategy = COPING_STRATEGIES[index];

  const prev = () => { setIndex((i) => (i - 1 + COPING_STRATEGIES.length) % COPING_STRATEGIES.length); setStep(0); };
  const next = () => { setIndex((i) => (i + 1) % COPING_STRATEGIES.length); setStep(0); };

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted text-center">
        {index + 1} of {COPING_STRATEGIES.length} strategies
      </p>

      <div className={cn('rounded-2xl p-5 space-y-4', strategy.color)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{strategy.emoji}</span>
            <p className="text-xl font-bold text-text-primary">{strategy.name}</p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-2">
          {strategy.steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={cn(
                'w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all',
                step === i
                  ? 'bg-white shadow-soft border-2 border-white scale-[1.01]'
                  : i < step
                  ? 'opacity-50'
                  : 'opacity-70 hover:opacity-90'
              )}
            >
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
                step === i ? 'bg-text-primary text-white' : step > i ? 'bg-sage text-white' : 'bg-white/60 text-text-muted'
              )}>
                {step > i ? '✓' : i + 1}
              </div>
              <p className={cn('text-sm text-text-primary mt-0.5', step === i && 'font-semibold')}>{s}</p>
            </button>
          ))}
        </div>

        {step < strategy.steps.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="w-full py-3 bg-white/70 rounded-xl font-bold text-text-primary text-base hover:bg-white transition-all"
          >
            Next step →
          </button>
        ) : (
          <div className="text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center mx-auto">
              <Check className="w-5 h-5 text-sage-dark" />
            </div>
            <p className="font-bold text-text-primary">Step complete!</p>
            <button onClick={() => setStep(0)} className="text-sm text-text-muted underline">
              Start again
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={prev} className="flex items-center gap-1 px-4 py-2 rounded-xl bg-sand hover:bg-beige text-sm font-medium text-text-secondary transition-all">
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <div className="flex gap-1.5">
          {COPING_STRATEGIES.map((_, i) => (
            <button key={i} onClick={() => { setIndex(i); setStep(0); }}
              className={cn('w-2 h-2 rounded-full transition-all', i === index ? 'bg-text-primary w-4' : 'bg-beige')}
            />
          ))}
        </div>
        <button onClick={next} className="flex items-center gap-1 px-4 py-2 rounded-xl bg-sand hover:bg-beige text-sm font-medium text-text-secondary transition-all">
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. WORRY JAR
// ─────────────────────────────────────────────────────────────────────────────

function WorryJar() {
  const [worries, setWorries] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [justAdded, setJustAdded] = useState(false);
  const [emptied, setEmptied] = useState(false);

  const addWorry = () => {
    if (!input.trim()) return;
    setWorries((w) => [input.trim(), ...w]);
    setInput('');
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const emptyJar = () => {
    setWorries([]);
    setEmptied(true);
    setTimeout(() => setEmptied(false), 3000);
  };

  const fillLevel = Math.min(worries.length, 5);
  const jarEmojis = ['🫙', '🫙', '🫙', '🫙', '🫙'];

  return (
    <div className="space-y-5">
      <div className="text-center space-y-2">
        <p className="text-base font-semibold text-text-primary">
          Write a worry and put it in the jar. The jar keeps it safe so your brain can rest.
        </p>
      </div>

      {/* Jar visualization */}
      <div className="flex justify-center">
        <div className="relative w-32 h-40">
          {/* Jar */}
          <div className="absolute inset-0 rounded-b-3xl rounded-t-lg border-4 border-gold bg-gold/10 overflow-hidden">
            {/* Fill */}
            <div
              className="absolute bottom-0 left-0 right-0 bg-gold/40 transition-all duration-700"
              style={{ height: `${(fillLevel / 5) * 100}%` }}
            />
            {/* Worry count */}
            <div className="absolute inset-0 flex items-center justify-center">
              {worries.length > 0 && (
                <span className="text-2xl font-bold text-gold-dark z-10">{worries.length}</span>
              )}
            </div>
          </div>
          {/* Lid */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-gold rounded-full border-2 border-gold-dark" />
        </div>
      </div>

      {emptied && (
        <p className="text-center text-lg font-semibold text-sage">
          All worries cleared. Your mind is free.
        </p>
      )}

      {justAdded && (
        <p className="text-center text-base font-semibold text-calm-dark">
          Worry safely in the jar!
        </p>
      )}

      {/* Input */}
      <div className="space-y-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addWorry()}
          placeholder="Type a worry here..."
          className="w-full border-2 border-beige rounded-xl px-4 py-3 text-base text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold"
        />
        <button
          onClick={addWorry}
          disabled={!input.trim()}
          className="w-full py-3 bg-gold text-white rounded-xl font-bold text-base disabled:opacity-40 hover:bg-gold-dark transition-all"
        >
          Add to jar
        </button>
      </div>

      {/* Worry list */}
      {worries.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-text-muted uppercase tracking-wide">
              {worries.length} {worries.length === 1 ? 'worry' : 'worries'} in jar
            </p>
            <button
              onClick={emptyJar}
              className="text-xs text-coral-dark underline hover:no-underline"
            >
              Clear all
            </button>
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {worries.map((w, i) => (
              <div key={i} className="flex items-center gap-2 bg-gold/10 rounded-xl px-3 py-2">
                <Archive className="w-4 h-4 text-gold-dark" />
                <p className="text-sm text-text-secondary flex-1">{w}</p>
                <button
                  onClick={() => setWorries((ws) => ws.filter((_, j) => j !== i))}
                  className="text-xs text-text-muted hover:text-error"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {worries.length === 0 && !emptied && (
        <p className="text-center text-sm text-text-muted">
          The jar is empty — nothing to worry about right now.
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. MY SUPERPOWERS
// ─────────────────────────────────────────────────────────────────────────────

const ALL_STRENGTHS = [
  { id: 'brave',     emoji: '🦁', name: 'Brave' },
  { id: 'kind',      emoji: '💝', name: 'Kind' },
  { id: 'creative',  emoji: '🎨', name: 'Creative' },
  { id: 'funny',     emoji: '😄', name: 'Funny' },
  { id: 'smart',     emoji: '🧠', name: 'Smart' },
  { id: 'helpful',   emoji: '🤝', name: 'Helpful' },
  { id: 'curious',   emoji: '🔍', name: 'Curious' },
  { id: 'caring',    emoji: '🤗', name: 'Caring' },
  { id: 'sporty',    emoji: '⚽', name: 'Sporty' },
  { id: 'musical',   emoji: '🎵', name: 'Musical' },
  { id: 'honest',    emoji: '✨', name: 'Honest' },
  { id: 'patient',   emoji: '⏱️', name: 'Patient' },
  { id: 'strong',    emoji: '💪', name: 'Strong' },
  { id: 'friendly',  emoji: '👋', name: 'Friendly' },
  { id: 'thoughtful',emoji: '💭', name: 'Thoughtful' },
  { id: 'resilient', emoji: '🌱', name: 'Resilient' },
];

function MySuperpowers() {
  const [collected, setCollected] = useState<Set<string>>(new Set(['kind', 'curious']));

  const toggle = (id: string) => {
    setCollected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-5">
      <p className="text-base font-semibold text-text-primary text-center">
        Select all the strengths that describe you
      </p>

      {/* Collected banner */}
      {collected.size > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 text-center">
          <p className="text-sm font-semibold text-yellow-700 mb-2">
            Your {collected.size} strength{collected.size > 1 ? 's' : ''}:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {Array.from(collected).map((id) => {
              const s = ALL_STRENGTHS.find((x) => x.id === id)!;
              return (
                <span key={id} className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 rounded-full text-sm font-medium text-yellow-800">
                  {s.emoji} {s.name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-4 gap-2">
        {ALL_STRENGTHS.map((s) => {
          const active = collected.has(s.id);
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className={cn(
                'flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all',
                active
                  ? 'border-yellow-400 bg-yellow-50 scale-105 shadow-sm'
                  : 'border-beige hover:border-yellow-200 hover:bg-yellow-50/50'
              )}
            >
              <span className="text-2xl">{s.emoji}</span>
              {active && <Star className="w-3 h-3 text-yellow-500 fill-yellow-400" />}
              <span className="text-xs font-medium text-text-secondary text-center leading-tight">{s.name}</span>
            </button>
          );
        })}
      </div>

      {collected.size >= 3 && (
        <p className="text-center text-base font-semibold text-text-primary">
          You have so many strengths. Don&apos;t forget them.
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. HAPPY PLACE VISUALISATION
// ─────────────────────────────────────────────────────────────────────────────

const HAPPY_PLACE_STEPS = [
  { emoji: '😌', bg: 'from-blue-100 to-blue-50',    text: 'Close your eyes and take a slow, deep breath in… and out. You are safe here.' },
  { emoji: '🌟', bg: 'from-blue-50 to-indigo-50',   text: 'Imagine you are walking towards your most favourite, most beautiful place in the world.' },
  { emoji: '🌳', bg: 'from-green-100 to-sage-50',   text: 'Look around slowly. What do you see? Maybe trees, water, mountains, or a cozy room?' },
  { emoji: '🐦', bg: 'from-sage-50 to-teal-50',     text: 'Listen carefully. What sounds do you hear? Maybe birds, waves, gentle wind, or soft music?' },
  { emoji: '☀️', bg: 'from-yellow-50 to-gold/20',   text: 'Feel the ground beneath your feet. Feel the warmth around you. You are safe and completely at peace.' },
  { emoji: '🌸', bg: 'from-gold/20 to-coral/10',    text: 'Breathe in and notice a lovely smell — flowers, ocean air, fresh rain, or something you love.' },
  { emoji: '🌈', bg: 'from-coral/10 to-cream',      text: 'This is YOUR special place. Whenever things feel hard, you can always come back here. It belongs to you.' },
  { emoji: '✨', bg: 'from-cream to-sand',           text: 'Take one final deep breath in… and out. Slowly wiggle your fingers and toes. Open your eyes. Well done.' },
];

function HappyPlace() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const current = HAPPY_PLACE_STEPS[step];

  const advance = () => {
    if (step < HAPPY_PLACE_STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setDone(true);
    }
  };

  if (done) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto">
          <Sun className="w-8 h-8 text-indigo-600" />
        </div>
        <p className="text-2xl font-bold text-text-primary">Session complete</p>
        <p className="text-base text-text-secondary">You can return to your safe place whenever you need calm.</p>
        <button
          onClick={() => { setStep(0); setDone(false); }}
          className="px-6 py-3 bg-sage text-white rounded-2xl font-bold"
        >
          Visit again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={cn('rounded-2xl p-6 bg-gradient-to-br text-center space-y-4 min-h-[280px] flex flex-col items-center justify-center', current.bg)}>
        <span className="text-7xl">{current.emoji}</span>
        <p className="text-base font-medium text-text-primary leading-relaxed max-w-xs">
          {current.text}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5">
        {HAPPY_PLACE_STEPS.map((_, i) => (
          <div key={i} className={cn('h-2 rounded-full transition-all', i === step ? 'w-5 bg-sage' : i < step ? 'w-2 bg-sage/50' : 'w-2 bg-beige')} />
        ))}
      </div>

      <button
        onClick={advance}
        className="w-full py-4 bg-sage text-white rounded-2xl font-bold text-lg shadow-medium"
      >
        {step < HAPPY_PLACE_STEPS.length - 1 ? 'Continue' : 'Finish'}
      </button>

      {step > 0 && (
        <button onClick={() => setStep((s) => s - 1)} className="w-full text-sm text-text-muted underline">
          Go back
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. FEELINGS MEMORY MATCH GAME
// ─────────────────────────────────────────────────────────────────────────────

const EMOTION_PAIRS = [
  { pairId: 'happy',   emoji: '😄', name: 'Happy'   },
  { pairId: 'sad',     emoji: '😢', name: 'Sad'     },
  { pairId: 'angry',   emoji: '😡', name: 'Angry'   },
  { pairId: 'scared',  emoji: '😨', name: 'Scared'  },
  { pairId: 'excited', emoji: '🤩', name: 'Excited' },
  { pairId: 'calm',    emoji: '😌', name: 'Calm'    },
  { pairId: 'silly',   emoji: '🤪', name: 'Silly'   },
  { pairId: 'loved',   emoji: '🥰', name: 'Loved'   },
];

interface MemCard {
  uid: number;
  pairId: string;
  emoji: string;
  name: string;
}

function shuffleDeck<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(): MemCard[] {
  const deck: MemCard[] = [];
  EMOTION_PAIRS.forEach((p, i) => {
    deck.push({ uid: i * 2,     pairId: p.pairId, emoji: p.emoji, name: p.name });
    deck.push({ uid: i * 2 + 1, pairId: p.pairId, emoji: p.emoji, name: p.name });
  });
  return shuffleDeck(deck);
}

function MemoryMatch() {
  const [cards, setCards] = useState<MemCard[]>(() => buildDeck());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);

  const restart = useCallback(() => {
    setCards(buildDeck());
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setLocked(false);
    setWon(false);
  }, []);

  const handleFlip = (card: MemCard) => {
    if (locked) return;
    if (flipped.includes(card.uid)) return;
    if (matched.has(card.pairId)) return;
    if (flipped.length >= 2) return;

    const nextFlipped = [...flipped, card.uid];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      const [uidA, uidB] = nextFlipped;
      const cardA = cards.find((c) => c.uid === uidA)!;
      const cardB = cards.find((c) => c.uid === uidB)!;
      const newMoves = moves + 1;
      setMoves(newMoves);

      if (cardA.pairId === cardB.pairId) {
        const newMatched = new Set(matched);
        newMatched.add(cardA.pairId);
        setMatched(newMatched);
        setFlipped([]);
        if (newMatched.size === EMOTION_PAIRS.length) {
          setWon(true);
        }
      } else {
        setLocked(true);
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 900);
      }
    }
  };

  const stars = moves <= 12 ? 3 : moves <= 18 ? 2 : 1;

  if (won) {
    return (
      <div className="text-center py-6 space-y-5">
        <div className="w-16 h-16 rounded-full bg-coral/20 flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-coral-dark" />
        </div>
        <p className="text-2xl font-bold text-text-primary">All pairs matched!</p>
        <div className="flex justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              className={cn('w-10 h-10 transition-all', s <= stars ? 'text-gold' : 'text-beige')}
              fill={s <= stars ? 'currentColor' : '#e8e0d0'}
            />
          ))}
        </div>
        <p className="text-base text-text-secondary">
          {moves} moves &middot; {stars === 3 ? 'Perfect score' : stars === 2 ? 'Great effort' : 'Well done'}
        </p>
        <p className="text-sm text-text-muted">
          {stars === 3 ? 'You have an amazing memory!' : stars === 2 ? 'Really impressive!' : 'Keep practising — you are getting better!'}
        </p>
        <button
          onClick={restart}
          className="flex items-center gap-2 mx-auto px-6 py-3 bg-coral text-white rounded-2xl font-bold shadow-medium"
        >
          <RotateCcw className="w-4 h-4" /> Play again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="flex items-center justify-between px-1">
        <span className="text-sm text-text-secondary">
          Moves: <span className="font-bold text-text-primary">{moves}</span>
        </span>
        <span className="text-sm text-text-secondary">
          Pairs: <span className="font-bold text-text-primary">{matched.size}/{EMOTION_PAIRS.length}</span>
        </span>
        <button
          onClick={restart}
          className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> New game
        </button>
      </div>

      {/* Star preview */}
      <div className="flex justify-center gap-1">
        {[1, 2, 3].map((s) => (
          <Star
            key={s}
            className={cn('w-5 h-5 transition-all', s <= stars ? 'text-gold' : 'text-beige')}
            fill={s <= (moves === 0 ? 3 : stars) ? 'currentColor' : '#e8e0d0'}
          />
        ))}
        <span className="text-xs text-text-muted ml-1 self-center">
          {moves === 0 ? 'Flip a card to start!' : moves <= 12 ? '3 stars so far!' : moves <= 18 ? '2 stars so far' : '1 star so far'}
        </span>
      </div>

      {/* Card grid — 4×4 */}
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => {
          const isRevealed = flipped.includes(card.uid) || matched.has(card.pairId);
          const isMatchedCard = matched.has(card.pairId);
          return (
            <button
              key={card.uid}
              onClick={() => handleFlip(card)}
              disabled={isMatchedCard || locked}
              className={cn(
                'aspect-square rounded-xl flex flex-col items-center justify-center border-2 select-none transition-all duration-200',
                isMatchedCard
                  ? 'bg-sage/20 border-sage cursor-default scale-95'
                  : isRevealed
                  ? 'bg-calm/20 border-calm scale-105 shadow-sm'
                  : 'bg-sand border-beige hover:bg-beige hover:scale-105 active:scale-95 cursor-pointer'
              )}
            >
              {isRevealed ? (
                <>
                  <span className="text-2xl leading-none">{card.emoji}</span>
                  <span className="text-[9px] font-semibold text-text-secondary mt-0.5 leading-tight">{card.name}</span>
                </>
              ) : (
                <div className="w-6 h-6 rounded bg-beige/80" />
              )}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-center text-text-muted">
        Tap cards to flip them · find all {EMOTION_PAIRS.length} matching pairs
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. EMOTION COACH (AI-powered)
// ─────────────────────────────────────────────────────────────────────────────

const SCENARIOS = {
  child: [
    { text: 'A friend didn\'t include you in their game at recess' },
    { text: 'You tried really hard but still made a mistake' },
    { text: 'Someone at school was unkind to you' },
    { text: 'You have to do something new and a bit scary' },
    { text: 'Your team lost a game you really wanted to win' },
  ],
  teen: [
    { text: 'You posted something and got almost no likes or responses' },
    { text: 'Your parents disagreed with a decision you made' },
    { text: 'You weren\'t invited to a party your friends went to' },
    { text: 'You keep feeling like you\'re not good enough' },
    { text: 'You feel totally overwhelmed by homework and deadlines' },
  ],
  adult: [
    { text: 'Someone criticised your work in front of others' },
    { text: 'A close friend has gone quiet on you for weeks' },
    { text: 'You feel overwhelmed by all your responsibilities' },
    { text: 'You feel stuck in the same routine with no sense of progress' },
    { text: 'You had a serious disagreement with someone important to you' },
  ],
};

const EMOTION_OPTIONS = [
  { id: 'happy',       name: 'Happy',       valence: 'positive', dot: 'bg-sage' },
  { id: 'sad',         name: 'Sad',         valence: 'negative', dot: 'bg-calm' },
  { id: 'angry',       name: 'Angry',       valence: 'negative', dot: 'bg-coral' },
  { id: 'scared',      name: 'Scared',      valence: 'negative', dot: 'bg-orange-400' },
  { id: 'worried',     name: 'Worried',     valence: 'negative', dot: 'bg-amber-400' },
  { id: 'excited',     name: 'Excited',     valence: 'positive', dot: 'bg-yellow-400' },
  { id: 'calm',        name: 'Calm',        valence: 'positive', dot: 'bg-teal-400' },
  { id: 'lonely',      name: 'Lonely',      valence: 'negative', dot: 'bg-indigo-400' },
  { id: 'proud',       name: 'Proud',       valence: 'positive', dot: 'bg-violet-400' },
  { id: 'overwhelmed', name: 'Overwhelmed', valence: 'negative', dot: 'bg-rose-400' },
];

type ECScreen = 1 | 2 | 3 | 4 | 5;

function EmotionCoach() {
  const { ageGroup } = useAuthStore();
  const { saveSession } = useEmotionSessions();
  const group: 'child' | 'teen' | 'adult' = ageGroup === 'child' ? 'child' : ageGroup === 'teen' ? 'teen' : 'adult';
  const scenarios = SCENARIOS[group];

  const [screen, setScreen] = useState<ECScreen>(1);
  const [scenario, setScenario] = useState(() => scenarios[Math.floor(Math.random() * scenarios.length)]);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<EmotionCoachResponse | null>(null);
  const [saved, setSaved] = useState(false);

  const toggleEmotion = (name: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(name) ? prev.filter((e) => e !== name) : prev.length < 3 ? [...prev, name] : prev
    );
  };

  const fetchAI = async () => {
    setLoading(true);
    setScreen(4);
    try {
      const res = await fetch('/api/emotion-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situation: scenario.text,
          emotions: selectedEmotions,
          ageGroup: group,
          note: note || undefined,
        }),
      });
      const data: EmotionCoachResponse = await res.json();
      setAiResponse(data);
    } catch {
      setAiResponse({
        validation: 'Your feelings are real and they matter. It\'s okay to feel this way.',
        normalisation: 'Many people experience these emotions in similar situations.',
        strategies: ['Take a few slow, deep breaths', 'Talk to someone you trust', 'Be kind to yourself today'],
        encouragement: 'You\'re doing great by checking in with how you feel.',
        severity: 'mixed',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!aiResponse || saved) return;
    await saveSession({
      scenario: scenario.text,
      emotions: selectedEmotions,
      clientNote: note || undefined,
      aiValidation: aiResponse.validation,
      aiNormalisation: aiResponse.normalisation,
      aiStrategies: aiResponse.strategies,
      aiEncouragement: aiResponse.encouragement,
      severity: aiResponse.severity,
    });
    setSaved(true);
    setScreen(5);
  };

  const restart = () => {
    setScreen(1);
    setScenario(scenarios[Math.floor(Math.random() * scenarios.length)]);
    setSelectedEmotions([]);
    setNote('');
    setAiResponse(null);
    setSaved(false);
    setLoading(false);
  };

  const severityColors = {
    positive:   'border-sage   bg-sage/10',
    mixed:      'border-gold   bg-gold/10',
    negative:   'border-coral  bg-coral/10',
    concerning: 'border-error  bg-error/10',
  };

  // Screen 1 — Scenario
  if (screen === 1) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-1">Situation</p>
          <p className="text-sm text-text-secondary">Read the situation below and reflect on how it would make you feel.</p>
        </div>
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-5">
          <p className="text-base text-text-primary leading-relaxed font-medium">{scenario.text}</p>
        </div>
        <button
          onClick={() => setScreen(2)}
          className="w-full py-3.5 bg-violet-600 text-white rounded-xl font-semibold text-base shadow-sm hover:bg-violet-700 transition-all flex items-center justify-center gap-2"
        >
          Identify my feelings <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Screen 2 — Emotion selection
  if (screen === 2) {
    return (
      <div className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-1">Select emotions</p>
          <p className="text-sm text-text-secondary">
            Choose up to 3 feelings that describe your response.{' '}
            <span className="font-medium text-text-primary">{selectedEmotions.length}/3 selected</span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {EMOTION_OPTIONS.map((e) => {
            const active = selectedEmotions.includes(e.name);
            return (
              <button
                key={e.id}
                onClick={() => toggleEmotion(e.name)}
                disabled={!active && selectedEmotions.length >= 3}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left',
                  active
                    ? 'border-violet-400 bg-violet-50 shadow-sm'
                    : 'border-beige bg-white hover:border-violet-200 hover:bg-violet-50/40 disabled:opacity-40 disabled:cursor-not-allowed'
                )}
              >
                <span className={cn('w-2.5 h-2.5 rounded-full flex-shrink-0', e.dot)} />
                <span className={cn('text-sm font-medium', active ? 'text-violet-800' : 'text-text-primary')}>{e.name}</span>
                {active && <Check className="w-4 h-4 text-violet-600 ml-auto" />}
              </button>
            );
          })}
        </div>
        <button
          disabled={selectedEmotions.length === 0}
          onClick={() => setScreen(3)}
          className="w-full py-3.5 bg-violet-600 text-white rounded-xl font-semibold text-base disabled:opacity-40 hover:bg-violet-700 transition-all flex items-center justify-center gap-2"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
        <button onClick={() => setScreen(1)} className="w-full text-sm text-text-muted hover:text-text-secondary transition-colors">
          Back
        </button>
      </div>
    );
  }

  // Screen 3 — Optional note
  if (screen === 3) {
    return (
      <div className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-1">Add context (optional)</p>
          <p className="text-sm text-text-secondary">Any additional details help the AI personalise its response.</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {selectedEmotions.map((em) => {
            const opt = EMOTION_OPTIONS.find((e) => e.name === em);
            return (
              <span key={em} className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-50 border border-violet-200 text-violet-800 rounded-full text-sm font-medium">
                <span className={cn('w-2 h-2 rounded-full', opt?.dot)} />
                {em}
              </span>
            );
          })}
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Share anything else about this situation…"
          rows={4}
          className="w-full border border-beige rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-violet-400 resize-none"
        />
        <div className="flex gap-3">
          <button
            onClick={fetchAI}
            className="flex-1 py-3.5 bg-violet-600 text-white rounded-xl font-semibold text-base hover:bg-violet-700 transition-all flex items-center justify-center gap-2"
          >
            Get guidance <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setNote(''); fetchAI(); }}
            className="px-5 py-3.5 bg-sand rounded-xl font-medium text-text-secondary hover:bg-beige transition-all text-sm"
          >
            Skip
          </button>
        </div>
        <button onClick={() => setScreen(2)} className="w-full text-sm text-text-muted hover:text-text-secondary transition-colors">
          Back
        </button>
      </div>
    );
  }

  // Screen 4 — AI Response
  if (screen === 4) {
    return (
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            <p className="text-sm font-medium text-text-secondary">Generating your personalised guidance…</p>
          </div>
        ) : aiResponse ? (
          <>
            {aiResponse.severity === 'concerning' && (
              <div className="bg-error/10 border border-error/30 rounded-xl p-3 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-error">Consider speaking with a trusted person or counsellor about what you&apos;re experiencing.</p>
              </div>
            )}

            <div className={cn('rounded-xl border p-4 space-y-2', severityColors[aiResponse.severity])}>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Your feelings acknowledged</p>
              <p className="text-sm text-text-primary leading-relaxed">{aiResponse.validation}</p>
              <p className="text-sm text-text-secondary">{aiResponse.normalisation}</p>
            </div>

            {aiResponse.strategies.length > 0 && (
              <div className="bg-sage/10 border border-sage/30 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-sage-dark">Suggested coping strategies</p>
                <ol className="space-y-2">
                  {aiResponse.strategies.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-text-primary">
                      <span className="w-5 h-5 rounded-full bg-sage/20 text-sage-dark text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="bg-gold/10 border border-gold/30 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-dark mb-1.5">A note to remember</p>
              <p className="text-sm text-text-primary leading-relaxed">{aiResponse.encouragement}</p>
            </div>

            <button
              onClick={handleSave}
              disabled={saved}
              className="w-full py-3.5 bg-violet-600 text-white rounded-xl font-semibold text-base disabled:opacity-60 hover:bg-violet-700 transition-all flex items-center justify-center gap-2"
            >
              {saved ? (
                <><Check className="w-4 h-4" /> Session saved</>
              ) : (
                'Save session'
              )}
            </button>
          </>
        ) : null}
      </div>
    );
  }

  // Screen 5 — Done
  return (
    <div className="text-center py-8 space-y-5">
      <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-violet-600" />
      </div>
      <div>
        <p className="text-xl font-bold text-text-primary">Session complete</p>
        <p className="text-sm text-text-secondary mt-1">
          Reflecting on your feelings is an important step. Your session has been saved.
        </p>
      </div>
      <button
        onClick={restart}
        className="px-8 py-3.5 bg-violet-600 text-white rounded-xl font-semibold text-base hover:bg-violet-700 transition-all"
      >
        Try another situation
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

const GAME_COMPONENTS: Record<GameId, React.FC> = {
  breathing:    BellyBreathing,
  feelings:     FeelingsWheel,
  'calm-kit':   CalmDownKit,
  'worry-jar':  WorryJar,
  superpowers:  MySuperpowers,
  'happy-place': HappyPlace,
  memory: MemoryMatch,
  'emotion-coach': EmotionCoach,
};

export default function GamesPage() {
  const theme = useAgeTheme();
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  const game = activeGame ? GAMES.find((g) => g.id === activeGame)! : null;
  const ActiveComponent = activeGame ? GAME_COMPONENTS[activeGame] : null;

  if (activeGame && game && ActiveComponent) {
    const GameIcon = GAME_ICONS[activeGame];
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <button
          onClick={() => setActiveGame(null)}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to tools
        </button>

        <div className={cn('rounded-xl p-4 mb-5 border', game.bg, game.border)}>
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', game.iconBg)}>
              <GameIcon className={cn('w-5 h-5', game.iconColor)} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-text-primary">{game.name}</h1>
              <span className={cn('text-xs px-2 py-0.5 rounded font-medium', game.badgeColor)}>
                {game.badge}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-beige shadow-sm p-5">
          <ActiveComponent />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-text-primary">
          Tools &amp; Activities
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          Evidence-based activities to support your emotional wellbeing.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {GAMES.map((g) => {
          const Icon = GAME_ICONS[g.id];
          return (
            <button
              key={g.id}
              onClick={() => setActiveGame(g.id)}
              className={cn(
                'rounded-xl p-4 text-left border transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99]',
                g.bg, g.border
              )}
            >
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center mb-3', g.iconBg)}>
                <Icon className={cn('w-4.5 h-4.5', g.iconColor)} />
              </div>
              <p className="font-semibold text-text-primary text-sm leading-tight">{g.name}</p>
              <p className="text-xs text-text-secondary mt-1 leading-snug">{g.desc}</p>
              <span className={cn('inline-block mt-2.5 text-xs px-2 py-0.5 rounded font-medium', g.badgeColor)}>
                {g.badge}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-center text-text-muted">
        These activities are used by therapists worldwide.
      </p>
    </div>
  );
}
