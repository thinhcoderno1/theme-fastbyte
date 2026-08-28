const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

function requiredUrl(name: 'NEXT_PUBLIC_SITE_URL' | 'NEXT_PUBLIC_ASSET_BASE_URL' | 'WORDPRESS_API_URL' | 'WORDPRESS_SITE_URL'): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Thiếu biến môi trường bắt buộc ${name}. Hãy sao chép .env.example thành .env.local và cấu hình lại.`);
  }

  try {
    return trimTrailingSlash(new URL(value).toString());
  } catch {
    throw new Error(`Biến môi trường ${name} phải là URL hợp lệ, bao gồm http:// hoặc https://.`);
  }
}

export function getSiteUrl(): string {
  return requiredUrl('NEXT_PUBLIC_SITE_URL');
}

export function getWordPressApiUrl(): string {
  return requiredUrl('WORDPRESS_API_URL');
}

export function getWordPressSiteUrl(): string {
  return requiredUrl('WORDPRESS_SITE_URL');
}

export function getAssetBaseUrl(): string {
  return requiredUrl('NEXT_PUBLIC_ASSET_BASE_URL');
}

export function isIndexingAllowed(): boolean {
  return process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true';
}

export function absoluteSiteUrl(path = '/'): string {
  return new URL(path, `${getSiteUrl()}/`).toString();
}
