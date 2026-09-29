# Cycle 3 (20:12-20:20)

## Defects (ranked)
1. Mobile Lighthouse performance 83-84 (< 90 target): home HTML was 525 KB (200 KB gzip) because the full world geometry was serialised into the client component.
2. /references caption contrast 4.44 (fixed in cycle 2, re-verified: a11y 100).
3. Home LCP text render delay on throttled mobile.

## Fixes
- `lib/geo.ts` rounds coordinates to 0.2 deg and drops repeated points before they reach the client: home HTML 525 KB -> 251 KB (gzip 202 -> 81 KB). Shapes still clickable and outlines visually unchanged at globe scale (110m data).
- Globe rendering throttled (32/50 ms), pauses off-screen, waits 2.5 s after load before turning.

## Measurements (local production build, Lighthouse CLI, mobile emulation unless noted)
- Home: perf 94, a11y 100, BP 100, SEO 100, FCP 1.4 s, LCP 3.0 s, TBT 80 ms. Country FRA: perf 96. References: perf 95, a11y 100 after contrast fix. Desktop home: 100/100/100/100.
- Acceptance script: ALL PASSED. /evaluation: 10/10.
- Real Chrome (puppeteer): rotation +8 deg/2 s desktop, +7 deg/2 s mobile; hover pauses (0 deg); drag -85 deg then auto-resume; reduced-motion 0 deg; clicking a country shape navigates (CAN -> /country/CAN); no horizontal overflow on home, country, references, evaluation at 1280 and 390, AR and EN.

## Scores
| Criterion | Weight | Score | Note |
|---|---:|---:|---|
| Visual beauty and polish | 15 | 8.0 | unchanged; I cannot certify pixel polish from descriptions |
| Usability | 15 | 8.5 | |
| Arabic RTL typography | 10 | 8.0 | |
| Accessibility | 10 | 9.0 | Lighthouse a11y 100 on 5 pages, pause control, reduced motion, focus visible |
| Content trustworthiness | 15 | 8.5 | |
| Performance / real-browser | 10 | 9.0 | mobile perf 94, real-browser interactions verified |
| Competition fit | 25 | 8.0 | no evidence of tests with the target group (criterion 5) and no measured before/after benefit |

**Weighted: 8.35 / 10. Gate: FAIL.**
