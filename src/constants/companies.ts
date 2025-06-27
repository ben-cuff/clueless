export const COMPANIES = {
  google: "GOOGLE",
  amazon: "AMAZON",
  meta: "META",
  microsoft: "MICROSOFT",
  bloomberg: "BLOOMBERG",
  apple: "APPLE",
  uber: "UBER",
  adobe: "ADOBE",
  tiktok: "TIKTOK",
  oracle: "ORACLE",
  linkedin: "LINKEDIN",
  nvidia: "NVIDIA",
  roblox: "ROBLOX",
  intuit: "INTUIT",
};

export type Company = keyof typeof COMPANIES;

export const READABLE_COMPANIES: Record<string, string> = {
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
  id: Company;
  db: string;
  readable: string;
}

export const COMPANY_LIST: CompanyInfo[] = Object.entries(COMPANIES).map(
  ([id, db]) => ({
    id: id as Company,
    db,
    readable: READABLE_COMPANIES[db] ?? db,
  })
);

export type UppercaseCompany =
  | "GOOGLE"
  | "AMAZON"
  | "META"
  | "MICROSOFT"
  | "BLOOMBERG"
  | "APPLE"
  | "UBER"
  | "ADOBE"
  | "TIKTOK"
  | "ORACLE"
  | "LINKEDIN"
  | "NVIDIA"
  | "ROBLOX"
  | "INTUIT";
