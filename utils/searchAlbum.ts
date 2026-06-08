import { AlbumCard } from './albumPages';
import { getCountryTheme } from '../data/countryThemes';

export function normalizeSearch(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export type SelectionSearchResult = {
  country: string;
  count: number;
  theme: ReturnType<typeof getCountryTheme>;
};

export type AlbumSearchResults = {
  players: AlbumCard[];
  selections: SelectionSearchResult[];
};

export function searchAlbum(items: AlbumCard[], query: string): AlbumSearchResults {
  const q = normalizeSearch(query);
  if (!q) return { players: [], selections: [] };

  const players = items.filter((item) => {
    const title = normalizeSearch(item.title ?? item.nome);
    const subtitle = normalizeSearch(item.subtitle ?? '');
    return title.includes(q) || subtitle.includes(q);
  });

  const selectionCounts = new Map<string, number>();
  items.forEach((item) => {
    const country = item.selecao || 'Global';
    if (normalizeSearch(country).includes(q)) {
      selectionCounts.set(country, (selectionCounts.get(country) ?? 0) + 1);
    }
  });

  const selections = Array.from(selectionCounts.entries())
    .map(([country, count]) => ({
      country,
      count,
      theme: getCountryTheme(country),
    }))
    .sort((a, b) => a.country.localeCompare(b.country, 'pt-BR'));

  return { players, selections };
}

export function findPageIndexForCountry(
  pages: Array<{ country: string }>,
  country: string
): number {
  return pages.findIndex((page) => page.country === country);
}
