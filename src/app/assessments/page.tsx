'use client';

import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useDemoData } from '@/hooks/useDemoData';
import { formatDate } from '@/lib/utils';
import { Plus, ClipboardList, TrendingDown, TrendingUp, Minus, Send } from 'lucide-react';

const assessmentTypes = [
  { id: 'phq9', name: 'PHQ-9', description: 'Depression severity', questions: 9 },
  { id: 'gad7', name: 'GAD-7', description: 'Anxiety severity', questions: 7 },
  { id: 'edeq', name: 'EDE-Q', description: 'Eating disorder behaviors', questions: 28 },
  { id: 'k10', name: 'K10', description: 'Psychological distress', questions: 10 },
  { id: 'dass21', name: 'DASS-21', description: 'Depression, anxiety, stress', questions: 21 },
];

const recentAssessments = [
  { id: 1, client: 'Emma Thompson', type: 'PHQ-9', score: 12, severity: 'Moderate', date: new Date(Date.now() - 604800000).toISOString(), trend: 'down' },
  { id: 2, client: 'Sophie Williams', type: 'EDE-Q', score: 3.2, severity: 'Clinical', date: new Date(Date.now() - 1209600000).toISOString(), trend: 'stable' },
  { id: 3, client: 'Mia Patel', type: 'GAD-7', score: 8, severity: 'Mild', date: new Date(Date.now() - 1814400000).toISOString(), trend: 'down' },
  { id: 4, client: 'Liam Nguyen', type: 'K10', score: 22, severity: 'Moderate', date: new Date(Date.now() - 2419200000).toISOString(), trend: 'up' },
];

export default function AssessmentsPage() {
  const { clients } = useDemoData();

  return (
    <div className="min-h-screen">
      <Header
        title="Assessments"
        subtitle="Standardized psychological assessments"
        actions={
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            Send Assessment
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Assessment Types */}
        <Card>
          <CardHeader>
            <CardTitle>Available Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assessmentTypes.map((assessment) => (
                <div
                  key={assessment.id}
                  className="p-4 border border-beige rounded-xl hover:border-sage hover:bg-sage-50/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-2 bg-sage-50 rounded-lg">
                      <ClipboardList className="w-5 h-5 text-sage" />
                    </div>
                    <Badge variant="default" size="sm">{assessment.questions} questions</Badge>
                  </div>
                  <h3 className="font-semibold text-text-primary">{assessment.name}</h3>
                  <p className="text-sm text-text-muted">{assessment.description}</p>
                  <Button variant="ghost" size="sm" className="mt-3" leftIcon={<Send className="w-3 h-3" />}>
                    Send to Client
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Assessments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAssessments.map((assessment) => (
                <div key={assessment.id} className="flex items-center gap-4 p-4 bg-sand rounded-xl">
                  <Avatar firstName={assessment.client.split(' ')[0]} lastName={assessment.client.split(' ')[1]} size="md" />
                  <div className="flex-1">
                    <p className="font-medium text-text-primary">{assessment.client}</p>
                    <p className="text-sm text-text-muted">{formatDate(assessment.date)}</p>
                  </div>
                  <Badge variant="default">{assessment.type}</Badge>
                  <div className="text-right">
                    <p className="font-semibold text-text-primary">Score: {assessment.score}</p>
                    <Badge variant={assessment.severity === 'Mild' ? 'success' : assessment.severity === 'Moderate' ? 'warning' : 'error'} size="sm">
                      {assessment.severity}
                    </Badge>
                  </div>
                  <div className={`p-2 rounded-full ${assessment.trend === 'down' ? 'bg-sage-50 text-sage' : assessment.trend === 'up' ? 'bg-coral/20 text-coral-dark' : 'bg-sand text-text-muted'}`}>
                    {assessment.trend === 'down' ? <TrendingDown className="w-4 h-4" /> : assessment.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
