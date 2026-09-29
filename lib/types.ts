export type Bi = { ar: string; en: string };
export type Locale = "ar" | "en";
export type Background = "christian" | "unaffiliated" | "hindu" | "buddhist_ea" | "unspecified";
export const BACKGROUNDS: Background[] = ["christian", "unaffiliated", "hindu", "buddhist_ea", "unspecified"];
export const BG_LABEL: Record<Background, Bi> = {
  christian: { ar: "مسيحية", en: "Christian" },
  unaffiliated: { ar: "بلا انتماء ديني", en: "No affiliation" },
  hindu: { ar: "هندوسية", en: "Hindu" },
  buddhist_ea: { ar: "بوذية / شرق آسيوية", en: "Buddhist / East Asian" },
  unspecified: { ar: "لا أحدد", en: "Prefer not to say" },
};
export type Headline = Bi & { section: string; claim_ids?: string[] };
export type Center = { id: string; name: Bi; url: string; verified: boolean; verified_on: string; about: Bi; scope: string };
export type JourneyResult = {
  iso3: string;
  country: Bi;
  template_id: string;
  explicit_background: boolean;
  badge: { ar: string; en: string; note?: Bi | null; variant: string };
  headlines: Headline[];
  detail: (Bi & { claim_ids: string[]; words: { ar: number; en: number } }) | null;
  claim_ids: string[];
  centers: Center[];
  abstain_flag: boolean;
  abstain_reason?: string;
  referral?: (Bi & { centers: Center[] }) | null;
  missing_figure?: (Bi & { link: string }) | null;
  answer?: { snippets: (Bi & { claim_ids?: string[] })[]; no_match: boolean } | null;
  next_step: (Bi & { claim_ids?: string[] }) | null;
  method: string;
};
