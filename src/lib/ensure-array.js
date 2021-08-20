export function ensureArray(candidate) {
  if (!Array.isArray(candidate)) {
    return [candidate].filter(Boolean)
  }
  return candidate
}
