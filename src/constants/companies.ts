import { Company } from "@prisma/client";

export const COMPANIES = {
  google: Company.GOOGLE,
  amazon: Company.AMAZON,
  meta: Company.META,
  microsoft: Company.MICROSOFT,
  bloomberg: Company.BLOOMBERG,
  apple: Company.APPLE,
  uber: Company.UBER,
  adobe: Company.ADOBE,
  tiktok: Company.TIKTOK,
  oracle: Company.ORACLE,
  linkedin: Company.LINKEDIN,
  nvidia: Company.NVIDIA,
  roblox: Company.ROBLOX,
  intuit: Company.INTUIT,
};

export const READABLE_COMPANIES: Record<Company, string> = {
  GOOGLE: "Google",
  AMAZON: "Amazon",
  META: "Meta",
  MICROSOFT: "Microsoft",
  BLOOMBERG: "Bloomberg",
  APPLE: "Apple",
  UBER: "Uber",
  ADOBE: "Adobe",
  TIKTOK: "TikTok",
  ORACLE: "Oracle",
  LINKEDIN: "LinkedIn",
  NVIDIA: "Nvidia",
  ROBLOX: "Roblox",
  INTUIT: "Intuit",
};

export interface CompanyInfo {
  id: string;
  db: Company;
  readable: string;
}

export const COMPANY_LIST: CompanyInfo[] = Object.entries(COMPANIES).map(
  ([id, db]) => ({
    id: id,
    db,
    readable: READABLE_COMPANIES[db] ?? db,
  })
);
