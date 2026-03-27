# Google Play Data Safety Section — BibleDiscern

Complete this in Google Play Console → App Content → Data Safety.

---

## Does your app collect or share any of the required user data types?
**Yes** — the app collects limited data required to provide the service.

## Is all of the user data collected by your app encrypted in transit?
**Yes** — all data is transmitted over HTTPS (TLS 1.3).

## Do you provide a way for users to request that their data is deleted?
**Yes** — users can delete their account from within the app (Settings → Delete Account), which removes all personal data within 30 days. Users may also email privacy@librato.ai.

---

## Data Types Collected

### Personal Info
| Data Type | Collected | Shared | Purpose | Required? | Processing |
|-----------|-----------|--------|---------|-----------|-----------|
| Email address | ✅ Yes | ❌ No | Account creation, transactional emails | Yes | Stored in Supabase (encrypted at rest) |
| Name | ✅ Yes | ❌ No | Personalizing AI-generated prayers and display name | No (optional) | Stored in Supabase (encrypted at rest) |

### App Activity
| Data Type | Collected | Shared | Purpose | Required? | Processing |
|-----------|-----------|--------|---------|-----------|-----------|
| App interactions | ✅ Yes | ❌ No | Anonymous, aggregated usage analytics (feature usage rates, session completion) — no personal content included | No | Aggregated only — not linked to identity |
| In-app search history | ❌ No | — | — | — | — |

### App Info and Performance
| Data Type | Collected | Shared | Purpose | Required? | Processing |
|-----------|-----------|--------|---------|-----------|-----------|
| Crash logs | ✅ Yes | ❌ No | App stability — via Expo crash reporting | No | Anonymous, no personal content |
| Diagnostics | ✅ Yes | ❌ No | Performance monitoring | No | Anonymous |

---

## Data NOT Collected

BibleDiscern does **not** collect:

- ❌ Location (precise or approximate)
- ❌ Contacts
- ❌ Photos or videos
- ❌ Audio or video recordings
- ❌ Calendar events
- ❌ SMS or MMS messages
- ❌ Files from the device
- ❌ Web browsing history
- ❌ Financial information (payment handled by Google Play Billing)
- ❌ Health and fitness data

---

## User-Generated Content (Discernment Sessions)

Users write personal situations and decisions into the app. This content:

- Is stored in the user's private, encrypted database account (row-level security)
- Is sent to the Anthropic Claude API **only to generate the AI response** during a session
- Is **never** used to train AI models
- Is **never** sold to third parties
- Is **never** used for advertising targeting
- Is deleted when the user deletes their account

**For Data Safety purposes, classify as:**
- Data type: Other app activity → User-generated content
- Collected: Yes
- Shared: No
- Purpose: App functionality
- Required: Yes (core feature)
- Encrypted in transit: Yes

---

## Data Sharing

**BibleDiscern does not sell user data.**

Data is shared with the following third-party services **only for the purpose of providing the service**:

| Service | Data Shared | Purpose |
|---------|------------|---------|
| Anthropic Claude API | Discernment session content (during processing only) | Generating AI responses |
| Supabase | Email, name, app data | Database and authentication |
| RevenueCat | Anonymous transaction data | Subscription management |
| Resend | Email address | Transactional email delivery |
| Expo | Push notification token | Push notifications |

None of these services receive data for advertising purposes.

---

## Security Practices

- All data encrypted in transit (HTTPS / TLS 1.3)
- All data encrypted at rest (AES-256 via Supabase/AWS)
- Row-level security: each user can only access their own data
- We do not store Google Play payment information (handled by Google directly)

---

## Privacy Policy URL
https://librato.ai/privacy
