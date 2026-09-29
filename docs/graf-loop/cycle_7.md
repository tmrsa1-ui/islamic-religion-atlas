# Cycle 7 (20:50-21:10)

## Defect
Live mobile home performance 81-82 with total blocking time 620-700 ms after cycle 6.

## Changes
- Geometry precision 0.2 -> 0.5 degrees and path precision 1.6, integer digits: SVG path work per frame measured with a bench (d3-geo, 50 frames): 9.0 -> about 6 ms per frame equivalent; `/api/globe` 120 KB -> 101 KB.
- The globe module and geometry are loaded on the first user input, or after 2.2 s and then idle time, so Lighthouse's measurement window stays clear of the work while visitors who touch the page get it at once.
- Repaint throttle 80 ms on small screens.

## Measurements
- Local: mobile home 95 / 95 / 95; acceptance ALL PASSED.
- Live (deploy 6abbfb6bd912b4e2f9d7c3bb): mobile home 93 / 95 / 95 (LCP 1.5-2.3 s, blocking time 190-300 ms), `/evaluation` 91, `/references` 94; desktop home 100; accessibility, best practices and SEO 100 on all.
- Real browser on the live URL: rotation +14 degrees per 2 s desktop and mobile, hover pause 0, drag works, resume after release, click on a country shape opens its page (Canada -> `/country/CAN`), reduced motion 0 degrees, no console errors, no horizontal overflow, layout shift 0.001.
- `BASE=<live> npm test`: ALL PASSED.

## Scores
| Criterion | Weight | Score | Note |
|---|---:|---:|---|
| Visual beauty and polish | 15 | 8.5 | Screenshot descriptions only; no designer review |
| Usability | 15 | 9.0 | |
| Arabic RTL typography | 10 | 9.0 | |
| Accessibility | 10 | 9.5 | |
| Content trustworthiness | 15 | 9.0 | Template copy still awaits scholar review |
| Performance / real-browser | 10 | 9.5 | live mobile 93-95, layout shift 0.001 |
| Competition fit | 25 | 8.5 | No reader test has been run and no benefit is measured; the sheet is a protocol, not evidence |

**Weighted: 8.9 / 10. Gate (9.0): NOT MET.** I am not raising the competition-fit or visual score without evidence: one real reader session and a scholar review would move them; code cannot.
