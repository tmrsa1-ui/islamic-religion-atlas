# Cycle 2 (20:03-20:12)

## Defects taken from cycle 1 (ranked)
1. No verification/evaluation surface, no operations note -> new `/evaluation` page: runs the real engine on 10 fixed cases on every request (journey, hindu/FRA templates, question answered from the pack, 5 abstain cases, missing-figure case), shows expected vs actual, source counts linking to /references, what the AI does/does not do, stated limits, post-challenge operating cost/review/testing. Nav link added.
2. No pause control for the moving globe (WCAG 2.2.2) -> visible "Pause rotation / Resume rotation" toggle under the globe (aria-pressed); reduced-motion users get no rotation and a screen-reader note.
3. /references not searchable -> client search + kind filter (Pew, Qur'anic text, official sites, studies), live count, and an "arrived from a percentage" banner naming the highlighted row (hash target), stronger `:target` highlight.
4. Arabic/Latin mixing -> percentages wrapped in `<bdi dir="ltr">` on Pew bars and list; claim ids already `dir=ltr`.
5. Lighthouse a11y on /references was 96 (id caption contrast 4.44) -> raised to ink/75.

## Measurements
- Journey acceptance: ALL PASSED. /evaluation live: 10 / 10 cases as expected.
- Lighthouse mobile: perf 84, a11y 100, BP 100, SEO 100 (LCP 3.6 s = tagline text render delay while the Arabic web font swaps; TBT 230 ms). Desktop: 100/100/100/100.
- /evaluation a11y 100; /country/FRA a11y 100; /references 96 before fix (contrast, fixed, re-run in cycle 3).
- Puppeteer: rotation +8 deg per 2 s (Lighthouse-idle window shortened it to 2.5 s after load), hover pause 0, drag works, resume works, reduced-motion 0, no horizontal overflow on 6 pages x 4 viewports.

## Scores
| Criterion | Weight | Score | Note |
|---|---:|---:|---|
| Visual beauty and polish | 15 | 8.0 | Globe labelled and animated; below-the-fold sections are plain but coherent |
| Usability | 15 | 8.5 | Search + filter on home and references, hash banner, sticky nav, both globe and list select |
| Arabic RTL typography | 10 | 8.0 | bdi for numerals, line-height 2; not verifiable at pixel level |
| Accessibility | 10 | 8.5 | Lighthouse 100 (references fix pending re-run), pause control, reduced-motion, keyboard |
| Content trustworthiness | 15 | 8.5 | /evaluation makes abstention and missing-data behaviour checkable |
| Performance / real-browser | 10 | 7.5 | Mobile perf 84 (<90), LCP 3.6 s |
| Competition fit | 25 | 8.0 | Journey, verification, limits, operations now visible; still no user-testing evidence (criterion 5 asks for tests with the target group) |

**Weighted: 8.15 / 10. Gate: FAIL.**
