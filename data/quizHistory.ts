export type QuizQuestion = {
  question: string;
  options: string[];
  correct: number;
};

export type QuizPack = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  questions: QuizQuestion[];
};

export const quizPacks: QuizPack[] = [
  {
    id: 'classic',
    title: 'Copa Clássica',
    description: 'Sedes, finais e campeões que marcaram gerações.',
    emoji: '🏆',
    questions: [
      {
        question: 'Qual país sediou a Copa do Mundo de 2014?',
        options: ['Brasil', 'Rússia', 'Alemanha', 'África do Sul'],
        correct: 0,
      },
      {
        question: 'Quem foi o artilheiro da Copa de 2022?',
        options: ['Kylian Mbappé', 'Lionel Messi', 'Olivier Giroud', 'Harry Kane'],
        correct: 0,
      },
      {
        question: 'Em qual ano o Brasil conquistou sua primeira Copa do Mundo?',
        options: ['1950', '1958', '1962', '1970'],
        correct: 1,
      },
      {
        question: 'Qual estádio foi palco da final da Copa do Mundo de 2022?',
        options: ['Lusail Iconic Stadium', 'Maracanã', 'Wembley', 'MetLife Stadium'],
        correct: 0,
      },
      {
        question: 'Qual seleção é a maior campeã da Copa do Mundo?',
        options: ['Alemanha', 'Itália', 'Brasil', 'Argentina'],
        correct: 2,
      },
    ],
  },
  {
    id: 'legends',
    title: 'Lendas do Futebol',
    description: 'Ídolos, craques e momentos inesquecíveis.',
    emoji: '⭐',
    questions: [
      {
        question: 'Quem marcou o gol do título argentino na Copa de 2022?',
        options: ['Lionel Messi', 'Ángel Di María', 'Julián Álvarez', 'Enzo Fernández'],
        correct: 0,
      },
      {
        question: 'Pelé conquistou quantas Copas do Mundo?',
        options: ['2', '3', '4', '1'],
        correct: 1,
      },
      {
        question: 'Qual jogador marcou 5 gols em uma partida na Copa de 2022?',
        options: ['Cristiano Ronaldo', 'Kylian Mbappé', 'Richarlison', 'Lionel Messi'],
        correct: 1,
      },
      {
        question: 'Quem é conhecido como "Rei do Futebol"?',
        options: ['Diego Maradona', 'Pelé', 'Zidane', 'Ronaldo Fenômeno'],
        correct: 1,
      },
      {
        question: 'Qual seleção tinha Neymar como principal referência ofensiva?',
        options: ['Argentina', 'Brasil', 'Portugal', 'França'],
        correct: 1,
      },
    ],
  },
  {
    id: 'hosts',
    title: 'Países-Sede',
    description: 'Onde a Copa aconteceu e curiosidades das sedes.',
    emoji: '🌍',
    questions: [
      {
        question: 'Qual foi o primeiro país europeu a sediar a Copa?',
        options: ['Itália', 'França', 'Suíça', 'Alemanha'],
        correct: 0,
      },
      {
        question: 'A Copa de 2022 foi a primeira realizada em qual região?',
        options: ['Ásia', 'Oceania', 'América do Sul', 'África'],
        correct: 0,
      },
      {
        question: 'Qual país sediou a Copa de 1994 nos Estados Unidos?',
        options: ['México', 'Estados Unidos', 'Canadá', 'Brasil'],
        correct: 1,
      },
      {
        question: 'O Maracanã foi palco da final de qual Copa?',
        options: ['1950', '2014', '1970', '1962'],
        correct: 1,
      },
      {
        question: 'Qual país sediou a Copa de 2010?',
        options: ['Egito', 'África do Sul', 'Nigéria', 'Marrocos'],
        correct: 1,
      },
    ],
  },
  {
    id: 'records',
    title: 'Recordes & Números',
    description: 'Estatísticas, placares e feitos históricos.',
    emoji: '📊',
    questions: [
      {
        question: 'Qual foi o placar da semifinal Alemanha x Brasil em 2014?',
        options: ['5 x 2', '7 x 1', '4 x 0', '3 x 0'],
        correct: 1,
      },
      {
        question: 'Quantas Copas o Brasil venceu até 2022?',
        options: ['4', '5', '6', '3'],
        correct: 1,
      },
      {
        question: 'Qual seleção venceu a Copa de 2018?',
        options: ['Croácia', 'França', 'Bélgica', 'Alemanha'],
        correct: 1,
      },
      {
        question: 'A final de 2022 terminou com qual placar no tempo regulamentar?',
        options: ['2 x 2', '3 x 3', '4 x 2', '1 x 0'],
        correct: 1,
      },
      {
        question: 'Quantas seleções disputaram a primeira Copa, em 1930?',
        options: ['13', '16', '24', '32'],
        correct: 0,
      },
    ],
  },
];

/** @deprecated Use quizPacks */
export const quizData = quizPacks[0].questions;

export type WorldCupHistoryItem = {
  year: string;
  host: string;
  champion: string;
  runnerUp: string;
  topScorer: string;
  highlight: string;
  stadium: string;
  finalScore: string;
  teams: string;
  mascot: string;
  funFact: string;
};

export const worldCupHistory: WorldCupHistoryItem[] = [
  {
    year: '1930',
    host: 'Uruguai',
    champion: 'Uruguai',
    runnerUp: 'Argentina',
    topScorer: 'Guillermo Stábile (Argentina) — 8 gols',
    highlight: 'Primeira edição do torneio, realizada sem fase de grupos e com apenas 13 seleções.',
    stadium: 'Estádio Centenário (Montevidéu)',
    finalScore: 'Uruguai 4 x 2 Argentina',
    teams: '13 seleções',
    mascot: 'Sem mascote oficial',
    funFact: 'O Uruguai venceu a final diante de cerca de 68 mil torcedores no Centenário.',
  },
  {
    year: '1970',
    host: 'México',
    champion: 'Brasil',
    runnerUp: 'Itália',
    topScorer: 'Gerd Müller (Alemanha) — 10 gols',
    highlight: 'Pelé liderou o tricampeonato e apresentou a seleção mais famosa de todos os tempos.',
    stadium: 'Estádio Azteca (Cidade do México)',
    finalScore: 'Brasil 4 x 1 Itália',
    teams: '16 seleções',
    mascot: 'Sem mascote oficial',
    funFact: 'Pelé levantou a Taça Jules Rimet pela última vez antes de o troféu ser entregue permanentemente ao Brasil.',
  },
  {
    year: '1994',
    host: 'Estados Unidos',
    champion: 'Brasil',
    runnerUp: 'Itália',
    topScorer: 'Oleg Salenko e Hristo Stoichkov — 6 gols',
    highlight: 'Final decidida nos pênaltis entre Brasil e Itália.',
    stadium: 'Rose Bowl (Pasadena)',
    finalScore: '0 x 0 (Brasil vence nos pênaltis por 3 x 2)',
    teams: '24 seleções',
    mascot: 'Striker, o cachorro',
    funFact: 'Foi a primeira Copa sediada principalmente nos EUA, ampliando o alcance global do torneio.',
  },
  {
    year: '2014',
    host: 'Brasil',
    champion: 'Alemanha',
    runnerUp: 'Argentina',
    topScorer: 'James Rodríguez (Colômbia) — 6 gols',
    highlight: 'Alemanha venceu por 7 a 1 no Mineirão contra a seleção anfitriã nas semifinais.',
    stadium: 'Maracanã (Rio de Janeiro)',
    finalScore: 'Alemanha 1 x 0 Argentina',
    teams: '32 seleções',
    mascot: 'Fuleco, a tatuaga',
    funFact: 'Mario Götze marcou o gol da final aos 113 minutos na prorrogação.',
  },
  {
    year: '2022',
    host: 'Catar',
    champion: 'Argentina',
    runnerUp: 'França',
    topScorer: 'Kylian Mbappé (França) — 8 gols',
    highlight: 'Final épica decidida nos pênaltis após 3 a 3 no tempo regulamentar.',
    stadium: 'Lusail Iconic Stadium',
    finalScore: '3 x 3 (Argentina vence nos pênaltis por 4 x 2)',
    teams: '32 seleções',
    mascot: 'La\'eeb',
    funFact: 'Mbappé marcou hat-trick na final e ainda assim a Argentina levou o título.',
  },
];
