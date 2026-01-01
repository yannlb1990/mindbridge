# Client Platform Specification

## Platform Name: MindBridge Connect

## Design Philosophy
- **Safe Space**: A therapeutic extension, not just an app
- **Non-Clinical Language**: Warm, supportive, accessible
- **Privacy-First**: Client controls what is shared
- **Empowering**: Tools to support recovery between sessions
- **Inclusive**: Accessible to all ages and abilities

---

## App Identity

### Tone of Voice
- Warm and encouraging
- Non-judgmental
- Strength-based
- Hope-oriented
- Age-appropriate options

### Visual Design
- Calming colour palette (soft blues, greens, warm neutrals)
- Clean, uncluttered interface
- Optional dark mode
- Customizable themes (youth: brighter; adults: sophisticated)
- No diet culture imagery or triggering content

---

## Onboarding Flow

### First Launch Experience
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                        🌉 Welcome to MindBridge                     │
│                                                                      │
│                   Your safe space between sessions                   │
│                                                                      │
│       This app was designed to support your mental health           │
│       journey alongside your work with your clinician.              │
│                                                                      │
│       What you share here is private and secure.                    │
│       You choose what your clinician can see.                       │
│                                                                      │
│                      [Let's Get Started]                            │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                        Connect with your clinician                   │
│                                                                      │
│       Enter the code your clinician provided:                       │
│                                                                      │
│                    ┌────────────────────┐                           │
│                    │  MIND-1234-ABCD    │                           │
│                    └────────────────────┘                           │
│                                                                      │
│       Your clinician: Dr. Jane Smith                                │
│       Practice: Melbourne Psychology Centre                          │
│                                                                      │
│                         [Connect]                                    │
│                                                                      │
│       Don't have a code? [Use app independently]                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                        Privacy Settings                              │
│                                                                      │
│       Choose what to share with your clinician:                     │
│                                                                      │
│       ┌─────────────────────────────────────────────┐               │
│       │  ○ Mood check-ins                     [ON]  │               │
│       │  ○ Journal entries                    [ASK] │               │
│       │  ○ Homework completions               [ON]  │               │
│       │  ○ Photos I share                     [ASK] │               │
│       │  ○ Crisis alerts                      [ON]  │               │
│       └─────────────────────────────────────────────┘               │
│                                                                      │
│       [ON] = Always shared                                          │
│       [ASK] = Ask me each time                                      │
│       [OFF] = Never shared (private to me)                          │
│                                                                      │
│       You can change these settings anytime.                        │
│                                                                      │
│                      [Save & Continue]                              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Home Screen

### Main Dashboard (Adult Version)
```
┌─────────────────────────────────────────────────────────────────────┐
│  Good morning, Sarah ☀️                              [Profile] [⚙️]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  HOW ARE YOU FEELING TODAY?                                     ││
│  │                                                                  ││
│  │    😢      😕      😐      🙂      😊                           ││
│  │  Struggling  Low   Neutral   Good   Great                       ││
│  │                                                                  ││
│  │  [Tap to log your mood]                                         ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  YOUR HOMEWORK                                                       │
│  ─────────────                                                       │
│  ┌───────────────────────────────────────────┐                      │
│  │ 📝 Thought Record                         │  Due today          │
│  │    Practice noticing unhelpful thoughts   │  [Start]            │
│  └───────────────────────────────────────────┘                      │
│  ┌───────────────────────────────────────────┐                      │
│  │ 🍽️ Meal Log                               │  Ongoing            │
│  │    Log your meals and feelings            │  [Open]             │
│  └───────────────────────────────────────────┘                      │
│                                                                      │
│  NEXT SESSION                                                        │
│  ────────────                                                        │
│  📅 Thursday 22 Jan, 9:00 AM (Telehealth)                          │
│  with Dr. Jane Smith                                                │
│  [Join Session] [Prepare for Session]                               │
│                                                                      │
│  QUICK ACCESS                                                        │
│  ────────────                                                        │
│  [📓 Journal]  [🎯 My Goals]  [📚 Resources]  [🆘 Safety Plan]     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

│  [Home]    [Journal]    [Exercises]    [Progress]    [More]         │
└─────────────────────────────────────────────────────────────────────┘
```

### Youth Version (Ages 12-17)
```
┌─────────────────────────────────────────────────────────────────────┐
│  Hey Alex! 👋                                        [Me] [⚙️]       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  HOW'S YOUR DAY GOING?                                          ││
│  │                                                                  ││
│  │    🌧️      ⛅      ☀️      🌈      ⭐                           ││
│  │  Stormy  Cloudy   Okay    Good   Amazing                        ││
│  │                                                                  ││
│  │  [Tap to check in]                                              ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  TODAY'S CHALLENGES 🎯                                               │
│  ────────────────────                                                │
│  ┌───────────────────────────────────────────┐                      │
│  │ 🧠 Catch a Worry                          │  ⭐ 10 pts          │
│  │    Write down one worried thought         │  [Let's Go!]        │
│  └───────────────────────────────────────────┘                      │
│                                                                      │
│  YOUR STREAK 🔥                                                      │
│  ─────────────                                                       │
│  7 days of check-ins! Keep it up!                                   │
│  [🏆 View Achievements]                                              │
│                                                                      │
│  NEXT TIME WITH [Clinician Name]                                    │
│  ────────────────────────────────                                    │
│  📅 Thursday at 4:00 PM                                             │
│                                                                      │
│  NEED HELP RIGHT NOW?                                               │
│  [💬 Talk to Someone] ← Always available                            │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Core Features

### 1. Journal & Safe Space

#### Journal Entry Screen
```
┌─────────────────────────────────────────────────────────────────────┐
│  New Journal Entry                               [Save] [Cancel]    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  How are you feeling?                                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 😢 😕 😐 🙂 😊  or  [Choose emotion ▼]                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  What's on your mind?                                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                              │   │
│  │  Today I managed to eat lunch with my friends. It was       │   │
│  │  really hard but I'm proud I did it. The voice in my head   │   │
│  │  was so loud telling me I shouldn't, but I remembered       │   │
│  │  what Dr. Smith said about not letting it control me...     │   │
│  │                                                              │   │
│  │                                                              │   │
│  │                                                              │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  Add more:                                                          │
│  [📷 Photo]  [🎤 Voice Note]  [📍 Location]  [🏷️ Tag]             │
│                                                                      │
│  Privacy for this entry:                                            │
│  ○ Share with my clinician                                          │
│  ● Keep private (just for me)                                       │
│                                                                      │
│  [Prompts & Ideas] ← Tap if you're not sure what to write          │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

#### Journal Prompts
- "What's one thing you're grateful for today?"
- "Describe a moment when you felt strong this week"
- "What would you tell a friend going through what you're experiencing?"
- "What's one small step you took towards your goals?"
- "How did your body feel today?"

---

### 2. Therapeutic Exercises

#### Exercise Library
```
┌─────────────────────────────────────────────────────────────────────┐
│  Exercises & Skills                                     [Search 🔍] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ASSIGNED BY YOUR CLINICIAN                                         │
│  ────────────────────────────                                        │
│  ┌───────────────────────────────────────────┬───────────────────┐  │
│  │ 📝 Thought Record                         │ Due: Today         │  │
│  │    Challenge unhelpful thinking patterns  │ [Start]           │  │
│  └───────────────────────────────────────────┴───────────────────┘  │
│                                                                      │
│  CATEGORIES                                                          │
│  ──────────                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   🧘 Calm    │  │  💭 Thoughts │  │ 💪 Coping    │              │
│  │  & Relaxation│  │   & Feelings │  │   Skills     │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   🍽️ Eating  │  │  🌙 Sleep   │  │ 👥 Social    │              │
│  │   Recovery   │  │    & Rest    │  │   Skills     │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                      │
│  POPULAR EXERCISES                                                   │
│  ─────────────────                                                   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🫁 5-4-3-2-1 Grounding                        5 min  [Start]│   │
│  │ 🌊 Urge Surfing                              10 min  [Start]│   │
│  │ 💜 Self-Compassion Break                       7 min  [Start]│   │
│  │ 🧠 Worry Time                                 15 min  [Start]│   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

#### Exercise: Thought Record (CBT)
```
┌─────────────────────────────────────────────────────────────────────┐
│  Thought Record                                    [Save] [Cancel]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Step 1: The Situation                                              │
│  ─────────────────────                                               │
│  What happened? Where were you? Who was there?                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ I was at dinner with my family. Mum served pasta.          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  Step 2: The Automatic Thought                                      │
│  ─────────────────────────────                                       │
│  What went through your mind?                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ "I can't eat this. It's too many calories. Everyone is      │   │
│  │  watching me. If I eat this, I'll lose control."            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  Step 3: Emotions & Intensity                                       │
│  ────────────────────────────                                        │
│  [Anxious: 8/10] [Guilty: 7/10] [Add emotion +]                    │
│                                                                      │
│  Step 4: Evidence FOR this thought                                  │
│  ─────────────────────────────────                                   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Pasta does have carbs. I have binged before.                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  Step 5: Evidence AGAINST this thought                              │
│  ─────────────────────────────────────                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ I've eaten pasta before without bingeing. My dietitian      │   │
│  │ says pasta is part of balanced eating. Mum isn't watching   │   │
│  │ to judge me, she's trying to help me recover.               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  Step 6: Balanced Thought                                           │
│  ────────────────────────                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ "Eating pasta is part of my recovery. One meal won't        │   │
│  │  change everything. My family supports me, not judges me."  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  How do you feel now?                                               │
│  [Anxious: 5/10] [Hopeful: 4/10]                                   │
│                                                                      │
│                              [Complete ✓]                           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 3. Eating Disorder Tools

#### Meal Log
```
┌─────────────────────────────────────────────────────────────────────┐
│  Meal Log                                          [Today ▼] [➕]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  THURSDAY 15 JAN                                                    │
│  ───────────────                                                     │
│                                                                      │
│  ☀️ BREAKFAST  8:30 AM                               [Edit]         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Oats with banana and milk                                  │   │
│  │                                                              │   │
│  │  Before: 😰 Anxious (7/10)   After: 😌 Okay (4/10)         │   │
│  │  Urges: None                                                 │   │
│  │  Notes: "Ate with family, felt supported"                   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  🌤️ MORNING SNACK  10:30 AM                          [Edit]        │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Apple + handful almonds                                    │   │
│  │                                                              │   │
│  │  Before: 😐 Neutral (5/10)   After: 🙂 Good (3/10)         │   │
│  │  Urges: Light restriction urge (didn't act on it ✓)        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  🌞 LUNCH  12:30 PM                                   [Log Now]     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Not yet logged                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  📊 TODAY'S SUMMARY                                                 │
│  ─────────────────                                                   │
│  Meals logged: 2/5  |  Average anxiety: 5/10  |  Urges resisted: 1 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

#### Add Meal Entry
```
┌─────────────────────────────────────────────────────────────────────┐
│  Log Meal                                          [Save] [Cancel]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Meal Type: [Breakfast ▼]    Time: [12:30 PM]                      │
│                                                                      │
│  What did you eat?                                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Sandwich with ham, cheese, lettuce. Glass of juice.         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  [📷 Add Photo] (optional - for your reference)                    │
│                                                                      │
│  ── BEFORE EATING ──                                                │
│                                                                      │
│  How anxious did you feel? (0 = calm, 10 = extremely anxious)      │
│  [0]──────●──────────────────────────────────────────────[10]      │
│                     6                                               │
│                                                                      │
│  ── AFTER EATING ──                                                 │
│                                                                      │
│  How do you feel now?                                               │
│  [0]──────────●──────────────────────────────────────────[10]      │
│               4                                                     │
│                                                                      │
│  Any urges? (select all that apply)                                │
│  ☐ Restrict  ☐ Purge  ☐ Over-exercise  ☐ Binge  ☐ None            │
│                                                                      │
│  Did you act on urges?                                              │
│  ○ No, I resisted ✓  ○ Partially  ○ Yes                            │
│                                                                      │
│  Notes (optional):                                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Ate with colleagues. Felt self-conscious but managed.       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│                              [Save Entry]                           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 4. Safety Plan (Always Accessible)

```
┌─────────────────────────────────────────────────────────────────────┐
│  🆘 My Safety Plan                                    [Edit] [🔊]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  IF YOU ARE IN IMMEDIATE DANGER:                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │        CALL 000  or  Go to nearest Emergency Dept           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                      │
│  1️⃣ WARNING SIGNS (I might be in crisis when...)                   │
│  ───────────────────────────────────────────                        │
│  • I isolate myself for more than a day                            │
│  • I skip multiple meals                                           │
│  • Thoughts of self-harm increase                                  │
│  • I can't stop crying                                             │
│                                                                      │
│  2️⃣ THINGS I CAN DO TO FEEL BETTER                                 │
│  ─────────────────────────────────                                   │
│  • Go for a walk outside                                           │
│  • Call a friend                                                   │
│  • Listen to my calming playlist 🎵                                │
│  • Use the grounding exercise in this app                          │
│  [Open Grounding Exercise]                                         │
│                                                                      │
│  3️⃣ PEOPLE I CAN CONTACT                                           │
│  ────────────────────────                                            │
│  • Mum - Jane: [📞 0413 456 789]                                   │
│  • Best friend - Emma: [📞 0421 234 567]                           │
│  • Dr. Smith (my psychologist): [📞 03 9876 5432]                  │
│                                                                      │
│  4️⃣ CRISIS HELPLINES                                               │
│  ────────────────────                                                │
│  • Lifeline: [📞 13 11 14] (24/7)                                  │
│  • Butterfly Foundation: [📞 1800 334 673]                         │
│  • Kids Helpline: [📞 1800 55 1800]                                │
│  • Beyond Blue: [📞 1300 22 4636]                                  │
│                                                                      │
│  5️⃣ REASONS I WANT TO LIVE                                         │
│  ──────────────────────────                                          │
│  • My little brother needs me                                      │
│  • I want to see Paris one day                                     │
│  • Recovery is possible - I've seen others do it                   │
│                                                                      │
│  ─────────────────────────────────────────────────────────────────  │
│  ❤️ You matter. This moment will pass.                              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 5. Progress Tracking

#### My Progress Dashboard
```
┌─────────────────────────────────────────────────────────────────────┐
│  My Progress                                        [Last 30 days ▼]│
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  MOOD OVER TIME                                                     │
│  ──────────────                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 😊 10│        ●           ●                                 │   │
│  │     8│   ●        ●           ●    ●                        │   │
│  │     6│        ●        ●           ●    ●    ●              │   │
│  │     4│   ●                               ●         ●        │   │
│  │ 😢  2│                                                      │   │
│  │      └──────────────────────────────────────────────────────│   │
│  │       Week 1      Week 2      Week 3      Week 4            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  WINS THIS MONTH 🏆                                                 │
│  ─────────────────                                                   │
│  ✓ 28 mood check-ins                                               │
│  ✓ 5 thought records completed                                     │
│  ✓ 24/30 days meal logged                                          │
│  ✓ Tried 3 new foods                                               │
│                                                                      │
│  AREAS OF GROWTH                                                    │
│  ───────────────                                                     │
│  • Anxiety before meals: ↓ 7.2 → 5.4 (average)                     │
│  • Urges acted on: ↓ 8 → 3 this month                              │
│  • Journal entries: ↑ Writing more consistently                     │
│                                                                      │
│  LATEST ASSESSMENT SCORES                                           │
│  ────────────────────────                                            │
│  PHQ-9 (Depression): 14 → 11 ↓ improving                           │
│  GAD-7 (Anxiety): 12 → 12 → stable                                 │
│  EDE-Q (Eating): 4.2 → 3.8 ↓ improving                             │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 6. Photo & Media Sharing

#### Share Space
```
┌─────────────────────────────────────────────────────────────────────┐
│  My Shares                                           [➕ Add New]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  This is your private space to capture moments, thoughts,          │
│  and things you want to share with your clinician.                 │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  [📷]          [📝]          [🎤]          [🎨]            │   │
│  │  Photo        Note          Voice         Drawing           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  RECENT SHARES                                                       │
│  ─────────────                                                       │
│  ┌──────────┬──────────┬──────────┐                                │
│  │ [Photo]  │ [Photo]  │ [Photo]  │                                │
│  │ 15 Jan   │ 14 Jan   │ 12 Jan   │                                │
│  │ "Dinner" │ "Art"    │ "Walk"   │                                │
│  │ 🔒Private│ 👁Shared │ 👁Shared │                                │
│  └──────────┴──────────┴──────────┘                                │
│                                                                      │
│  CATEGORIES                                                         │
│  ──────────                                                          │
│  [All] [Meals 🍽️] [Moments ✨] [Art 🎨] [Recovery Wins 🏆]         │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Accessibility Features

### Reading & Visual
- Font size adjustment (4 levels)
- Dyslexia-friendly font option (OpenDyslexic)
- High contrast mode
- Dark mode
- Screen reader compatibility (VoiceOver/TalkBack)

### Interaction
- Voice input for all text fields
- Large touch targets
- Simplified navigation mode
- Reduce motion option

### Language
- Plain English mode
- Reading level adjustment (accessible for ages 10+)
- Audio instructions for exercises

---

## Notification Strategy

### Gentle Reminders (Configurable)
- "Time for your daily check-in 💙"
- "You have a homework exercise waiting"
- "Your session with [Clinician] is tomorrow"
- "Haven't seen you in a while. Everything okay?"

### Critical Alerts
- "Your clinician sent you a message"
- "[Session starting in 15 minutes]"

### Never
- Guilt-inducing language
- Tracking streak pressure
- Comparison with others
- Diet/weight-related notifications

---

## Offline Capability

### Always Available Offline
- Safety plan
- Grounding exercises
- Journal (syncs when online)
- Crisis numbers
- Last session summary

### Requires Internet
- Syncing with clinician
- Video sessions
- Sending messages
- Assessment submissions
