export interface CardItem {
  id: string;
  type: 'team' | 'player' | 'stadium';
  title: string;
  subtitle: string;
  description: string;
  stats: string;
  curiosity: string;
  image: string;
}

export const albumData: CardItem[] = [
  {
    id: '1',
    type: 'team',
    title: 'Brasil',
    subtitle: 'Confederação Brasileira de Futebol',
    description: 'A única seleção a participar de todas as edições da Copa do Mundo e a maior vencedora do torneio.',
    stats: '5 Títulos | 109 Jogos | 237 Gols',
    curiosity: 'O Brasil é o único país que possui a posse definitiva da Taça Jules Rimet original (embora tenha sido roubada em 1983).',
    image: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=500'
  },
  {
    id: '2',
    type: 'player',
    title: 'Pelé',
    subtitle: 'O Rei do Futebol',
    description: 'Considerado o maior jogador de todos os tempos, conquistou três Copas do Mundo como jogador.',
    stats: '14 Jogos | 12 Gols | 3 Títulos',
    curiosity: 'É o jogador mais jovem a marcar em uma final de Copa do Mundo, com apenas 17 anos em 1958.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500'
  },
  {
    id: '3',
    type: 'stadium',
    title: 'Maracanã',
    subtitle: 'Rio de Janeiro, Brasil',
    description: 'Palco de duas finais de Copa do Mundo (1950 e 2014) e um dos templos mais sagrados do futebol mundial.',
    stats: 'Capacidade atual: 78.838 | Inauguração: 1950',
    curiosity: 'O recorde oficial de público do estádio foi na final de 1950, com quase 200.000 pessoas presentes.',
    image: 'https://images.unsplash.com/photo-1563299446-f94bf82068ee?w=500'
  }
];

export const historyData = [
  { year: '2022', host: 'Catar', winner: 'Argentina', runnerUp: 'França', scorer: 'Mbappé (8 gols)' },
  { year: '2018', host: 'Rússia', winner: 'França', runnerUp: 'Croácia', scorer: 'Harry Kane (6 gols)' },
  { year: '2014', host: 'Brasil', winner: 'Alemanha', runnerUp: 'Argentina', scorer: 'James Rodríguez (6 gols)' },
];

export const quizData = [
  {
    question: 'Qual país venceu a primeira Copa do Mundo em 1930?',
    options: ['Brasil', 'Argentina', 'Uruguai', 'Itália'],
    correct: 2
  },
  {
    question: 'Quem é o maior artilheiro da história das Copas?',
    options: ['Pelé', 'Miroslav Klose', 'Ronaldo Fenômeno', 'Lionel Messi'],
    correct: 1
  }
];