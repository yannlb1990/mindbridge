'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { useLibraryDocuments, type LibraryDocument } from '@/hooks/useLibraryDocuments';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import {
  Book,
  FileText,
  ExternalLink,
  Folder,
  FolderPlus,
  Upload,
  Search,
  Download,
  Eye,
  Trash2,
  Globe,
  GraduationCap,
  Building2,
  Heart,
  Brain,
  Users,
  Star,
  Clock,
  Grid,
  List,
  File,
  FileImage,
  FileVideo,
  Link2,
  X,
  Check,
  Plus,
  Loader2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Copy,
  Share2,
  Printer,
  FileUp,
  CheckCircle,
  FolderOpen,
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'video' | 'link';
  category: string;
  tags: string[];
  size?: string;
  url?: string;
  content?: string; // For demo text content
  starred: boolean;
  uploadedAt: string;
  lastAccessed: string;
}

interface ResourceLink {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  icon: 'government' | 'research' | 'education' | 'clinical' | 'organization';
}

// Demo document contents
const DOCUMENT_CONTENTS: Record<string, string> = {
  'doc-1': `CBT-E Treatment Manual

Enhanced Cognitive Behavior Therapy for Eating Disorders

OVERVIEW
CBT-E is a "transdiagnostic" treatment for all forms of eating disorders. It focuses on the processes that maintain the eating disorder rather than those that caused it.

KEY PRINCIPLES
1. The eating disorder mindset and its maintaining mechanisms
2. Regular eating and addressing dietary restriction
3. Body checking, avoidance, and feeling fat
4. Events, moods, and eating
5. Dietary rules and related behaviors
6. Setbacks and mindsets

PHASE 1: Starting Well (Sessions 1-7)
- Engage the patient in treatment and change
- Create the "formulation" together
- Establish regular eating pattern
- Weekly weighing in session

PHASE 2: Taking Stock (Sessions 8-9)
- Review progress
- Identify barriers to change
- Revise formulation if needed
- Plan Phase 3

PHASE 3: The Main Body of Treatment (Sessions 10-17)
- Address maintaining mechanisms
- Body image concerns
- Events and moods affecting eating
- Dietary rules

PHASE 4: Ending Well (Sessions 18-20)
- Maintain progress
- Minimize risk of relapse
- Plan for the future`,

  'doc-2': `Family-Based Treatment (FBT) Phase 1 Guidelines

PHASE 1: WEIGHT RESTORATION

Goal: Help parents refeed their child and restore weight to healthy levels.

SESSION 1: The Family Meal
- Assess family dynamics around eating
- Observe a meal in session
- Begin empowering parents

KEY TASKS FOR PARENTS:
1. Take charge of all food decisions
2. Sit with child during all meals and snacks
3. Prevent compensatory behaviors
4. Present a united front

THERAPIST ROLE:
- Externalize the eating disorder
- Support parental authority
- Reduce blame and guilt
- Coach parents through refeeding

TYPICAL DURATION: 3-4 months

SUCCESS INDICATORS:
- Steady weight gain (0.5-1kg per week)
- Reduced mealtime distress
- Parents feeling more confident
- Child accepting parental control`,

  'doc-3': `PHQ-9 Scoring Guide

Patient Health Questionnaire-9

SCORING:
0 = Not at all
1 = Several days
2 = More than half the days
3 = Nearly every day

TOTAL SCORE INTERPRETATION:
0-4: Minimal depression
5-9: Mild depression
10-14: Moderate depression
15-19: Moderately severe depression
20-27: Severe depression

QUESTION 9 - SELF-HARM:
Any positive response requires immediate follow-up assessment of suicide risk.

CLINICAL ACTIONS BY SCORE:
- 5-9: Watchful waiting, repeat PHQ-9 at follow-up
- 10-14: Treatment plan, consider counseling and/or medication
- 15-19: Active treatment with pharmacotherapy and/or psychotherapy
- 20-27: Immediate initiation of pharmacotherapy, consider referral

USING PHQ-9 TO MONITOR TREATMENT:
A 50% reduction in score indicates treatment response.
A score of <5 indicates remission.`,

  'doc-4': `GAD-7 Administration Guide

Generalized Anxiety Disorder 7-item Scale

SCORING:
0 = Not at all
1 = Several days
2 = Over half the days
3 = Nearly every day

TOTAL SCORE INTERPRETATION:
0-4: Minimal anxiety
5-9: Mild anxiety
10-14: Moderate anxiety
15-21: Severe anxiety

SUGGESTED TREATMENT THRESHOLDS:
- Score ≥10: Consider active intervention
- Score ≥15: Warrants active treatment

CLINICAL NOTES:
The GAD-7 has good sensitivity (89%) and specificity (82%) for GAD.
It is also reasonably sensitive to panic disorder, social phobia, and PTSD.

ADMINISTRATION:
- Self-report or clinician-administered
- Time frame: Past 2 weeks
- Average completion time: 1-2 minutes`,

  'doc-5': `EDE-Q Interpretation Guide

Eating Disorder Examination Questionnaire

SUBSCALES:
1. Restraint (5 items)
2. Eating Concern (5 items)
3. Shape Concern (8 items)
4. Weight Concern (5 items)

SCORING:
Items rated 0-6 based on frequency or severity
Subscale scores = mean of items
Global score = mean of subscales

COMMUNITY NORMS (Young Adult Women):
- Restraint: M = 1.30, SD = 1.40
- Eating Concern: M = 0.76, SD = 1.06
- Shape Concern: M = 2.23, SD = 1.65
- Weight Concern: M = 1.97, SD = 1.56
- Global: M = 1.55, SD = 1.21

CLINICAL CUTOFFS:
A global score ≥4.0 is typically considered clinically significant.

KEY BEHAVIORAL QUESTIONS (frequency in past 28 days):
- Objective binge episodes
- Self-induced vomiting
- Laxative misuse
- Driven exercise`,

  'doc-6': `Safety Plan Template

CLIENT SAFETY PLAN

Name: _______________________
Date: _______________________

STEP 1: WARNING SIGNS
What thoughts, feelings, or behaviors tell me a crisis may be developing?
1. _______________________
2. _______________________
3. _______________________

STEP 2: INTERNAL COPING STRATEGIES
Things I can do to distract myself without contacting anyone:
1. _______________________
2. _______________________
3. _______________________

STEP 3: SOCIAL CONTACTS FOR DISTRACTION
People and places that can help distract me:
1. Name: _____________ Phone: _____________
2. Name: _____________ Phone: _____________

STEP 4: PEOPLE I CAN ASK FOR HELP
Family or friends who can help during a crisis:
1. Name: _____________ Phone: _____________
2. Name: _____________ Phone: _____________

STEP 5: PROFESSIONAL CONTACTS
Clinician: _____________ Phone: _____________
Emergency: _____________ Phone: _____________
Crisis Line: Lifeline 13 11 14

STEP 6: MAKING THE ENVIRONMENT SAFE
Ways to restrict access to means:
_______________________`,

  'doc-7': `Meal Planning Worksheet

WEEKLY MEAL PLAN

Regular eating means:
- 3 meals per day
- 2-3 snacks per day
- No more than 3-4 hours between eating episodes

MEAL STRUCTURE:

BREAKFAST (within 1 hour of waking):
- Grain/starch: _______
- Protein: _______
- Fruit: _______

MORNING SNACK:
- _______

LUNCH:
- Grain/starch: _______
- Protein: _______
- Vegetables: _______
- Fat: _______

AFTERNOON SNACK:
- _______

DINNER:
- Grain/starch: _______
- Protein: _______
- Vegetables: _______
- Fat: _______

EVENING SNACK (if needed):
- _______

REMEMBER:
- Plan meals in advance
- Keep regular meal times
- Include variety
- Challenge fear foods gradually`,

  'doc-8': `Thought Record Template

COGNITIVE RESTRUCTURING WORKSHEET

DATE: _______

SITUATION:
What happened? Where? When? Who was there?
_______________________

EMOTIONS:
What did you feel? Rate intensity 0-100%
Emotion: _______ Intensity: ____%
Emotion: _______ Intensity: ____%

AUTOMATIC THOUGHTS:
What went through your mind?
_______________________

COGNITIVE DISTORTIONS:
□ All-or-nothing thinking
□ Overgeneralization
□ Mental filter
□ Discounting positives
□ Mind reading
□ Fortune telling
□ Catastrophizing
□ Emotional reasoning
□ Should statements
□ Labeling
□ Personalization

EVIDENCE THAT SUPPORTS THE THOUGHT:
_______________________

EVIDENCE AGAINST THE THOUGHT:
_______________________

BALANCED THOUGHT:
_______________________

OUTCOME:
Re-rate emotions: ____%`,

  'doc-10': `DBT Skills Handbook

DIALECTICAL BEHAVIOR THERAPY SKILLS

MODULE 1: MINDFULNESS
Core Skill: "Wise Mind"
- Reasonable Mind + Emotional Mind = Wise Mind
- "What" skills: Observe, Describe, Participate
- "How" skills: Non-judgmentally, One-mindfully, Effectively

MODULE 2: DISTRESS TOLERANCE
Crisis Survival Skills:
- STOP: Stop, Take a step back, Observe, Proceed mindfully
- TIP: Temperature, Intense exercise, Paced breathing, Paired muscle relaxation
- ACCEPTS: Activities, Contributing, Comparisons, Emotions, Pushing away, Thoughts, Sensations
- Self-soothe with 5 senses
- IMPROVE the moment

MODULE 3: EMOTION REGULATION
- Check the facts
- Opposite action
- Problem solving
- ABC PLEASE: Accumulate positives, Build mastery, Cope ahead, treat PhysicaL illness, balance Eating, avoid mood-Altering substances, balance Sleep, get Exercise

MODULE 4: INTERPERSONAL EFFECTIVENESS
- DEAR MAN: Describe, Express, Assert, Reinforce, Mindful, Appear confident, Negotiate
- GIVE: Gentle, Interested, Validate, Easy manner
- FAST: Fair, no Apologies, Stick to values, Truthful`,
};

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'documents' | 'resources'>('documents');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Document management — backed by useLibraryDocuments hook
  const {
    documents: hookDocs,
    isLoading: docsLoading,
    uploadDocument: hookUpload,
    toggleStar: hookToggleStar,
    deleteDocument: hookDelete,
    updateLastAccessed: hookUpdateLastAccessed,
  } = useLibraryDocuments();

  // Local UI state — mirror of hook data, converted to local Document shape
  const [documents, setDocuments] = useState<Document[]>([]);

  // Sync from hook whenever hook docs change
  useEffect(() => {
    setDocuments(
      hookDocs.map((d) => ({
        id: d.id,
        name: d.name,
        type: d.type,
        category: d.category,
        tags: d.tags,
        size: d.size,
        url: d.url,
        starred: d.starred,
        uploadedAt: d.uploaded_at,
        lastAccessed: d.last_accessed_at,
      }))
    );
  }, [hookDocs]);

  // Modal states
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [folders, setFolders] = useState<string[]>(['Treatment Protocols', 'Assessment Tools', 'Clinical Templates', 'Client Resources']);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Australian mental health resources
  const resourceLinks: ResourceLink[] = [
    {
      id: 'res-1',
      name: 'Australian Institute of Health and Welfare',
      description: 'Mental health data, statistics, and reports for Australia',
      url: 'https://www.aihw.gov.au/mental-health',
      category: 'Government',
      icon: 'government',
    },
    {
      id: 'res-2',
      name: 'Department of Health - Mental Health',
      description: 'Federal mental health policies, programs, and initiatives',
      url: 'https://www.health.gov.au/topics/mental-health',
      category: 'Government',
      icon: 'government',
    },
    {
      id: 'res-3',
      name: 'Head to Health',
      description: 'National mental health digital gateway with resources and services',
      url: 'https://www.headtohealth.gov.au',
      category: 'Government',
      icon: 'government',
    },
    {
      id: 'res-4',
      name: 'RANZCP Clinical Guidelines',
      description: 'Clinical practice guidelines from Royal Australian and New Zealand College of Psychiatrists',
      url: 'https://www.ranzcp.org/clinical-guidelines-publications',
      category: 'Clinical Guidelines',
      icon: 'clinical',
    },
    {
      id: 'res-5',
      name: 'Phoenix Australia',
      description: 'National centre of excellence in posttraumatic mental health',
      url: 'https://www.phoenixaustralia.org',
      category: 'Research',
      icon: 'research',
    },
    {
      id: 'res-6',
      name: 'Orygen',
      description: 'Youth mental health research and clinical care innovation',
      url: 'https://www.orygen.org.au',
      category: 'Research',
      icon: 'research',
    },
    {
      id: 'res-7',
      name: 'Black Dog Institute',
      description: 'Depression and bipolar disorder research and resources',
      url: 'https://www.blackdoginstitute.org.au',
      category: 'Research',
      icon: 'research',
    },
    {
      id: 'res-8',
      name: 'Australian Psychological Society',
      description: 'Peak body for psychologists with practice resources and CPD',
      url: 'https://psychology.org.au',
      category: 'Professional',
      icon: 'organization',
    },
    {
      id: 'res-9',
      name: 'AHPRA - Psychology',
      description: 'Registration and regulatory information for psychologists',
      url: 'https://www.psychologyboard.gov.au',
      category: 'Professional',
      icon: 'organization',
    },
    {
      id: 'res-10',
      name: 'National Eating Disorders Collaboration',
      description: 'Australian eating disorders resources and training',
      url: 'https://nedc.com.au',
      category: 'Eating Disorders',
      icon: 'clinical',
    },
    {
      id: 'res-11',
      name: 'Butterfly Foundation',
      description: 'Eating disorders and body image support and resources',
      url: 'https://butterfly.org.au',
      category: 'Eating Disorders',
      icon: 'organization',
    },
    {
      id: 'res-12',
      name: 'InsideOut Institute',
      description: 'Eating disorders research and translation',
      url: 'https://insideoutinstitute.org.au',
      category: 'Eating Disorders',
      icon: 'research',
    },
    {
      id: 'res-13',
      name: 'headspace',
      description: 'Youth mental health services and resources',
      url: 'https://headspace.org.au',
      category: 'Youth',
      icon: 'organization',
    },
    {
      id: 'res-14',
      name: 'ReachOut Australia',
      description: 'Youth mental health digital resources and peer support',
      url: 'https://au.reachout.com',
      category: 'Youth',
      icon: 'organization',
    },
    {
      id: 'res-15',
      name: 'Mental Health Professionals Network',
      description: 'Free online CPD and professional development',
      url: 'https://www.mhpn.org.au',
      category: 'Education',
      icon: 'education',
    },
    {
      id: 'res-16',
      name: 'eMHPrac',
      description: 'Digital mental health training for practitioners',
      url: 'https://www.emhprac.org.au',
      category: 'Education',
      icon: 'education',
    },
    {
      id: 'res-17',
      name: 'Beyond Blue',
      description: 'Anxiety and depression support and resources',
      url: 'https://www.beyondblue.org.au',
      category: 'General',
      icon: 'organization',
    },
    {
      id: 'res-18',
      name: 'SANE Australia',
      description: 'Complex mental health resources and support',
      url: 'https://www.sane.org',
      category: 'General',
      icon: 'organization',
    },
  ];

  const categories = ['all', ...Array.from(new Set(documents.map(d => d.category)))];
  const resourceCategories = ['all', ...Array.from(new Set(resourceLinks.map(r => r.category)))];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredResources = resourceLinks.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (type: Document['type'], size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClass = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
    switch (type) {
      case 'pdf':
        return <FileText className={`${sizeClass} text-red-500`} />;
      case 'doc':
        return <File className={`${sizeClass} text-blue-500`} />;
      case 'image':
        return <FileImage className={`${sizeClass} text-amber-500`} />;
      case 'video':
        return <FileVideo className={`${sizeClass} text-purple-500`} />;
      case 'link':
        return <Link2 className={`${sizeClass} text-cyan-500`} />;
      default:
        return <File className={`${sizeClass} text-gray-500`} />;
    }
  };

  const getResourceIcon = (icon: ResourceLink['icon']) => {
    switch (icon) {
      case 'government':
        return <Building2 className="w-6 h-6 text-blue-600" />;
      case 'research':
        return <Brain className="w-6 h-6 text-purple-600" />;
      case 'education':
        return <GraduationCap className="w-6 h-6 text-amber-600" />;
      case 'clinical':
        return <Heart className="w-6 h-6 text-red-500" />;
      case 'organization':
        return <Users className="w-6 h-6 text-teal-600" />;
      default:
        return <Globe className="w-6 h-6 text-gray-500" />;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Toggle star — delegate to hook (handles both demo and real users)
  const toggleStar = (docId: string) => {
    hookToggleStar(docId);
  };

  // Delete document — delegate to hook
  const deleteDocument = (docId: string) => {
    hookDelete(docId);
    if (viewingDocument?.id === docId) {
      setViewingDocument(null);
    }
  };

  // Download document (simulated)
  const downloadDocument = (doc: Document) => {
    const content = DOCUMENT_CONTENTS[doc.id] || `Document: ${doc.name}\n\nThis document content would be downloaded.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.name}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Print document
  const printDocument = (doc: Document) => {
    const content = DOCUMENT_CONTENTS[doc.id] || '';
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${doc.name}</title>
            <style>
              body { font-family: system-ui, sans-serif; padding: 40px; line-height: 1.6; }
              h1 { color: #333; border-bottom: 2px solid #4A7C59; padding-bottom: 10px; }
              pre { white-space: pre-wrap; font-family: inherit; }
            </style>
          </head>
          <body>
            <h1>${doc.name}</h1>
            <pre>${content}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Handle file upload — delegate to hook for real users, simulate for demo
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate progress bar
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      for (const file of Array.from(files)) {
        await hookUpload(file, { category: 'Uploads', tags: ['Uploaded'] });
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      clearInterval(interval);
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setShowUploadModal(false);
        setUploadProgress(0);
      }, 400);
    }
  };

  // Create new folder
  const createFolder = () => {
    if (newFolderName.trim() && !folders.includes(newFolderName.trim())) {
      setFolders(prev => [...prev, newFolderName.trim()]);
      setNewFolderName('');
      setShowNewFolderModal(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Knowledge Library"
        subtitle="Documents, resources, and clinical references"
        actions={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              leftIcon={<FolderPlus className="w-4 h-4" />}
              onClick={() => setShowNewFolderModal(true)}
            >
              New Folder
            </Button>
            <Button
              leftIcon={<Upload className="w-4 h-4" />}
              onClick={() => setShowUploadModal(true)}
            >
              Upload
            </Button>
          </div>
        }
      />

      <div className="p-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {
              setActiveTab('documents');
              setSelectedCategory('all');
            }}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
              activeTab === 'documents'
                ? 'bg-sage text-white'
                : 'bg-sand text-text-secondary hover:bg-beige'
            )}
          >
            <Folder className="w-5 h-5" />
            My Documents
          </button>
          <button
            onClick={() => {
              setActiveTab('resources');
              setSelectedCategory('all');
            }}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
              activeTab === 'resources'
                ? 'bg-sage text-white'
                : 'bg-sand text-text-secondary hover:bg-beige'
            )}
          >
            <Globe className="w-5 h-5" />
            Research & Resources
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <Input
              placeholder={activeTab === 'documents' ? 'Search documents...' : 'Search resources...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-beige rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-sage"
            >
              {(activeTab === 'documents' ? categories : resourceCategories).map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            {activeTab === 'documents' && (
              <div className="flex border border-beige rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'grid' ? 'bg-sage text-white' : 'bg-white text-text-muted hover:bg-sand'
                  )}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'list' ? 'bg-sage text-white' : 'bg-white text-text-muted hover:bg-sand'
                  )}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <>
            {/* Loading state */}
            {docsLoading && (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 text-sage animate-spin" />
                <span className="ml-3 text-text-secondary">Loading documents...</span>
              </div>
            )}

            {/* Starred Documents */}
            {!docsLoading && documents.some(d => d.starred) && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  Starred Documents
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {documents.filter(d => d.starred).slice(0, 6).map(doc => (
                    <div
                      key={doc.id}
                      onClick={() => setViewingDocument(doc)}
                      className="p-4 bg-white border border-beige rounded-lg hover:border-sage hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex justify-center mb-3">
                        {getFileIcon(doc.type)}
                      </div>
                      <p className="text-sm font-medium text-text-primary text-center line-clamp-2">
                        {doc.name}
                      </p>
                      <p className="text-xs text-text-muted text-center mt-1">{doc.size}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Documents */}
            {!docsLoading && <h2 className="text-lg font-semibold text-text-primary mb-4">
              All Documents ({filteredDocuments.length})
            </h2>}

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredDocuments.map(doc => (
                  <div
                    key={doc.id}
                    onClick={() => setViewingDocument(doc)}
                    className="p-4 bg-white border border-beige rounded-lg hover:border-sage hover:shadow-md transition-all cursor-pointer group relative"
                  >
                    <button
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(doc.id);
                      }}
                    >
                      <Star className={cn(
                        'w-4 h-4 transition-colors',
                        doc.starred ? 'fill-amber-500 text-amber-500' : 'text-gray-300 hover:text-amber-500'
                      )} />
                    </button>
                    <div className="flex justify-center mb-3">
                      {getFileIcon(doc.type)}
                    </div>
                    <p className="text-sm font-medium text-text-primary text-center line-clamp-2">
                      {doc.name}
                    </p>
                    <p className="text-xs text-text-muted text-center mt-1">{doc.size}</p>
                    <div className="flex flex-wrap justify-center gap-1 mt-2">
                      {doc.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="default" size="sm" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead className="bg-sand">
                      <tr>
                        <th className="text-left p-4 font-medium text-text-secondary">Name</th>
                        <th className="text-left p-4 font-medium text-text-secondary">Category</th>
                        <th className="text-left p-4 font-medium text-text-secondary">Size</th>
                        <th className="text-left p-4 font-medium text-text-secondary">Last Accessed</th>
                        <th className="text-right p-4 font-medium text-text-secondary">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocuments.map(doc => (
                        <tr
                          key={doc.id}
                          className="border-b border-beige hover:bg-sand/50 transition-colors cursor-pointer"
                          onClick={() => setViewingDocument(doc)}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {getFileIcon(doc.type)}
                              <div>
                                <p className="font-medium text-text-primary">{doc.name}</p>
                                <div className="flex gap-1 mt-1">
                                  {doc.tags.slice(0, 3).map(tag => (
                                    <Badge key={tag} variant="default" size="sm" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-text-secondary">{doc.category}</td>
                          <td className="p-4 text-text-secondary">{doc.size}</td>
                          <td className="p-4 text-text-secondary">{formatDate(doc.lastAccessed)}</td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                              <Button variant="ghost" size="sm" onClick={() => setViewingDocument(doc)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => downloadDocument(doc)}>
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => toggleStar(doc.id)}>
                                <Star className={cn(
                                  'w-4 h-4',
                                  doc.starred ? 'fill-amber-500 text-amber-500' : ''
                                )} />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => deleteDocument(doc.id)}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <>
            {/* Category Quick Links */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['Government', 'Research', 'Clinical Guidelines', 'Eating Disorders', 'Youth', 'Education', 'Professional'].map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setSelectedCategory(selectedCategory === cat ? 'all' : cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>

            {/* Resource Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map(resource => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="h-full hover:shadow-md hover:border-sage transition-all cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-sand flex items-center justify-center flex-shrink-0">
                          {getResourceIcon(resource.icon)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-text-primary line-clamp-1">
                              {resource.name}
                            </h3>
                            <ExternalLink className="w-4 h-4 text-text-muted flex-shrink-0" />
                          </div>
                          <Badge variant="default" size="sm" className="mt-1">
                            {resource.category}
                          </Badge>
                          <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                            {resource.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>

            {/* Featured Collections */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Featured Collections</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-sage/10 to-sage/5 border-sage/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Heart className="w-8 h-8 text-sage" />
                      <div>
                        <h3 className="font-semibold text-text-primary">Eating Disorders</h3>
                        <p className="text-sm text-text-muted">4 resources</p>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary">
                      Comprehensive resources for eating disorder assessment, treatment, and support.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="w-8 h-8 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-text-primary">Youth Mental Health</h3>
                        <p className="text-sm text-text-muted">3 resources</p>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary">
                      Specialized resources for children, adolescents, and young adults.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <GraduationCap className="w-8 h-8 text-amber-600" />
                      <div>
                        <h3 className="font-semibold text-text-primary">CPD & Training</h3>
                        <p className="text-sm text-text-muted">2 resources</p>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary">
                      Professional development and continuing education opportunities.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {((activeTab === 'documents' && filteredDocuments.length === 0) ||
          (activeTab === 'resources' && filteredResources.length === 0)) && (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-secondary">No results found for "{searchQuery}"</p>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setViewingDocument(null)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
              <div className="flex items-center gap-3">
                {getFileIcon(viewingDocument.type, 'sm')}
                <div>
                  <h2 className="font-semibold text-stone-800">{viewingDocument.name}</h2>
                  <p className="text-sm text-stone-500">{viewingDocument.category} • {viewingDocument.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleStar(viewingDocument.id)}
                  className="p-2 hover:bg-stone-200 rounded-lg transition-colors"
                  title="Star document"
                >
                  <Star className={cn(
                    'w-5 h-5',
                    viewingDocument.starred ? 'fill-amber-500 text-amber-500' : 'text-stone-400'
                  )} />
                </button>
                <button
                  onClick={() => copyToClipboard(DOCUMENT_CONTENTS[viewingDocument.id] || '')}
                  className="p-2 hover:bg-stone-200 rounded-lg transition-colors"
                  title="Copy content"
                >
                  <Copy className="w-5 h-5 text-stone-600" />
                </button>
                <button
                  onClick={() => printDocument(viewingDocument)}
                  className="p-2 hover:bg-stone-200 rounded-lg transition-colors"
                  title="Print"
                >
                  <Printer className="w-5 h-5 text-stone-600" />
                </button>
                <button
                  onClick={() => downloadDocument(viewingDocument)}
                  className="p-2 hover:bg-stone-200 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5 text-stone-600" />
                </button>
                <button
                  onClick={() => setViewingDocument(null)}
                  className="p-2 hover:bg-stone-200 rounded-lg transition-colors ml-2"
                >
                  <X className="w-5 h-5 text-stone-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-white">
              <div className="max-w-3xl mx-auto">
                <pre className="whitespace-pre-wrap font-sans text-stone-700 leading-relaxed text-base">
                  {DOCUMENT_CONTENTS[viewingDocument.id] || `Document: ${viewingDocument.name}\n\nThis document would contain the full content.`}
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-stone-200 bg-stone-50">
              <div className="flex items-center gap-4 text-sm text-stone-500">
                <span>Uploaded: {formatDate(viewingDocument.uploadedAt)}</span>
                <span>Last accessed: {formatDate(viewingDocument.lastAccessed)}</span>
              </div>
              <div className="flex items-center gap-2">
                {viewingDocument.tags.map(tag => (
                  <Badge key={tag} variant="default" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isUploading && setShowUploadModal(false)}
          />

          <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
              <h2 className="text-xl font-semibold text-stone-800">Upload Documents</h2>
              <button
                onClick={() => !isUploading && setShowUploadModal(false)}
                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                disabled={isUploading}
              >
                <X className="w-5 h-5 text-stone-600" />
              </button>
            </div>

            <div className="p-6">
              {!isUploading ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 rounded-xl p-12 text-center cursor-pointer hover:border-sage hover:bg-sage-50/50 transition-all"
                >
                  <FileUp className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                  <p className="text-stone-600 font-medium mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-stone-500">
                    PDF, DOC, DOCX, Images up to 10MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <Loader2 className="w-12 h-12 text-sage animate-spin mx-auto mb-4" />
                  <p className="text-stone-600 font-medium mb-4">Uploading documents...</p>
                  <div className="w-full bg-stone-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-sage h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-stone-500">{uploadProgress}% complete</p>
                </div>
              )}

              <div className="mt-6">
                <p className="text-sm font-medium text-stone-700 mb-2">Upload to folder:</p>
                <select className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage">
                  {folders.map(folder => (
                    <option key={folder} value={folder}>{folder}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowNewFolderModal(false)}
          />

          <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
              <h2 className="text-xl font-semibold text-stone-800">Create New Folder</h2>
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-stone-600" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <FolderOpen className="w-10 h-10 text-sage" />
                <Input
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && createFolder()}
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setShowNewFolderModal(false)}>
                  Cancel
                </Button>
                <Button onClick={createFolder} disabled={!newFolderName.trim()}>
                  Create Folder
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
