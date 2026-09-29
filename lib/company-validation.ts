import type { CompanyDetails } from "./companies-repository";

export function validateCompanyDetails(
  value: unknown,
): CompanyDetails | string {
  const body =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  const company_name = String(body.company_name ?? "").trim();
  const rawWebsite = String(body.company_website ?? "").trim();
  const company_telephone = String(body.company_telephone ?? "").trim();
  const company_address = String(body.company_address ?? "").trim();
  const company_ntn = String(body.company_ntn ?? "").trim();

  if (company_name.length < 2 || company_name.length > 150) {
    return "Company name must be 2-150 characters.";
  }
  if (rawWebsite.length > 300) {
    return "Company website must not exceed 300 characters.";
  }

  const company_website = /^https?:\/\//i.test(rawWebsite)
    ? rawWebsite
    : `https://${rawWebsite}`;
  let websiteUrl: URL;
  try {
    websiteUrl = new URL(company_website);
  } catch {
    return "Enter a valid company website.";
  }
  if (
    !["http:", "https:"].includes(websiteUrl.protocol) ||
    !websiteUrl.hostname.includes(".")
  ) {
    return "Enter a valid company website.";
  }

  const telephoneDigits = company_telephone.replace(/\D/g, "");
  if (
    company_telephone.length < 7 ||
    company_telephone.length > 30 ||
    telephoneDigits.length < 7 ||
    !/^[+()\d\s.-]+$/.test(company_telephone)
  ) {
    return "Enter a valid company telephone number.";
  }
  if (company_address.length < 5 || company_address.length > 300) {
    return "Company address must be 5-300 characters.";
  }
  if (
    company_ntn.length < 4 ||
    company_ntn.length > 50 ||
    !/^[a-z\d/-]+$/i.test(company_ntn)
  ) {
    return "Enter a valid NTN number.";
  }

  return {
    company_name,
    company_website: websiteUrl.toString(),
    company_telephone,
    company_address,
    company_ntn,
  };
}