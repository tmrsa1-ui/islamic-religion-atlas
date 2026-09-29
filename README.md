# أطلس الدين الإسلامي — Islamic Religion Atlas

Bathel 2026 challenge, **track 03** (interactive experiences and the knowledge journey for introducing and learning Islam).

> **Status: starter build.** This version was built on 29 September 2026. Per the challenge rules, the work judged is the work done **4–6 October 2026**; tonight's build is a documented starting point, not the final product.

**Live demo:** https://illustrious-flan-0afa94.netlify.app  ·  **Source:** https://github.com/tmrsa1-ui/islamic-religion-atlas

## The problem
One introduction to Islam, written as a single template, fails a Christian, a Hindu, a secular Swede and a Thai Buddhist at the first sentence. The atlas starts from the visitor's **explicit** choice (a country, then optionally a background) and returns a short, sourced journey: headlines, one Islamic concept, then a source or a verified centre.

## What the AI does (and the map does not)
`POST /api/journey` is the product. It performs:
- **template routing** (explicit background wins; otherwise the country's template; `unspecified` = country template);
- **retrieval from a closed pack** (`/data/*.json`) with rule-based lexical matching — no live scrape, no external model, no API key;
- **attribution**: every headline/detail carries `claim_ids` that resolve to rows in `/references`;
- **abstention**: apostasy, hudud, gender rulings, contemporary politics and fatwa requests return `abstain_flag: true` plus a referral (Dar al-Ifta al-Misriyyah, Al-Azhar) and **no ruling**;
- **missing data**: a question about a figure we do not hold returns «لا رقم مؤكد» / "No verified figure" with a link to `/method`.

```bash
curl -s -X POST http://localhost:3000/api/journey -H 'content-type: application/json' \
  -d '{"iso3":"IND","background":"hindu"}'
curl -s -X POST http://localhost:3000/api/journey -H 'content-type: application/json' \
  -d '{"iso3":"FRA","question":"what is the hadd for theft"}'   # abstain_flag: true
```
Response fields: `template_id, badge, headlines[5–8], detail{ar,en,claim_ids}, claim_ids[], centers[], abstain_flag` (+ `referral`, `answer`, `missing_figure`, `next_step`). The visitor's religion is **never inferred** from language, behaviour or IP.

## Run
```bash
npm install && npm run dev      # http://localhost:3000
npm run build && npm start      # production
npm test                        # acceptance script against BASE (default http://localhost:3000)
```
Node 18+ . No environment variables and no secrets are needed.

## Routes
`/` · `/country/[iso3]` · `/api/journey` · `/references` · `/centers` · `/method` · `/about` · `/evaluation`

## Countries (12) and data
France, Sweden, United States, Germany, United Kingdom, India, Japan, Thailand, Nigeria, Brazil, Egypt, Canada. Religious composition is **Pew Research Center 2020** (published 9 June 2025), frozen in `data/countries.json`. World Christian Database is never mixed into a country card. Any figure not in the pack is `null` and displays «لا رقم مؤكد». See `data/method.md` (also at `/method`).

## Design
"Archival atlas at dusk": Void `#07090C`, Night earth `#0E1518`, Limestone `#E7E2D8`, Brass `#8A6520`, Sea ink `#1A2332`, Verdigris `#2E7A63` (selected), paper `#F6F3EC` / ink `#1C1915` (references). Missing data is muted clay, never alarm red. One Arabic face (Noto Naskh Arabic) and one Latin serif (EB Garamond) via `next/font`. Arabic by default with RTL; English toggle. `prefers-reduced-motion` disables all auto-rotation.
The home page uses an **orthographic SVG globe** (d3-geo + world-atlas) plus a searchable country list; the list is the mobile experience and needs no WebGL.

## Disclosure of prior visual language
The team has earlier globe / visual-language work under the names **Falak, Adim and Ufuq**. This repository was created fresh for the atlas on 29 September 2026: no code or assets from those projects were copied into it, and the design here (archival atlas at dusk, SVG globe) was written for this build. The judged work is that of **4–6 October 2026**.

## Sources (closed pack)
Pew Research Center (2020 composition; 2025 switching and drivers; 2018 U.S. note), University of Cambridge Centre of Islamic Studies reports (2013, 2016), van Nieuwkerk (2006), Köse (1996), Zebiri (2008), the Qur'anic text (quran.com), and official sites of listed centres. Full table: `/references`.

## Known limits of this starter
Only 12 countries; rule-based retrieval (no LLM); few verified centres; template Arabic/English copy needs scholarly review before the judged phase; no annual convert numbers by design; no testing with real readers from the target backgrounds yet.

See `docs/`: `ARCHITECTURE.md`, `scenarios.md`, `video-script.md`.

## Design pass 2 (29 Sep 2026)
Restyle from Claude Design merged (`docs/claude-design-brief.md`): flatter panels, folio/number typography, brass hairline links, muted-clay missing-data blocks, badge «خطاب ملائم لأغلبية هذه الدولة». The home-page earth was redrawn as a dusk-lit **orthographic SVG globe** (`components/Globe.tsx`, d3-geo + world-atlas, no WebGL): Sea ink ocean, Night earth land with fine Limestone outlines, subtle graticule, limb glow and terminator shading, Brass marker rings on the 12 countries (Verdigris when hovered/focused); rotate buttons plus the country list remain as keyboard/mobile paths. The previous version is kept on git branch `backup-pre-restyle` (local only).

## Globe behaviour and Graf Loop (29 Sept 2026)
The home globe rotates continuously (about 7°/s) until the pointer is over it, focus enters it, the user drags/rotates it, or a country shape is clicked; it then pauses and resumes about 1.4 s after the pointer leaves or the drag ends. There is a visible Pause/Resume button. Under `prefers-reduced-motion` there is no auto-rotation. Countries are selectable by clicking their actual shape (not only the markers); marker links and keyboard access remain. Country names are drawn as labels (AR/EN) with collision avoidance and far-side fade.

A scored quality loop is logged in `docs/graf-loop/` (RUBRIC.md, PROGRESS.md, cycle_1..5.md). The live `/evaluation` page runs the 10-case engine test on every request and shows the repeatability check, value over a single template, what was and was not user-tested, and the privacy statement.
