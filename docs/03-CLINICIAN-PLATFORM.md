# Clinician Platform Specification

## Platform Name: MindBridge Clinician

## Design Philosophy
- **Efficiency First**: Reduce administrative burden, maximize clinical time
- **Clinical Language**: Use proper psychological terminology
- **Flexible Documentation**: Support multiple theoretical orientations
- **Intelligent Assistance**: AI that enhances, never replaces, clinical judgment
- **One-Click Actions**: Minimize clicks for common tasks

---

## Dashboard Overview

### Main Dashboard Layout
```
┌─────────────────────────────────────────────────────────────────────┐
│  MindBridge Clinician                    [Search] [Notifications] [Profile]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │ TODAY'S     │  │ PENDING     │  │ CLIENT      │  │ BILLING     │  │
│  │ SESSIONS    │  │ NOTES       │  │ ALERTS      │  │ DUE         │  │
│  │     5       │  │     3       │  │     2       │  │   $1,240    │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │
│                                                                       │
│  ┌─────────────────────────────────┬─────────────────────────────┐  │
│  │  TODAY'S SCHEDULE               │  QUICK ACTIONS              │  │
│  │  ──────────────────             │  ────────────               │  │
│  │  09:00 Sarah M. (Telehealth)    │  [+ New Client]             │  │
│  │  10:00 James T. (In-person)     │  [+ Quick Note]             │  │
│  │  11:30 Chen Family (Family)     │  [Start Session]            │  │
│  │  14:00 Alex R. (Initial)        │  [View Waitlist]            │  │
│  │  15:30 Dr. Smith (Supervision)  │  [Generate Report]          │  │
│  │                                  │                             │  │
│  └─────────────────────────────────┴─────────────────────────────┘  │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  CLIENT ALERTS                                                   │ │
│  │  ────────────                                                    │ │
│  │  ⚠️  Sarah M. - PHQ-9 score increased 8→14 (moderate→mod-severe)│ │
│  │  ⚠️  James T. - 3 missed homework assignments                    │ │
│  │  ✓  Alex R. - Safety plan completed                              │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Core Modules

### 1. Session Management

#### Pre-Session View
```
┌─────────────────────────────────────────────────────────────────────┐
│  UPCOMING SESSION: Sarah M.                              [Start Now]│
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  CLIENT SNAPSHOT                    │  SESSION PREP                  │
│  ─────────────────                  │  ────────────                  │
│  Age: 24 | F | Presenting: AN-R    │  Last Session: 12 Dec 2025    │
│  Sessions: 14 | Since: Sep 2025    │  Duration: 55 min             │
│  Risk: Moderate (medical)          │                                │
│                                     │  Treatment Plan:              │
│  Current Diagnoses:                 │  • FBT Phase 2                │
│  • Anorexia Nervosa, Restricting   │  • Weight restoration focus   │
│  • GAD (comorbid)                   │  • Family meals 5x/week       │
│                                     │                                │
│  RECENT ALERTS                      │  HOMEWORK STATUS               │
│  ─────────────                      │  ──────────────               │
│  • BMI: 16.2 (↓ from 16.8)         │  ✓ Meal log completed         │
│  • Missed meal yesterday            │  ✓ Anxiety thought record     │
│  • PHQ-9: 14 (moderate-severe)      │  ○ Exposure task (pending)    │
│                                     │                                │
│  LAST SESSION SUMMARY               │  CLIENT APP ACTIVITY          │
│  ────────────────────               │  ───────────────────          │
│  Discussed meal anxiety. Family     │  Journal entries: 5           │
│  reported resistance at dinner.     │  Photo shares: 3              │
│  Introduced SUDS for exposure.      │  Mood logs: 7/7 days          │
│  Goal: Complete one feared food.    │  Last active: 2 hours ago     │
│                                     │                                │
└─────────────────────────────────────────────────────────────────────┘
```

#### During Session (Telehealth)
```
┌─────────────────────────────────────────────────────────────────────┐
│  SESSION IN PROGRESS: Sarah M.                    [Timer: 32:15]    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌───────────────────────────────────┬───────────────────────────┐  │
│  │                                   │  AI SCRIBE                 │  │
│  │      [VIDEO FEED]                 │  ──────────                │  │
│  │                                   │  🔴 Recording              │  │
│  │                                   │                            │  │
│  │                                   │  S: "I managed to eat      │  │
│  │                                   │  the pasta yesterday but   │  │
│  │                                   │  I felt so guilty after.   │  │
│  │                                   │  I wanted to exercise but  │  │
│  │                                   │  remembered what we said." │  │
│  │                                   │                            │  │
│  │                                   │  [Key themes detected:]    │  │
│  │                                   │  • Food guilt ✓            │  │
│  │                                   │  • Compensatory urge       │  │
│  │                                   │  • Used coping strategy ✓  │  │
│  └───────────────────────────────────┴───────────────────────────┘  │
│                                                                      │
│  QUICK TOOLS                                                         │
│  ───────────                                                         │
│  [Share Worksheet] [Whiteboard] [MSE Prompt] [Risk Check] [End]     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 2. Documentation Centre

#### Note Creation (Post-Session)
```
┌─────────────────────────────────────────────────────────────────────┐
│  PROGRESS NOTE: Sarah M. - 15 Jan 2026                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Template: [DAP ▼]    Duration: [55 min]    Mode: [Telehealth ▼]   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  🤖 AI GENERATED DRAFT (Review Required)          [Regenerate] ││
│  ├─────────────────────────────────────────────────────────────────┤│
│  │                                                                  ││
│  │  DATA:                                                           ││
│  │  Client presented for scheduled telehealth session. Reported    ││
│  │  successfully completing feared food exposure (pasta) at family ││
│  │  dinner. Noted significant guilt post-meal with urge to engage  ││
│  │  in compensatory exercise. Client utilized coping strategies    ││
│  │  discussed in previous session (distraction, self-talk) to      ││
│  │  resist urge. Mood appeared brighter than previous session.     ││
│  │  Affect congruent. Speech normal rate and rhythm.               ││
│  │                                                                  ││
│  │  Meal log reviewed: 4/5 days complete. One missed entry noted   ││
│  │  on Wednesday - client reported "forgot" but acknowledged       ││
│  │  avoidance pattern when stressed.                                ││
│  │                                                                  ││
│  │  ASSESSMENT:                                                     ││
│  │  Progress towards treatment goals evident. Client demonstrating ││
│  │  increased willingness to challenge ED cognitions. Guilt        ││
│  │  response remains significant but impulse control improving.    ││
│  │  Risk level maintained at moderate (medical).                   ││
│  │                                                                  ││
│  │  PLAN:                                                           ││
│  │  1. Continue weekly sessions (FBT Phase 2 protocol)             ││
│  │  2. Assign: Two feared food exposures before next session       ││
│  │  3. Introduce post-meal coping card                             ││
│  │  4. Liaise with dietitian re: meal plan adjustment              ││
│  │  5. Next session: 22 Jan 2026, 09:00                            ││
│  │                                                                  ││
│  │  MSE Summary: [Auto-filled, click to expand]                    ││
│  │  Risk Assessment: [Moderate - Medical] [Review]                 ││
│  │                                                                  ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  [Edit Draft] [Add to Note] [Insert Template Section]               │
│                                                                      │
│  Clinician Signature: Dr. Jane Smith (Registered Psychologist)     │
│                                                                      │
│  [Save Draft] [Sign & Complete] [Generate Referral]                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 3. Client Management

#### Client Profile
```
┌─────────────────────────────────────────────────────────────────────┐
│  CLIENT PROFILE: Sarah Mitchell                    [Edit] [Archive] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  DEMOGRAPHICS              │  CLINICAL SUMMARY                      │
│  ────────────              │  ────────────────                      │
│  DOB: 15/03/2001 (24 yrs)  │  Primary Dx: Anorexia Nervosa (F50.01) │
│  Gender: Female            │  - Restricting type                    │
│  Pronouns: She/Her         │  - Current episode: Moderate           │
│  Aboriginal/TSI: No        │                                        │
│                            │  Secondary Dx: GAD (F41.1)             │
│  CONTACT                   │                                        │
│  ───────                   │  Treatment Approach:                   │
│  📱 0412 345 678           │  • FBT (Modified for adult)            │
│  ✉️  sarah.m@email.com     │  • CBT-E components                    │
│  🏠 123 Example St,        │  • Medical monitoring                  │
│     Melbourne VIC 3000     │                                        │
│                            │  Risk Status: MODERATE                 │
│  EMERGENCY CONTACT         │  Last reviewed: 15 Jan 2026            │
│  ─────────────────         │                                        │
│  Parent: Jane Mitchell     │  OUTCOME MEASURES                      │
│  📱 0413 456 789           │  ─────────────────                     │
│  Relationship: Mother      │  PHQ-9: 14 ↑ (was 8)                   │
│                            │  GAD-7: 12 → (stable)                  │
│  REFERRER                  │  EDE-Q: 4.2 ↓ (was 4.8)               │
│  ────────                  │  BMI: 16.2 ↓ (was 16.8)               │
│  Dr. Michael Chen (GP)     │                                        │
│  Central Medical Practice  │                                        │
│  Ref: MHTP - 10 sessions   │                                        │
│  Started: 15 Sep 2025      │                                        │
│                            │                                        │
├─────────────────────────────────────────────────────────────────────┤
│  TABS: [Timeline] [Notes] [Assessments] [Documents] [Billing]       │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 4. Template Library

#### Template Categories
- **Assessment Templates**
  - Initial Assessment (Adult)
  - Initial Assessment (Child/Adolescent)
  - Eating Disorder Assessment
  - Risk Assessment
  - Mental Status Examination

- **Progress Notes**
  - SOAP Note
  - DAP Note
  - BIRP Note
  - Brief Contact Note
  - Crisis Intervention Note

- **Treatment Plans**
  - CBT Treatment Plan
  - DBT Treatment Plan
  - FBT Treatment Plan
  - EMDR Protocol Plan

- **Correspondence**
  - GP Report
  - Psychiatrist Referral
  - NDIS Report
  - School Letter
  - Court Report

- **Medicare/Billing**
  - Mental Health Treatment Plan
  - Review of MHTP
  - GP Shared Care Plan

---

### 5. Homework Assignment

#### Assign Homework Interface
```
┌─────────────────────────────────────────────────────────────────────┐
│  ASSIGN HOMEWORK: Sarah M.                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  EXERCISE LIBRARY                    │  CURRENT ASSIGNMENTS         │
│  ────────────────                    │  ───────────────────         │
│  [Search exercises...]               │                              │
│                                       │  ✓ Meal Log (ongoing)        │
│  Categories:                          │  ✓ Thought Record (weekly)   │
│  ├─ CBT                               │  ○ Feared Food Exposure x2   │
│  │  ├─ Thought Records                │    Due: 22 Jan 2026         │
│  │  ├─ Behavioural Experiments        │                              │
│  │  └─ Activity Scheduling            │                              │
│  ├─ DBT                               │  QUICK ASSIGN                │
│  │  ├─ Diary Card                     │  ──────────────              │
│  │  ├─ TIPP Skills                    │  [+ Meal Log]                │
│  │  └─ Mindfulness                    │  [+ Mood Tracking]           │
│  ├─ Eating Disorder                   │  [+ Thought Record]          │
│  │  ├─ Meal Logging                   │  [+ Custom Exercise]         │
│  │  ├─ Urge Surfing                   │                              │
│  │  ├─ Body Image Journal             │                              │
│  │  └─ Exposure Tasks                 │                              │
│  ├─ ACT                               │                              │
│  │  ├─ Values Clarification           │                              │
│  │  └─ Defusion Exercises             │                              │
│  └─ Relaxation                        │                              │
│     ├─ Progressive Muscle             │                              │
│     ├─ Breathing Exercises            │                              │
│     └─ Guided Imagery                 │                              │
│                                       │                              │
│  [Preview] [Customize] [Assign]       │                              │
│                                       │                              │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 6. Client App Activity Monitor

#### Client Engagement View
```
┌─────────────────────────────────────────────────────────────────────┐
│  CLIENT APP ACTIVITY: Sarah M.                  [Last 7 days ▼]     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ENGAGEMENT OVERVIEW                                                 │
│  ───────────────────                                                 │
│  App opens: 12 | Journal entries: 5 | Homework: 3/4 complete        │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  MOOD TREND                                                    │  │
│  │  ──────────                                                    │  │
│  │   10│                                                          │  │
│  │    8│              ●                                           │  │
│  │    6│    ●    ●         ●    ●                                │  │
│  │    4│         ●              ●    ●                           │  │
│  │    2│                                                          │  │
│  │     └────────────────────────────────────                      │  │
│  │      Mon  Tue  Wed  Thu  Fri  Sat  Sun                        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  JOURNAL ENTRIES (Shared)                                           │
│  ────────────────────────                                           │
│  📝 15 Jan: "Feeling proud of myself for eating pasta..."          │
│  📝 14 Jan: "Bad day. Couldn't stop thinking about calories..."    │
│  📝 12 Jan: "Mum was supportive at dinner tonight..."              │
│  [View All]                                                         │
│                                                                      │
│  SHARED PHOTOS                                                       │
│  ─────────────                                                       │
│  🖼️ 14 Jan: "My dinner - tried the new meal plan" [View]           │
│  🖼️ 12 Jan: "Art therapy - how I see recovery" [View]              │
│  [View All]                                                         │
│                                                                      │
│  HOMEWORK STATUS                                                     │
│  ──────────────                                                      │
│  ✓ Meal Log: 5/7 days completed                                     │
│  ✓ Thought Record: Submitted 13 Jan                                 │
│  ○ Feared Food Exposure: 1/2 completed                              │
│  ○ Urge Surfing Practice: Not started                               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Navigation Structure

### Primary Navigation (Sidebar)
1. **Dashboard** - Overview and alerts
2. **Calendar** - Schedule management
3. **Clients** - Client list and profiles
4. **Sessions** - Active and past sessions
5. **Documents** - Notes, reports, templates
6. **Billing** - Invoices, Medicare, NDIS
7. **Templates** - Template library
8. **Reports** - Analytics and outcomes
9. **Settings** - Account and preferences

### Secondary Navigation (Top Bar)
- Global search
- Notifications
- Quick actions
- Profile/logout

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| New client | Ctrl/Cmd + N |
| Quick note | Ctrl/Cmd + Shift + N |
| Search | Ctrl/Cmd + K |
| Today's schedule | Ctrl/Cmd + T |
| Start session | Ctrl/Cmd + S |
| Save document | Ctrl/Cmd + S |

---

## Responsive Design

### Desktop (Primary)
- Full feature access
- Multi-panel layouts
- Side-by-side comparison

### Tablet
- Simplified navigation
- Single-panel focus
- Touch-optimized buttons

### Mobile (Companion)
- Quick view only
- Session start/end
- Urgent notifications
- Basic note capture
