export type CountryTheme = {
  flag: string;
  primary: string;
  secondary: string;
  headerText: string;
  stickerBg: string;
  nameBar: string;
};

export const COUNTRY_ORDER = [
  'Alemanha',
  'Argentina',
  'Brasil',
  'Colombia',
  'Croacia',
  'Equador',
  'Espanha',
  'França',
  'Holanda',
  'Inglaterra',
  'Marrocos',
  'Mexico',
  'Noruega',
  'Portugal',
  'Uruguai',
  'Coca Cola',
  'Global',
];

export const COUNTRY_THEMES: Record<string, CountryTheme> = {
  Alemanha: { flag: '🇩🇪', primary: '#000000', secondary: '#DD0000', headerText: '#FFFFFF', stickerBg: '#F5F5F5', nameBar: '#1B2838' },
  Argentina: { flag: '🇦🇷', primary: '#75AADB', secondary: '#FFFFFF', headerText: '#1B2838', stickerBg: '#E8F4FC', nameBar: '#1B2838' },
  Brasil: { flag: '🇧🇷', primary: '#009C3B', secondary: '#FFDF00', headerText: '#1B2838', stickerBg: '#E8F8EE', nameBar: '#002776' },
  Colombia: { flag: '🇨🇴', primary: '#FCD116', secondary: '#003893', headerText: '#1B2838', stickerBg: '#FFF8E1', nameBar: '#003893' },
  Croacia: { flag: '🇭🇷', primary: '#FF0000', secondary: '#FFFFFF', headerText: '#FFFFFF', stickerBg: '#FFEBEE', nameBar: '#171796' },
  Equador: { flag: '🇪🇨', primary: '#FFD100', secondary: '#003087', headerText: '#1B2838', stickerBg: '#FFFDE7', nameBar: '#003087' },
  Espanha: { flag: '🇪🇸', primary: '#AA151B', secondary: '#F1BF00', headerText: '#FFFFFF', stickerBg: '#FFEBEE', nameBar: '#AA151B' },
  França: { flag: '🇫🇷', primary: '#0055A4', secondary: '#EF4135', headerText: '#FFFFFF', stickerBg: '#E3F2FD', nameBar: '#0055A4' },
  Holanda: { flag: '🇳🇱', primary: '#FF6600', secondary: '#21468B', headerText: '#FFFFFF', stickerBg: '#FFF3E0', nameBar: '#21468B' },
  Inglaterra: { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', primary: '#FFFFFF', secondary: '#CF081F', headerText: '#CF081F', stickerBg: '#FAFAFA', nameBar: '#1B2838' },
  Marrocos: { flag: '🇲🇦', primary: '#C1272D', secondary: '#006233', headerText: '#FFFFFF', stickerBg: '#FFEBEE', nameBar: '#006233' },
  Mexico: { flag: '🇲🇽', primary: '#006847', secondary: '#CE1126', headerText: '#FFFFFF', stickerBg: '#E8F5E9', nameBar: '#006847' },
  Noruega: { flag: '🇳🇴', primary: '#BA0C2F', secondary: '#00205B', headerText: '#FFFFFF', stickerBg: '#FFEBEE', nameBar: '#00205B' },
  Portugal: { flag: '🇵🇹', primary: '#006600', secondary: '#FF0000', headerText: '#FFFFFF', stickerBg: '#E8F5E9', nameBar: '#006600' },
  Uruguai: { flag: '🇺🇾', primary: '#0038A8', secondary: '#FFFFFF', headerText: '#FFFFFF', stickerBg: '#E3F2FD', nameBar: '#0038A8' },
  'Coca Cola': { flag: '🥤', primary: '#F40009', secondary: '#FFFFFF', headerText: '#FFFFFF', stickerBg: '#FFEBEE', nameBar: '#1B2838' },
  Global: { flag: '🌍', primary: '#8A1538', secondary: '#EEB111', headerText: '#FFFFFF', stickerBg: '#FFF8F0', nameBar: '#8A1538' },
};

export const DEFAULT_THEME: CountryTheme = {
  flag: '⚽',
  primary: '#8A1538',
  secondary: '#EEB111',
  headerText: '#FFFFFF',
  stickerBg: '#FFF8F0',
  nameBar: '#1B2838',
};

export function getCountryTheme(country: string): CountryTheme {
  return COUNTRY_THEMES[country] ?? DEFAULT_THEME;
}

export function getCountryCode(country: string): string {
  const codes: Record<string, string> = {
    Alemanha: 'GER',
    Argentina: 'ARG',
    Brasil: 'BRA',
    Colombia: 'COL',
    Croacia: 'CRO',
    Equador: 'ECU',
    Espanha: 'ESP',
    França: 'FRA',
    Holanda: 'NED',
    Inglaterra: 'ENG',
    Marrocos: 'MAR',
    Mexico: 'MEX',
    Noruega: 'NOR',
    Portugal: 'POR',
    Uruguai: 'URU',
    'Coca Cola': 'CC',
    Global: 'GLB',
  };
  return codes[country] ?? country.slice(0, 3).toUpperCase();
}
