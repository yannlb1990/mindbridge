'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { demoSessionSentiments } from '@/lib/ai/demoData';
import { useClients } from '@/hooks/useClients';
import { useSessions } from '@/hooks/useSessions';
import { useAuthStore } from '@/stores/authStore';
import { isEffectiveDemo } from '@/lib/supabase';
import { SessionSentiment, SentimentTimelineEntry } from '@/lib/ai/types';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Lightbulb,
  Clock,
  MessageSquare,
  Smile,
  Frown,
  Meh,
  ArrowRight,
  Zap,
  Heart,
  AlertCircle,
  Sparkles,
  Info,
} from 'lucide-react';

export default function SentimentAnalysisPage() {
  const { user } = useAuthStore();
  const demoMode = isEffectiveDemo(user?.id);
  const { clients } = useClients();
  const { sessions: realSessions } = useSessions();

  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [selectedSession, setSelectedSession] = useState<SessionSentiment | null>(demoMode ? demoSessionSentiments[0] : null);
  const [loading, setLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // For demo mode, find the client matching the sentiment
  const client = demoMode
    ? clients.find(c => c.id === selectedSession?.clientId)
    : null;

  // Build real session options — only completed sessions with notes
  const realSessionOptions = realSessions
    .filter(s => s.status === 'completed')
    .map(s => ({
      value: s.id,
      label: `${s.client_name || 'Client'} — ${new Date(s.scheduled_start).toLocaleDateString('en-AU')}`,
    }));

  useEffect(() => {
    if (demoMode) {
      setSelectedSessionId(demoSessionSentiments[0]?.sessionId || '');
    } else if (realSessionOptions.length > 0 && !selectedSessionId) {
      setSelectedSessionId(realSessionOptions[0].value);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoMode, realSessions.length]);

  const analyzeSession = async (sessionId: string) => {
    if (demoMode) {
      const s = demoSessionSentiments.find(s => s.sessionId === sessionId);
      setSelectedSession(s || demoSessionSentiments[0]);
      return;
    }
    setLoading(true);
    setAiError(null);
    setSelectedSession(null);
    try {
      const res = await fetch(`/api/insights/sentiment?sessionId=${sessionId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to analyse session');
      setSelectedSession(data);
    } catch (e: any) {
      setAiError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-success bg-success/10';
      case 'negative': return 'text-error bg-error/10';
      default: return 'text-text-muted bg-sand';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Smile className="w-4 h-4" />;
      case 'negative': return <Frown className="w-4 h-4" />;
      default: return <Meh className="w-4 h-4" />;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      anxiety: 'bg-warning/20 text-warning',
      frustration: 'bg-error/20 text-error',
      hope: 'bg-success/20 text-success',
      relief: 'bg-calm/20 text-calm',
      sadness: 'bg-blue-100 text-blue-700',
      grief: 'bg-purple-100 text-purple-700',
      love: 'bg-pink-100 text-pink-700',
      acceptance: 'bg-sage/20 text-sage-dark',
      determination: 'bg-orange-100 text-orange-700',
      pride: 'bg-amber-100 text-amber-700',
    };
    return colors[emotion] || 'bg-sand text-text-secondary';
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Session Sentiment Analysis"
        subtitle="AI-powered emotional flow tracking during therapy sessions"
        actions={
          <div className="flex items-center gap-3">
            <Badge variant="info" className="gap-1">
              <Sparkles className="w-3 h-3" />
              AI Feature
            </Badge>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* Session Selector */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Select Session to Analyze
                </label>
                <Select
                  value={selectedSessionId}
                  onChange={(e) => {
                    setSelectedSessionId(e.target.value);
                    analyzeSession(e.target.value);
                  }}
                  options={demoMode
                    ? demoSessionSentiments.map(s => ({
                        value: s.sessionId,
                        label: `Session ${s.sessionId.split('-')[1]} - ${new Date(s.sessionDate).toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric' })} (${s.duration} min)`,
                      }))
                    : realSessionOptions
                  }
                />
              </div>
              <div className="text-right">
                <p className="text-sm text-text-muted">Session Duration</p>
                <p className="text-2xl font-bold text-text-primary">{selectedSession?.duration} min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {loading && (
          <Card>
            <CardContent className="pt-8 pb-8 flex items-center justify-center gap-3 text-text-muted">
              <Heart className="w-5 h-5 animate-pulse text-sage" />
              <span>Analysing session with AI…</span>
            </CardContent>
          </Card>
        )}

        {aiError && (
          <Card className="border-error/30 bg-error/5">
            <CardContent className="pt-4 pb-4 text-sm text-error">
              {aiError.includes('No note found') ? (
                <>No clinical note found for this session. <a href="/session-capture" className="underline">Generate a note</a> first, then analyse sentiment.</>
              ) : aiError}
            </CardContent>
          </Card>
        )}

        {!loading && !selectedSession && !aiError && !demoMode && realSessionOptions.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="pt-8 pb-8 text-center text-text-muted text-sm">
              No completed sessions found. Complete a session and generate a clinical note to enable sentiment analysis.
            </CardContent>
          </Card>
        )}

        {selectedSession && (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-text-muted">Overall Sentiment</p>
                    {selectedSession.summary.averageSentiment > 10 ? (
                      <TrendingUp className="w-5 h-5 text-success" />
                    ) : selectedSession.summary.averageSentiment < -10 ? (
                      <TrendingDown className="w-5 h-5 text-error" />
                    ) : (
                      <Minus className="w-5 h-5 text-text-muted" />
                    )}
                  </div>
                  <p className={`text-3xl font-bold ${
                    selectedSession.summary.averageSentiment > 10 ? 'text-success' :
                    selectedSession.summary.averageSentiment < -10 ? 'text-error' : 'text-text-primary'
                  }`}>
                    {selectedSession.summary.averageSentiment > 0 ? '+' : ''}{selectedSession.summary.averageSentiment}
                  </p>
                  <p className="text-sm text-text-muted">sentiment score</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-text-muted">Turning Points</p>
                    <Zap className="w-5 h-5 text-warning" />
                  </div>
                  <p className="text-3xl font-bold text-text-primary">
                    {selectedSession.summary.turningPoints.length}
                  </p>
                  <p className="text-sm text-text-muted">emotional shifts</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-text-muted">Peak Positive</p>
                    <Smile className="w-5 h-5 text-success" />
                  </div>
                  <p className="text-3xl font-bold text-success">
                    {selectedSession.summary.peakPositive?.intensity || 'N/A'}
                  </p>
                  <p className="text-sm text-text-muted">
                    at {selectedSession.summary.peakPositive ? formatTime(selectedSession.summary.peakPositive.time) : '-'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-text-muted">Peak Negative</p>
                    <Frown className="w-5 h-5 text-error" />
                  </div>
                  <p className="text-3xl font-bold text-error">
                    {selectedSession.summary.peakNegative?.intensity || 'N/A'}
                  </p>
                  <p className="text-sm text-text-muted">
                    at {selectedSession.summary.peakNegative ? formatTime(selectedSession.summary.peakNegative.time) : '-'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sentiment Timeline */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-sage" />
                      Emotional Flow Timeline
                    </CardTitle>
                    <CardDescription>Sentiment tracking throughout the session</CardDescription>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowDetails(!showDetails)}
                  >
                    {showDetails ? 'Hide Details' : 'Show Details'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Timeline Visualization */}
                <div className="relative mb-6">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-text-muted w-16">
                    <span>Positive</span>
                    <span>Neutral</span>
                    <span>Negative</span>
                  </div>

                  {/* Chart area */}
                  <div className="ml-20 h-48 bg-sand rounded-lg relative overflow-hidden">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between py-4">
                      <div className="border-b border-dashed border-beige h-0" />
                      <div className="border-b border-dashed border-beige h-0" />
                      <div className="border-b border-dashed border-beige h-0" />
                    </div>

                    {/* Sentiment bars */}
                    <div className="absolute inset-0 flex items-end p-2">
                      {selectedSession.timeline.map((entry, i) => {
                        const height = entry.sentiment === 'positive'
                          ? 50 + (entry.intensity / 2)
                          : entry.sentiment === 'negative'
                          ? 50 - (entry.intensity / 2)
                          : 50;

                        return (
                          <div
                            key={i}
                            className="flex-1 flex flex-col items-center mx-0.5"
                            title={`${formatTime(entry.timestamp)}: ${entry.sentiment} (${entry.intensity}%)`}
                          >
                            <div
                              className={`w-full rounded-t transition-all ${
                                entry.sentiment === 'positive' ? 'bg-success' :
                                entry.sentiment === 'negative' ? 'bg-error' : 'bg-text-muted'
                              }`}
                              style={{
                                height: `${height}%`,
                                opacity: 0.5 + (entry.intensity / 200)
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Turning points markers */}
                    {selectedSession.summary.turningPoints.map((tp, i) => {
                      const position = (tp.time / (selectedSession.duration * 60)) * 100;
                      return (
                        <div
                          key={i}
                          className="absolute top-2 w-6 h-6 -ml-3 bg-warning rounded-full flex items-center justify-center z-10"
                          style={{ left: `${position}%` }}
                          title={`Turning point: ${tp.trigger}`}
                        >
                          <Zap className="w-3 h-3 text-white" />
                        </div>
                      );
                    })}
                  </div>

                  {/* X-axis labels */}
                  <div className="ml-20 flex justify-between text-xs text-text-muted mt-2">
                    <span>0:00</span>
                    <span>{Math.floor(selectedSession.duration / 4)}:00</span>
                    <span>{Math.floor(selectedSession.duration / 2)}:00</span>
                    <span>{Math.floor((selectedSession.duration * 3) / 4)}:00</span>
                    <span>{selectedSession.duration}:00</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-success" />
                    <span className="text-text-muted">Positive</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-text-muted" />
                    <span className="text-text-muted">Neutral</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-error" />
                    <span className="text-text-muted">Negative</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-warning flex items-center justify-center">
                      <Zap className="w-2 h-2 text-white" />
                    </div>
                    <span className="text-text-muted">Turning Point</span>
                  </div>
                </div>

                {/* Detailed timeline entries */}
                {showDetails && (
                  <div className="mt-6 border-t border-beige pt-6">
                    <h4 className="font-medium text-text-primary mb-4">Detailed Timeline</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {selectedSession.timeline.map((entry, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-4 p-3 rounded-lg ${getSentimentColor(entry.sentiment)}`}
                        >
                          <span className="text-sm font-mono w-12">{formatTime(entry.timestamp)}</span>
                          <span className="w-6">{getSentimentIcon(entry.sentiment)}</span>
                          <span className="flex-1 text-sm">{entry.topic}</span>
                          <Badge variant="default" size="sm">
                            {entry.speaker}
                          </Badge>
                          <span className="text-sm font-medium">{entry.intensity}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Summary & Turning Points */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-sage" />
                    Session Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Overall Tone */}
                  <div>
                    <p className="text-sm font-medium text-text-muted mb-2">Overall Tone</p>
                    <p className="text-text-primary">{selectedSession.summary.overallTone}</p>
                  </div>

                  {/* Dominant Emotions */}
                  <div>
                    <p className="text-sm font-medium text-text-muted mb-2">Dominant Emotions</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSession.summary.dominantEmotions.map((emotion, i) => (
                        <Badge key={i} className={getEmotionColor(emotion)}>
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Turning Points */}
                  <div>
                    <p className="text-sm font-medium text-text-muted mb-2">Emotional Turning Points</p>
                    <div className="space-y-3">
                      {selectedSession.summary.turningPoints.map((tp, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-warning/10 rounded-lg">
                          <Zap className="w-5 h-5 text-warning flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-mono text-text-muted">{formatTime(tp.time)}</span>
                              <span className="capitalize text-error">{tp.from}</span>
                              <ArrowRight className="w-4 h-4 text-text-muted" />
                              <span className={`capitalize ${tp.to === 'positive' ? 'text-success' : tp.to === 'negative' ? 'text-error' : 'text-text-primary'}`}>
                                {tp.to}
                              </span>
                            </div>
                            {tp.trigger && (
                              <p className="text-sm text-text-secondary mt-1">
                                Trigger: {tp.trigger}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Peak Moments */}
                  <div className="grid grid-cols-2 gap-4">
                    {selectedSession.summary.peakPositive && (
                      <div className="p-3 bg-success/10 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Smile className="w-4 h-4 text-success" />
                          <span className="text-sm font-medium text-success">Peak Positive</span>
                        </div>
                        <p className="text-xs text-text-muted mb-1">
                          at {formatTime(selectedSession.summary.peakPositive.time)}
                        </p>
                        <p className="text-sm text-text-secondary">
                          {selectedSession.summary.peakPositive.context}
                        </p>
                      </div>
                    )}
                    {selectedSession.summary.peakNegative && (
                      <div className="p-3 bg-error/10 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Frown className="w-4 h-4 text-error" />
                          <span className="text-sm font-medium text-error">Peak Negative</span>
                        </div>
                        <p className="text-xs text-text-muted mb-1">
                          at {formatTime(selectedSession.summary.peakNegative.time)}
                        </p>
                        <p className="text-sm text-text-secondary">
                          {selectedSession.summary.peakNegative.context}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-warning" />
                    AI Clinical Insights
                  </CardTitle>
                  <CardDescription>
                    Automated observations from session analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedSession.insights.map((insight, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 bg-sand rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-sage" />
                        </div>
                        <p className="text-text-primary">{insight}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-calm/10 rounded-lg border border-calm/20">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-calm flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-calm mb-1">Clinical Note</p>
                        <p className="text-sm text-text-secondary">
                          These insights are AI-generated suggestions based on sentiment analysis.
                          Always apply clinical judgement when interpreting results.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
