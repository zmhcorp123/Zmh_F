export const countries = [
  { name: "United States", code: "US", dialCode: "+1" },
  { name: "Canada", code: "CA", dialCode: "+1" },
  { name: "United Kingdom", code: "GB", dialCode: "+44" },
  { name: "Australia", code: "AU", dialCode: "+61" },
  { name: "Bangladesh", code: "BD", dialCode: "+880" },
  { name: "India", code: "IN", dialCode: "+91" },
  { name: "Pakistan", code: "PK", dialCode: "+92" },
  { name: "United Arab Emirates", code: "AE", dialCode: "+971" },
];

export function countryByCode(code) {
  return countries.find((country) => country.code === code) || countries[0];
}
