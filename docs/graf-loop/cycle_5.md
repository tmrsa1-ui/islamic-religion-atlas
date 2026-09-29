# Cycle 5 (20:20-20:30) - final cycle run

## Defects fixed
1. 390 px clipping of the references and evaluation tables -> tables become label/value cards on mobile (0 horizontal overflow on 10 page x viewport x language combinations, checked live).
2. Arabic leading raised (1.95 body, tighter for headings), numerals wrapped in bdi dir=ltr.
3. Mobile header/nav wrapping fixed.
4. Paper-surface "missing data" clay darkened for contrast -> references a11y back to 100.
5. /evaluation gained: repeatability check (byte-identical repeat runs), value-over-single-template table (Jaccard of headline sets for FRA across backgrounds), and an honest "user testing: done / not done" section.

## Measurements on the LIVE deploy (6abbf34b812c6f78715351cf)
- `npm test` against live: ALL PASSED.
- Lighthouse mobile: home perf 86 / a11y 100 / BP 100 / SEO 100 (FCP 1.6 s, LCP 2.3 s, TBT 430 ms); /evaluation 91/100/100/100; /references 94/100/100/100. Desktop home 99/100/100/100. (Local production build scored 93-96 on mobile; live is lower because of network and Netlify's injected script.)
- Real browser (puppeteer, live): rotation, hover pause, drag, resume, click-on-shape, reduced-motion (0 deg change), 0 overflow on all audited pages.

## Scores
| Criterion | Weight | Score | Note |
|---|---:|---:|---|
| Visual beauty and polish | 15 | 8.0 | Pixel polish verified only through image descriptions, not by a designer |
| Usability | 15 | 9.0 | |
| Arabic RTL typography | 10 | 9.0 | |
| Accessibility | 10 | 9.5 | Lighthouse 100 everywhere, keyboard sweep clean |
| Content trustworthiness | 15 | 9.0 | Template copy still needs scholarly review |
| Performance / real-browser | 10 | 8.5 | Live mobile home 86 (TBT 430 ms, style/layout of the SVG globe) |
| Competition fit | 25 | 8.5 | No real target-group testing and no measured benefit; cannot be fabricated |

**Weighted: 8.7 / 10. Gate (9.0): NOT MET.** The remaining gap is evidence (user testing, scholar review) and not fixable by code; loop stopped here rather than inflating the score.
