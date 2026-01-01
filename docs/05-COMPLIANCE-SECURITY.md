# Australian Compliance & Data Security

## Overview
MindBridge is designed from the ground up for full compliance with Australian privacy legislation and healthcare data protection standards.

---

## Applicable Legislation

### Primary Legislation

#### 1. Privacy Act 1988 (Cth)
The foundational privacy law in Australia, including:
- **Australian Privacy Principles (APPs)** - 13 principles governing personal information handling
- **Health information** classified as **sensitive information** requiring higher protection
- Applies to organisations with annual turnover >$3M AND all health service providers regardless of turnover

#### 2. Health Records Act 2001 (Vic) / Similar State Acts
State-specific health record legislation where applicable:
- Victoria: Health Records Act 2001
- NSW: Health Records and Information Privacy Act 2002
- ACT: Health Records (Privacy and Access) Act 1997

#### 3. My Health Records Act 2012 (Cth)
If integrating with My Health Record system

#### 4. National Health (Privacy) Rules 2025
New rules effective 1 April 2025 for Medicare/PBS claims data:
- Enhanced data encryption requirements
- Access controls
- Data minimisation principles

---

## Australian Privacy Principles (APPs) Compliance

### APP 1 - Open & Transparent Management
**Requirement**: Privacy policy, clear information handling practices

**Implementation**:
- Comprehensive, plain-English privacy policy
- In-app privacy settings with clear explanations
- Privacy impact assessments for new features
- Publicly available privacy policy on website
- Collection notices at all data collection points

### APP 2 - Anonymity & Pseudonymity
**Requirement**: Option to not identify or use pseudonym where practicable

**Implementation**:
- Clients can use preferred name/alias in app
- Clinician sees legal name only in clinical record
- Anonymous usage analytics (no PII in analytics)

### APP 3 - Collection of Solicited Information
**Requirement**: Only collect information reasonably necessary

**Implementation**:
- Minimum viable data collection approach
- Clear justification for each data field
- Regular data necessity audits
- Health information collected only with express consent
- Collection notices explain purpose

### APP 4 - Dealing with Unsolicited Information
**Requirement**: Proper handling of information received but not requested

**Implementation**:
- Clear protocols for unsolicited disclosures
- Destruction procedures for unnecessary information
- Training for support staff

### APP 5 - Notification of Collection
**Requirement**: Tell individuals about collection at or before time of collection

**Implementation**:
- Onboarding screens explain data collection
- Just-in-time notices for specific features
- Clear consent workflows
- Regular reminders of what is being collected

### APP 6 - Use and Disclosure
**Requirement**: Only use/disclose for collected purpose or with consent

**Implementation**:
- Granular consent for each sharing category
- Clear primary and secondary use definitions
- Audit logs of all data access
- No selling or sharing data with third parties for marketing
- Disclosure only with explicit consent or legal requirement

**Permitted Disclosures Without Consent**:
- Required by law (subpoena, mandatory reporting)
- To prevent serious threat to life/health
- Necessary for enforcement activity

### APP 7 - Direct Marketing
**Requirement**: Restrictions on using information for marketing

**Implementation**:
- No direct marketing without opt-in consent
- Easy opt-out mechanisms
- No sale of data to third parties
- Marketing preferences in account settings

### APP 8 - Cross-border Disclosure
**Requirement**: Ensure overseas recipients comply with APPs

**Implementation**:
- Primary data storage in Australia (Sydney region)
- Any offshore processors bound by equivalent protections
- Data Processing Agreements with all third parties
- Disclosure in privacy policy of any overseas transfers
- Preference for Australian-based infrastructure

### APP 9 - Adoption, Use, Disclosure of Government Identifiers
**Requirement**: Cannot use government identifiers as own identifier

**Implementation**:
- Medicare numbers stored but not used as primary ID
- Internal UUIDs for all records
- Government IDs only used for intended purposes

### APP 10 - Quality of Personal Information
**Requirement**: Take reasonable steps to ensure accuracy

**Implementation**:
- Client can review and update their information
- Regular data verification prompts
- Clinician review of clinical information
- Audit trails for all changes

### APP 11 - Security of Personal Information
**Requirement**: Protect from misuse, interference, loss, unauthorised access

**Implementation**:
- See Technical Security Measures below
- Regular security audits
- Incident response plan
- Staff security training
- Data destruction procedures

### APP 12 - Access to Personal Information
**Requirement**: Provide access to personal information on request

**Implementation**:
- In-app data export feature (client & clinician)
- Formal access request process
- 30-day response timeframe
- Clear fees (if any) for access requests
- Exceptions documented (e.g., harm to others)

### APP 13 - Correction of Personal Information
**Requirement**: Correct information on request if inaccurate

**Implementation**:
- In-app profile editing
- Request correction of clinical notes (with notation)
- Clinician can add addendums to notes
- Audit trail of corrections

---

## Health Information Special Requirements

### Definition
Health information includes:
- Physical or mental health condition
- Disability status
- Health service provision
- Genetic information
- Expressed wishes about future health services

### Enhanced Protections
1. **Express consent required** for collection (not just implied)
2. **Stricter use limitations** - generally only for direct care
3. **Additional security measures** required
4. **Longer retention periods** may apply

### Mandatory Reporting Obligations
Clinicians must be able to document and comply with:
- Child protection reporting
- Threat to life disclosures
- Court-ordered disclosures
- Professional body requirements

---

## Technical Security Measures

### Encryption

#### Data at Rest
- AES-256 encryption for all stored data
- Database-level encryption (AWS RDS encryption)
- Encrypted backups
- Encryption key management via AWS KMS or similar

#### Data in Transit
- TLS 1.3 minimum for all connections
- Certificate pinning for mobile apps
- HTTPS only (no HTTP endpoints)
- Secure WebSocket for real-time features

### Authentication & Access Control

#### User Authentication
- Email/password with minimum strength requirements
- Multi-factor authentication (MFA) mandatory for clinicians
- MFA optional for clients (encouraged)
- Biometric login option (Face ID, fingerprint)
- Session timeout (configurable, default 30 min)
- Device management (view/revoke sessions)

#### Role-Based Access Control (RBAC)
| Role | Access Level |
|------|-------------|
| Client | Own data only |
| Clinician | Assigned clients only |
| Practice Admin | Practice-wide view, no clinical notes |
| Super Admin | Technical access only, audit logged |

#### Access Logging
- All data access logged with timestamp, user, action
- Logs retained minimum 7 years
- Tamper-evident logging
- Regular access review alerts

### Infrastructure Security

#### Cloud Hosting
- AWS Sydney region (ap-southeast-2) primary
- Melbourne region backup
- Data sovereignty maintained in Australia
- SOC 2 Type II certified infrastructure

#### Network Security
- Web Application Firewall (WAF)
- DDoS protection
- VPC isolation
- Regular penetration testing
- Intrusion detection systems

#### Application Security
- Secure development lifecycle (SDLC)
- Regular dependency scanning
- Static code analysis
- Dynamic application security testing
- Bug bounty program (future)

---

## Data Retention & Destruction

### Retention Periods

| Data Type | Retention Period | Source |
|-----------|------------------|--------|
| Adult clinical records | 7 years from last service | State health records acts |
| Child clinical records | 7 years from age 18 (25 total) | State health records acts |
| Financial records | 7 years | Tax Act |
| Access logs | 7 years | Best practice |
| Chat/messaging | 7 years (clinical) | State health records acts |
| Session recordings | Per consent, max 2 years | Privacy Act |

### Data Destruction
- Secure deletion methods (cryptographic erasure)
- Certificate of destruction on request
- Destruction logging
- Third-party data destruction audit

---

## Incident Response

### Data Breach Protocol

#### Notifiable Data Breaches Scheme
Under Part IIIC of the Privacy Act:

1. **Assessment** (within 30 days)
   - Determine if breach is "eligible"
   - Assess likelihood of serious harm

2. **Notification** (ASAP if eligible breach)
   - Notify OAIC
   - Notify affected individuals
   - Prepare public statement if widespread

3. **Response**
   - Contain breach
   - Remediate vulnerabilities
   - Support affected individuals

#### Internal Response Team
- Security Lead
- Privacy Officer
- Clinical Director
- Communications Lead
- Legal Counsel

---

## Third-Party Compliance

### Sub-Processor Requirements
All third parties handling personal information must:
- Sign Data Processing Agreements
- Demonstrate APP compliance
- Maintain adequate security
- Allow audit rights
- Report breaches immediately

### Current Third Parties (Example)
| Provider | Purpose | Location | DPA Status |
|----------|---------|----------|------------|
| AWS | Hosting | Australia | ✓ |
| Twilio | SMS | USA* | ✓ |
| Stripe | Payments | Australia | ✓ |
| SendGrid | Email | USA* | ✓ |

*Data minimisation applied; transactional only

---

## Clinician Compliance Features

### Record Keeping Support
- Template-based documentation ensuring minimum requirements
- Mandatory fields for legal compliance
- Timestamp and signature logging
- Version history for all clinical notes

### Consent Management
- Digital consent capture with witness confirmation
- Consent version tracking
- Consent withdrawal workflow
- Consent status visibility

### Mandatory Reporting Workflow
- Risk assessment prompts
- Mandatory reporting guidance by state
- Documentation templates for reports
- Audit trail of mandatory report submissions

### Professional Requirements
- Session time tracking
- Supervision logging
- CPD hour tracking
- Professional indemnity reminders

---

## Certification Roadmap

### Current Target
- OAIC Privacy Management Framework alignment
- ISO 27001 (Information Security Management)
- SOC 2 Type II

### Future
- IRAP assessment (Government sector)
- Essential Eight maturity

---

## Privacy Officer

### Responsibilities
- Privacy policy maintenance
- Complaint handling
- Training oversight
- Breach response coordination
- OAIC liaison

### Contact
Privacy inquiries: privacy@mindbridge.com.au
Complaints: complaints@mindbridge.com.au

---

## Staff Training Requirements

### All Staff
- APP overview
- Data handling procedures
- Incident reporting
- Annual refresher

### Clinical Staff
- Health information handling
- Mandatory reporting
- Consent management
- Client rights

### Technical Staff
- Secure development
- Access management
- Incident response
- Encryption standards

---

## References

- [OAIC - Australian Privacy Principles](https://www.oaic.gov.au/privacy/australian-privacy-principles)
- [OAIC - Health and Medical Research](https://www.oaic.gov.au/privacy/privacy-legislation/the-privacy-act/health-and-and-medical-research)
- [Digital Health Laws Australia 2025](https://iclg.com/practice-areas/digital-health-laws-and-regulations/australia)
- [Guide to Australia Privacy Act](https://usercentrics.com/knowledge-hub/australia-privacy-act-apps/)
- [Compliancy Group - Privacy Act 1988](https://compliancy-group.com/hipaa-australia-the-privacy-act-1988/)
