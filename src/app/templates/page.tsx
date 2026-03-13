'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import {
  FileText,
  Plus,
  Search,
  Edit3,
  Copy,
  Trash2,
  Star,
  Clock,
  Users,
  AlertTriangle,
  UserPlus,
  ClipboardList,
  MessageSquare,
  Video,
  Heart,
  Brain,
  Sparkles,
  ChevronRight,
  X,
  Save,
  Eye,
  GripVertical,
  Settings,
  Lightbulb,
  BookOpen,
  Wand2,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Layers,
  FolderOpen,
} from 'lucide-react';

// Template Section Types
interface TemplateSection {
  id: string;
  title: string;
  placeholder: string;
  required: boolean;
  aiPrompts: string[];
  clinicalTips?: string;
  wordCountGuide?: string;
}

// Template Types
interface SessionTemplate {
  id: string;
  name: string;
  description: string;
  category: 'intake' | 'standard' | 'crisis' | 'review' | 'discharge' | 'family' | 'group' | 'telehealth' | 'custom';
  icon: React.ReactNode;
  sections: TemplateSection[];
  suggestedDuration: number; // minutes
  noteFormat: 'soap' | 'dap' | 'birp' | 'narrative' | 'structured';
  tags: string[];
  isStarred: boolean;
  isCustom: boolean;
  usageCount: number;
  lastUsed?: string;
  color: string;
}

// Pre-built Session Templates with comprehensive clinical guidance
const PRESET_TEMPLATES: SessionTemplate[] = [
  {
    id: 'intake-assessment',
    name: 'Initial Assessment / Intake',
    description: 'Comprehensive first session template covering presenting concerns, history, risk assessment, and treatment planning.',
    category: 'intake',
    icon: <UserPlus className="w-6 h-6" />,
    suggestedDuration: 60,
    noteFormat: 'structured',
    tags: ['First Session', 'Assessment', 'History Taking'],
    isStarred: true,
    isCustom: false,
    usageCount: 45,
    lastUsed: '2025-02-14',
    color: 'bg-blue-500',
    sections: [
      {
        id: 'presenting-concerns',
        title: 'Presenting Concerns',
        placeholder: 'Document the client\'s main reasons for seeking treatment...',
        required: true,
        aiPrompts: [
          'What brings the client to therapy at this time?',
          'What are the primary symptoms or difficulties?',
          'How long have these concerns been present?',
          'What has the client already tried to address these issues?',
          'What are the client\'s goals for therapy?',
        ],
        clinicalTips: 'Use the client\'s own words where possible. Note onset, duration, frequency, and severity of symptoms.',
        wordCountGuide: '150-300 words',
      },
      {
        id: 'psychiatric-history',
        title: 'Psychiatric History',
        placeholder: 'Previous mental health treatment, diagnoses, hospitalisations...',
        required: true,
        aiPrompts: [
          'Previous diagnoses and when they were made',
          'Past psychological or psychiatric treatment (type, duration, outcome)',
          'Previous hospitalisations or crisis interventions',
          'Current and past psychotropic medications',
          'Response to previous treatments - what helped, what didn\'t',
        ],
        clinicalTips: 'Include both formal diagnoses and self-reported concerns. Note any gaps in treatment.',
        wordCountGuide: '100-200 words',
      },
      {
        id: 'medical-history',
        title: 'Medical History',
        placeholder: 'Relevant medical conditions, medications, allergies...',
        required: true,
        aiPrompts: [
          'Current medical conditions and treatments',
          'Current medications (include dosages if known)',
          'Recent medical investigations or hospitalisations',
          'Sleep patterns and any sleep disorders',
          'Substance use (alcohol, caffeine, nicotine, other)',
        ],
        clinicalTips: 'Note any conditions that may impact mental health (thyroid, chronic pain, neurological).',
        wordCountGuide: '80-150 words',
      },
      {
        id: 'developmental-history',
        title: 'Developmental & Family History',
        placeholder: 'Early development, family relationships, significant life events...',
        required: false,
        aiPrompts: [
          'Early developmental milestones and any concerns',
          'Family structure and key relationships',
          'Family mental health history',
          'Significant childhood experiences or trauma',
          'Educational and occupational history',
        ],
        clinicalTips: 'Be sensitive when exploring trauma history. Note protective factors as well as risk factors.',
        wordCountGuide: '100-200 words',
      },
      {
        id: 'current-functioning',
        title: 'Current Functioning',
        placeholder: 'Daily activities, relationships, work/study, self-care...',
        required: true,
        aiPrompts: [
          'Current living situation and support network',
          'Occupational/educational functioning',
          'Social relationships and activities',
          'Daily routine and self-care',
          'Hobbies, interests, and sources of meaning',
        ],
        clinicalTips: 'Assess both impairments and strengths. Note any recent changes in functioning.',
        wordCountGuide: '100-150 words',
      },
      {
        id: 'risk-assessment',
        title: 'Risk Assessment',
        placeholder: 'Suicidal ideation, self-harm, harm to others, vulnerability...',
        required: true,
        aiPrompts: [
          'Current suicidal ideation (frequency, intensity, plan, intent, means)',
          'History of suicide attempts or self-harm',
          'Current self-harm behaviours',
          'Thoughts of harming others',
          'Protective factors against suicide/self-harm',
          'Current risk level (low/medium/high) with rationale',
        ],
        clinicalTips: 'Always ask directly about suicide. Document protective factors. Include safety plan if indicated.',
        wordCountGuide: '100-200 words',
      },
      {
        id: 'mental-status',
        title: 'Mental Status Examination',
        placeholder: 'Appearance, behaviour, speech, mood, affect, thought content/process...',
        required: true,
        aiPrompts: [
          'Appearance and behaviour (grooming, psychomotor activity, eye contact)',
          'Speech (rate, volume, tone, coherence)',
          'Mood (client\'s subjective report) and affect (observed emotional expression)',
          'Thought process (logical, tangential, circumstantial)',
          'Thought content (preoccupations, obsessions, delusions)',
          'Perceptions (hallucinations, illusions)',
          'Cognition (orientation, attention, memory)',
          'Insight and judgement',
        ],
        clinicalTips: 'Be objective and descriptive. Note any incongruence between mood and affect.',
        wordCountGuide: '150-250 words',
      },
      {
        id: 'formulation',
        title: 'Clinical Formulation',
        placeholder: 'Integration of assessment information into a coherent understanding...',
        required: true,
        aiPrompts: [
          'Predisposing factors (biological, psychological, social)',
          'Precipitating factors (recent triggers)',
          'Perpetuating factors (what maintains the problem)',
          'Protective factors (strengths and resources)',
          'Working hypothesis or diagnostic impression',
        ],
        clinicalTips: 'Use a biopsychosocial framework. Link presenting concerns to underlying mechanisms.',
        wordCountGuide: '150-250 words',
      },
      {
        id: 'treatment-plan',
        title: 'Treatment Recommendations',
        placeholder: 'Proposed interventions, frequency, goals, referrals...',
        required: true,
        aiPrompts: [
          'Recommended treatment modality (e.g., CBT, DBT, psychodynamic)',
          'Proposed session frequency and duration of treatment',
          'Short-term and long-term treatment goals',
          'Specific interventions to be used',
          'Need for medication review or other referrals',
          'Client\'s level of engagement and motivation',
        ],
        clinicalTips: 'Goals should be SMART. Include client in collaborative treatment planning.',
        wordCountGuide: '100-200 words',
      },
    ],
  },
  {
    id: 'standard-session',
    name: 'Standard Therapy Session',
    description: 'Regular session template with agenda setting, intervention, and homework review.',
    category: 'standard',
    icon: <MessageSquare className="w-6 h-6" />,
    suggestedDuration: 50,
    noteFormat: 'soap',
    tags: ['Regular Session', 'Ongoing Treatment'],
    isStarred: true,
    isCustom: false,
    usageCount: 156,
    lastUsed: '2025-02-15',
    color: 'bg-sage',
    sections: [
      {
        id: 'check-in',
        title: 'Session Check-In',
        placeholder: 'Client\'s current state, mood rating, significant events since last session...',
        required: true,
        aiPrompts: [
          'How has the client been since the last session?',
          'Current mood rating (0-10) and comparison to last session',
          'Any significant events or stressors this week?',
          'Sleep, appetite, energy levels',
          'Medication compliance (if applicable)',
        ],
        clinicalTips: 'Start with open-ended questions before structured assessment. Note any changes from baseline.',
        wordCountGuide: '50-100 words',
      },
      {
        id: 'homework-review',
        title: 'Homework Review',
        placeholder: 'Review of between-session tasks, what was completed, barriers encountered...',
        required: false,
        aiPrompts: [
          'What homework/exercises were assigned last session?',
          'What did the client complete? What wasn\'t completed?',
          'What did the client learn from the exercises?',
          'What barriers prevented completion?',
          'How can homework be modified for better engagement?',
        ],
        clinicalTips: 'Approach non-completion with curiosity, not judgement. Explore barriers therapeutically.',
        wordCountGuide: '50-100 words',
      },
      {
        id: 'session-focus',
        title: 'Session Focus & Agenda',
        placeholder: 'Main topics addressed, client priorities, collaborative agenda...',
        required: true,
        aiPrompts: [
          'What does the client want to focus on today?',
          'What items from the treatment plan are being addressed?',
          'Are there any urgent issues that need attention?',
          'Agreed session agenda',
        ],
        clinicalTips: 'Collaboratively set agenda at the start. Be flexible but maintain therapeutic focus.',
        wordCountGuide: '30-60 words',
      },
      {
        id: 'interventions',
        title: 'Interventions & Content',
        placeholder: 'Therapeutic techniques used, topics explored, skills taught...',
        required: true,
        aiPrompts: [
          'What specific interventions were used? (e.g., cognitive restructuring, exposure, behavioural activation)',
          'What topics or themes were explored?',
          'What insights or shifts occurred?',
          'What skills were taught or practiced?',
          'Client\'s engagement and response to interventions',
        ],
        clinicalTips: 'Be specific about techniques used. Document client\'s response and any breakthroughs.',
        wordCountGuide: '150-300 words',
      },
      {
        id: 'progress',
        title: 'Progress & Observations',
        placeholder: 'Progress toward goals, clinical observations, therapeutic relationship...',
        required: true,
        aiPrompts: [
          'Progress toward treatment goals',
          'Changes in symptoms or functioning',
          'Client\'s level of insight and motivation',
          'Quality of therapeutic alliance',
          'Any concerns or areas needing attention',
        ],
        clinicalTips: 'Link observations to treatment goals. Note both progress and areas for continued work.',
        wordCountGuide: '80-150 words',
      },
      {
        id: 'plan',
        title: 'Plan & Homework',
        placeholder: 'Homework assigned, focus for next session, any referrals or actions...',
        required: true,
        aiPrompts: [
          'What homework or exercises are assigned?',
          'Focus areas for next session',
          'Any referrals or coordination needed?',
          'Next appointment date and time',
          'Any changes to treatment plan?',
        ],
        clinicalTips: 'Homework should be specific, achievable, and collaboratively agreed. Confirm client understands.',
        wordCountGuide: '50-100 words',
      },
    ],
  },
  {
    id: 'crisis-session',
    name: 'Crisis Intervention Session',
    description: 'Template for crisis presentations including safety assessment, stabilisation, and safety planning.',
    category: 'crisis',
    icon: <AlertTriangle className="w-6 h-6" />,
    suggestedDuration: 60,
    noteFormat: 'structured',
    tags: ['Crisis', 'Safety', 'Urgent'],
    isStarred: true,
    isCustom: false,
    usageCount: 12,
    lastUsed: '2025-02-10',
    color: 'bg-red-500',
    sections: [
      {
        id: 'crisis-presentation',
        title: 'Crisis Presentation',
        placeholder: 'Nature of crisis, precipitating events, current state...',
        required: true,
        aiPrompts: [
          'What is the nature of the current crisis?',
          'What events precipitated this crisis?',
          'When did the crisis begin?',
          'Current emotional and physical state',
          'Who referred or brought the client (if applicable)?',
        ],
        clinicalTips: 'Remain calm and containing. Establish rapport quickly while assessing safety.',
        wordCountGuide: '100-200 words',
      },
      {
        id: 'suicide-risk',
        title: 'Suicide Risk Assessment',
        placeholder: 'Detailed assessment of suicidal ideation, plan, intent, means, and protective factors...',
        required: true,
        aiPrompts: [
          'IDEATION: Frequency, intensity, duration of suicidal thoughts',
          'PLAN: Does client have a specific plan? How detailed?',
          'INTENT: Does client intend to act on thoughts?',
          'MEANS: Access to lethal means (firearms, medications, etc.)',
          'TIMELINE: Any specific timeframe or deadline?',
          'HISTORY: Previous attempts (number, method, lethality, circumstances)',
          'PROTECTIVE FACTORS: Reasons for living, support network, responsibilities',
          'RISK LEVEL: Low/Moderate/High/Imminent with rationale',
        ],
        clinicalTips: 'Ask directly and specifically. Use validated tools (e.g., Columbia Protocol). Document thoroughly.',
        wordCountGuide: '200-350 words',
      },
      {
        id: 'self-harm-assessment',
        title: 'Self-Harm Assessment',
        placeholder: 'Current self-harm, methods, frequency, medical attention needed...',
        required: true,
        aiPrompts: [
          'Current self-harm behaviours (type, frequency, severity)',
          'Most recent episode (when, method, severity)',
          'Function of self-harm (emotional regulation, communication, etc.)',
          'Medical attention required?',
          'History of self-harm and escalation patterns',
        ],
        clinicalTips: 'Assess wounds if visible. Determine if medical attention is needed. Distinguish from suicidal intent.',
        wordCountGuide: '80-150 words',
      },
      {
        id: 'mental-state',
        title: 'Current Mental State',
        placeholder: 'Abbreviated MSE focusing on safety-relevant observations...',
        required: true,
        aiPrompts: [
          'Level of distress (0-10)',
          'Ability to think clearly and problem-solve',
          'Presence of hopelessness',
          'Agitation or psychomotor changes',
          'Intoxication or substance use',
          'Psychotic symptoms (if relevant)',
          'Ability to engage with safety planning',
        ],
        clinicalTips: 'Focus on factors relevant to immediate safety. Note client\'s capacity to engage.',
        wordCountGuide: '80-150 words',
      },
      {
        id: 'stabilisation',
        title: 'Stabilisation Interventions',
        placeholder: 'Interventions used to reduce immediate distress and increase safety...',
        required: true,
        aiPrompts: [
          'What interventions were used to stabilise the client?',
          'Grounding techniques, breathing exercises, containment',
          'Problem-solving for immediate concerns',
          'Challenging hopeless cognitions',
          'Client\'s response to interventions',
          'Level of stabilisation achieved',
        ],
        clinicalTips: 'Document specific techniques used and client\'s response. Ensure client is stable before leaving.',
        wordCountGuide: '100-200 words',
      },
      {
        id: 'safety-plan',
        title: 'Safety Plan',
        placeholder: 'Collaborative safety plan including warning signs, coping strategies, supports...',
        required: true,
        aiPrompts: [
          'WARNING SIGNS: How will client know they\'re in crisis?',
          'INTERNAL COPING: What can client do alone to cope?',
          'SOCIAL SUPPORTS: Who can client reach out to?',
          'PROFESSIONAL CONTACTS: Therapist, GP, crisis line numbers',
          'MEANS RESTRICTION: Steps to reduce access to lethal means',
          'REASONS FOR LIVING: What makes life worth living?',
          'Client\'s commitment to safety plan',
        ],
        clinicalTips: 'Make safety plan collaboratively. Ensure client has a copy. Involve supports if appropriate.',
        wordCountGuide: '150-250 words',
      },
      {
        id: 'disposition',
        title: 'Disposition & Follow-Up',
        placeholder: 'Decision about level of care, follow-up arrangements, notifications...',
        required: true,
        aiPrompts: [
          'Disposition decision (continue outpatient, ED referral, voluntary admission, etc.)',
          'Rationale for disposition',
          'Follow-up appointment (when?)',
          'Who has been notified? (GP, psychiatrist, family)',
          'Documentation provided to client',
          'Any mandatory reporting obligations',
        ],
        clinicalTips: 'Document decision-making process. Ensure clear follow-up. Consider duty of care obligations.',
        wordCountGuide: '80-150 words',
      },
    ],
  },
  {
    id: 'progress-review',
    name: 'Treatment Progress Review',
    description: 'Scheduled review of treatment progress, goal assessment, and treatment planning adjustments.',
    category: 'review',
    icon: <ClipboardList className="w-6 h-6" />,
    suggestedDuration: 50,
    noteFormat: 'structured',
    tags: ['Review', 'Progress', 'Goals'],
    isStarred: false,
    isCustom: false,
    usageCount: 28,
    lastUsed: '2025-02-12',
    color: 'bg-amber-500',
    sections: [
      {
        id: 'review-context',
        title: 'Review Context',
        placeholder: 'Session number, treatment duration, reason for review...',
        required: true,
        aiPrompts: [
          'Current session number and treatment duration',
          'Reason for review (scheduled, client request, clinical concern)',
          'Original presenting concerns',
          'Initial treatment goals',
        ],
        clinicalTips: 'Reference initial assessment for comparison. This is a collaborative process with the client.',
        wordCountGuide: '50-80 words',
      },
      {
        id: 'symptom-review',
        title: 'Symptom & Functioning Review',
        placeholder: 'Changes in symptoms, assessment scores, daily functioning...',
        required: true,
        aiPrompts: [
          'Current symptom levels compared to baseline',
          'Assessment scores (PHQ-9, GAD-7, etc.) compared to intake',
          'Changes in daily functioning (work, relationships, self-care)',
          'New symptoms or concerns that have emerged',
          'Client\'s subjective sense of progress',
        ],
        clinicalTips: 'Use standardised measures where possible. Document both objective and subjective changes.',
        wordCountGuide: '100-200 words',
      },
      {
        id: 'goal-review',
        title: 'Treatment Goals Review',
        placeholder: 'Progress on each treatment goal, goals achieved, goals needing revision...',
        required: true,
        aiPrompts: [
          'Review each treatment goal:',
          '- Goal 1: Progress made? Achieved? Ongoing?',
          '- Goal 2: Progress made? Achieved? Ongoing?',
          '- Goal 3: Progress made? Achieved? Ongoing?',
          'Are current goals still relevant?',
          'Any new goals to add?',
          'Goals that need to be modified?',
        ],
        clinicalTips: 'Be specific about progress indicators. Celebrate achievements. Adjust goals collaboratively.',
        wordCountGuide: '150-250 words',
      },
      {
        id: 'treatment-review',
        title: 'Treatment Approach Review',
        placeholder: 'Effectiveness of current approach, therapeutic relationship, what\'s working...',
        required: true,
        aiPrompts: [
          'Is the current treatment modality effective?',
          'What interventions have been most helpful?',
          'What hasn\'t worked as well?',
          'Quality of therapeutic relationship',
          'Client engagement and homework completion',
          'Barriers to progress',
        ],
        clinicalTips: 'Invite honest feedback. Be willing to adapt approach. Address ruptures if present.',
        wordCountGuide: '100-180 words',
      },
      {
        id: 'revised-plan',
        title: 'Revised Treatment Plan',
        placeholder: 'Updated goals, modified approach, session frequency, estimated duration...',
        required: true,
        aiPrompts: [
          'Updated treatment goals (if changed)',
          'Modifications to treatment approach',
          'Changes to session frequency',
          'Estimated remaining sessions or treatment duration',
          'Any new referrals needed (psychiatry, groups, etc.)',
          'Plan for next review',
        ],
        clinicalTips: 'Document client\'s agreement with revised plan. Set date for next review.',
        wordCountGuide: '100-180 words',
      },
    ],
  },
  {
    id: 'discharge-session',
    name: 'Discharge / Termination',
    description: 'End of treatment session including summary, maintenance planning, and relapse prevention.',
    category: 'discharge',
    icon: <CheckCircle className="w-6 h-6" />,
    suggestedDuration: 50,
    noteFormat: 'structured',
    tags: ['Discharge', 'Termination', 'Relapse Prevention'],
    isStarred: false,
    isCustom: false,
    usageCount: 15,
    lastUsed: '2025-02-08',
    color: 'bg-emerald-500',
    sections: [
      {
        id: 'treatment-summary',
        title: 'Treatment Summary',
        placeholder: 'Overview of treatment course, total sessions, main themes addressed...',
        required: true,
        aiPrompts: [
          'Treatment duration and total number of sessions',
          'Original presenting concerns',
          'Treatment modality used',
          'Main themes and issues addressed',
          'Key interventions and techniques used',
        ],
        clinicalTips: 'Provide a cohesive narrative of the treatment journey. Highlight the work done together.',
        wordCountGuide: '150-250 words',
      },
      {
        id: 'outcomes',
        title: 'Treatment Outcomes',
        placeholder: 'Goals achieved, symptom changes, functional improvements, assessment scores...',
        required: true,
        aiPrompts: [
          'Status of each treatment goal (achieved, partially achieved, ongoing)',
          'Symptom changes from baseline to discharge',
          'Assessment scores comparison (intake vs discharge)',
          'Improvements in daily functioning',
          'Client\'s subjective experience of change',
          'Areas of remaining difficulty',
        ],
        clinicalTips: 'Use objective measures where possible. Acknowledge both achievements and ongoing challenges.',
        wordCountGuide: '150-250 words',
      },
      {
        id: 'skills-learned',
        title: 'Skills & Insights Gained',
        placeholder: 'Key skills client has developed, insights achieved, coping strategies...',
        required: true,
        aiPrompts: [
          'Specific skills the client has learned',
          'Key insights or cognitive shifts',
          'Coping strategies that work for this client',
          'Changes in relationship patterns or behaviours',
          'Client\'s increased self-awareness',
        ],
        clinicalTips: 'Help client articulate their learning. This reinforces gains and aids future self-help.',
        wordCountGuide: '100-180 words',
      },
      {
        id: 'relapse-prevention',
        title: 'Relapse Prevention Plan',
        placeholder: 'Warning signs, triggers, coping strategies, when to seek help...',
        required: true,
        aiPrompts: [
          'Early warning signs of relapse',
          'Known triggers to monitor',
          'Coping strategies to use if symptoms return',
          'Maintenance activities (exercise, social connection, etc.)',
          'When to seek professional help again',
          'Resources and support contacts',
        ],
        clinicalTips: 'Make this concrete and personalised. Provide written copy to client.',
        wordCountGuide: '150-250 words',
      },
      {
        id: 'follow-up',
        title: 'Follow-Up Arrangements',
        placeholder: 'Booster sessions, referrals, GP communication, open door policy...',
        required: true,
        aiPrompts: [
          'Any booster sessions scheduled?',
          'Referrals made (ongoing support, groups, etc.)',
          'Communication to GP or referrer',
          'Open door policy for future contact',
          'What circumstances would warrant return to treatment',
        ],
        clinicalTips: 'Ensure smooth handover if referring elsewhere. Communicate with GP. Leave door open.',
        wordCountGuide: '80-150 words',
      },
      {
        id: 'termination-process',
        title: 'Termination Process',
        placeholder: 'Client\'s feelings about ending, therapist observations, closure...',
        required: false,
        aiPrompts: [
          'Client\'s feelings about ending treatment',
          'How termination was addressed therapeutically',
          'Any unfinished business or lingering concerns',
          'Positive aspects of the therapeutic relationship to acknowledge',
          'Sense of closure achieved',
        ],
        clinicalTips: 'Allow space for feelings about ending. This can be therapeutic in itself.',
        wordCountGuide: '80-150 words',
      },
    ],
  },
  {
    id: 'family-session',
    name: 'Family Therapy Session',
    description: 'Template for family or couples sessions including systemic observations and interventions.',
    category: 'family',
    icon: <Users className="w-6 h-6" />,
    suggestedDuration: 60,
    noteFormat: 'narrative',
    tags: ['Family', 'Couples', 'Systemic'],
    isStarred: false,
    isCustom: false,
    usageCount: 22,
    lastUsed: '2025-02-11',
    color: 'bg-purple-500',
    sections: [
      {
        id: 'attendees',
        title: 'Session Attendees',
        placeholder: 'Who attended, who was absent, any changes from usual attendance...',
        required: true,
        aiPrompts: [
          'Family members present (names and relationships)',
          'Anyone absent and reason',
          'Changes from usual attendance pattern',
          'Seating arrangement observations',
        ],
        clinicalTips: 'Note who chose to sit where - seating often reflects family dynamics.',
        wordCountGuide: '30-60 words',
      },
      {
        id: 'family-dynamics',
        title: 'Family Dynamics Observed',
        placeholder: 'Communication patterns, alliances, conflicts, non-verbal interactions...',
        required: true,
        aiPrompts: [
          'Communication patterns observed',
          'Who speaks to whom? Who is silent?',
          'Alliances and coalitions',
          'Conflict patterns and how they\'re managed',
          'Non-verbal communication and body language',
          'Power dynamics and hierarchy',
          'Emotional climate of the session',
        ],
        clinicalTips: 'Describe patterns rather than individual pathology. Note what happens, not just what\'s said.',
        wordCountGuide: '150-250 words',
      },
      {
        id: 'presenting-issues',
        title: 'Issues Discussed',
        placeholder: 'Main topics raised, different perspectives, areas of agreement/disagreement...',
        required: true,
        aiPrompts: [
          'Main issues or concerns raised',
          'Each family member\'s perspective',
          'Areas of agreement',
          'Areas of disagreement or conflict',
          'How was the "identified patient" discussed?',
          'Underlying systemic issues identified',
        ],
        clinicalTips: 'Capture multiple perspectives. Note whose voice is heard and whose is silenced.',
        wordCountGuide: '150-250 words',
      },
      {
        id: 'interventions',
        title: 'Therapeutic Interventions',
        placeholder: 'Techniques used, reframes offered, tasks assigned, enactments...',
        required: true,
        aiPrompts: [
          'Systemic interventions used (e.g., circular questioning, reframing)',
          'Communication improvements facilitated',
          'Enactments or role-plays',
          'Reframes or new perspectives offered',
          'Psychoeducation provided',
          'Family\'s response to interventions',
        ],
        clinicalTips: 'Document specific techniques. Note shifts in understanding or behaviour during session.',
        wordCountGuide: '150-250 words',
      },
      {
        id: 'homework',
        title: 'Between-Session Tasks',
        placeholder: 'Tasks for the family, communication exercises, observations to make...',
        required: false,
        aiPrompts: [
          'Tasks assigned to the family as a whole',
          'Tasks for specific family members',
          'Communication exercises',
          'Observations to make',
          'Rituals or structured activities',
        ],
        clinicalTips: 'Make tasks achievable and clear. Involve the family in designing tasks.',
        wordCountGuide: '50-100 words',
      },
      {
        id: 'formulation',
        title: 'Systemic Formulation',
        placeholder: 'Patterns identified, hypotheses about family system, treatment direction...',
        required: true,
        aiPrompts: [
          'Key patterns in the family system',
          'Hypotheses about what maintains the problem',
          'Family strengths and resources',
          'Treatment direction and focus',
          'Predicted challenges',
        ],
        clinicalTips: 'Think systemically - how does the problem serve the system? What would need to change?',
        wordCountGuide: '100-180 words',
      },
    ],
  },
  {
    id: 'telehealth-session',
    name: 'Telehealth Session',
    description: 'Template adapted for video or phone sessions with technology and safety considerations.',
    category: 'telehealth',
    icon: <Video className="w-6 h-6" />,
    suggestedDuration: 50,
    noteFormat: 'soap',
    tags: ['Telehealth', 'Video', 'Remote'],
    isStarred: false,
    isCustom: false,
    usageCount: 67,
    lastUsed: '2025-02-15',
    color: 'bg-cyan-500',
    sections: [
      {
        id: 'telehealth-setup',
        title: 'Telehealth Setup',
        placeholder: 'Platform used, connection quality, client location, safety verification...',
        required: true,
        aiPrompts: [
          'Platform used (Zoom, Teams, phone, etc.)',
          'Video or audio only?',
          'Connection quality',
          'Client\'s location (for safety purposes)',
          'Privacy - is client able to speak freely?',
          'Emergency contact and local crisis services confirmed',
        ],
        clinicalTips: 'Always verify location at start of session. Have backup contact method ready.',
        wordCountGuide: '40-80 words',
      },
      {
        id: 'observations',
        title: 'Telehealth Observations',
        placeholder: 'What could be observed via video, limitations, home environment observations...',
        required: false,
        aiPrompts: [
          'General appearance (what\'s visible)',
          'Affect and emotional presentation',
          'Home environment observations (if visible and relevant)',
          'Engagement with the session',
          'Any technology-related challenges',
          'Limitations of assessment via telehealth',
        ],
        clinicalTips: 'Note limitations of observation. Be mindful of what you can and cannot assess remotely.',
        wordCountGuide: '60-120 words',
      },
      {
        id: 'session-content',
        title: 'Session Content',
        placeholder: 'Topics discussed, interventions used, adaptations for telehealth...',
        required: true,
        aiPrompts: [
          'Main topics or concerns addressed',
          'Interventions used (adapted for telehealth)',
          'Screen-shared resources or worksheets',
          'Client engagement and participation',
          'Any adaptations needed for remote delivery',
        ],
        clinicalTips: 'Consider which interventions work well remotely. Use screen sharing for visual aids.',
        wordCountGuide: '150-300 words',
      },
      {
        id: 'risk-telehealth',
        title: 'Risk & Safety (Telehealth)',
        placeholder: 'Risk assessment conducted, safety plan reviewed, emergency protocols...',
        required: true,
        aiPrompts: [
          'Risk assessment conducted',
          'Current risk level',
          'Safety plan reviewed if indicated',
          'Client\'s current location confirmed',
          'Emergency contact details confirmed',
          'Local crisis services known',
        ],
        clinicalTips: 'Risk assessment is essential for telehealth. Have a clear protocol if you lose connection during a crisis.',
        wordCountGuide: '60-120 words',
      },
      {
        id: 'plan-telehealth',
        title: 'Plan',
        placeholder: 'Homework, next session, telehealth or in-person preference...',
        required: true,
        aiPrompts: [
          'Between-session tasks',
          'Resources sent/shared',
          'Next session (date, time, telehealth or in-person)',
          'Client\'s preference for future session modality',
          'Any technical issues to resolve',
        ],
        clinicalTips: 'Confirm next session details clearly. Send session summary or resources by secure message.',
        wordCountGuide: '50-100 words',
      },
    ],
  },
  {
    id: 'eating-disorder-session',
    name: 'Eating Disorder Session',
    description: 'Specialised template for eating disorder treatment including weight, eating behaviours, and body image.',
    category: 'standard',
    icon: <Heart className="w-6 h-6" />,
    suggestedDuration: 50,
    noteFormat: 'structured',
    tags: ['Eating Disorders', 'ED', 'Specialised'],
    isStarred: true,
    isCustom: false,
    usageCount: 89,
    lastUsed: '2025-02-15',
    color: 'bg-rose-500',
    sections: [
      {
        id: 'weight-check',
        title: 'Weight Check',
        placeholder: 'Current weight, change from last session, client reaction, collaborative discussion...',
        required: true,
        aiPrompts: [
          'Current weight and change from last session',
          'Trend over recent weeks',
          'Client\'s reaction to weight',
          'Discussion of weight in session',
          'Weight goal progress (if applicable)',
        ],
        clinicalTips: 'Weigh at start of session (CBT-E protocol). Discuss collaboratively. Don\'t avoid difficult conversations.',
        wordCountGuide: '40-80 words',
      },
      {
        id: 'eating-behaviours',
        title: 'Eating Behaviours Review',
        placeholder: 'Food diary review, regular eating, binge/purge episodes, restriction...',
        required: true,
        aiPrompts: [
          'Food diary completed? Quality of self-monitoring?',
          'Regular eating pattern maintained?',
          'Binge eating episodes (number, triggers, context)',
          'Compensatory behaviours (vomiting, laxatives, exercise)',
          'Dietary restriction or rules',
          'New foods tried or fear foods challenged',
        ],
        clinicalTips: 'Review food diary in detail. Look for patterns. Maintain non-judgmental stance.',
        wordCountGuide: '100-180 words',
      },
      {
        id: 'body-image',
        title: 'Body Image & Checking',
        placeholder: 'Body checking behaviours, avoidance, feeling fat, mirror use...',
        required: false,
        aiPrompts: [
          'Body checking behaviours this week',
          'Body avoidance behaviours',
          'Frequency of "feeling fat"',
          'Triggers for body dissatisfaction',
          'Progress on body image work',
        ],
        clinicalTips: 'Body image work typically comes after eating is stabilised. Address checking behaviours.',
        wordCountGuide: '60-120 words',
      },
      {
        id: 'ed-interventions',
        title: 'Session Interventions',
        placeholder: 'CBT-E/FBT interventions, psychoeducation, behavioural experiments...',
        required: true,
        aiPrompts: [
          'Specific interventions used',
          'Psychoeducation topics covered',
          'Cognitive work (e.g., dietary rules, shape/weight concerns)',
          'Behavioural experiments planned or reviewed',
          'Skills practice (e.g., urge surfing, distress tolerance)',
          'Client engagement and response',
        ],
        clinicalTips: 'Follow treatment protocol. Document specific techniques. Note any modifications needed.',
        wordCountGuide: '150-250 words',
      },
      {
        id: 'medical-status',
        title: 'Medical Status',
        placeholder: 'Physical symptoms, medical monitoring, coordination with GP/physician...',
        required: true,
        aiPrompts: [
          'Physical symptoms reported (dizziness, fatigue, hair loss, etc.)',
          'Recent medical appointments or tests',
          'Vital signs if taken',
          'Medication changes',
          'Communication with medical team',
          'Medical concerns requiring follow-up',
        ],
        clinicalTips: 'Monitor medical status closely. Low threshold for medical review. Document any concerns.',
        wordCountGuide: '60-120 words',
      },
      {
        id: 'ed-homework',
        title: 'Homework & Plan',
        placeholder: 'Food diary, behavioural tasks, exposure exercises, next session focus...',
        required: true,
        aiPrompts: [
          'Food diary instructions',
          'Specific behavioural tasks',
          'Exposure or challenge tasks',
          'Focus for next session',
          'Any adjustments to meal plan',
          'Next appointment details',
        ],
        clinicalTips: 'Be specific with homework. Collaborate on achievable challenges. Plan ahead.',
        wordCountGuide: '60-120 words',
      },
    ],
  },
  {
    id: 'group-session',
    name: 'Group Therapy Session',
    description: 'Template for group therapy sessions with multiple client observations and group dynamics.',
    category: 'group',
    icon: <Users className="w-6 h-6" />,
    suggestedDuration: 90,
    noteFormat: 'narrative',
    tags: ['Group', 'Multiple Clients'],
    isStarred: false,
    isCustom: false,
    usageCount: 18,
    lastUsed: '2025-02-13',
    color: 'bg-indigo-500',
    sections: [
      {
        id: 'group-attendance',
        title: 'Attendance',
        placeholder: 'Members present, absent, new members, dropouts...',
        required: true,
        aiPrompts: [
          'Number of members present',
          'Members absent (names/initials)',
          'New members joining',
          'Members who have dropped out',
          'Session number in group programme',
        ],
        clinicalTips: 'Track attendance patterns. Follow up with absent members. Note impact of absences on group.',
        wordCountGuide: '30-60 words',
      },
      {
        id: 'group-theme',
        title: 'Session Theme & Content',
        placeholder: 'Planned content, topics covered, skills taught...',
        required: true,
        aiPrompts: [
          'Planned session theme/topic',
          'Actual content covered',
          'Skills taught or practiced',
          'Materials or exercises used',
          'Deviations from plan and why',
        ],
        clinicalTips: 'Balance structure with responsiveness to group needs. Document any protocol variations.',
        wordCountGuide: '100-180 words',
      },
      {
        id: 'group-dynamics',
        title: 'Group Dynamics',
        placeholder: 'Group cohesion, interactions, conflicts, therapeutic factors observed...',
        required: true,
        aiPrompts: [
          'Overall group cohesion and atmosphere',
          'Significant interactions between members',
          'Conflicts or tensions',
          'Therapeutic factors observed (universality, hope, etc.)',
          'Leadership and participation patterns',
          'Subgroup formations',
        ],
        clinicalTips: 'Observe process, not just content. Note therapeutic factors at work. Address problematic dynamics.',
        wordCountGuide: '120-200 words',
      },
      {
        id: 'individual-notes',
        title: 'Individual Member Notes',
        placeholder: 'Brief notes on individual members requiring documentation...',
        required: false,
        aiPrompts: [
          'Members showing significant progress',
          'Members requiring individual follow-up',
          'Risk or safety concerns for any member',
          'Individual disclosures requiring documentation',
          'Members who may need additional support',
        ],
        clinicalTips: 'Keep individual notes brief. Detailed notes go in individual files. Flag any concerns.',
        wordCountGuide: '80-150 words',
      },
      {
        id: 'facilitator-reflections',
        title: 'Facilitator Reflections',
        placeholder: 'What worked, what could improve, supervision issues, self-care...',
        required: false,
        aiPrompts: [
          'What worked well this session?',
          'What could be improved?',
          'Issues for supervision',
          'Co-facilitator dynamics (if applicable)',
          'Facilitator self-care needs',
        ],
        clinicalTips: 'Honest self-reflection improves practice. Bring challenges to supervision.',
        wordCountGuide: '60-120 words',
      },
      {
        id: 'group-plan',
        title: 'Plan for Next Session',
        placeholder: 'Content planned, members to follow up, adjustments needed...',
        required: true,
        aiPrompts: [
          'Content planned for next session',
          'Members requiring follow-up contact',
          'Adjustments to group structure',
          'Resources to prepare',
          'Communication with referrers if needed',
        ],
        clinicalTips: 'Plan ahead but remain flexible. Follow up with members at risk. Keep referrers informed.',
        wordCountGuide: '50-100 words',
      },
    ],
  },
];

const categoryInfo = {
  intake: { label: 'Intake & Assessment', color: 'bg-blue-100 text-blue-700', icon: <UserPlus className="w-4 h-4" /> },
  standard: { label: 'Standard Sessions', color: 'bg-sage/20 text-sage-dark', icon: <MessageSquare className="w-4 h-4" /> },
  crisis: { label: 'Crisis', color: 'bg-red-100 text-red-700', icon: <AlertTriangle className="w-4 h-4" /> },
  review: { label: 'Review', color: 'bg-amber-100 text-amber-700', icon: <ClipboardList className="w-4 h-4" /> },
  discharge: { label: 'Discharge', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle className="w-4 h-4" /> },
  family: { label: 'Family/Couples', color: 'bg-purple-100 text-purple-700', icon: <Users className="w-4 h-4" /> },
  group: { label: 'Group', color: 'bg-indigo-100 text-indigo-700', icon: <Users className="w-4 h-4" /> },
  telehealth: { label: 'Telehealth', color: 'bg-cyan-100 text-cyan-700', icon: <Video className="w-4 h-4" /> },
  custom: { label: 'Custom', color: 'bg-stone-100 text-stone-700', icon: <Edit3 className="w-4 h-4" /> },
};

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<SessionTemplate[]>(PRESET_TEMPLATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewingTemplate, setViewingTemplate] = useState<SessionTemplate | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<SessionTemplate | null>(null);

  // Load templates from localStorage on mount and merge with presets
  useEffect(() => {
    const stored = localStorage.getItem('mindbridge-templates');
    if (stored) {
      try {
        const savedTemplates = JSON.parse(stored);
        // Merge: keep presets, add any custom templates
        const customTemplates = savedTemplates.filter((t: SessionTemplate) => t.isCustom);
        const presetIds = PRESET_TEMPLATES.map(t => t.id);
        const updatedPresets = PRESET_TEMPLATES.map(preset => {
          const saved = savedTemplates.find((t: SessionTemplate) => t.id === preset.id);
          return saved ? { ...preset, isStarred: saved.isStarred, usageCount: saved.usageCount, lastUsed: saved.lastUsed } : preset;
        });
        setTemplates([...updatedPresets, ...customTemplates]);
      } catch (e) {
        console.error('Failed to load templates:', e);
      }
    }
  }, []);

  // Save templates to localStorage whenever they change
  useEffect(() => {
    // Serialize templates without React nodes (icons)
    const serializable = templates.map(t => ({
      ...t,
      icon: undefined, // Don't serialize React elements
    }));
    localStorage.setItem('mindbridge-templates', JSON.stringify(serializable));
  }, [templates]);

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort: starred first, then by usage count
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (a.isStarred && !b.isStarred) return -1;
    if (!a.isStarred && b.isStarred) return 1;
    return b.usageCount - a.usageCount;
  });

  const toggleStar = (templateId: string) => {
    setTemplates(prev => prev.map(t =>
      t.id === templateId ? { ...t, isStarred: !t.isStarred } : t
    ));
  };

  const duplicateTemplate = (template: SessionTemplate) => {
    const newTemplate: SessionTemplate = {
      ...template,
      id: `custom-${Date.now()}`,
      name: `${template.name} (Copy)`,
      isCustom: true,
      isStarred: false,
      usageCount: 0,
      lastUsed: undefined,
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const useTemplate = (template: SessionTemplate) => {
    // Update usage count
    setTemplates(prev => prev.map(t =>
      t.id === template.id ? { ...t, usageCount: t.usageCount + 1, lastUsed: new Date().toISOString().split('T')[0] } : t
    ));
    // Navigate to new note with template
    window.location.href = `/notes/new?template=${template.id}`;
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Session Templates"
        subtitle="Pre-built and custom templates for clinical documentation"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => router.back()}
            >
              Back
            </Button>
            <Button
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setEditingTemplate(null);
                setShowBuilder(true);
              }}
            >
              Create Template
            </Button>
          </div>
        }
      />

      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sage/20 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-sage" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">{templates.length}</p>
                  <p className="text-sm text-text-muted">Total Templates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Star className="w-5 h-5 text-amber-600 fill-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">{templates.filter(t => t.isStarred).length}</p>
                  <p className="text-sm text-text-muted">Starred</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">{templates.filter(t => t.isCustom).length}</p>
                  <p className="text-sm text-text-muted">Custom</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">
                    {templates.reduce((sum, t) => sum + t.usageCount, 0)}
                  </p>
                  <p className="text-sm text-text-muted">Total Uses</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-beige rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-sage"
          >
            <option value="all">All Categories</option>
            {Object.entries(categoryInfo).map(([key, info]) => (
              <option key={key} value={key}>{info.label}</option>
            ))}
          </select>
        </div>

        {/* Category Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedCategory === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Button>
          {Object.entries(categoryInfo).map(([key, info]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? 'primary' : 'secondary'}
              size="sm"
              leftIcon={info.icon}
              onClick={() => setSelectedCategory(selectedCategory === key ? 'all' : key)}
              className={selectedCategory === key ? '' : info.color}
            >
              {info.label}
            </Button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTemplates.map(template => (
            <Card
              key={template.id}
              className="hover:shadow-md hover:border-sage transition-all cursor-pointer group relative"
            >
              <CardContent className="pt-6">
                {/* Star Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStar(template.id);
                  }}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <Star className={cn(
                    'w-5 h-5 transition-colors',
                    template.isStarred ? 'fill-amber-500 text-amber-500' : 'text-stone-300 hover:text-amber-500'
                  )} />
                </button>

                {/* Template Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-white', template.color)}>
                    {template.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary line-clamp-1">{template.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={categoryInfo[template.category].color} size="sm">
                        {categoryInfo[template.category].label}
                      </Badge>
                      {template.isCustom && (
                        <Badge variant="default" size="sm">Custom</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-text-secondary line-clamp-2 mb-4">
                  {template.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs text-text-muted mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {template.suggestedDuration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {template.sections.length} sections
                  </span>
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {template.usageCount} uses
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="default" size="sm" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-beige">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => useTemplate(template)}
                  >
                    Use Template
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewingTemplate(template);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateTemplate(template);
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  {template.isCustom && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTemplate(template.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedTemplates.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">No templates found</h3>
              <p className="text-text-secondary mb-4">
                {searchQuery ? 'Try adjusting your search' : 'Create your first custom template'}
              </p>
              <Button
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => setShowBuilder(true)}
              >
                Create Template
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Template Preview Modal */}
      {viewingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setViewingTemplate(null)}
          />

          <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
              <div className="flex items-center gap-4">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-white', viewingTemplate.color)}>
                  {viewingTemplate.icon}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-stone-800">{viewingTemplate.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={categoryInfo[viewingTemplate.category].color} size="sm">
                      {categoryInfo[viewingTemplate.category].label}
                    </Badge>
                    <span className="text-sm text-stone-500">
                      {viewingTemplate.suggestedDuration} min · {viewingTemplate.noteFormat.toUpperCase()} format
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => useTemplate(viewingTemplate)}>
                  Use Template
                </Button>
                <button
                  onClick={() => setViewingTemplate(null)}
                  className="p-2 hover:bg-stone-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-stone-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <p className="text-stone-600 mb-6">{viewingTemplate.description}</p>

              {/* Sections Preview */}
              <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-sage" />
                Template Sections ({viewingTemplate.sections.length})
              </h3>

              <div className="space-y-4">
                {viewingTemplate.sections.map((section, index) => (
                  <Card key={section.id} className="border-l-4 border-l-sage">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-sage text-white text-sm flex items-center justify-center font-medium">
                            {index + 1}
                          </span>
                          <h4 className="font-semibold text-stone-800">{section.title}</h4>
                          {section.required && (
                            <Badge variant="error" size="sm">Required</Badge>
                          )}
                        </div>
                        {section.wordCountGuide && (
                          <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded">
                            {section.wordCountGuide}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-stone-500 mb-3 italic">
                        "{section.placeholder}"
                      </p>

                      {/* AI Prompts */}
                      <div className="bg-sage/5 rounded-lg p-4 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-sage" />
                          <span className="text-sm font-medium text-sage-dark">AI Writing Prompts</span>
                        </div>
                        <ul className="space-y-1">
                          {section.aiPrompts.map((prompt, i) => (
                            <li key={i} className="text-sm text-stone-600 flex items-start gap-2">
                              <ChevronRight className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
                              {prompt}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Clinical Tips */}
                      {section.clinicalTips && (
                        <div className="bg-amber-50 rounded-lg p-3 flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-amber-800">{section.clinicalTips}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200 bg-stone-50">
              <div className="flex flex-wrap gap-2">
                {viewingTemplate.tags.map(tag => (
                  <Badge key={tag} variant="default" size="sm">{tag}</Badge>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  leftIcon={<Copy className="w-4 h-4" />}
                  onClick={() => duplicateTemplate(viewingTemplate)}
                >
                  Duplicate
                </Button>
                <Button
                  leftIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => useTemplate(viewingTemplate)}
                >
                  Use Template
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Builder Modal */}
      {showBuilder && (
        <TemplateBuilder
          existingTemplate={editingTemplate}
          onClose={() => {
            setShowBuilder(false);
            setEditingTemplate(null);
          }}
          onSave={(template) => {
            if (editingTemplate) {
              setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? template : t));
            } else {
              setTemplates(prev => [...prev, template]);
            }
            setShowBuilder(false);
            setEditingTemplate(null);
          }}
        />
      )}
    </div>
  );
}

// Template Builder Component
function TemplateBuilder({
  existingTemplate,
  onClose,
  onSave,
}: {
  existingTemplate: SessionTemplate | null;
  onClose: () => void;
  onSave: (template: SessionTemplate) => void;
}) {
  const [name, setName] = useState(existingTemplate?.name || '');
  const [description, setDescription] = useState(existingTemplate?.description || '');
  const [category, setCategory] = useState<SessionTemplate['category']>(existingTemplate?.category || 'custom');
  const [noteFormat, setNoteFormat] = useState<SessionTemplate['noteFormat']>(existingTemplate?.noteFormat || 'soap');
  const [suggestedDuration, setSuggestedDuration] = useState(existingTemplate?.suggestedDuration || 50);
  const [tags, setTags] = useState<string[]>(existingTemplate?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [sections, setSections] = useState<TemplateSection[]>(existingTemplate?.sections || [
    {
      id: 'section-1',
      title: 'Session Check-In',
      placeholder: 'How is the client presenting today?',
      required: true,
      aiPrompts: ['Current mood and state', 'Changes since last session'],
      clinicalTips: '',
      wordCountGuide: '50-100 words',
    },
  ]);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const addSection = () => {
    const newSection: TemplateSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      placeholder: 'Enter placeholder text...',
      required: false,
      aiPrompts: [],
      clinicalTips: '',
      wordCountGuide: '',
    };
    setSections([...sections, newSection]);
    setEditingSectionId(newSection.id);
  };

  const updateSection = (sectionId: string, updates: Partial<TemplateSection>) => {
    setSections(prev => prev.map(s =>
      s.id === sectionId ? { ...s, ...updates } : s
    ));
  };

  const removeSection = (sectionId: string) => {
    setSections(prev => prev.filter(s => s.id !== sectionId));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < sections.length) {
      [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
      setSections(newSections);
    }
  };

  const handleSave = () => {
    const template: SessionTemplate = {
      id: existingTemplate?.id || `custom-${Date.now()}`,
      name,
      description,
      category,
      icon: <Edit3 className="w-6 h-6" />,
      sections,
      suggestedDuration,
      noteFormat,
      tags,
      isStarred: existingTemplate?.isStarred || false,
      isCustom: true,
      usageCount: existingTemplate?.usageCount || 0,
      lastUsed: existingTemplate?.lastUsed,
      color: 'bg-stone-500',
    };
    onSave(template);
  };

  // AI suggestion templates based on category
  const getAISuggestions = () => {
    const suggestions: Record<string, TemplateSection[]> = {
      intake: [
        { id: 'ai-1', title: 'Presenting Concerns', placeholder: 'Main reasons for seeking treatment...', required: true, aiPrompts: ['What brings the client?', 'Duration of symptoms', 'Impact on functioning'], clinicalTips: 'Use client\'s own words', wordCountGuide: '150-300 words' },
        { id: 'ai-2', title: 'Risk Assessment', placeholder: 'Suicide/self-harm assessment...', required: true, aiPrompts: ['Suicidal ideation', 'Self-harm history', 'Protective factors'], clinicalTips: 'Always ask directly', wordCountGuide: '100-200 words' },
      ],
      crisis: [
        { id: 'ai-1', title: 'Crisis Presentation', placeholder: 'Nature of current crisis...', required: true, aiPrompts: ['What triggered the crisis?', 'Current safety level', 'Support available'], clinicalTips: 'Remain calm and containing', wordCountGuide: '100-200 words' },
        { id: 'ai-2', title: 'Safety Plan', placeholder: 'Collaborative safety plan...', required: true, aiPrompts: ['Warning signs', 'Coping strategies', 'Emergency contacts'], clinicalTips: 'Make collaboratively', wordCountGuide: '150-250 words' },
      ],
      standard: [
        { id: 'ai-1', title: 'Session Check-In', placeholder: 'How has the client been?', required: true, aiPrompts: ['Mood rating', 'Significant events', 'Homework completion'], clinicalTips: 'Start with open questions', wordCountGuide: '50-100 words' },
        { id: 'ai-2', title: 'Session Interventions', placeholder: 'Techniques used...', required: true, aiPrompts: ['Specific interventions', 'Client response', 'Skills practiced'], clinicalTips: 'Document specific techniques', wordCountGuide: '150-300 words' },
      ],
    };
    return suggestions[category] || suggestions.standard;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-5xl max-h-[95vh] mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sage flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-stone-800">
                {existingTemplate ? 'Edit Template' : 'Create New Template'}
              </h2>
              <p className="text-sm text-stone-500">Build a custom documentation template</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-lg transition-colors">
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Template Settings */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Template Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Anxiety Session"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of when to use this template..."
                  className="w-full px-4 py-2 border border-beige rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SessionTemplate['category'])}
                    className="w-full px-4 py-2 border border-beige rounded-lg focus:ring-2 focus:ring-sage"
                  >
                    {Object.entries(categoryInfo).map(([key, info]) => (
                      <option key={key} value={key}>{info.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Note Format</label>
                  <select
                    value={noteFormat}
                    onChange={(e) => setNoteFormat(e.target.value as SessionTemplate['noteFormat'])}
                    className="w-full px-4 py-2 border border-beige rounded-lg focus:ring-2 focus:ring-sage"
                  >
                    <option value="soap">SOAP</option>
                    <option value="dap">DAP</option>
                    <option value="birp">BIRP</option>
                    <option value="narrative">Narrative</option>
                    <option value="structured">Structured</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Duration (minutes)
                </label>
                <Input
                  type="number"
                  value={suggestedDuration}
                  onChange={(e) => setSuggestedDuration(Number(e.target.value))}
                  min={15}
                  max={180}
                  step={5}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag..."
                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button variant="secondary" onClick={addTag}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {tags.map(tag => (
                    <Badge key={tag} variant="default" size="sm" className="flex items-center gap-1">
                      {tag}
                      <button onClick={() => removeTag(tag)}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* AI Suggestions */}
              <div className="bg-sage/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-sage" />
                    <span className="font-medium text-sage-dark">AI Suggestions</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAISuggestions(!showAISuggestions)}
                  >
                    {showAISuggestions ? 'Hide' : 'Show'}
                  </Button>
                </div>
                {showAISuggestions && (
                  <div className="space-y-2">
                    <p className="text-sm text-stone-600 mb-3">
                      Suggested sections for {categoryInfo[category].label} templates:
                    </p>
                    {getAISuggestions().map(suggestion => (
                      <button
                        key={suggestion.id}
                        onClick={() => setSections([...sections, { ...suggestion, id: `section-${Date.now()}` }])}
                        className="w-full text-left p-2 rounded-lg bg-white hover:bg-sage/10 transition-colors border border-sage/20"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-stone-700">{suggestion.title}</span>
                          <Plus className="w-4 h-4 text-sage" />
                        </div>
                        <p className="text-xs text-stone-500 mt-1">{suggestion.placeholder}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Sections Builder */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-stone-800">
                  Template Sections ({sections.length})
                </h3>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={addSection}
                >
                  Add Section
                </Button>
              </div>

              <div className="space-y-3">
                {sections.map((section, index) => (
                  <Card key={section.id} className="border-l-4 border-l-sage">
                    <CardContent className="pt-4">
                      {editingSectionId === section.id ? (
                        // Edit Mode
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Input
                              value={section.title}
                              onChange={(e) => updateSection(section.id, { title: e.target.value })}
                              placeholder="Section title"
                              className="flex-1"
                            />
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={section.required}
                                onChange={(e) => updateSection(section.id, { required: e.target.checked })}
                                className="rounded border-stone-300"
                              />
                              Required
                            </label>
                          </div>

                          <div>
                            <label className="block text-sm text-stone-600 mb-1">Placeholder text</label>
                            <textarea
                              value={section.placeholder}
                              onChange={(e) => updateSection(section.id, { placeholder: e.target.value })}
                              className="w-full px-3 py-2 border border-beige rounded-lg text-sm resize-none"
                              rows={2}
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-stone-600 mb-1">AI Prompts (one per line)</label>
                            <textarea
                              value={section.aiPrompts.join('\n')}
                              onChange={(e) => updateSection(section.id, { aiPrompts: e.target.value.split('\n').filter(p => p.trim()) })}
                              className="w-full px-3 py-2 border border-beige rounded-lg text-sm resize-none"
                              rows={4}
                              placeholder="What questions should the clinician consider?"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-stone-600 mb-1">Clinical Tips</label>
                              <textarea
                                value={section.clinicalTips || ''}
                                onChange={(e) => updateSection(section.id, { clinicalTips: e.target.value })}
                                className="w-full px-3 py-2 border border-beige rounded-lg text-sm resize-none"
                                rows={2}
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-stone-600 mb-1">Word Count Guide</label>
                              <Input
                                value={section.wordCountGuide || ''}
                                onChange={(e) => updateSection(section.id, { wordCountGuide: e.target.value })}
                                placeholder="e.g., 50-100 words"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Button size="sm" onClick={() => setEditingSectionId(null)}>
                              Done Editing
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => moveSection(index, 'up')}
                              disabled={index === 0}
                              className="p-1 hover:bg-stone-100 rounded disabled:opacity-30"
                            >
                              <ChevronRight className="w-4 h-4 -rotate-90" />
                            </button>
                            <GripVertical className="w-4 h-4 text-stone-300" />
                            <button
                              onClick={() => moveSection(index, 'down')}
                              disabled={index === sections.length - 1}
                              className="p-1 hover:bg-stone-100 rounded disabled:opacity-30"
                            >
                              <ChevronRight className="w-4 h-4 rotate-90" />
                            </button>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="w-6 h-6 rounded-full bg-sage text-white text-xs flex items-center justify-center font-medium">
                                {index + 1}
                              </span>
                              <h4 className="font-medium text-stone-800">{section.title}</h4>
                              {section.required && (
                                <Badge variant="error" size="sm">Required</Badge>
                              )}
                            </div>
                            <p className="text-sm text-stone-500 italic">"{section.placeholder}"</p>
                            {section.aiPrompts.length > 0 && (
                              <p className="text-xs text-sage mt-1">
                                {section.aiPrompts.length} AI prompts
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingSectionId(section.id)}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSection(section.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {sections.length === 0 && (
                  <div className="text-center py-8 text-stone-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-stone-300" />
                    <p>No sections yet. Add your first section or use AI suggestions.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200 bg-stone-50">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            leftIcon={<Save className="w-4 h-4" />}
            onClick={handleSave}
            disabled={!name.trim() || sections.length === 0}
          >
            {existingTemplate ? 'Save Changes' : 'Create Template'}
          </Button>
        </div>
      </div>
    </div>
  );
}
