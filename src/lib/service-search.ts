import { MAIN_CATEGORIES } from "@/data/categoriesData";

const normalize = (value: string) => value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").trim();
const firstWord = (value: string) => normalize(value).split(/[^a-z0-9]+/).find(Boolean) ?? "";

/** Resolves a category key, English name, German name or a loose label ("Business & IT") to a MAIN_CATEGORIES key. */
export function resolveCategoryKey(value?: string | null): string | undefined {
  if (!value) return undefined;
  const wanted = normalize(value);
  const exact = MAIN_CATEGORIES.find((category) =>
    [category.key, category.nameEn, category.nameDe].some((name) => normalize(name) === wanted)
  );
  if (exact) return exact.key;

  const word = firstWord(value);
  return MAIN_CATEGORIES.find((category) => firstWord(category.nameEn) === word || firstWord(category.nameDe) === word)?.key;
}

const splitNames = (name: string) => name.split(/\s*[/,]\s*/).map(normalize).filter(Boolean);

/** Light English stemming so "painter", "painting" and "paint" all match each other. */
const stem = (word: string) => {
  for (const suffix of ["ings", "ing", "ers", "er", "es", "s"]) {
    if (word.endsWith(suffix) && word.length - suffix.length >= 4) return word.slice(0, -suffix.length);
  }
  return word;
};

const stemPhrase = (phrase: string) => phrase.split(/\s+/).map(stem).join(" ");

/**
 * Expands a search term with the matching specialisations in both languages,
 * so "Plumbing" also finds "Sanitär" and "Cleaning" finds "Gebäudereinigung".
 */
export function expandSearchTerms(term: string): string[] {
  const wanted = stemPhrase(normalize(term));
  if (!wanted) return [];
  const terms = new Set([wanted]);

  for (const category of MAIN_CATEGORIES) {
    for (const spec of category.specializations) {
      const parts = [...splitNames(spec.nameEn), ...splitNames(spec.nameDe)].map(stemPhrase);
      if (parts.some((part) => part.includes(wanted) || wanted.includes(part))) {
        parts.forEach((part) => terms.add(part));
      }
    }
  }
  return [...terms];
}

export function matchesSearch(fields: Array<string | undefined>, terms: string[]) {
  if (terms.length === 0) return true;
  const haystack = normalize(fields.filter(Boolean).join(" "));
  return terms.some((term) => haystack.includes(term));
}
