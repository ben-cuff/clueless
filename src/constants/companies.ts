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