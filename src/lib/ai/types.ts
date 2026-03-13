// AI Feature Types for MindBridge

// Session Sentiment Analysis Types
export interface SentimentTimelineEntry {
  timestamp: number; // seconds into session
  sentiment: 'positive' | 'neutral' | 'negative';
  intensity: number; // 0-100
  topic?: string;
  speaker: 'client' | 'clinician';
}

export interface SessionSentiment {
  sessionId: string;
  clientId: string;
  sessionDate: Date;
  duration: number; // minutes
  timeline: SentimentTimelineEntry[];
  summary: {
    overallTone: string;
    averageSentiment: number; // -100 to 100
    peakPositive: { time: number; context: string; intensity: number } | null;
    peakNegative: { time: number; context: string; intensity: number } | null;
    turningPoints: { time: number; from: string; to: string; trigger?: string }[];
    dominantEmotions: string[];
  };
  insights: string[];
}

// Smart Session Preparation Types
export interface SessionPrep {
  clientId: string;
  clientName: string;
  sessionDate: Date;
  summary: {
    lastSessionHighlights: string[];
    lastSessionDate: Date | null;
    homeworkStatus: { completed: number; assigned: number; overdue: number };
    moodTrend: 'improving' | 'stable' | 'declining';
    averageMoodScore: number;
    recentConcerns: string[];
    riskLevel: 'low' | 'moderate' | 'high' | 'critical';
    riskChange: 'increased' | 'stable' | 'decreased';
  };
  suggestedAgenda: {
    priority: number;
    topic: string;
    rationale: string;
    timeEstimate: number; // minutes
    type: 'follow-up' | 'new-topic' | 'assessment' | 'crisis' | 'homework-review';
  }[];
  preparedResources: {
    type: 'worksheet' | 'assessment' | 'psychoeducation' | 'exercise';
    name: string;
    description: string;
  }[];
  alerts: {
    type: 'warning' | 'info' | 'urgent';
    message: string;
  }[];
  treatmentProgress: {
    goals: { goal: string; progress: number; status: 'on-track' | 'behind' | 'achieved' }[];
    sessionsCompleted: number;
    estimatedRemaining: number;
  };
}

// Outcome Tracking Dashboard Types
export interface OutcomeMetric {
  date: Date;
  score: number;
  severity: string;
  notes?: string;
}

export interface TreatmentGoal {
  id: string;
  goal: string;
  targetDate?: Date;
  progress: number; // 0-100
  status: 'on-track' | 'behind' | 'achieved' | 'at-risk';
  milestones: { description: string; completed: boolean; date?: Date }[];
}

export interface OutcomeDashboard {
  clientId: string;
  clientName: string;
  treatmentStartDate: Date;
  currentPhase: string;
  assessments: {
    type: string;
    fullName: string;
    scores: OutcomeMetric[];
    trend: 'improving' | 'stable' | 'worsening';
    clinicallySignificantChange: boolean;
    reliableChangeIndex: number;
  }[];
  goals: TreatmentGoal[];
  overallProgress: {
    startScore: number;
    currentScore: number;
    percentImprovement: number;
    sessionsCompleted: number;
    estimatedSessionsRemaining: number;
    projectedEndDate: Date | null;
  };
  moodTrend: {
    data: { date: Date; rating: number }[];
    average: number;
    trend: 'improving' | 'stable' | 'declining';
  };
  engagementMetrics: {
    attendanceRate: number;
    homeworkCompletionRate: number;
    appUsageFrequency: number; // times per week
  };
}

// Therapeutic Alliance Types (bonus)
export interface AllianceMetrics {
  sessionId: string;
  overallScore: number; // 0-100
  rapportIndicators: {
    turnTakingBalance: number;
    emotionalAlignment: number;
    verbalMirroring: number;
  };
  sessionComparison: {
    trend: 'improving' | 'stable' | 'declining';
    changeFromLast: number;
  };
  alerts: string[];
}
