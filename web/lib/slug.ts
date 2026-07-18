/** Slug for a daily scale: slugified question + ISO date (matches migration 005). */
export function scaleSlug(question: string, date: string): string {
  const base = question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
  return `${base}-${date}`;
}
