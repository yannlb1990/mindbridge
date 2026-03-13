'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Activity,
  Brain,
  Target,
  Sparkles,
  ArrowRight,
  LineChart,
  Clock,
  Lightbulb,
  TrendingUp,
  FileText,
} from 'lucide-react';

const insightFeatures = [
  {
    id: 'sentiment',
    title: 'Session Sentiment Analysis',
    description: 'Track emotional flow and turning points during therapy sessions with AI-powered analysis.',
    icon: Activity,
    color: 'text-sage',
    bgColor: 'bg-sage/10',
    href: '/insights/sentiment',
    features: [
      'Real-time sentiment timeline',
      'Emotional turning point detection',
      'Session tone summary',
      'AI-generated clinical insights',
    ],
    badge: 'Feature 3',
  },
  {
    id: 'session-prep',
    title: 'Smart Session Preparation',
    description: 'AI-generated session briefs with agenda suggestions, prepared resources, and client status.',
    icon: Brain,
    color: 'text-calm',
    bgColor: 'bg-calm/10',
    href: '/insights/session-prep',
    features: [
      'Last session summary',
      'Prioritized agenda suggestions',
      'Homework status tracking',
      'Prepared resources & materials',
    ],
    badge: 'Feature 6',
  },
  {
    id: 'outcomes',
    title: 'Outcome Tracking Dashboard',
    description: 'Visual progress tracking with assessment trends, treatment goals, and engagement metrics.',
    icon: Target,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    href: '/insights/outcomes',
    features: [
      'Assessment score trends',
      'Treatment goal progress',
      'Clinically significant change detection',
      'Engagement metrics',
    ],
    badge: 'Feature 7',
  },
];

export default function InsightsPage() {
  return (
    <div className="min-h-screen">
      <Header
        title="AI Insights"
        subtitle="Innovative AI-powered tools to enhance clinical practice"
        actions={
          <Badge variant="info" className="gap-1">
            <Sparkles className="w-3 h-3" />
            AI Features
          </Badge>
        }
      />

      <div className="p-6 space-y-6">
        {/* Hero Section */}
        <Card className="bg-gradient-to-br from-sage/10 via-calm/5 to-warning/5 border-sage/20">
          <CardContent className="pt-8 pb-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-sage" />
                <Badge variant="success">New</Badge>
              </div>
              <h2 className="text-2xl font-display font-bold text-text-primary mb-3">
                AI-Powered Clinical Insights
              </h2>
              <p className="text-text-secondary mb-6">
                These innovative features use AI to analyze session data, track client progress,
                and provide actionable insights to enhance your clinical practice. All insights
                are generated from your existing session notes, assessments, and client data.
              </p>
              <div className="flex items-center gap-6 text-sm text-text-muted">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Save 10-15 min per session</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Track progress objectively</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>Get AI-powered suggestions</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insightFeatures.map((feature) => (
            <Link key={feature.id} href={feature.href}>
              <Card className="h-full hover:shadow-lg transition-all hover:border-sage/30 cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <Badge variant="default" size="sm">{feature.badge}</Badge>
                  </div>
                  <CardTitle className="group-hover:text-sage transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {feature.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                        <div className={`w-1.5 h-1.5 rounded-full ${feature.bgColor.replace('/10', '')}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 text-sage font-medium text-sm group-hover:gap-3 transition-all">
                    <span>Open Tool</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Info Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-calm/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-calm" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">About AI Insights</h3>
                <p className="text-sm text-text-secondary mb-3">
                  These features are powered by advanced AI analysis of your clinical data.
                  All insights are suggestions to support your clinical judgement, not replace it.
                  Data remains secure and private within your practice.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">HIPAA Compliant</Badge>
                  <Badge variant="default">Australian Privacy Act</Badge>
                  <Badge variant="default">End-to-End Encrypted</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-text-muted">
              <Sparkles className="w-5 h-5" />
              Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-sand rounded-lg">
                <h4 className="font-medium text-text-primary mb-1">Voice Biomarker Analysis</h4>
                <p className="text-sm text-text-muted">Detect depression/anxiety signals from voice patterns</p>
              </div>
              <div className="p-4 bg-sand rounded-lg">
                <h4 className="font-medium text-text-primary mb-1">Therapeutic Alliance Tracking</h4>
                <p className="text-sm text-text-muted">Measure therapist-client rapport quality</p>
              </div>
              <div className="p-4 bg-sand rounded-lg">
                <h4 className="font-medium text-text-primary mb-1">Treatment Response Prediction</h4>
                <p className="text-sm text-text-muted">Predict which approaches will work best</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
