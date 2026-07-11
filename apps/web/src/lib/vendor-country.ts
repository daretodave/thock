export const COUNTRY_LABEL: Record<string, string> = {
  US: 'United States',
  CN: 'China',
  JP: 'Japan',
  DE: 'Germany',
  UK: 'United Kingdom',
  HK: 'Hong Kong',
  NL: 'Netherlands',
  KR: 'South Korea',
  TW: 'Taiwan',
  FR: 'France',
}

export function countryLabel(countryCode: string): string {
  return COUNTRY_LABEL[countryCode] ?? countryCode
}
