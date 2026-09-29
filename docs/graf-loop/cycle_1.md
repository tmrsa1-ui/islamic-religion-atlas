# Cycle 1 (19:52-20:03)

## Built before the audit (Part 1 of the brief)
Country-name labels on the globe (Arabic/English, greedy collision avoidance, fade on the far side, font scaled to ~12.5 screen px), faint continent captions and border mesh, clickable country shapes, continuous rotation (7 deg/s) that pauses on hover/focus/drag/list-inspection and resumes after ~1.4 s, no auto-rotation under prefers-reduced-motion, viewport-visibility pause.

## Measurements (real Chrome via puppeteer-core, Lighthouse CLI)
- Rotation: +14.2 deg in 2 s at 1280 and at 390 px (AR); reduced-motion: 0.0 deg; hover on globe: 0.0 deg; drag moved the globe -85 deg; rotation resumed after release (+10.5 deg in 1.5 s).
- Clicking a country shape navigates (verified with elementFromPoint scan: CAN -> /country/CAN). Marker links are still keyboard reachable (Tab 15 lands on a marker link).
- Labels visible at 1280 and 390: 7 names in view (France, Sweden, Germany, UK, India, Nigeria, Egypt) with no overlap by construction.
- Horizontal overflow: 0 px on home, country, references at 1280 and 390, AR and EN.
- Lighthouse desktop: perf 100, a11y 100, best-practices 96, SEO 100. Mobile (before fixes): perf 69, TBT 770 ms; after pausing off-screen and throttling repaint: perf 82, TBT 280 ms, LCP 3.6 s.
- Console: only a favicon 404 (fixed with app/icon.svg).

## Fixes made this cycle
1. Mobile header wrapped into three rows; now brand + language on one row and a horizontally scrollable nav row; active page underlined (aria-current).
2. Home page had no explanation of the journey or of how to verify claims; added a three-step "How the journey works" and a "Verify it yourself" block (closed pack, no estimates, AI = retrieval + routing + abstention).
3. Globe perf: paint throttling (32/50 ms), IntersectionObserver pause, 2.5 s idle at load so LCP is not fighting the animation; favicon.

## Scores (weights in RUBRIC.md)
| Criterion | Weight | Score | Why not higher |
|---|---:|---:|---|
| Visual beauty and polish | 15 | 7.5 | Globe and labels look good in descriptions but I cannot verify pixel quality; home below the fold is text-heavy |
| Usability (casual + researcher) | 15 | 7.5 | Percent links go to the Pew table row, fine, but /references has no search/filter and nothing tells the researcher which row they landed on |
| Arabic RTL typography | 10 | 7.5 | Mixed Arabic/Latin ids and % signs not audited; heading weights fine |
| Accessibility | 10 | 8.0 | Lighthouse 100, but an auto-rotating globe has no explicit pause control (WCAG 2.2.2) |
| Content trustworthiness | 15 | 8.0 | Closed pack, abstentions and missing data work; no visible test evidence for the reader |
| Performance and real-browser | 10 | 7.5 | Mobile Lighthouse perf 82 (< 90) |
| Competition fit | 25 | 7.0 | No place that shows the evaluation (abstention tests, limits, operations plan); judging weights verification and operations |

**Weighted score: 7.5 / 10. Gate: FAIL (< 9.0).**

## Top defects ranked by score impact
1. No verification/evaluation surface and no operations note (competition fit, 25%).
2. No pause control for the moving globe (accessibility, WCAG 2.2.2).
3. /references cannot be searched or filtered; no per-row highlight explanation.
4. Mobile Lighthouse performance 82.
5. Arabic/Latin mixing audit (percent signs, ids) not done.
