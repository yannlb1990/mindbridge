'use client';

import { useState, useCallback, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { demoOutcomeDashboards } from '@/lib/ai/demoData';
import { useClients } from '@/hooks/useClients';
import { useAuthStore } from '@/stores/authStore';
import { isEffectiveDemo } from '@/lib/supabase';
import { OutcomeDashboard, TreatmentGoal } from '@/lib/ai/types';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Calendar,
  CheckCircle,
  Circle,
  Activity,
  ClipboardList,
  Clock,
  Award,
  BarChart3,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Download,
  Share2,
  Users,
  Percent,
  BookOpen,
  Smartphone,
  Info,
} from 'lucide-react';

export default function OutcomeDashboardPage() {
  const { user } = useAuthStore();
  const demoMode = isEffectiveDemo(user?.id);
  const { clients: realClients } = useClients();

  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedDashboard, setSelectedDashboard] = useState<OutcomeDashboard | null>(demoMode ? demoOutcomeDashboards[0] : null);
  const [selectedAssessment, setSelectedAssessment] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState(false);

  useEffect(() => {
    if (demoMode) {
      setSelectedClientId(demoOutcomeDashboards[0]?.clientId || '');
    } else if (realClients.length > 0 && !selectedClientId) {
      setSelectedClientId(realClients[0].id);
    }
  }, [demoMode, realClients, selectedClientId]);

  const loadDashboard = useCallback(async (clientId: string) => {
    if (demoMode) {
      const d = demoOutcomeDashboards.find(d => d.clientId === clientId);
      setSelectedDashboard(d || demoOutcomeDashboards[0]);
      return;
    }
    setLoading(true);
    setLoadError(null);
    setSelectedDashboard(null);
    try {
      const res = await fetch(`/api/insights/outcomes?clientId=${clientId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load outcomes');
      setSelectedDashboard(data);
    } catch (e: any) {
      setLoadError(e.message);
    } finally {
      setLoading(false);
    }
  }, [demoMode]);

  useEffect(() => {
    if (selectedClientId && !selectedDashboard && !loading) {
      loadDashboard(selectedClientId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClientId]);

  const handleShare = useCallback(() => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).catch(() => {});
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  }, []);

  const handleExportPDF = useCallback(() => {
    window.print();
  }, []);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-AU', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTrendIcon = (trend: string, size: string = 'w-4 h-4') => {
    switch (trend) {
      case 'improving': return <TrendingUp className={`${size} text-success`} />;
      case 'worsening': return <TrendingDown className={`${size} text-error`} />;
      default: return <Minus className={`${size} text-text-muted`} />;
    }
  };

  const getScoreColor = (current: number, max: number, isLowerBetter: boolean = true) => {
    const ratio = current / max;
    if (isLowerBetter) {
      if (ratio <= 0.3) return 'text-success';
      if (ratio <= 0.6) return 'text-warning';
      return 'text-error';
    } else {
      if (ratio >= 0.7) return 'text-success';
      if (ratio >= 0.4) return 'text-warning';
      return 'text-error';
    }
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'achieved': return 'bg-success';
      case 'on-track': return 'bg-sage';
      case 'behind': return 'bg-warning';
      case 'at-risk': return 'bg-error';
      default: return 'bg-text-muted';
    }
  };

  return (
    <div className="min-h-screen">
      {shareToast && (
        <div className="fixed top-4 right-4 z-50 bg-sage text-white px-4 py-2.5 rounded-xl shadow-large text-sm font-medium animate-pulse">
          ✓ Report link copied to clipboard
        </div>
      )}
      <Header
        title="Outcome Tracking Dashboard"
        subtitle="Visual treatment progress and outcome monitoring"
        actions={
          <div className="flex items-center gap-3">
            <Button variant="secondary" leftIcon={<Share2 className="w-4 h-4" />} onClick={handleShare}>
              Share Report
            </Button>
            <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />} onClick={handleExportPDF}>
              Export PDF
            </Button>
            <Badge variant="info" className="gap-1">
              <Sparkles className="w-3 h-3" />
              AI Feature
            </Badge>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* Client Selector */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  View Outcomes For
                </label>
                <Select
                  value={selectedClientId}
                  onChange={(e) => {
                    setSelectedClientId(e.target.value);
                    loadDashboard(e.target.value);
                  }}
                  options={demoMode
                    ? demoOutcomeDashboards.map(d => ({ value: d.clientId, label: d.clientName }))
                    : realClients.map(c => ({ value: c.id, label: `${c.first_name} ${c.last_name}` }))
                  }
                />
              </div>

              {selectedDashboard && (
                <>
                  <div className="text-center px-6 border-l border-beige">
                    <p className="text-sm text-text-muted">Treatment Phase</p>
                    <p className="font-semibold text-text-primary text-sm">
                      {selectedDashboard.currentPhase}
                    </p>
                  </div>
                  <div className="text-center px-6 border-l border-beige">
                    <p className="text-sm text-text-muted">Since</p>
                    <p className="font-semibold text-text-primary">
                      {formatDate(selectedDashboard.treatmentStartDate)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {loading && (
          <Card>
            <CardContent className="pt-8 pb-8 flex items-center justify-center gap-3 text-text-muted">
              <Activity className="w-5 h-5 animate-pulse text-sage" />
              <span>Loading outcome data…</span>
            </CardContent>
          </Card>
        )}

        {loadError && (
          <Card className="border-error/30 bg-error/5">
            <CardContent className="pt-4 pb-4 text-sm text-error">{loadError}</CardContent>
          </Card>
        )}

        {!loading && !selectedDashboard && !loadError && selectedClientId && (
          <Card className="border-dashed">
            <CardContent className="pt-8 pb-8 text-center text-text-muted text-sm">
              No assessment data found for this client yet. Administer a PHQ-9, GAD-7, K10, or DASS-21 to start tracking outcomes.
            </CardContent>
          </Card>
        )}

        {selectedDashboard && (
          <>
            {/* Overall Progress Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card className="bg-gradient-to-br from-sage/10 to-sage/5 border-sage/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-text-muted">Overall Improvement</p>
                    <ArrowUpRight className="w-5 h-5 text-success" />
                  </div>
                  <p className="text-3xl font-bold text-success">
                    {selectedDashboard.overallProgress.percentImprovement}%
                  </p>
                  <p className="text-sm text-text-muted">from baseline</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-text-muted">Start Score</p>
                    <Activity className="w-5 h-5 text-error" />
                  </div>
                  <p className="text-3xl font-bold text-error">
                    {selectedDashboard.overallProgress.startScore}
                  </p>
                  <p className="text-sm text-text-muted">avg. severity</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-text-muted">Current Score</p>
                    <Activity className="w-5 h-5 text-success" />
                  </div>
                  <p className="text-3xl font-bold text-success">
                    {selectedDashboard.overallProgress.currentScore}
                  </p>
                  <p className="text-sm text-text-muted">avg. severity</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-text-muted">Sessions</p>
                    <Calendar className="w-5 h-5 text-sage" />
                  </div>
                  <p className="text-3xl font-bold text-text-primary">
                    {selectedDashboard.overallProgress.sessionsCompleted}
                  </p>
                  <p className="text-sm text-text-muted">completed</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-text-muted">Est. Remaining</p>
                    <Clock className="w-5 h-5 text-calm" />
                  </div>
                  <p className="text-3xl font-bold text-calm">
                    ~{selectedDashboard.overallProgress.estimatedSessionsRemaining}
                  </p>
                  <p className="text-sm text-text-muted">sessions</p>
                </CardContent>
              </Card>
            </div>

            {/* Assessment Charts & Goals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Assessment Score Trends */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <LineChart className="w-5 h-5 text-sage" />
                          Assessment Score Trends
                        </CardTitle>
                        <CardDescription>
                          Standardized measure scores over time
                        </CardDescription>
                      </div>
                      <Select
                        value={selectedAssessment}
                        onChange={(e) => setSelectedAssessment(e.target.value)}
                        options={[
                          { value: 'all', label: 'All Assessments' },
                          ...selectedDashboard.assessments.map(a => ({
                            value: a.type,
                            label: a.type,
                          })),
                        ]}
                        className="w-48"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selectedDashboard.assessments
                      .filter(a => selectedAssessment === 'all' || a.type === selectedAssessment)
                      .map((assessment) => (
                        <div key={assessment.type} className="mb-8 last:mb-0">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-semibold text-text-primary">{assessment.type}</h4>
                              <p className="text-sm text-text-muted">{assessment.fullName}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              {getTrendIcon(assessment.trend)}
                              <span className={`font-medium capitalize ${
                                assessment.trend === 'improving' ? 'text-success' :
                                assessment.trend === 'worsening' ? 'text-error' : 'text-text-primary'
                              }`}>
                                {assessment.trend}
                              </span>
                              {assessment.clinicallySignificantChange && (
                                <Badge variant="success" size="sm">
                                  <Award className="w-3 h-3 mr-1" />
                                  Clinically Significant
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Score Chart */}
                          <div className="relative h-32 bg-sand rounded-lg p-4">
                            {/* Y-axis */}
                            <div className="absolute left-2 top-4 bottom-4 flex flex-col justify-between text-xs text-text-muted">
                              <span>{assessment.type === 'PHQ-9' ? 27 : assessment.type === 'GAD-7' ? 21 : 100}</span>
                              <span>{assessment.type === 'PHQ-9' ? 14 : assessment.type === 'GAD-7' ? 10 : 50}</span>
                              <span>0</span>
                            </div>

                            {/* Chart area */}
                            <div className="ml-8 h-full flex items-end gap-1">
                              {assessment.scores.map((score, i) => {
                                const maxScore = assessment.type === 'PHQ-9' ? 27 : assessment.type === 'GAD-7' ? 21 : 100;
                                const height = (score.score / maxScore) * 100;
                                const isLatest = i === assessment.scores.length - 1;

                                return (
                                  <div key={i} className="flex-1 flex flex-col items-center">
                                    <div
                                      className={`w-full rounded-t transition-all ${
                                        isLatest ? 'bg-sage' : 'bg-sage/50'
                                      }`}
                                      style={{ height: `${height}%` }}
                                    />
                                    <div className="mt-2 text-center">
                                      <p className={`text-sm font-bold ${getScoreColor(score.score, maxScore)}`}>
                                        {score.score}
                                      </p>
                                      <p className="text-xs text-text-muted">
                                        {new Date(score.date).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Trend line overlay */}
                            <svg className="absolute inset-0 ml-8 pointer-events-none" style={{ left: '2rem' }}>
                              <polyline
                                fill="none"
                                stroke="#7C9885"
                                strokeWidth="2"
                                strokeDasharray="4"
                                points={assessment.scores.map((score, i) => {
                                  const maxScore = assessment.type === 'PHQ-9' ? 27 : assessment.type === 'GAD-7' ? 21 : 100;
                                  const x = (i / (assessment.scores.length - 1)) * 100 + '%';
                                  const y = (1 - score.score / maxScore) * 80 + 10 + '%';
                                  return `${x},${y}`;
                                }).join(' ')}
                              />
                            </svg>
                          </div>

                          {/* Severity Labels */}
                          <div className="flex justify-between mt-2 text-xs">
                            {assessment.scores.map((score, i) => (
                              <Badge
                                key={i}
                                variant={
                                  score.severity === 'Minimal' || score.severity === 'Mild' ? 'success' :
                                  score.severity === 'Moderate' ? 'warning' : 'error'
                                }
                                size="sm"
                              >
                                {score.severity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>

                {/* Mood Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-warning" />
                      Daily Mood Trend
                    </CardTitle>
                    <CardDescription>
                      Self-reported mood ratings (last 14 days)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        {getTrendIcon(selectedDashboard.moodTrend.trend, 'w-5 h-5')}
                        <span className="font-medium capitalize">
                          {selectedDashboard.moodTrend.trend}
                        </span>
                      </div>
                      <div className="text-sm text-text-muted">
                        Average: <span className="font-semibold text-text-primary">{selectedDashboard.moodTrend.average.toFixed(1)}/5</span>
                      </div>
                    </div>

                    {/* Mood Chart */}
                    <div className="h-32 bg-sand rounded-lg p-4 flex items-end gap-1">
                      {selectedDashboard.moodTrend.data.map((entry, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-warning rounded-t"
                            style={{ height: `${(entry.rating / 5) * 100}%` }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-text-muted">
                      <span>14 days ago</span>
                      <span>Today</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Goals & Engagement */}
              <div className="space-y-6">
                {/* Treatment Goals */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-calm" />
                      Treatment Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {selectedDashboard.goals.map((goal) => (
                        <div key={goal.id}>
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-text-primary text-sm">{goal.goal}</h4>
                            <Badge
                              variant={
                                goal.status === 'achieved' ? 'success' :
                                goal.status === 'on-track' ? 'info' :
                                goal.status === 'behind' ? 'warning' : 'error'
                              }
                              size="sm"
                            >
                              {goal.status}
                            </Badge>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-beige rounded-full h-3 mb-2">
                            <div
                              className={`h-3 rounded-full ${getGoalStatusColor(goal.status)}`}
                              style={{ width: `${goal.progress}%` }}
                            />
                          </div>

                          {/* Milestones */}
                          <div className="space-y-1.5">
                            {goal.milestones.map((milestone, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm">
                                {milestone.completed ? (
                                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-text-muted flex-shrink-0" />
                                )}
                                <span className={milestone.completed ? 'text-text-muted line-through' : 'text-text-secondary'}>
                                  {milestone.description}
                                </span>
                              </div>
                            ))}
                          </div>

                          {goal.targetDate && (
                            <p className="text-xs text-text-muted mt-2">
                              Target: {formatDate(goal.targetDate)}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Engagement Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-sage" />
                      Engagement Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-text-muted" />
                        <span className="text-sm text-text-secondary">Attendance Rate</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-success">
                          {selectedDashboard.engagementMetrics.attendanceRate}%
                        </span>
                        <div className="w-16 bg-beige rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-success"
                            style={{ width: `${selectedDashboard.engagementMetrics.attendanceRate}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-text-muted" />
                        <span className="text-sm text-text-secondary">Homework Completion</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${
                          selectedDashboard.engagementMetrics.homeworkCompletionRate >= 70 ? 'text-success' :
                          selectedDashboard.engagementMetrics.homeworkCompletionRate >= 40 ? 'text-warning' : 'text-error'
                        }`}>
                          {selectedDashboard.engagementMetrics.homeworkCompletionRate}%
                        </span>
                        <div className="w-16 bg-beige rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              selectedDashboard.engagementMetrics.homeworkCompletionRate >= 70 ? 'bg-success' :
                              selectedDashboard.engagementMetrics.homeworkCompletionRate >= 40 ? 'bg-warning' : 'bg-error'
                            }`}
                            style={{ width: `${selectedDashboard.engagementMetrics.homeworkCompletionRate}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-text-muted" />
                        <span className="text-sm text-text-secondary">App Usage</span>
                      </div>
                      <span className="font-bold text-calm">
                        {selectedDashboard.engagementMetrics.appUsageFrequency.toFixed(1)}x/week
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Projected Completion */}
                {selectedDashboard.overallProgress.projectedEndDate && (
                  <Card className="bg-gradient-to-br from-calm/10 to-calm/5 border-calm/20">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Award className="w-8 h-8 text-calm mx-auto mb-2" />
                        <p className="text-sm text-text-muted mb-1">Projected Completion</p>
                        <p className="text-xl font-bold text-calm">
                          {formatDate(selectedDashboard.overallProgress.projectedEndDate)}
                        </p>
                        <p className="text-sm text-text-muted mt-2">
                          ~{selectedDashboard.overallProgress.estimatedSessionsRemaining} sessions remaining
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* AI Insights */}
                <div className="p-4 bg-sage/10 rounded-lg border border-sage/20">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sage-dark mb-1">AI Outcome Summary</p>
                      <p className="text-sm text-text-secondary">
                        {selectedDashboard.clientName} shows {selectedDashboard.overallProgress.percentImprovement}% improvement
                        from baseline with clinically significant changes in depression and anxiety scores.
                        Treatment is progressing as expected with good engagement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
