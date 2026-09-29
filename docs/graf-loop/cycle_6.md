# Cycle 6 (20:34-20:50)

## Defects targeted (from the cycle 5 weaknesses)
1. Mobile performance of the home page (live Lighthouse 86, blocking time 430 ms).
2. Visual hierarchy of home, globe and country panel.
3. Competition fit: the reader-test protocol was prose only; the per-background value was shown as similarity numbers only.

## Changes
- Globe is no longer in the home HTML/JS: the server draws a coarse static SVG placeholder (land at the start rotation, same size, labels for 7 countries) and `HomeExplorer` loads `components/Globe` (d3-geo) plus `/api/globe` (land, borders, per-country shapes; static, cached) after first paint. Home HTML 251 KB -> about 63 KB, page JS 13.1 kB -> 2.8 kB.
- Layout shift: the placeholder reserves the Pause button's space; measured CLS went 0.26 -> 0 (found with a layout-shift observer, not guessed).
- Globe repaint throttle 40/80 ms; rotation starts 0.8 s after the interactive globe mounts.
- `/evaluation`: real side-by-side outputs for France under four explicit backgrounds (headline, first sentence of the detail, source ids linking to the references), and a reader test sheet (consent and no-tracking note, three tasks with success criteria, blank observation table with no name field), copyable and printable (print CSS shows only the sheet). It states that nobody has taken part and shows no participant figures.
- Visual: numbered section marks with a brass rule, a large lead figure on the country page (largest group and its percentage, isolated LTR), depth behind the globe (soft glow and drop shadow), a gradient on the country panel, brass edge on the badge, hero size in Arabic.

## Measurements (local production build unless noted)
- Mobile Lighthouse home: 81 (before) -> 95 / 95 / 95 after the final pass (see cycle 7); acceptance ALL PASSED.
- Live after the cycle 6 deploy (6abbf9f6e336554d27a26e57): home mobile 82 / 82 / 81 (blocking time 620-700 ms: the 120 KB geometry fetch and path work ran during the measurement window). Not good enough; this drove cycle 7.

## Scores
| Criterion | Weight | Score | Note |
|---|---:|---:|---|
| Visual beauty and polish | 15 | 8.5 | Hierarchy and depth added; judged from screenshot descriptions only |
| Usability | 15 | 9.0 | |
| Arabic RTL typography | 10 | 9.0 | |
| Accessibility | 10 | 9.5 | |
| Content trustworthiness | 15 | 9.0 | |
| Performance / real-browser | 10 | 8.0 | live mobile home 81-82 |
| Competition fit | 25 | 8.5 | Protocol and demo are usable now, but there is still no real reader evidence |

**Weighted: 8.75 / 10. Gate: NOT MET.**
