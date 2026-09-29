// Usage: BASE=http://localhost:3000 node scripts/test-journey.mjs
const BASE = process.env.BASE || "http://localhost:3000";
const ISO = ["FRA","SWE","USA","DEU","GBR","IND","JPN","THA","NGA","BRA","EGY","CAN"];
let fail = 0;
const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fail++; };
const post = (b) => fetch(BASE + "/api/journey", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(b) }).then(async r => ({ s: r.status, j: await r.json() }));
for (const i of ISO) {
  const r = await fetch(`${BASE}/country/${i}`); const html = await r.text();
  ok(r.status === 200 && html.includes("/references#pew-country-table-2020"), `country page ${i} opens, pct links to /references`);
  const { s, j } = await post({ iso3: i });
  const wc = j.detail.ar.split(/\s+/).length, we = j.detail.en.split(/\s+/).length;
  ok(s === 200 && j.headlines.length >= 5 && j.headlines.length <= 8 && wc >= 60 && wc <= 90 && we >= 60 && we <= 90 && j.headlines.every(h => h.ar.split(/\s+/).length <= 18 && h.en.split(/\s+/).length <= 18) && j.abstain_flag === false, `journey ${i}: 5-8 headlines<=18w, detail 60-90 words (${wc}/${we})`);
}
const a = (await post({ iso3: "IND", background: "hindu" })).j, b = (await post({ iso3: "FRA", background: "unaffiliated" })).j;
ok(a.template_id !== b.template_id && a.detail.en !== b.detail.en && a.headlines[0].en !== b.headlines[0].en, "IND+hindu differs from FRA+unaffiliated");
for (const q of ["what is the hadd for theft", "ما حد السرقة؟", "What is the ruling on apostasy?", "is hijab obligatory"]) {
  const r = (await post({ iso3: "FRA", question: q })).j; ok(r.abstain_flag === true && r.referral && r.centers.length > 0, `abstains: ${q}`);
}
const m = (await post({ iso3: "USA", question: "how many people convert in 2025" })).j; ok(m.missing_figure && /لا رقم مؤكد/.test(m.missing_figure.ar), "2025 count -> لا رقم مؤكد");
const e = (await post({ iso3: "EGY" })).j; ok(e.template_id === "muslim_majority" && e.centers.every(c => c.scope === "referral"), "EGY muslim_majority, referral centres only");
const n = (await post({ iso3: "NGA" })).j; ok(/Christian framing beside a Muslim majority/.test(n.badge.en), "NGA badge");
const x = (await post({ iso3: "ZZZ" })); ok(x.s === 400, "unknown iso3 -> 400 no crash");
const y = await fetch(BASE + "/api/journey", { method: "POST", body: "not json" }); ok(y.status === 400, "bad json -> 400");
const z = (await post({ iso3: "SWE", background: "unspecified" })).j; ok(z.template_id === "christian" && !z.explicit_background, "unspecified falls back to country template");
const q1 = (await post({ iso3: "GBR", question: "tell me about Jesus and Mary" })).j; ok(!q1.abstain_flag && q1.answer && !q1.answer.no_match, "free question retrieves from pack");
const refs = await (await fetch(BASE + "/references")).text(); ok(refs.includes("البيان") && refs.includes("الناشر"), "references table headers (ar)");
const home = await (await fetch(BASE + "/")).text(); ok(home.includes('dir="rtl"') && home.includes('lang="ar"'), "home rtl/ar default");
const en = await (await fetch(BASE + "/", { headers: { cookie: "lang=en" } })).text(); ok(en.includes('dir="ltr"') && en.includes("Islamic Religion Atlas"), "EN toggle via cookie");
console.log(fail ? `${fail} FAILED` : "ALL PASSED"); process.exit(fail ? 1 : 0);
