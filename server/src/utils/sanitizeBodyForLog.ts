const SENSITIVE_KEYS = new Set(
  ['password', 'senha', 'passwordhash', 'token', 'authorization', 'refreshtoken'].map((k) =>
    k.toLowerCase(),
  ),
);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Serializa body para log, removendo campos sensiveis (case-insensitive nas chaves).
 */
export function sanitizeBodyForLog(body: unknown): string {
  if (body === undefined || body === null) {
    return '{}';
  }

  if (!isPlainObject(body)) {
    return JSON.stringify({ _note: 'non-json-body' });
  }

  const clone: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      continue;
    }
    clone[key] = value;
  }

  try {
    return JSON.stringify(clone);
  } catch {
    return '{}';
  }
}
