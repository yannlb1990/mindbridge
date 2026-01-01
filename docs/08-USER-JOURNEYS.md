# User Journeys

## Overview
This document outlines key user journeys for both clinicians and clients, identifying touchpoints, pain points, and opportunities for improvement.

---

## Clinician Journeys

### Journey 1: New Client Intake

**Persona**: Dr. Sarah Chen, Clinical Psychologist specializing in eating disorders

**Goal**: Efficiently onboard a new eating disorder client with comprehensive documentation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        NEW CLIENT INTAKE JOURNEY                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  TRIGGER: Referral received from GP                                         │
│                                                                              │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐      │
│  │  1. REFERRAL     │───▶│  2. PRE-INTAKE   │───▶│  3. INTAKE       │      │
│  │     RECEIVED     │    │     PREPARATION  │    │     SESSION      │      │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘      │
│         │                        │                        │                  │
│         ▼                        ▼                        ▼                  │
│  • GP referral letter    • Send client portal   • Conduct assessment        │
│  • MHTP received           invite               • AI scribe active          │
│  • Create client         • Pre-session forms   • Complete MSE               │
│    profile                 auto-sent            • Risk assessment           │
│                          • Review GP notes      • Treatment planning        │
│                                                                              │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐      │
│  │  4. DOCUMENTATION│───▶│  5. CLIENT APP   │───▶│  6. FOLLOW-UP    │      │
│  │     COMPLETION   │    │     SETUP        │    │     SCHEDULED    │      │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘      │
│         │                        │                        │                  │
│         ▼                        ▼                        ▼                  │
│  • AI generates draft   • Generate client     • Book recurring slots        │
│    assessment             invite code         • Set homework                 │
│  • Review & sign        • Assign initial     • Coordinate with GP           │
│  • Treatment plan         exercises          • Dietitian referral           │
│    documented           • Safety plan setup                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Time Target**:
- Pre-session admin: 10 minutes (vs. 30 minutes traditional)
- Post-session documentation: 10 minutes (vs. 45 minutes traditional)

**Pain Points Addressed**:
- ❌ Manual data entry from referral letters
- ❌ Sending forms via email and chasing returns
- ❌ Typing lengthy assessment notes
- ❌ Separate systems for clinical notes and client engagement

---

### Journey 2: Ongoing Telehealth Session

**Persona**: Dr. Sarah Chen, Clinical Psychologist

**Goal**: Conduct effective telehealth session with minimal administrative burden

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TELEHEALTH SESSION JOURNEY                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PRE-SESSION (5 min)                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  • Review client snapshot (auto-populated)                        │       │
│  │  • Check client app activity (homework, mood trends)              │       │
│  │  • Review alerts (PHQ-9 increased, meals missed)                  │       │
│  │  • Prepare session agenda                                         │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  DURING SESSION (50 min)                                                     │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  • One-click join (client also one-click)                         │       │
│  │  • AI scribe records & transcribes (with consent)                 │       │
│  │  • Share worksheets via screen share                              │       │
│  │  • Quick risk check prompt (if flags detected)                    │       │
│  │  • Assign homework during session                                 │       │
│  │  • End session - book next appointment in-flow                    │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  POST-SESSION (10 min)                                                       │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  • Review AI-generated progress note draft                        │       │
│  │  • Edit/approve note                                              │       │
│  │  • Sign off documentation                                         │       │
│  │  • Invoice generated automatically                                │       │
│  │  • Client receives post-session prompt in app                     │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key Features**:
- Session prep takes 5 min, not 15 min
- Note completion in 10 min, not 45 min
- Billing happens automatically
- Client engagement continues between sessions

---

### Journey 3: Managing a Client in Crisis

**Persona**: Dr. Sarah Chen, Clinical Psychologist

**Goal**: Respond effectively to client crisis indication

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CRISIS RESPONSE JOURNEY                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  TRIGGER: System alert - Client flagged crisis in app                        │
│                                                                              │
│  ┌──────────────────┐                                                        │
│  │  1. ALERT        │  • Push notification to clinician                     │
│  │     RECEIVED     │  • Client details immediately visible                 │
│  │                  │  • Last known location (if shared)                    │
│  └────────┬─────────┘                                                        │
│           │                                                                  │
│           ▼                                                                  │
│  ┌──────────────────┐                                                        │
│  │  2. RAPID        │  • One-click call client                              │
│  │     ASSESSMENT   │  • View safety plan                                   │
│  │                  │  • See recent app activity                            │
│  │                  │  • Risk assessment template ready                     │
│  └────────┬─────────┘                                                        │
│           │                                                                  │
│           ├──────────────────────────────────────┐                          │
│           ▼                                      ▼                          │
│  ┌──────────────────┐                   ┌──────────────────┐                │
│  │  3A. DE-ESCALATE │                   │  3B. ESCALATE    │                │
│  │                  │                   │                  │                │
│  │  • Use DBT crisis│                   │  • Contact       │                │
│  │    skills        │                   │    emergency     │                │
│  │  • Update safety │                   │    contact       │                │
│  │    plan          │                   │  • Arrange       │                │
│  │  • Schedule      │                   │    hospital      │                │
│  │    follow-up     │                   │    assessment    │                │
│  │  • Document      │                   │  • Document      │                │
│  │    intervention  │                   │    thoroughly    │                │
│  └──────────────────┘                   └──────────────────┘                │
│                                                                              │
│  ┌──────────────────┐                                                        │
│  │  4. DOCUMENTATION│  • Crisis note auto-drafted                           │
│  │     & FOLLOW-UP  │  • Risk level updated in profile                     │
│  │                  │  • Follow-up reminders set                            │
│  │                  │  • Supervision notification (if configured)           │
│  └──────────────────┘                                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Critical Features**:
- Immediate notification (not just email)
- Quick access to client's safety plan
- One-click calling
- Template for crisis documentation
- Audit trail for compliance

---

## Client Journeys

### Journey 1: Daily App Use (Adult ED Client)

**Persona**: Maya, 24, in treatment for Anorexia Nervosa

**Goal**: Stay engaged with recovery between sessions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DAILY CLIENT ENGAGEMENT JOURNEY                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  MORNING (8:00 AM)                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  📱 Gentle notification: "Good morning Maya. How are you today?"  │       │
│  │                                                                    │       │
│  │  • Opens app                                                       │       │
│  │  • Taps mood (chooses 😕 - Low)                                   │       │
│  │  • Optional: Adds note "Dreading breakfast"                       │       │
│  │  • Sees encouragement: "Thanks for checking in. Remember,         │       │
│  │    mornings can be hard. You've got this."                        │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  BREAKFAST (8:30 AM)                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  📱 Reminder: "Time to log breakfast"                             │       │
│  │                                                                    │       │
│  │  • Logs meal: Oats with banana                                    │       │
│  │  • Before anxiety: 7/10                                           │       │
│  │  • After: 5/10                                                    │       │
│  │  • Urges: Light restriction urge (marked "resisted" ✓)            │       │
│  │  • Optionally shares photo of meal                                │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  LUNCH (12:30 PM)                                                            │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  • Logs lunch with work colleagues                                │       │
│  │  • Notes: "Ate sandwich. Felt self-conscious but managed."        │       │
│  │  • Uses grounding exercise before eating                          │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  AFTERNOON (3:00 PM)                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  • Opens homework: Thought Record assigned by therapist           │       │
│  │  • Completes exercise about lunchtime anxiety                     │       │
│  │  • Feels calmer after identifying balanced thought                │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  EVENING (7:00 PM)                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  • Logs dinner                                                    │       │
│  │  • Writes journal entry: "Hard day but I ate all my meals.        │       │
│  │    Sharing this with my psychologist."                            │       │
│  │  • Reviews progress chart - sees 7-day meal log streak            │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  NIGHT (9:00 PM)                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  📱 Gentle notification: "How was today overall?"                 │       │
│  │                                                                    │       │
│  │  • Rates day: 6/10                                                │       │
│  │  • Gratitude prompt: "Grateful for supportive friend at lunch"   │       │
│  │  • App: "You logged all meals today. That's strength. 💙"         │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Engagement Principles**:
- Gentle, never pushy notifications
- Acknowledges difficulty, celebrates wins
- Client controls sharing with clinician
- Progress visualization motivates

---

### Journey 2: Adolescent Client (Age 14)

**Persona**: Alex, 14, anxious, referred by school counsellor

**Goal**: Engage teenager in mental health support without feeling "clinical"

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        YOUTH ENGAGEMENT JOURNEY                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ONBOARDING                                                                  │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  • Fun, game-like intro "Build your profile"                      │       │
│  │  • Choose avatar/theme                                            │       │
│  │  • Privacy explained in teen-friendly way:                        │       │
│  │    "This is YOUR space. You choose what [Therapist] sees."        │       │
│  │  • Parent link optional (with Alex's consent)                     │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  DAILY CHECK-IN                                                              │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  📱 "Hey Alex! Quick vibe check?"                                 │       │
│  │                                                                    │       │
│  │  Weather metaphor instead of numbers:                             │       │
│  │  🌧️ Stormy  |  ⛅ Cloudy  |  ☀️ Okay  |  🌈 Good  |  ⭐ Great     │       │
│  │                                                                    │       │
│  │  Taps: ⛅ Cloudy                                                  │       │
│  │                                                                    │       │
│  │  "Thanks for sharing. Remember, cloudy days are normal.           │       │
│  │   Want a quick chill-out exercise?" [Yes] [Maybe later]          │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  CHALLENGES (Gamified Homework)                                              │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  🎯 TODAY'S CHALLENGE                                             │       │
│  │                                                                    │       │
│  │  "Worry Catcher" - Catch one worry and write it down             │       │
│  │  ⭐ 15 points                                                     │       │
│  │                                                                    │       │
│  │  [Start Challenge]                                                │       │
│  │                                                                    │       │
│  │  Streak: 🔥 5 days!                                               │       │
│  │  Total points: 245                                                │       │
│  │  Achievements: [Worry Warrior] [Week Strong] [???]               │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  CHILL ZONE (Coping Skills)                                                  │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  🎧 Chill Vibes - Calming audio exercises                         │       │
│  │  🎮 Mini Games - Distraction games                                │       │
│  │  🎨 Create - Drawing/journaling                                   │       │
│  │  💬 Encouragement - Positive quotes                               │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  NEED HELP NOW                                                               │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  Always visible button:                                           │       │
│  │  [💬 I Need Help] → Grounding exercise + helpline numbers         │       │
│  │                     → Option to message therapist                 │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Youth-Specific Design**:
- Gamification without trivializing
- Age-appropriate language
- Autonomy and privacy respected
- Parent involvement is opt-in (with teen's consent)
- Quick, micro-interactions

---

### Journey 3: Client in Crisis

**Persona**: Maya, 24, experiencing crisis moment

**Goal**: Get immediate support and use coping skills

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT CRISIS JOURNEY                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  TRIGGER: Maya is overwhelmed after family argument about eating            │
│                                                                              │
│  ┌──────────────────┐                                                        │
│  │  1. REACHES FOR  │  • Opens app quickly                                  │
│  │     APP          │  • Taps "I Need Help Now" button (always visible)     │
│  └────────┬─────────┘                                                        │
│           │                                                                  │
│           ▼                                                                  │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  2. IMMEDIATE OPTIONS                                              │       │
│  │                                                                    │       │
│  │  "I'm here. What would help right now?"                           │       │
│  │                                                                    │       │
│  │  [🫁 Calm My Body]     → Breathing/grounding exercise             │       │
│  │  [📋 My Safety Plan]  → Opens personalized plan                   │       │
│  │  [💬 Message Therapist] → Secure message                          │       │
│  │  [📞 Talk to Someone]  → Helpline numbers                         │       │
│  │  [🆘 Emergency]        → 000 / Emergency contacts                 │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  Maya taps "Calm My Body"                                                    │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  3. GROUNDING EXERCISE (5-4-3-2-1)                                │       │
│  │                                                                    │       │
│  │  [Audio + Visual Guide]                                           │       │
│  │                                                                    │       │
│  │  "Let's focus on what's around you right now..."                  │       │
│  │                                                                    │       │
│  │  👁️ Name 5 things you can SEE                                    │       │
│  │  [tap to continue]                                                │       │
│  │                                                                    │       │
│  │  👂 Name 4 things you can HEAR                                    │       │
│  │  [tap to continue]                                                │       │
│  │                                                                    │       │
│  │  ... (continues through exercise)                                 │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  4. CHECK-IN AFTER                                                 │       │
│  │                                                                    │       │
│  │  "How are you feeling now?"                                       │       │
│  │                                                                    │       │
│  │  [Still struggling] → More options / Safety plan                  │       │
│  │  [A bit better]     → "That's okay. Want to try something else?" │       │
│  │  [Feeling calmer]   → "I'm glad. You handled that moment. 💙"    │       │
│  │                                                                    │       │
│  │  [Would you like to message your therapist about this?]          │       │
│  │  [Yes, share] [Not right now]                                     │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  If Maya continues to struggle, prompts lead to:                            │
│  • Safety plan review                                                        │
│  • Emergency contact one-tap                                                 │
│  • Direct crisis line connection                                             │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  5. CLINICIAN NOTIFICATION (Optional/Configurable)                │       │
│  │                                                                    │       │
│  │  If client's distress level remains high, clinician receives:     │       │
│  │  • "Maya accessed crisis support at 8:45pm"                       │       │
│  │  • Clinician can see which tools were used                        │       │
│  │  • Option to reach out proactively                                │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Crisis Design Principles**:
- Always accessible (even offline)
- No friction - immediate options
- Multiple pathways based on severity
- Respects autonomy while ensuring safety
- Clinician notified when appropriate

---

## Journey Success Metrics

### Clinician Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Documentation time | <15 min/session | Time tracking |
| Note completion rate | >95% same day | Audit log |
| Session prep time | <5 min | User research |
| Billing accuracy | >99% | Financial reconciliation |

### Client Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Daily engagement | >70% active days | App analytics |
| Homework completion | >80% | Task tracking |
| Mood log consistency | >5 days/week | Check-in data |
| Crisis tool usage | Used in crisis | Feature analytics |
| Satisfaction (NPS) | >50 | Surveys |
