# Brightera website

The company site for Brightera, a software engineering studio in Gurgaon. It is built with Next.js 16 (App Router, Cache Components), TypeScript, Tailwind CSS v4, GSAP (ScrollTrigger and SplitText), Lenis and React Three Fiber.

The original personal portfolio is preserved at the git tag `portfolio-v1`.

## Run it

```bash
npm install
cp .env.example .env.local   # fill in the lead-form keys (see below)
npm run dev                  # http://localhost:3000
npm run build && npm start
```

## Editing content

All copy lives in `content/seed/`. Pages read it only through the async getters in `lib/content/index.ts`, so the source can move to a CMS (Sanity) without touching components.

| File | What it holds |
|---|---|
| `content/seed/site.ts` | Name, domain, email, WhatsApp, booking link, legal details, nav, hero, process, principles |
| `content/seed/services.ts` | The five services and the engagement packages (no prices) |
| `content/seed/products.ts` | Source-to-Pay and MRP: features, walkthrough steps, illustrative app window |
| `content/seed/work.ts` | Work items, and testimonials (shown only when `published: true`) |

Before launch, fill in these values in `content/seed/site.ts`:

- `whatsapp`: digits with country code, e.g. `919876543210`. While empty, WhatsApp links are hidden.
- `bookingUrl`: a Cal.com or Calendly link. While empty, "Book a call" goes to the brief form.
- `email`: switch to `hello@brightera.in` once the domain mailbox exists.
- `legal`: entity name, CIN and GSTIN after registration. They appear in the footer only once set.
- `socials`: LinkedIn and other profiles.
- Testimonials: add real, approved quotes only. Until then the section is hidden.
- Engagement package names and durations in `services.ts` are proposals: review them.
- `/privacy` and `/terms` are plain-language drafts. Have them reviewed.

## Lead forms

The project brief (`/contact`) and demo requests (`/products/[slug]#demo`) are server actions in `lib/leads/actions.ts`. They validate input with zod and send a plain-text email through the Resend API.

| Env var | Purpose |
|---|---|
| `RESEND_API_KEY` | Resend API key |
| `LEAD_INBOX_EMAIL` | Where leads are delivered |
| `LEAD_FROM_EMAIL` | Sender. Use `Brightera <onboarding@resend.dev>` until `brightera.in` is verified in Resend. |
| `LEAD_SEND_AUTOREPLY` | `true` to email visitors a confirmation (needs a verified domain) |
| `NEXT_PUBLIC_SITE_URL` | Optional override of the canonical URL (defaults to `https://brightera.in`) |

The forms reject submissions that fill the hidden honeypot field or arrive less than three seconds after the form loaded. If the keys are missing or Resend fails, visitors see an error with the fallback email address, and the cause is logged on the server.

## Pages

| Route | Built from |
|---|---|
| `/` | Hero (3D tiles), stack marquee, delivery statement, services, S2P spotlight, process, principles, packages, testimonials, CTA |
| `/services`, `/services/[slug]` | `PageHero`, `Capabilities`, `Packages`. The AI systems page also includes the live retrieval demo (`Tuning`). |
| `/products`, `/products/[slug]` | Dark spotlight hero, features, `ProductWalkthrough`, `DemoForm` |
| `/work`, `/about`, `/contact` | `WorkTabs`, `Principles`, `BriefForm` |
| `/privacy`, `/terms` | `LegalPage` |

Shared chrome (nav, footer, live 3D layer, corner controls, Organization JSON-LD) lives in `app/(site)/layout.tsx`.

## Deploying

Deploy on Vercel: import the repo, add the env vars above, and set the production domain once `brightera.in` is bought.

## Accessibility and motion

- Reduced motion turns off smooth scrolling, the intro, the pinned statement, scroll reveals, loops and the real-time 3D. Content appears immediately.
- Visitors can pause animations, and interface sound is off by default.
- The site has a skip link, landmarks, visible focus rings and ARIA tabs.
- Form fields have labels and inline errors linked to their inputs, and the success message receives focus.

## Fonts

Inter Tight and JetBrains Mono (both under the OFL), self-hosted from `@fontsource-variable` via `next/font/local`.
