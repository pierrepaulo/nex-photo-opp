/**
 * Mascara IP para logs: IPv4 como a.b.*.*; IPv6 reduzido a prefixo + :***
 */
export function maskIp(raw: string | undefined): string {
  if (!raw || raw.trim() === '') {
    return 'unknown';
  }

  const ip = raw.split(',')[0]?.trim() ?? raw;

  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4 && parts.every((p) => /^\d{1,3}$/.test(p))) {
      return `${parts[0]}.${parts[1]}.*.*`;
    }
  }

  if (ip.includes(':')) {
    const segments = ip.split(':').filter(Boolean);
    if (segments.length >= 2) {
      return `${segments[0]}:${segments[1]}:***`;
    }
  }

  return '*';
}
