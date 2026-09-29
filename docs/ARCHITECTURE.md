# Architecture and method note

**Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, `next/font`. No database, no external API, no secrets.

**Data (closed pack, `/data`)**: `countries.json` (Pew 2020 figures, template id, badge variant, nullable headcounts), `templates.json` (5 templates: christian, unaffiliated, hindu, buddhist_ea, muslim_majority; sections curiosity / misconceptions / attractions / objections / one_concept / next_step, each bilingual with `claim_ids`), `references.json` (claim_id, statement, year, publisher, url), `centers.json` (only rows with a verified official URL), `world_2020_pew.json`, `method.md`.

**Engine (`lib/journey.ts`)**
1. Validate `iso3` and `background` (400 on bad input).
2. Choose template: explicit background (except `unspecified`) else `country.content_template_id`. Choose badge variant.
3. If a `question` is present: classify. Abstain rules (regex over normalised Arabic/English: hudud, apostasy, gender rulings, contemporary politics, fatwa) → `abstain_flag=true`, referral centres, no answer. Missing-figure rule (years after 2020, annual counts, convert counts) → «لا رقم مؤكد». Otherwise lexical scoring over the template's passages returns up to two snippets with claim ids.
4. Otherwise return headlines (6 per template, capped at 8), the one concept (60–90 words), claim ids, verified centres for the country, next step.

**Why rule-based:** no LLM key and a source-bound design; every sentence a visitor can see is a reviewed string from the pack, so nothing is generated that could rule on religion. An LLM re-ranker/phrasing layer is a possible step for 4–6 October, constrained to the same pack.

**Rendering:** server components read the JSON; the country page is server-rendered with the default journey and a client panel calls `/api/journey`. The earth plate is computed server-side (d3-geo natural earth projection of world-atlas 110m) as inline SVG; the countries are links. Locale is a cookie (`lang`), `dir` set on `<html>`.

**Safeguards:** never infer religion; badge text «خطاب ملائم لأغلبية هذه الدولة» describes the country's majority, not the individual; muslim-majority template refers rather than preaches; centres only with an official URL that loaded on the verification date.

**Tests:** `npm test` runs `scripts/test-journey.mjs` (12 countries, word limits, difference between templates, abstentions, missing data, error handling, RTL/EN).
