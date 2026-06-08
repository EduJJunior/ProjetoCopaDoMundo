import { CardItem } from '../data/mockData';
import { COUNTRY_ORDER, getCountryTheme } from '../data/countryThemes';

export type FilterType = 'all' | 'team' | 'player' | 'stadium' | 'mascot' | 'coach';

export type AlbumCard = CardItem & {
  type: FilterType;
  title: string;
  subtitle: string;
  image: unknown;
  description: string;
  stats: string;
  curiosity: string;
  stickerNumber: number;
};

export type AlbumPage = {
  id: string;
  country: string;
  countryPage: number;
  countryTotalPages: number;
  pageIndex: number;
  totalPages: number;
  stickers: AlbumCard[];
  theme: ReturnType<typeof getCountryTheme>;
};

export const STICKERS_PER_PAGE = 6;
export const GRID_COLS = 2;
export const HOME_GRID_COLS = 2;

const TYPE_LABELS: Record<string, string> = {
  player: 'Jogador',
  team: 'Seleção',
  stadium: 'Estádio',
  mascot: 'Mascote',
  coach: 'Técnico',
};

export function getTypeLabel(type?: string, uppercase = false): string {
  const label = TYPE_LABELS[type ?? 'player'] ?? type ?? 'Jogador';
  return uppercase ? label.toUpperCase() : label;
}

export function getStickerRole(item: Pick<AlbumCard, 'posicao' | 'type'>): string {
  const posicao = item.posicao?.trim();
  if (posicao && posicao.toLowerCase() !== 'player') return posicao;
  return getTypeLabel(item.type);
}

export function getItemType(item: CardItem): Exclude<FilterType, 'all'> {
  if (item.type) return item.type as Exclude<FilterType, 'all'>;
  const position = item.posicao?.toLowerCase() ?? '';
  if (position.includes('técnico') || position.includes('tecnico')) return 'coach';
  if (position === 'estádio' || position === 'estadio') return 'stadium';
  if (position === 'seleção' || position === 'selecao') return 'team';
  if (position === 'mascote') return 'mascot';
  return 'player';
}

export function normalizeAlbumItem(item: CardItem, stickerNumber: number): AlbumCard {
  return {
    ...item,
    type: getItemType(item),
    title: item.title ?? item.nome,
    subtitle: item.subtitle ?? `${item.selecao} • ${item.posicao}`,
    image: item.imagem,
    description: item.description ?? item.curiosidade,
    stats: item.stats ?? item.posicao,
    curiosity: item.curiosity ?? item.curiosidade,
    stickerNumber,
  };
}

export function getCountryItems(items: AlbumCard[], country: string, filter: FilterType = 'all'): AlbumCard[] {
  return items.filter((item) => {
    const matchesCountry = item.selecao === country;
    const matchesFilter = filter === 'all' || item.type === filter;
    return matchesCountry && matchesFilter;
  });
}

export type SelectionSummary = {
  country: string;
  count: number;
  theme: ReturnType<typeof getCountryTheme>;
};

export function buildSelectionsSummary(items: AlbumCard[], filter: FilterType = 'all'): SelectionSummary[] {
  const counts = new Map<string, number>();

  items.forEach((item) => {
    if (filter !== 'all' && item.type !== filter) return;
    const country = item.selecao || 'Global';
    counts.set(country, (counts.get(country) ?? 0) + 1);
  });

  const countries = [
    ...COUNTRY_ORDER.filter((c) => counts.has(c)),
    ...Array.from(counts.keys()).filter((c) => !COUNTRY_ORDER.includes(c)).sort(),
  ];

  return countries.map((country) => ({
    country,
    count: counts.get(country) ?? 0,
    theme: getCountryTheme(country),
  }));
}

export function buildAlbumPages(items: AlbumCard[]): AlbumPage[] {
  const byCountry = new Map<string, AlbumCard[]>();

  items.forEach((item) => {
    const country = item.selecao || 'Global';
    if (!byCountry.has(country)) byCountry.set(country, []);
    byCountry.get(country)!.push(item);
  });

  const countries = [
    ...COUNTRY_ORDER.filter((c) => byCountry.has(c)),
    ...Array.from(byCountry.keys()).filter((c) => !COUNTRY_ORDER.includes(c)).sort(),
  ];

  const pages: AlbumPage[] = [];
  let pageIndex = 0;

  countries.forEach((country) => {
    const countryItems = byCountry.get(country) ?? [];
    const countryTotalPages = Math.max(1, Math.ceil(countryItems.length / STICKERS_PER_PAGE));

    for (let i = 0; i < countryTotalPages; i += 1) {
      const slice = countryItems.slice(i * STICKERS_PER_PAGE, (i + 1) * STICKERS_PER_PAGE);
      pages.push({
        id: `${country}-${i + 1}`,
        country,
        countryPage: i + 1,
        countryTotalPages,
        pageIndex,
        totalPages: 0,
        stickers: slice.map((item, idx) => ({
          ...item,
          stickerNumber: i * STICKERS_PER_PAGE + idx + 1,
        })),
        theme: getCountryTheme(country),
      });
      pageIndex += 1;
    }
  });

  return pages.map((page) => ({ ...page, totalPages: pages.length }));
}

export function normalizeAlbumData(albumData: CardItem[]): AlbumCard[] {
  const counters = new Map<string, number>();
  return albumData.map((item) => {
    const country = item.selecao || 'Global';
    const next = (counters.get(country) ?? 0) + 1;
    counters.set(country, next);
    return normalizeAlbumItem(item, next);
  });
}
