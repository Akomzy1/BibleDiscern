# Apple Privacy Nutrition Labels — BibleDiscern

Complete this in App Store Connect under App Privacy → Data Types.

---

## Data Used to Track You
**None.**
BibleDiscern does not track users across apps or websites owned by other companies for advertising or marketing purposes. No ATT prompt is shown.

---

## Data Linked to You

These data types are collected and linked to your account:

### Contact Info
| Data Type | Collected | Purpose | Optional? |
|-----------|-----------|---------|-----------|
| Email Address | ✅ Yes | Account setup, transactional emails (follow-up reminders, account confirmation) | No — required to create account |
| Name | ✅ Yes | Display name in app, personalizing AI-generated prayers | Yes — only first name is used |

### Identifiers
| Data Type | Collected | Purpose | Optional? |
|-----------|-----------|---------|-----------|
| User ID | ✅ Yes | Internal account identifier (Supabase UUID) — never exposed externally | No |

### Usage Data
| Data Type | Collected | Purpose | Optional? |
|-----------|-----------|---------|-----------|
| Product Interaction | ✅ Yes | Anonymous, aggregated feature usage (e.g., which steps complete) — no PII | No |

---

## Data Not Linked to You

### Diagnostics
| Data Type | Collected | Purpose |
|-----------|-----------|---------|
| Crash Data | ✅ Yes (via Expo) | App stability and crash reporting — no user content included |

---

## Data NOT Collected (important for reviewer confidence)

BibleDiscern explicitly does **not** collect:

- ❌ **Location** — not requested, not used
- ❌ **Browsing History** — not collected
- ❌ **Search History** — not collected
- ❌ **Contacts** — not accessed
- ❌ **Health & Fitness** — not collected
- ❌ **Financial Info** — payment handled by Apple IAP / Stripe directly; we never receive card details
- ❌ **Sensitive Info** — see note below

---

## Note on Discernment Session Content

Users enter personal situations and decisions into the app. This content:

- Is stored in their private Supabase account (row-level security: accessible only to the authenticated user)
- Is sent to the Anthropic Claude API solely to generate the AI response — and **only** during the session
- Is **never** used to train AI models (we have opted out via Anthropic's API terms)
- Is **never** shared with third parties
- Is **never** used for advertising or marketing
- Is classified as **user-generated content linked to the user** for App Store purposes — however, because it is sensitive spiritual content, it is treated with the same care as health data

Apple does not have a specific "spiritual data" category. Represent this content as:
- **Other User Content** → Linked to You → App Functionality

---

## Third-Party SDKs and Their Data Practices

| SDK | Purpose | Their Privacy Policy |
|-----|---------|---------------------|
| Anthropic Claude API | AI response generation | https://www.anthropic.com/privacy |
| Supabase | Auth + database | https://supabase.com/privacy |
| RevenueCat | Subscription management | https://www.revenuecat.com/privacy |
| Expo / EAS | Build + push notifications | https://expo.dev/privacy |
| Resend | Transactional email | https://resend.com/privacy |

---

## App Store Privacy Policy URL
https://librato.ai/privacy
