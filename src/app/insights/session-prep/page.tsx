'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Avatar } from '@/components/ui/Avatar';
import { demoSessionPreps } from '@/lib/ai/demoData';
import { useDemoData } from '@/hooks/useDemoData';
import { SessionPrep } from '@/lib/ai/types';
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Info,
  FileText,
  BookOpen,
  ClipboardList,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Printer,
  Download,
  ChevronRight,
  Activity,
  Brain,
  Lightbulb,
  Shield,
  User,
  Zap,
} from 'lucide-react';

export default function SessionPrepPage() {
  const router = useRouter();
  const { clients } = useDemoData();
  const [selectedPrep, setSelectedPrep] = useState<SessionPrep | null>(demoSessionPreps[0]);
  const [resourceToast, setResourceToast] = useState(false);

  const showResourceToast = useCallback(() => {
    setResourceToast(true);
    setTimeout(() => setResourceToast(false), 2200);
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <AlertTriangle className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-error/10 border-error/30 text-error';
      case 'warning': return 'bg-warning/10 border-warning/30 text-warning';
      default: return 'bg-calm/10 border-calm/30 text-calm';
    }
  };

  const getAgendaTypeIcon = (type: string) => {
    switch (type) {
      case 'homework-review': return <BookOpen className="w-4 h-4" />;
      case 'follow-up': return <ChevronRight className="w-4 h-4" />;
      case 'assessment': return <ClipboardList className="w-4 h-4" />;
      case 'crisis': return <Shield className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getAgendaTypeBadge = (type: string) => {
    switch (type) {
      case 'homework-review': return 'info';
      case 'follow-up': return 'default';
      case 'assessment': return 'warning';
      case 'crisis': return 'error';
      default: return 'success';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'worksheet': return <FileText className="w-5 h-5 text-sage" />;
      case 'assessment': return <ClipboardList className="w-5 h-5 text-warning" />;
      case 'psychoeducation': return <Brain className="w-5 h-5 text-calm" />;
      case 'exercise': return <Activity className="w-5 h-5 text-success" />;
      default: return <FileText className="w-5 h-5 text-text-muted" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-success" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-error" />;
      default: return <Minus className="w-4 h-4 text-text-muted" />;
    }
  };

  return (
    <div className="min-h-screen">
      {resourceToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-sage text-white px-5 py-3 rounded-xl shadow-large flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4" />
          Resource downloaded successfully
        </div>
      )}
      <Header
        title="Smart Session Preparation"
        subtitle="AI-generated session briefs and agenda suggestions"
        actions={
          <div className="flex items-center gap-3">
            <Button variant="secondary" leftIcon={<Printer className="w-4 h-4" />} onClick={() => window.print()}>
              Print Brief
            </Button>
            <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />} onClick={() => window.print()}>
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
                  Prepare for Session With
                </label>
                <Select
                  value={selectedPrep?.clientId || ''}
                  onChange={(e) => {
                    const prep = demoSessionPreps.find(p => p.clientId === e.target.value);
                    setSelectedPrep(prep || null);
                  }}
                  options={demoSessionPreps.map(p => ({
                    value: p.clientId,
                    label: p.clientName,
                  }))}
                />
              </div>

              {selectedPrep && (
                <>
                  <div className="text-center px-6 border-l border-beige">
                    <p className="text-sm text-text-muted">Session Date</p>
                    <p className="font-semibold text-text-primary">
                      {new Date(selectedPrep.sessionDate).toLocaleDateString('en-AU', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-center px-6 border-l border-beige">
                    <p className="text-sm text-text-muted">Risk Level</p>
                    <Badge
                      variant={
                        selectedPrep.summary.riskLevel === 'low' ? 'success' :
                        selectedPrep.summary.riskLevel === 'moderate' ? 'warning' : 'error'
                      }
                    >
                      {selectedPrep.summary.riskLevel}
                    </Badge>
                  </div>
                  <div className="text-center px-6 border-l border-beige">
                    <p className="text-sm text-text-muted">Sessions</p>
                    <p className="font-semibold text-text-primary">
                      #{selectedPrep.treatmentProgress.sessionsCompleted + 1}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {selectedPrep && (
          <>
            {/* Alerts */}
            {selectedPrep.alerts.length > 0 && (
              <div className="space-y-2">
                {selectedPrep.alerts.map((alert, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-4 rounded-lg border ${getAlertStyle(alert.type)}`}
                  >
                    {getAlertIcon(alert.type)}
                    <span className="font-medium">{alert.message}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Summary & Status */}
              <div className="space-y-6">
                {/* Last Session Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-sage" />
                      Last Session Summary
                    </CardTitle>
                    <CardDescription>
                      {selectedPrep.summary.lastSessionDate
                        ? formatDate(selectedPrep.summary.lastSessionDate)
                        : 'First session'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedPrep.summary.lastSessionHighlights.map((highlight, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                          <CheckCircle className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Homework Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-calm" />
                      Homework Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-success/10 rounded-lg">
                        <p className="text-2xl font-bold text-success">
                          {selectedPrep.summary.homeworkStatus.completed}
                        </p>
                        <p className="text-xs text-text-muted">Completed</p>
                      </div>
                      <div className="p-3 bg-warning/10 rounded-lg">
                        <p className="text-2xl font-bold text-warning">
                          {selectedPrep.summary.homeworkStatus.assigned - selectedPrep.summary.homeworkStatus.completed}
                        </p>
                        <p className="text-xs text-text-muted">Pending</p>
                      </div>
                      <div className="p-3 bg-error/10 rounded-lg">
                        <p className="text-2xl font-bold text-error">
                          {selectedPrep.summary.homeworkStatus.overdue}
                        </p>
                        <p className="text-xs text-text-muted">Overdue</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Mood & Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-warning" />
                      Client Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-muted">Mood Trend</span>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(selectedPrep.summary.moodTrend)}
                        <span className={`font-medium capitalize ${
                          selectedPrep.summary.moodTrend === 'improving' ? 'text-success' :
                          selectedPrep.summary.moodTrend === 'declining' ? 'text-error' : 'text-text-primary'
                        }`}>
                          {selectedPrep.summary.moodTrend}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-muted">Average Mood</span>
                      <span className="font-medium text-text-primary">
                        {selectedPrep.summary.averageMoodScore.toFixed(1)} / 5
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-muted">Risk Change</span>
                      <Badge
                        variant={
                          selectedPrep.summary.riskChange === 'decreased' ? 'success' :
                          selectedPrep.summary.riskChange === 'increased' ? 'error' : 'default'
                        }
                        size="sm"
                      >
                        {selectedPrep.summary.riskChange}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Concerns */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-error" />
                      Recent Concerns
                    </CardTitle>
                    <CardDescription>
                      Topics flagged in mood journal this week
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedPrep.summary.recentConcerns.map((concern, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Zap className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                          <span className="text-text-secondary">{concern}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Middle Column - Suggested Agenda */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-sage" />
                      AI Suggested Agenda
                    </CardTitle>
                    <CardDescription>
                      Prioritized topics based on client data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedPrep.suggestedAgenda.map((item, i) => (
                        <div
                          key={i}
                          className={`p-4 rounded-lg border ${
                            item.priority === 1 ? 'bg-sage/5 border-sage/30' : 'bg-sand border-beige'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              item.priority === 1 ? 'bg-sage text-white' : 'bg-beige text-text-muted'
                            }`}>
                              {item.priority}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-text-primary">{item.topic}</h4>
                                <Badge
                                  variant={getAgendaTypeBadge(item.type) as any}
                                  size="sm"
                                >
                                  {getAgendaTypeIcon(item.type)}
                                  <span className="ml-1">{item.type.replace('-', ' ')}</span>
                                </Badge>
                              </div>
                              <p className="text-sm text-text-secondary mb-2">{item.rationale}</p>
                              <div className="flex items-center gap-2 text-xs text-text-muted">
                                <Clock className="w-3 h-3" />
                                {item.timeEstimate} minutes
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <Clock className="w-4 h-4" />
                      Total estimated time: {selectedPrep.suggestedAgenda.reduce((sum, item) => sum + item.timeEstimate, 0)} minutes
                    </div>
                  </CardFooter>
                </Card>

                {/* Treatment Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-calm" />
                      Treatment Goals Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedPrep.treatmentProgress.goals.map((goal, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-text-primary">{goal.goal}</span>
                            <Badge
                              variant={
                                goal.status === 'achieved' ? 'success' :
                                goal.status === 'on-track' ? 'info' : 'warning'
                              }
                              size="sm"
                            >
                              {goal.status}
                            </Badge>
                          </div>
                          <div className="w-full bg-beige rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                goal.status === 'achieved' ? 'bg-success' :
                                goal.status === 'on-track' ? 'bg-sage' : 'bg-warning'
                              }`}
                              style={{ width: `${goal.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-text-muted mt-1">{goal.progress}% complete</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-beige grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-sage">
                          {selectedPrep.treatmentProgress.sessionsCompleted}
                        </p>
                        <p className="text-xs text-text-muted">Sessions Completed</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-calm">
                          ~{selectedPrep.treatmentProgress.estimatedRemaining}
                        </p>
                        <p className="text-xs text-text-muted">Est. Remaining</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Resources */}
              <div className="space-y-6">
                {/* Prepared Resources */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-sage" />
                      Prepared Resources
                    </CardTitle>
                    <CardDescription>
                      Materials ready for this session
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedPrep.preparedResources.map((resource, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 bg-sand rounded-lg hover:bg-beige transition-colors cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                            {getResourceIcon(resource.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-text-primary">{resource.name}</h4>
                            <p className="text-sm text-text-muted">{resource.description}</p>
                            <Badge variant="default" size="sm" className="mt-2">
                              {resource.type}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm" onClick={showResourceToast}>
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="secondary" className="w-full" leftIcon={<Sparkles className="w-4 h-4" />} onClick={showResourceToast}>
                      Suggest More Resources
                    </Button>
                  </CardFooter>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="secondary" className="w-full justify-start" leftIcon={<User className="w-4 h-4" />} onClick={() => selectedPrep && router.push(`/clients/${selectedPrep.clientId}`)}>
                      View Full Client Profile
                    </Button>
                    <Button variant="secondary" className="w-full justify-start" leftIcon={<FileText className="w-4 h-4" />} onClick={() => router.push('/notes')}>
                      Review Previous Notes
                    </Button>
                    <Button variant="secondary" className="w-full justify-start" leftIcon={<ClipboardList className="w-4 h-4" />} onClick={() => router.push('/assessments')}>
                      Start Assessment
                    </Button>
                    <Button variant="secondary" className="w-full justify-start" leftIcon={<Shield className="w-4 h-4" />} onClick={() => router.push('/safety-plans')}>
                      View Safety Plan
                    </Button>
                  </CardContent>
                </Card>

                {/* AI Disclaimer */}
                <div className="p-4 bg-calm/10 rounded-lg border border-calm/20">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-calm flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-calm mb-1">AI-Generated Preparation</p>
                      <p className="text-sm text-text-secondary">
                        This brief was automatically generated based on client data, session history,
                        and homework completion. Review and adjust based on your clinical judgement.
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
