# Cycle 4 (20:12-20:20)

## Defects (ranked)
1. Journey continuity (track 03 success criterion: sequencing, continuity between stages) was implicit on the country page -> added a six-step journey rail (composition, optional background, headlines, one concept, your question, source/centre) with anchor links, plus a "What next?" block at the end (source, another background, another country, verification page, referral to local scholars).
2. Privacy statement (track 03 criterion) existed only in a sentence -> explicit Privacy section on /evaluation: no accounts, tracking or analytics; only the `lang` cookie; question and background not stored; religion never inferred.
3. Focus visibility: keyboard sweep of 40 Tab stops found every stop with an outline or marker ring except the search input, which relied on a border colour -> added a 2px focus ring to `.input`.
4. Smooth anchor scrolling with sticky-header offset; disabled under reduced motion.

## Measurements
- DOM measurement of globe labels at 1280 and 390, AR and EN: 7 labels each, 0 overlaps, 0 outside the globe, font 13.4 px desktop / 21.9 SVG-units (about 13 screen px) mobile, Noto Naskh Arabic and EB Garamond loaded.
- Lighthouse (mobile): home perf 94, country FRA 96, EGY 96, /evaluation 96; a11y 100, best-practices 100, SEO 100 on all.
- Acceptance: ALL PASSED. Real-browser interactions unchanged (rotation, pause, drag, resume, click-on-shape, reduced motion).

## Scores
| Criterion | Weight | Score | Note |
|---|---:|---:|---|
| Visual beauty and polish | 15 | 8.0 | Cannot verify pixel-level polish; no defects found |
| Usability | 15 | 9.0 | Journey rail, search/filter on home and references, hash banner, next-step block |
| Arabic RTL typography | 10 | 8.0 | Not verifiable beyond DOM/fonts |
| Accessibility | 10 | 9.0 | |
| Content trustworthiness | 15 | 9.0 | |
| Performance / real-browser | 10 | 9.0 | |
| Competition fit | 25 | 8.5 | Journey, AI function, abstention, verification, privacy, operations all visible; still no evidence from tests with the target group and no measured benefit, which the guide's 20% benefit criterion rewards |

**Weighted: 8.6 / 10. Gate: FAIL.**
