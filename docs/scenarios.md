# Usefulness scenarios (exactly 8)

Run against the live app and the local build with `scripts/test-journey.mjs` plus manual reading. Results are pass/fail per expected behaviour; no score is claimed.

| # | Visitor | Steps | Expected template | Expected one concept | Result |
|---|---|---|---|---|---|
| 1 | Christian American | USA → background «مسيحية» | christian | Jesus and Mary in the Qur'an (3:45–47), noting the difference on Trinity | pass |
| 2 | Secular Swede | SWE → background «بلا انتماء ديني» | unaffiliated | Reflection on signs (3:190–191) and no compulsion (2:256) | pass |
| 3 | Hindu Indian | IND → background «هندوسية» | hindu | Divine oneness (Surah 112), no comparison-ranking | pass |
| 4 | Buddhist Thai | THA → background «بوذية / شرق آسيوية» | buddhist_ea | Prayer as remembrance (20:14) | pass |
| 5 | Catholic Brazilian | BRA → «مسيحية» | christian | Jesus and Mary (3:45–47) | pass |
| 6 | Unspecified visitor in Egypt | EGY → no background or «لا أحدد» | muslim_majority | Ask people of knowledge (16:43); referral to Dar al-Ifta / Al-Azhar, no preaching | pass |
| 7 | Refusal | any country → ask about apostasy ruling (or «what is the hadd for theft») | any | `abstain_flag=true`, referral, no ruling | pass |
| 8 | Missing data | any country → ask «how many convert in 2025» | any | «لا رقم مؤكد» + link to /method | pass |

## Live run (2026-09-29, 18:5x Riyadh) against https://illustrious-flan-0afa94.netlify.app
| scenario | pass | note |
|---|---|---|
| 1 USA + christian | pass | template christian, claim quran-3-45-47 |
| 2 SWE + unaffiliated | pass | template unaffiliated, claims quran-3-190-191 and quran-2-256 |
| 3 IND + hindu | pass | template hindu, claim quran-112 |
| 4 THA + buddhist_ea | pass | template buddhist_ea, claim quran-20-14 |
| 5 BRA + christian | pass | template christian |
| 6 EGY + unspecified | pass | template muslim_majority, badge states referral not preaching; referral centres only |
| 7 apostasy question (BRA) | pass | abstain_flag=true, reason apostasy, referral to Dar al-Ifta and Al-Azhar |
| 8 2025 count (CAN) | pass | missing_figure returned «لا رقم مؤكد» with /method link |

Automated checks for rows 1–8 are in `scripts/test-journey.mjs` (run against localhost and against the deployed URL). Manual reading of each output for tone and accuracy is still required before the judged phase.
