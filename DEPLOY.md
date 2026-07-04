# ZL Travel Agency — Redesign (Homepage Prototype)

Static site. No build step. Blended navy + orange/gold palette, scroll animations,
testimonial slider, animated counters, trust-badge marquee, and a GoHighLevel-ready lead form.

## Files
```
index.html            Homepage
assets/css/styles.css  All styling
assets/js/main.js      Animations + lead form logic (GHL config at top)
vercel.json            Vercel config (clean URLs + asset caching)
```

## Preview locally
Open `index.html` in any browser. (Images currently load from the live site — see note below.)

## Deploy to Vercel
**Option 1 — dashboard (easiest)**
1. Push this folder to a GitHub repo.
2. vercel.com → Add New → Project → import the repo.
3. Framework preset: **Other**. Root: the folder with `index.html`. Build command: none. Output dir: `./`
4. Deploy.

**Option 2 — CLI**
```bash
npm i -g vercel
cd "ZL travel"
vercel          # preview URL
vercel --prod   # production
```
(You'll log in with your own Vercel account — I can't authenticate to Vercel for you.)

## Connect the lead form to GoHighLevel
Open `assets/js/main.js` and set ONE of these:

**A. Inbound webhook (recommended, no backend)**
In GHL: Automation → Workflows → new workflow → Trigger **Inbound Webhook** → copy the URL.
Paste it into `GHL_WEBHOOK_URL` at the top of `main.js`. The form posts every field as JSON
(first_name, last_name, email, phone, destination, travel_dates, travelers, budget, message, source, page).
Add workflow steps to create the contact/opportunity and notify the team.

**B. GHL embedded form/survey**
In GHL: Sites → Forms → Integrate → copy the iframe embed. Replace the `<form id="leadForm">…</form>`
block in `index.html` with that iframe. Then the JS config is ignored.

Until a webhook is set, the form shows a success message but does not send (safe for previewing).

## GHL chat widget
The GoHighLevel chat widget (`widgets.leadconnectorhq.com/loader.js`, widget id
`6a4984550fa9255697183072`) is embedded on every page before `</body>`. It loads
automatically — no extra config needed. Manage its behaviour from your GHL dashboard.

## Note on images
Images are currently pulled directly from `zltravelagency.com` (as requested). Before going
live it's best to **self-host** them: download the files, drop them in `assets/img/`, and
update the `src` paths. This removes the dependency on the old WordPress site and speeds up load.

## Still to build (next steps)
About, Deals/Packages (full page), FAQs, Blog, plus self-hosted images and favicon.
