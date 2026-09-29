import countriesJson from "@/data/countries.json";
import templatesJson from "@/data/templates.json";
import referencesJson from "@/data/references.json";
import centersJson from "@/data/centers.json";
import worldJson from "@/data/world_2020_pew.json";
import type { Bi, Center } from "./types";

export type Comp = { g: string; pct: number };
export type Country = {
  iso3: string; numeric: string; name: Bi; content_template_id: string; badge_variant: string;
  composition: Comp[]; headcounts_2020_million: Record<string, number | null>; total_population_million: number | null;
};
export type Reference = { claim_id: string; type: string; statement_ar: string; statement_en: string; year: number | null; publisher: string; url: string };

export const countries = countriesJson.countries as Country[];
export const countriesMeta = countriesJson;
export const templates = templatesJson.templates as Record<string, any>;
export const badges = templatesJson.badges as Record<string, any>;
export const references = referencesJson.references as Reference[];
export const centersData = centersJson as any;
export const world = worldJson as any;
export const groupLabels = worldJson.group_labels as Record<string, Bi>;
export const missingLabel = countriesJson.missing_label as Bi;

export const getCountry = (iso3: string) => countries.find((c) => c.iso3 === iso3.toUpperCase());
export const getRef = (id: string) => references.find((r) => r.claim_id === id);
export const allCenters = centersData.centers as (Center & { countries: string[] })[];
