# Graf Loop rubric — Islamic Religion Atlas (track 03: interactive experiences and the knowledge journey)

Adapted from an audit -> score /10 -> targeted fixes -> redeploy -> re-audit loop with a gate at >= 9.0 and a maximum number of cycles. Weights follow the competition
guide's final judging criteria (25 technical/AI, 15 reliability and scholarly safety, 15 innovation, 10 user experience
and accessibility, 20 benefit against the track's success criterion, 10 operations realism, 5 clarity and verifiability)
and the user's site criteria. Track 03 success criterion: understanding of an Islamic concept, sequencing and continuity of
the journey, privacy, and never inferring or classifying the user's religion.

| # | Criterion | Weight | What a 9 looks like |
|---|-----------|-------:|---------------------|
| 1 | Visual beauty and polish (home, globe) | 15% | Globe is genuinely elegant, labelled, always turning until touched; one editorial object across pages; no clipped or crowded areas at 390 and 1280 px |
| 2 | Usability, casual reader and researcher | 15% | Search, filter, globe and list both select; every percentage links to its source row; obvious reading flow; mobile is comfortable |
| 3 | Arabic RTL typography | 10% | Correct RTL everywhere, Arabic line-height and size comfortable, numerals and Latin ids isolated, EN mirror is faithful |
| 4 | Accessibility | 10% | Lighthouse a11y 100, keyboard reaches every action, visible focus, reduced-motion respected, contrast >= 4.5 on text |
| 5 | Content trustworthiness | 15% | Sources closed and visible, abstains on rulings, «لا رقم مؤكد» for gaps, no proselytising, no invented numbers |
| 6 | Performance and real-browser behaviour | 10% | Lighthouse mobile perf >= 90, animation smooth, drag/hover/click verified in a real browser |
| 7 | Competition fit (track 03 journey + judging criteria) | 25% | The journey (interest -> concept -> source -> centre) is legible from the home page; AI function, abstention and verification are shown, not just claimed; limits and operations are honest |

Scoring rules: half-points allowed; a criterion cannot exceed 8 if a real defect at that level is open; the auditor is the
same agent that builds, so scores are conservative and every claim is backed by a measurement in the cycle file.
Tools: puppeteer-core with system Chrome (real rendering, AR/EN, 1280 and 390 px), Lighthouse CLI, scripts/test-journey.mjs.
Limitation stated up front: screenshots are read through an image-description tool, so pixel-level judgements (kerning,
exact colour) are not verifiable; layout facts are backed by DOM measurements instead.
