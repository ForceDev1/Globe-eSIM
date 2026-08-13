export type Country = {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  price: string; // starting price in USD, e.g. "4.50"
};

export const countries: Country[] = [
  { code: "TR", name: "Turkey", price: "4.50" },
  { code: "US", name: "United States", price: "5.00" },
  { code: "GB", name: "United Kingdom", price: "4.00" },
  { code: "FR", name: "France", price: "4.50" },
  { code: "DE", name: "Germany", price: "4.50" },
  { code: "ES", name: "Spain", price: "4.00" },
  { code: "IT", name: "Italy", price: "4.50" },
  { code: "TH", name: "Thailand", price: "3.50" },
  { code: "AE", name: "United Arab Emirates", price: "6.00" },
  { code: "JP", name: "Japan", price: "5.50" },
  { code: "KR", name: "South Korea", price: "5.00" },
  { code: "GE", name: "Georgia", price: "3.50" },
  { code: "GR", name: "Greece", price: "4.00" },
  { code: "MX", name: "Mexico", price: "5.00" },
  { code: "ID", name: "Indonesia", price: "4.50" },
  { code: "VN", name: "Vietnam", price: "3.50" },
  { code: "AU", name: "Australia", price: "5.50" },
];

/** ISO alpha-2 code -> flag emoji, via regional indicator symbols. */
export function flagEmoji(code: string) {
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export const popularCountryCodes = ["TR", "AE", "TH", "US", "FR", "JP"];

export const suggestedForYouCodes = ["DE", "GR", "AU"];

export function findCountry(code: string | null) {
  return countries.find((c) => c.code === code) ?? null;
}
