# Project Decisions & Requirements

## Confirmed Requirements

### Business Model
- **Pricing**: Per-clinician subscription model
- **Practice Size**: Solo practitioner first, group practice features in Phase 2
- **Timeline**: Prototype/MVP first, no fixed deadline

### Documentation Features
- **AI Scribe**: Yes, enabled by default with manual override option
- **Note Formats**: Multiple options (SOAP, DAP, BIRP, and others)
- **Flexibility**: Clinician can choose AI-assisted or fully manual

### Dashboard Features
- **Client Demographics**: Show age distribution breakdown
- **At-a-glance view**: Session counts, pending notes, alerts, revenue

---

## MVP Scope (Phase 1)

### Clinician Platform - Must Have

| Feature | Priority | Notes |
|---------|----------|-------|
| AI Scribe (transcription + note generation) | P0 | With manual override |
| Progress Notes (SOAP, DAP, BIRP, narrative) | P0 | Multiple format options |
| Client Profiles | P0 | Demographics, diagnosis, risk status |
| Session Scheduling | P0 | Calendar with reminders |
| Telehealth (video) | P0 | Built-in, HIPAA/APP compliant |
| Risk Assessment | P0 | Quick access, alerts |
| Dashboard with analytics | P0 | Age breakdown, session stats |
| Basic Invoicing | P1 | Generate invoices, track payments |

### Client App - Must Have

| Feature | Priority | Notes |
|---------|----------|-------|
| Mood Check-in | P0 | Daily, quick, visual |
| Safety Plan | P0 | Always accessible, offline |
| Meal Logging | P0 | For eating disorder clients |
| Homework/Exercises | P0 | Thought records, DBT skills |
| Secure Messaging | P0 | Text to clinician |
| Journal | P1 | Free-form writing |
| Progress Tracking | P1 | Visual trends |

### Not in MVP (Phase 2+)

| Feature | Phase | Notes |
|---------|-------|-------|
| Multi-clinician practice management | Phase 2 | After solo validated |
| Medicare claiming integration | Phase 2 | Manual invoicing first |
| NDIS portal integration | Phase 2 | |
| Group therapy features | Phase 2 | |
| Supervision tools | Phase 3 | |
| Advanced analytics/reporting | Phase 3 | |

---

## Technical Decisions

### Architecture
- **Backend**: Supabase (quick MVP, scales later)
- **Clinician Web**: Next.js + React
- **Client Mobile**: React Native + Expo
- **AI**: Whisper (transcription) + Claude (note generation)
- **Video**: Daily.co (HIPAA-compliant)
- **Hosting**: Australian data residency (Sydney region)

### Data Model Priority
1. Users (clinicians, clients)
2. Sessions
3. Clinical notes
4. Assessments
5. Homework assignments
6. Mood/meal logs
7. Messages

---

## User Experience Decisions

### Clinician Platform
- **Primary Device**: Desktop/laptop (web app)
- **Secondary**: Mobile for quick access
- **AI Default**: AI suggestions shown, clinician reviews/edits
- **Manual Option**: Always available, can disable AI entirely

### Client App
- **Primary Device**: Mobile (iOS + Android)
- **Tone**: Warm, supportive, non-clinical language
- **Privacy**: Client chooses what to share with clinician
- **Offline**: Safety plan and grounding exercises always available

---

## Success Metrics (Prototype)

### Clinician
- Documentation time reduced by 50%+
- Note completion same-day rate >90%
- Positive feedback on AI accuracy

### Client
- Daily engagement rate >50%
- Homework completion rate >70%
- Positive feedback on app usability

---

## Open Questions (To Resolve)

1. **Specific eating disorder presentations**: Focus on AN/BN/BED, or include ARFID/OSFED?
2. **Youth age range**: Minimum age for app (8? 10? 12?)
3. **Parent portal**: Include in MVP or Phase 2?
4. **Specific therapeutic homework**: Which DBT/CBT/ACT exercises to prioritize?
5. **Assessment instruments**: Which standardized measures to include first?

---

## Next Steps

1. Review additional note format templates
2. Create wireframe mockups (Figma)
3. Set up Supabase project structure
4. Build clinician dashboard prototype
5. Build client app onboarding flow
