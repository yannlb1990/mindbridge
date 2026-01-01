# Technical Stack Recommendation

## Overview
This document outlines the recommended technology stack for MindBridge, prioritizing:
- Australian data sovereignty
- Healthcare-grade security
- Scalability and performance
- Developer productivity
- Cost efficiency

---

## Architecture Summary

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENTS                                        │
├─────────────────┬─────────────────┬─────────────────┬───────────────────┤
│  Web Browser    │  iOS App        │  Android App    │  Admin Portal     │
│  (Clinician)    │  (Client)       │  (Client)       │  (Practice Mgmt)  │
└────────┬────────┴────────┬────────┴────────┬────────┴─────────┬─────────┘
         │                 │                 │                   │
         └─────────────────┴────────┬────────┴───────────────────┘
                                    │
                           ┌────────▼────────┐
                           │   CDN / WAF     │
                           │  (Cloudflare)   │
                           └────────┬────────┘
                                    │
                           ┌────────▼────────┐
                           │  Load Balancer  │
                           │  (AWS ALB)      │
                           └────────┬────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
     ┌────────▼────────┐   ┌───────▼────────┐   ┌───────▼────────┐
     │  API Server     │   │  WebSocket     │   │  AI/ML         │
     │  (Node.js)      │   │  Server        │   │  Services      │
     └────────┬────────┘   └───────┬────────┘   └───────┬────────┘
              │                    │                    │
              └────────────────────┼────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
┌────────▼────────┐       ┌───────▼────────┐       ┌───────▼────────┐
│  PostgreSQL     │       │  Redis         │       │  S3 Storage    │
│  (Primary DB)   │       │  (Cache/Queue) │       │  (Files/Media) │
└─────────────────┘       └────────────────┘       └────────────────┘
```

---

## Frontend Stack

### Clinician Web Application (Primary)

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **Framework** | Next.js 14+ (React) | Server components, excellent DX, strong TypeScript support |
| **Language** | TypeScript | Type safety, better tooling, fewer runtime errors |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid development, consistent design system, accessible components |
| **State Management** | Zustand + TanStack Query | Lightweight, powerful data fetching with caching |
| **Forms** | React Hook Form + Zod | Type-safe forms with validation |
| **Rich Text** | TipTap (ProseMirror) | Flexible clinical note editor |
| **Charts** | Recharts / Tremor | Data visualization for outcomes |
| **Video** | Daily.co SDK | HIPAA-compliant video (alternative: Twilio) |
| **Testing** | Vitest + Playwright | Unit and E2E testing |

### Client Mobile Application

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **Framework** | React Native + Expo | Cross-platform, code sharing with web |
| **Navigation** | React Navigation | Standard for RN apps |
| **State** | Zustand | Consistent with web app |
| **Offline** | WatermelonDB | Local-first database with sync |
| **Push Notifications** | Expo Notifications | Native push with scheduling |
| **Animations** | Reanimated 3 | Smooth, native animations |
| **Testing** | Jest + Detox | Unit and E2E testing |

---

## Backend Stack

### API Layer

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **Runtime** | Node.js 20 LTS | JavaScript ecosystem, async performance |
| **Framework** | Fastify or NestJS | Performance (Fastify) or structure (Nest) |
| **Language** | TypeScript | End-to-end type safety |
| **API Style** | REST + GraphQL | REST for simplicity, GraphQL for flexibility |
| **Validation** | Zod | Runtime + compile-time validation |
| **Authentication** | Supabase Auth or Auth0 | Managed auth with MFA support |
| **Real-time** | Socket.io or Supabase Realtime | WebSocket for live features |

### Alternative: Supabase-First Architecture

For faster MVP development:

| Component | Supabase Feature | Notes |
|-----------|------------------|-------|
| **Database** | Postgres | Built-in |
| **Auth** | Supabase Auth | Email, OAuth, MFA |
| **API** | Auto-generated REST/GraphQL | Row Level Security |
| **Real-time** | Supabase Realtime | PostgreSQL subscriptions |
| **Storage** | Supabase Storage | File uploads, CDN |
| **Functions** | Edge Functions | Serverless TypeScript |

**Recommendation**: Start with Supabase for MVP, migrate to dedicated services as needed.

---

## Database

### Primary Database: PostgreSQL

| Feature | Implementation |
|---------|----------------|
| **Provider** | Supabase (managed) or AWS RDS |
| **Version** | PostgreSQL 15+ |
| **Extensions** | pgvector (AI embeddings), pg_crypto |
| **Encryption** | Column-level for sensitive fields |
| **Backup** | Daily automated, 30-day retention |
| **Replication** | Read replicas for reporting |

### Schema Design Principles
- HIPAA-style audit logging on all tables
- Soft deletes for data retention compliance
- Encrypted columns for PII
- Row Level Security (RLS) for access control
- Separate schemas for clinical vs. operational data

### Sample Core Tables
```sql
-- Core entities
clients
clinicians
practices
sessions
clinical_notes
assessments
homework_assignments

-- Client app entities
mood_entries
journal_entries
meal_logs
exercise_completions

-- System entities
audit_logs
consent_records
notifications
files_metadata
```

---

## AI/ML Services

### AI Scribe (Transcription + Note Generation)

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **Speech-to-Text** | Whisper (OpenAI) or Deepgram | High accuracy, Australian English |
| **Note Generation** | Claude API (Anthropic) | Superior clinical reasoning |
| **Fine-tuning** | Claude or custom LLM | Mental health terminology |
| **Embeddings** | OpenAI or Voyage | For semantic search |

### AI Pipeline
```
Audio Input → Whisper (transcription) → Claude (note generation) → Clinician Review
                                                    ↓
                                        Template Matching
                                                    ↓
                                        Structured Output
```

### Key AI Features
1. **Real-time transcription** during sessions
2. **Progress note generation** (SOAP, DAP, BIRP)
3. **Risk flag detection** from transcripts
4. **Sentiment/affect analysis** for client app data
5. **Template auto-fill** based on context

### Privacy Considerations
- No training on client data
- API calls only (no model hosting initially)
- Transcript deletion after processing (configurable)
- Opt-in consent for AI features

---

## Infrastructure

### Cloud Provider: AWS (Sydney Region)

| Service | Purpose |
|---------|---------|
| **EC2 / ECS Fargate** | Application hosting |
| **RDS** | Managed PostgreSQL |
| **ElastiCache** | Redis caching |
| **S3** | File storage (encrypted) |
| **CloudFront** | CDN for static assets |
| **WAF** | Web Application Firewall |
| **KMS** | Key management |
| **CloudWatch** | Logging and monitoring |
| **Secrets Manager** | Secret storage |

### Alternative: Supabase + Vercel
For smaller team / faster development:
- Supabase: Database, Auth, Storage, Real-time
- Vercel: Next.js hosting, Edge Functions
- Cloudflare: CDN, WAF, DNS

---

## Video Conferencing

### Option 1: Daily.co (Recommended)
- HIPAA-compliant
- Easy React/RN integration
- Recording with consent
- Screen sharing
- Australian data residency available

### Option 2: Twilio Video
- More complex, more customizable
- HIPAA BAA available
- Higher cost

### Option 3: Agora
- Lower latency
- Good for real-time features
- Requires more implementation work

---

## Messaging & Notifications

| Service | Purpose |
|---------|---------|
| **Twilio** | SMS (appointment reminders) |
| **SendGrid / Postmark** | Transactional email |
| **Firebase Cloud Messaging** | Push notifications (Android) |
| **Apple Push Notification** | Push notifications (iOS) |
| **Socket.io / Supabase Realtime** | In-app real-time |

---

## Payment Processing

### Medicare/NDIS Integration
- **Tyro Health** - Medicare claiming API
- **NDIS Provider Portal** - Manual or API integration
- Custom integration with Services Australia

### Private Payments
- **Stripe** - Primary payment processor
- **PayPal** - Alternative option
- **Direct Debit** - Stripe BECS

---

## Monitoring & Observability

| Tool | Purpose |
|------|---------|
| **Sentry** | Error tracking (frontend + backend) |
| **LogRocket / FullStory** | Session replay (clinician app) |
| **DataDog / New Relic** | APM, infrastructure monitoring |
| **PagerDuty** | Alerting and on-call |
| **CloudWatch Logs** | Centralized logging |

---

## Development Tools

| Category | Tools |
|----------|-------|
| **Version Control** | GitHub |
| **CI/CD** | GitHub Actions |
| **Code Quality** | ESLint, Prettier, Husky |
| **Documentation** | Notion / GitBook |
| **Design** | Figma |
| **Project Management** | Linear / Jira |
| **API Documentation** | Swagger / Stoplight |

---

## Security Tools

| Tool | Purpose |
|------|---------|
| **Snyk** | Dependency scanning |
| **SonarQube** | Code quality & security |
| **AWS GuardDuty** | Threat detection |
| **Cloudflare** | DDoS protection |
| **Vanta / Drata** | Compliance automation |

---

## Cost Estimation (MVP - 1,000 users)

### Monthly Costs (AUD)

| Service | Estimated Cost |
|---------|----------------|
| Supabase Pro | $75/month |
| Vercel Pro | $40/month |
| AWS (minimal) | $200/month |
| Daily.co (video) | $200/month |
| Twilio (SMS) | $100/month |
| SendGrid | $40/month |
| Claude API | $300/month |
| Whisper API | $200/month |
| Monitoring (Sentry etc) | $100/month |
| **Total** | ~$1,255/month |

### Scale Considerations
- Database: Scale with read replicas
- Video: Daily.co scales per-minute pricing
- AI: Consider self-hosted Whisper at scale
- Storage: S3 pricing scales linearly

---

## Development Phases

### Phase 1: MVP (3-4 months)
- Supabase backend
- Next.js clinician portal
- React Native client app (Expo)
- Basic AI scribe (Whisper + Claude)
- Core features only

### Phase 2: Enhancement (2-3 months)
- Video integration
- Advanced AI features
- Medicare integration
- Enhanced security

### Phase 3: Scale (Ongoing)
- Performance optimization
- Advanced analytics
- Additional integrations
- Mobile app enhancements

---

## Team Requirements

### MVP Team
- 1x Full-stack Developer (Next.js/React Native)
- 1x Backend Developer (Node.js/Supabase)
- 1x Product Designer (UX/UI)
- 1x Clinical Advisor (Psychologist)
- 1x Product Manager (part-time)

### Growth Team (Add)
- 1x DevOps/Security Engineer
- 1x Mobile Developer (dedicated)
- 1x AI/ML Engineer
- 1x QA Engineer

---

## Recommended Starter Template

```bash
# Create project structure
npx create-next-app@latest mindbridge-clinician --typescript --tailwind --app
npx create-expo-app mindbridge-connect --template expo-template-blank-typescript

# Key dependencies (clinician app)
npm install @supabase/supabase-js @tanstack/react-query zustand
npm install @radix-ui/react-* # shadcn/ui base
npm install @tiptap/react @tiptap/starter-kit # Rich text
npm install zod react-hook-form @hookform/resolvers
npm install recharts # Charts
npm install @daily-co/daily-react # Video

# Key dependencies (client app - Expo)
npx expo install @supabase/supabase-js
npx expo install expo-notifications expo-secure-store
npx expo install react-native-reanimated
npm install @nozbe/watermelondb # Offline-first
```
