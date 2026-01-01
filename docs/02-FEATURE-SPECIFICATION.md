# Feature Specification Document

## Overview
This document outlines all features for the MindBridge platform, organized by platform component and priority.

---

## Priority Legend
- **P0**: Must-have for MVP launch
- **P1**: High priority, Phase 2
- **P2**: Medium priority, Phase 3
- **P3**: Nice-to-have, future roadmap

---

## A. Clinician Platform Features

### A1. AI-Powered Clinical Documentation (P0)

#### A1.1 Session Transcription
- Real-time transcription during telehealth sessions
- Support for in-person sessions via mobile app
- Multi-speaker identification (clinician vs client)
- Australian English optimisation
- Support for therapeutic silence (doesn't force speech)
- Configurable sensitivity for mental health content

#### A1.2 Progress Note Generation
- **SOAP Notes** (Subjective, Objective, Assessment, Plan)
- **DAP Notes** (Data, Assessment, Plan)
- **BIRP Notes** (Behavior, Intervention, Response, Plan)
- **Mental Status Examination (MSE)** structured format
- **Risk Assessment** documentation
- Custom template creation
- Learn clinician's writing style over time

#### A1.3 Eating Disorder-Specific Documentation
- Meal log summaries from client app
- Weight/vitals tracking (if shared by client)
- Behavioural observation notes (restriction, purging, bingeing)
- Medical risk indicators
- FBT (Family-Based Treatment) session notes
- SSCM (Specialist Supportive Clinical Management) templates

#### A1.4 Youth-Specific Documentation
- Developmental stage considerations
- Parent/guardian session notes
- School liaison correspondence
- NDIS report templates
- Child-friendly language options
- Collaborative goal documentation

---

### A2. Clinical Templates Library (P0)

#### A2.1 Assessment Templates
- Initial Psychological Assessment
- Eating Disorder Assessment (EDE-Q integration)
- Child & Adolescent Assessment
- Risk Assessment (suicide, self-harm, harm to others)
- Mental Status Examination
- Diagnostic Formulation (DSM-5-TR/ICD-11)

#### A2.2 Treatment Planning
- CBT Treatment Plan
- DBT Treatment Plan (including stage assignment)
- ACT-based Treatment Plan
- FBT Treatment Protocol
- EMDR Phase Planning
- Relapse Prevention Plan

#### A2.3 Progress Note Templates
- Individual Therapy Session
- Group Therapy Session
- Family Therapy Session
- Crisis Intervention
- Telehealth Session Note
- Phone/Email Contact Log

#### A2.4 Correspondence Templates
- GP Referral Letter
- Psychiatrist Referral
- School Psychologist Letter
- NDIS Report
- Court/Legal Report
- Medicare Mental Health Treatment Plan
- Review of Mental Health Treatment Plan

#### A2.5 Discharge & Outcome
- Discharge Summary
- Treatment Outcome Summary
- Transfer of Care Letter
- Client Feedback Request

---

### A3. Practice Management (P0)

#### A3.1 Scheduling
- Calendar management with recurring appointments
- Buffer time between sessions (configurable)
- Automatic timezone handling
- Multi-location support
- Group session scheduling
- Family session coordination

#### A3.2 Client Management
- Comprehensive client profiles
- Contact details with emergency contacts
- Referral source tracking
- Presenting concerns summary
- Diagnosis history
- Medication list (if provided)
- Treatment history timeline

#### A3.3 Reminders & Communication
- SMS appointment reminders
- Email confirmations
- Customizable reminder intervals
- Two-way SMS (with conversation logging)
- Secure messaging portal
- Document sharing

#### A3.4 Billing & Invoicing
- Session fee management
- Invoice generation (ABN, GST compliant)
- Medicare bulk billing / rebate claiming
- NDIS invoicing support
- Private health fund integration
- Overdue payment tracking
- Stripe/PayPal payment processing

---

### A4. Telehealth Integration (P0)

#### A4.1 Video Consultation
- Built-in HIPAA/APP-compliant video
- Screen sharing for worksheets
- Virtual whiteboard
- Session recording (with consent)
- Waiting room with custom messaging
- One-click join for clients

#### A4.2 Session Tools
- In-session timer
- Break reminders for lengthy sessions
- Quick note-taking sidebar
- Real-time transcription display
- Emotion/affect observation prompts

---

### A5. Clinical Decision Support (P1)

#### A5.1 Risk Monitoring
- Automated risk flags from client app data
- PHQ-9, GAD-7, K10 score trending
- Eating disorder behaviour pattern detection
- Missed appointment alerts
- Deterioration warnings

#### A5.2 Treatment Guidance
- Evidence-based intervention suggestions
- Session agenda recommendations
- Homework completion tracking
- Outcome measure scheduling
- Treatment protocol adherence

---

### A6. Supervision & Training (P2)

#### A6.1 Clinical Supervision
- Supervision session documentation
- Case presentation templates
- Competency tracking
- Supervision hour logging
- Video review for supervisees

#### A6.2 Professional Development
- CPD tracking
- Webinar/training integration
- Peer consultation logging

---

## B. Client Platform Features

### B1. Safe Sharing Space (P0)

#### B1.1 Journal & Reflection
- Daily mood journal with prompts
- Thought record (CBT)
- Gratitude journal
- Free-form writing
- Voice memos (for non-writers)
- Photo/image uploads with captions

#### B1.2 Photo Sharing
- Secure photo upload
- Photo journal with timeline
- Optional sharing with clinician
- Private-only option
- Image categories (meals, art, moments, etc.)

#### B1.3 Thought & Feeling Tracking
- Emotion wheel selection
- Intensity rating (0-10)
- Trigger identification
- Coping strategy used
- Outcome reflection

---

### B2. Therapeutic Homework (P0)

#### B2.1 Assignment System
- Clinician-assigned activities
- Due date reminders
- Progress tracking
- Completion confirmation
- Client feedback on exercises

#### B2.2 CBT Exercises
- Thought Records (7-column)
- Cognitive Restructuring worksheets
- Behavioural Experiments
- Activity Scheduling
- Exposure Hierarchy tracking

#### B2.3 DBT Skills
- Diary Card (digital)
- TIPP Skills guide
- Wise Mind exercises
- DEARMAN practice
- GIVE/FAST skills
- Crisis Survival toolkit
- Mindfulness exercises (audio)

#### B2.4 ACT Exercises
- Values clarification
- Defusion techniques
- Present moment awareness
- Committed action planning
- Acceptance exercises

#### B2.5 Eating Disorder-Specific
- Meal logging (Recovery Record style)
- Urge surfing exercises
- Body image journaling
- Feared food hierarchy
- Meal plan adherence tracking
- Pre/post meal check-in
- Behavioural chain analysis

#### B2.6 Youth-Adapted Exercises
- Age-appropriate language
- Gamification elements
- Visual/interactive worksheets
- Parent collaboration activities
- School situation problem-solving

---

### B3. Wellbeing Tracking (P0)

#### B3.1 Mood & Symptom Tracking
- Daily mood check-in
- Sleep quality/duration
- Anxiety levels
- Energy levels
- Social connection
- Physical symptoms

#### B3.2 Standardized Assessments
- PHQ-9 (Depression)
- GAD-7 (Anxiety)
- K10 (Psychological Distress)
- EDE-Q (Eating Disorders)
- RCADS (Children/Adolescents)
- SDQ (Strengths & Difficulties)
- DASS-21

#### B3.3 Progress Visualization
- Trend graphs over time
- Weekly/monthly summaries
- Goal progress tracking
- Celebration of milestones

---

### B4. Crisis Support (P0)

#### B4.1 Safety Planning
- Digital safety plan (accessible offline)
- Warning signs list
- Coping strategies quick access
- Support contacts (personal)
- Professional contacts
- Crisis services (auto-populated Australian services)

#### B4.2 In-App Crisis Features
- "I need help now" button
- Grounding exercises
- Distraction toolkit
- Direct line to clinician (if enabled)
- Emergency services information

---

### B5. Communication (P1)

#### B5.1 Secure Messaging
- Text messages to clinician
- Photo/file sharing
- Read receipts
- Response time expectations
- Urgent flag option

#### B5.2 Appointment Management
- View upcoming sessions
- Request appointment changes
- Telehealth session join
- Pre-session preparation prompts
- Post-session reflection prompts

---

### B6. Library & Resources (P1)

#### B6.1 Psychoeducation
- Condition-specific information
- Treatment approach explanations
- Skill guides (DBT, CBT, etc.)
- Audio relaxation/meditation
- Video content

#### B6.2 Clinician-Curated Content
- Assigned reading/watching
- Personalized resource library
- External link curation

---

## C. Admin & Multi-Practice Features (P2)

### C1. Practice Administration
- Multi-clinician management
- Role-based permissions
- Practice-wide reporting
- Template library management
- Billing oversight
- Waitlist management

### C2. Analytics & Reporting
- Session statistics
- Revenue reporting
- Client outcome tracking
- Clinician productivity
- Practice KPIs

---

## D. Integration Requirements (P1)

### D1. Healthcare Integrations
- Medicare Online (AU)
- DVA claiming
- NDIS portal
- PRODA authentication
- My Health Record (view)

### D2. Third-Party Integrations
- Xero / MYOB accounting
- Stripe payments
- Twilio SMS
- Zoom (backup telehealth)
- Google Calendar sync
- Outlook Calendar sync

### D3. API & Exports
- FHIR-compatible exports
- PDF report generation
- CSV data export
- Secure backup/restore

---

## E. Accessibility Requirements (P0)

### E1. WCAG 2.1 AA Compliance
- Screen reader compatibility
- Keyboard navigation
- High contrast mode
- Font size adjustment
- Dyslexia-friendly font option

### E2. Language & Literacy
- Plain English options
- Reading level adjustment
- Voice input alternatives
- Visual/icon-based navigation

---

## F. Mobile Considerations

### F1. Clinician Mobile App
- Quick note capture
- Appointment view
- Session timer
- Client quick-view
- Notifications

### F2. Client Mobile App (Primary)
- Full feature parity with above
- Offline capability for:
  - Safety plan
  - Grounding exercises
  - Journal entries (sync later)
- Push notifications
- Widget for daily check-in
