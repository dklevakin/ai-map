const PLACEHOLDER = '/assets/service-placeholder.svg';

function extractDomain(href: string): string | null {
  try {
    const url = new URL(href);
    return url.hostname.replace(/^www\./, '');
  } catch (error) {
    return null;
  }
}

export function getServiceLogoUrl(href: string): string {
  const domain = extractDomain(href);
  if (!domain) {
    return PLACEHOLDER;
  }
  return `https://logo.clearbit.com/${domain}`;
}

export function getFallbackLogo(): string {
  return PLACEHOLDER;
}
