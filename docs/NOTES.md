# Brightseid website: notes and open items

Last updated: 26 November 2026. For how the site works and how to run it, see `../README.md`.

## Where things stand

- **Live site:** https://brightseid.vercel.app, on Vercel project `brightseid` (Next.js, Node 24, Mumbai region `bom1`). Every push to `main` deploys automatically.
- **Code:** GitHub repo `ipriyanshyadav/Brightsied`, branch `main`. The original personal portfolio is preserved at the git tag `portfolio-v1`, which isn't pushed (`git push origin portfolio-v1` if you want it on GitHub).
- **Spelling to settle:** the site says **Brightseid** but the GitHub repo is **Brightsied**. Fix whichever is wrong before buying the domain.
- **Node:** 24 LTS (Homebrew `node@24`). Node 20 is still installed. The Sanity CLI needs Node 22.12 or newer.
- **Content:** comes from Sanity project `4xtzkdcg`, dataset `production`. Edit at https://brightseid.vercel.app/studio (or http://localhost:3000/studio) and sign in with your Sanity account. Publishing refreshes the live site in about 6 seconds through the webhook. The files in `src/content/seed/` are now only the starting copy.
- **Lead emails:** the project brief and demo forms send email through Resend to your Gmail. Test emails were sent on 26 Nov, including one from the live site. **Check they arrived, including Spam.**
- **Vercel settings:** the Sanity project id, dataset, lead email settings and `NEXT_PUBLIC_SITE_URL=https://brightseid.vercel.app` are stored as plain settings. `RESEND_API_KEY` and `SANITY_REVALIDATE_SECRET` are stored as sensitive. `SANITY_AUTH_TOKEN` is deliberately **not** on Vercel.
- **Sanity:** CORS allows `http://localhost:3000` and `https://brightseid.vercel.app`. A webhook ("Vercel revalidate") posts to `https://brightseid.vercel.app/api/revalidate` on create, update and delete.
- **Checks run on 26 Nov:**
  - Type check, lint and production build pass.
  - All live pages return 200; unknown pages return 404.
  - A live edit refreshed the site through Sanity's real webhook in about 6 seconds, and a forged webhook signature was rejected.
  - Lighthouse (mobile, local build): home 89, inner pages 91–94. Best practices and SEO 100 on every page; accessibility 96–100.

## When the domain is bought

1. **Vercel.** Add the domain under Project → Settings → Domains and set the DNS records it shows. Then set `NEXT_PUBLIC_SITE_URL=https://yourdomain` (Production) and redeploy.
2. **Site URL in Sanity.** Update the canonical URL under Site settings to match the domain.
3. **Resend.**
   - Verify the domain (add the DNS records Resend shows you).
   - In Vercel, set `LEAD_FROM_EMAIL=Brightseid <hello@yourdomain>` and `LEAD_SEND_AUTOREPLY=true`, then redeploy.
   - Send a test brief from the live site.
4. **Mailbox.** Create `hello@yourdomain`, then change the contact email in Sanity Site settings. It's your Gmail for now.
5. **Sanity, CORS.** Add `https://yourdomain` under API → CORS origins, with credentials allowed.
6. **Sanity, webhook.** Change the URL of the existing "Vercel revalidate" webhook to `https://yourdomain/api/revalidate`; keep the same secret. Then edit something in the Studio and check the live site updates.
7. **Search engines.** Submit `https://yourdomain/sitemap.xml` in Google Search Console.

## Details to fill in (all editable in Sanity → Site settings)

- [ ] **WhatsApp number:** digits with country code, e.g. `919876543210`. WhatsApp links stay hidden until it's set.
- [ ] **Booking link:** a Cal.com or Calendly URL. Until it's set, "Book a call" opens the brief form.
- [ ] **Legal details:** registered name, CIN and GSTIN once the company is registered. They appear in the footer only when filled.
- [ ] **Social profiles:** LinkedIn and others.
- [ ] **Testimonials:** add real, client-approved quotes only, and tick "Show on the site". The section stays hidden until one exists.
- [ ] **Client case studies:** add a Work item with a case study once a client agrees to be named (or to an anonymised write-up).

## Text to review (written as proposals)

- [ ] **Privacy policy and Terms:** plain-language drafts for India's DPDP Act 2023. **Get them reviewed by a lawyer before launch.**
- [ ] **Engagement package names and durations,** for example "MVP Build, 6–10 weeks".
- [ ] **The promise "We reply within one working day."**
- [ ] **The S2P and MRP case studies, and the MRP feature descriptions.**
- [ ] **Product statuses:** both read "Demo available". Make sure you can actually give demos.
- [ ] **Hero headline and tagline.**

## Security housekeeping

- [ ] The `SANITY_AUTH_TOKEN` in `.env` is your **personal** Sanity token, with admin rights. Replace it with a project token that has the Editor role (sanity.io/manage → API → Tokens), then revoke the personal one. Never put it in Vercel.
- [ ] `npm audit` reports 18 findings (2 high, 16 moderate). All of them are in Sanity's command-line tooling, not in code that website visitors reach. npm's only fix is to downgrade Sanity a major version, so check again when Sanity releases an update.
- [ ] Keep Next.js patched; it's on 16.4.6 now. Run `npm audit --omit=dev` from time to time.

## Not built yet (nice to have)

- **Stronger spam protection.** The forms have a hidden honeypot field and a 3-second minimum fill time, but no rate limit or CAPTCHA. Add Cloudflare Turnstile or a rate limit (for example Upstash) if spam appears.
- **Analytics.** None yet. Vercel Analytics or Plausible would be simple. Adding analytics that uses cookies would also need a cookie/consent notice.
- **Inline booking.** "Book a call" is only a link; a Cal.com embed on `/contact` would keep visitors on the site.
- **Sanity preview.** There's no preview or visual editing in the Studio, so you only see edits after publishing.
- **Images.** No image fields in Sanity yet (logos, screenshots, team photo).
- **Pages that don't exist:** blog or insights, careers, client logos.
- **Share image text.** Every service, product and case study has its own share image, but the alt text is generic ("A Brightseid service").
- **Mobile load speed.** Largest Contentful Paint is about 3–3.7 s on Lighthouse's simulated slow mobile. Worth another look after deploying, using real-user data.

## Known quirks

- **Case studies can't all be removed.** If every Work item in Sanity loses its case study, the build fails, because `/work/[slug]` needs at least one. Keep at least one case study.
- **Document IDs** must not contain a dot. Sanity makes those private, so the site couldn't read them.
- **`npm run cms:seed` overwrites** Sanity content with what's in `src/content/seed/`. Only run it on purpose.
- **Dev-server warning about uncached data on `/products/[slug]`.** It only appears in development; the production build prerenders these pages fine.
- **Stale styles after a build.** Once, an edit to `globals.css` didn't reach the production build because of a stale Turbopack cache. If styles look out of date, delete `.next` (except `.next/dev`) and rebuild.
- **Lighthouse contrast warnings on headings.** They are caught mid blur-in animation; the final text has full contrast.
- **No 3D in some browsers.** The 3D hero only runs with a hardware graphics chip, so headless browsers and machines without one see the still tiles.
- **`THREE.Clock` deprecation warnings** in the browser console come from the 3D library and are harmless.
- **The package name** in `package.json` is still `priyansh-portfolio`.

## Possible next steps

- Run Lighthouse against the live site (https://brightseid.vercel.app) and Google's Rich Results test on the structured data, now that it's public.
- Test on a real phone.
