import { Law, Deputy, Party, VotingRecord, RecentChange, ControversialVote, Vote, VoteType } from '@/types';

// Political parties in Bulgaria
export const parties: Party[] = [
  { id: 'gerb', name: 'ГЕРБ-СДС', shortName: 'ГЕРБ', color: '#0066CC' },
  { id: 'pp-db', name: 'Продължаваме Промяната - Демократична България', shortName: 'ПП-ДБ', color: '#FFD700' },
  { id: 'dps', name: 'Движение за права и свободи', shortName: 'ДПС', color: '#003366' },
  { id: 'vazrazhdane', name: 'Възраждане', shortName: 'Възраждане', color: '#8B0000' },
  { id: 'bsp', name: 'БСП за България', shortName: 'БСП', color: '#CC0000' },
  { id: 'itv', name: 'Има такъв народ', shortName: 'ИТН', color: '#00CED1' },
];

// Mock deputies
export const deputies: Deputy[] = [
  { id: 'dep-1', name: 'Иван Петров', party: parties[0], constituency: 'София-град', consistencyScore: 92, attendance: 95 },
  { id: 'dep-2', name: 'Мария Георгиева', party: parties[0], constituency: 'Пловдив', consistencyScore: 88, attendance: 91 },
  { id: 'dep-3', name: 'Георги Димитров', party: parties[1], constituency: 'Варна', consistencyScore: 95, attendance: 98 },
  { id: 'dep-4', name: 'Елена Стоянова', party: parties[1], constituency: 'София-град', consistencyScore: 91, attendance: 94 },
  { id: 'dep-5', name: 'Петър Николов', party: parties[2], constituency: 'Кърджали', consistencyScore: 85, attendance: 88 },
  { id: 'dep-6', name: 'Ахмед Мехмедов', party: parties[2], constituency: 'Разград', consistencyScore: 89, attendance: 92 },
  { id: 'dep-7', name: 'Костадин Ангелов', party: parties[3], constituency: 'Бургас', consistencyScore: 97, attendance: 96 },
  { id: 'dep-8', name: 'Николай Иванов', party: parties[3], constituency: 'Стара Загора', consistencyScore: 94, attendance: 93 },
  { id: 'dep-9', name: 'Драгомир Стойнев', party: parties[4], constituency: 'Благоевград', consistencyScore: 86, attendance: 89 },
  { id: 'dep-10', name: 'Корнелия Нинова', party: parties[4], constituency: 'София-област', consistencyScore: 90, attendance: 92 },
  { id: 'dep-11', name: 'Тошко Йорданов', party: parties[5], constituency: 'Плевен', consistencyScore: 93, attendance: 87 },
  { id: 'dep-12', name: 'Станислав Трифонов', party: parties[5], constituency: 'Велико Търново', consistencyScore: 88, attendance: 85 },
];

// Generate votes for a voting record
function generateVotes(deputies: Deputy[]): { votesFor: Vote[]; votesAgainst: Vote[]; abstained: Vote[]; absent: Vote[] } {
  const shuffled = [...deputies].sort(() => Math.random() - 0.5);
  const forCount = Math.floor(shuffled.length * 0.45);
  const againstCount = Math.floor(shuffled.length * 0.35);
  const abstainedCount = Math.floor(shuffled.length * 0.12);
  
  const createVote = (deputy: Deputy, vote: VoteType): Vote => ({
    deputyId: deputy.id,
    deputy,
    vote,
    date: new Date().toISOString(),
  });

  return {
    votesFor: shuffled.slice(0, forCount).map(d => createVote(d, 'for')),
    votesAgainst: shuffled.slice(forCount, forCount + againstCount).map(d => createVote(d, 'against')),
    abstained: shuffled.slice(forCount + againstCount, forCount + againstCount + abstainedCount).map(d => createVote(d, 'abstained')),
    absent: shuffled.slice(forCount + againstCount + abstainedCount).map(d => createVote(d, 'absent')),
  };
}

// Mock laws
export const laws: Law[] = [
  {
    id: 'law-1',
    title: 'Закон за данък върху добавената стойност',
    shortTitle: 'ЗДДС',
    category: 'tax',
    status: 'active',
    currentVersion: 'v3',
    followers: 2450,
    lastUpdated: '2024-12-15',
    relatedLawIds: ['law-2', 'law-5'],
    versions: [
      {
        id: 'v1',
        versionNumber: 'v1',
        date: '2023-01-15',
        effectiveDate: '2023-04-01',
        summary: 'Първоначална версия на закона',
        changesCount: { added: 45, removed: 0, modified: 0 },
        changes: [
          {
            articleNumber: '1',
            title: 'Предмет на закона',
            changes: [
              { lineNumber: 1, content: 'Този закон урежда облагането с данък върху добавената стойност.', type: 'added' },
              { lineNumber: 2, content: 'Данъкът върху добавената стойност е косвен данък, който се начислява върху потреблението.', type: 'added' },
            ],
          },
        ],
      },
      {
        id: 'v2',
        versionNumber: 'v2',
        date: '2024-03-20',
        effectiveDate: '2024-07-01',
        summary: 'Промяна на данъчните ставки за основни хранителни продукти',
        changesCount: { added: 12, removed: 5, modified: 8 },
        changes: [
          {
            articleNumber: '66',
            title: 'Данъчни ставки',
            changes: [
              { lineNumber: 1, content: 'Стандартната ставка на данъка е 20 на сто.', type: 'unchanged' },
              { lineNumber: 2, content: 'За доставки на хляб и брашно ставката е 9 на сто.', type: 'removed', oldContent: 'За доставки на хляб ставката е 9 на сто.' },
              { lineNumber: 3, content: 'За доставки на хляб, брашно и основни млечни продукти ставката е 9 на сто.', type: 'added' },
              { lineNumber: 4, content: 'За ресторантьорски услуги ставката е 9 на сто.', type: 'unchanged' },
            ],
          },
          {
            articleNumber: '67',
            title: 'Освободени доставки',
            changes: [
              { lineNumber: 1, content: 'Освободени от данък са:', type: 'unchanged' },
              { lineNumber: 2, content: '1. Доставки на финансови услуги;', type: 'unchanged' },
              { lineNumber: 3, content: '2. Доставки на образователни услуги;', type: 'modified', oldContent: '2. Доставки на образователни услуги от държавни училища;' },
              { lineNumber: 4, content: '3. Доставки на здравни услуги.', type: 'added' },
            ],
          },
        ],
        votingRecord: {
          id: 'vote-1',
          date: '2024-03-18',
          lawId: 'law-1',
          versionId: 'v2',
          totalVotes: 240,
          passed: true,
          ...generateVotes(deputies),
        },
      },
      {
        id: 'v3',
        versionNumber: 'v3',
        date: '2024-12-15',
        effectiveDate: '2025-01-01',
        summary: 'Дигитализация на данъчните процедури и нови правила за електронна търговия',
        changesCount: { added: 18, removed: 3, modified: 12 },
        changes: [
          {
            articleNumber: '118',
            title: 'Електронна фактура',
            changes: [
              { lineNumber: 1, content: 'Електронната фактура има същата правна сила като хартиената.', type: 'unchanged' },
              { lineNumber: 2, content: 'От 01.01.2025 г. всички данъчно задължени лица са длъжни да издават електронни фактури.', type: 'added' },
              { lineNumber: 3, content: 'Електронните фактури се съхраняват в единна национална система.', type: 'added' },
              { lineNumber: 4, content: 'Срокът за съхранение е 10 години.', type: 'modified', oldContent: 'Срокът за съхранение е 5 години.' },
            ],
          },
          {
            articleNumber: '14а',
            title: 'Електронна търговия',
            changes: [
              { lineNumber: 1, content: 'Платформите за електронна търговия носят солидарна отговорност за ДДС.', type: 'added' },
              { lineNumber: 2, content: 'Доставчиците на платежни услуги предоставят данни за трансакциите.', type: 'added' },
            ],
          },
        ],
        votingRecord: {
          id: 'vote-2',
          date: '2024-12-10',
          lawId: 'law-1',
          versionId: 'v3',
          totalVotes: 238,
          passed: true,
          ...generateVotes(deputies),
        },
      },
    ],
  },
  {
    id: 'law-2',
    title: 'Кодекс на труда',
    shortTitle: 'КТ',
    category: 'labor',
    status: 'amended',
    currentVersion: 'v2',
    followers: 5820,
    lastUpdated: '2024-11-28',
    relatedLawIds: ['law-3'],
    versions: [
      {
        id: 'v1',
        versionNumber: 'v1',
        date: '2022-06-01',
        effectiveDate: '2022-09-01',
        summary: 'Кодификация на трудовото законодателство',
        changesCount: { added: 320, removed: 0, modified: 0 },
        changes: [],
      },
      {
        id: 'v2',
        versionNumber: 'v2',
        date: '2024-11-28',
        effectiveDate: '2025-01-01',
        summary: 'Регулиране на дистанционната работа и право на прекъсване',
        changesCount: { added: 25, removed: 2, modified: 15 },
        changes: [
          {
            articleNumber: '107б',
            title: 'Дистанционна работа',
            changes: [
              { lineNumber: 1, content: 'Дистанционната работа е форма на организация на трудовия процес.', type: 'unchanged' },
              { lineNumber: 2, content: 'Работодателят е длъжен да осигури необходимото оборудване.', type: 'added' },
              { lineNumber: 3, content: 'Работникът има право на компенсация за разходи за електричество и интернет.', type: 'added' },
              { lineNumber: 4, content: 'Размерът на компенсацията се определя с колективен трудов договор.', type: 'added' },
            ],
          },
          {
            articleNumber: '107в',
            title: 'Право на прекъсване',
            changes: [
              { lineNumber: 1, content: 'Работникът има право да не отговаря на служебни комуникации извън работно време.', type: 'added' },
              { lineNumber: 2, content: 'Работодателят не може да санкционира работник за упражняване на това право.', type: 'added' },
            ],
          },
        ],
        votingRecord: {
          id: 'vote-3',
          date: '2024-11-25',
          lawId: 'law-2',
          versionId: 'v2',
          totalVotes: 235,
          passed: true,
          ...generateVotes(deputies),
        },
      },
    ],
  },
  {
    id: 'law-3',
    title: 'Наказателен кодекс',
    shortTitle: 'НК',
    category: 'criminal',
    status: 'active',
    currentVersion: 'v4',
    followers: 3100,
    lastUpdated: '2024-10-05',
    relatedLawIds: ['law-4'],
    versions: [
      {
        id: 'v1',
        versionNumber: 'v1',
        date: '2020-01-01',
        effectiveDate: '2020-04-01',
        summary: 'Консолидирана версия',
        changesCount: { added: 450, removed: 0, modified: 0 },
        changes: [],
      },
      {
        id: 'v2',
        versionNumber: 'v2',
        date: '2022-06-15',
        effectiveDate: '2022-09-01',
        summary: 'Криминализиране на домашното насилие',
        changesCount: { added: 8, removed: 0, modified: 3 },
        changes: [],
      },
      {
        id: 'v3',
        versionNumber: 'v3',
        date: '2023-11-20',
        effectiveDate: '2024-01-01',
        summary: 'Завишени наказания за корупционни престъпления',
        changesCount: { added: 5, removed: 2, modified: 12 },
        changes: [],
      },
      {
        id: 'v4',
        versionNumber: 'v4',
        date: '2024-10-05',
        effectiveDate: '2024-12-01',
        summary: 'Киберпрестъпления и защита на личните данни',
        changesCount: { added: 15, removed: 1, modified: 8 },
        changes: [
          {
            articleNumber: '319а',
            title: 'Компютърни престъпления',
            changes: [
              { lineNumber: 1, content: 'Който неправомерно достъпва компютърна система, се наказва с лишаване от свобода до 3 години.', type: 'modified', oldContent: 'Който неправомерно достъпва компютърна система, се наказва с лишаване от свобода до 1 година.' },
              { lineNumber: 2, content: 'При причиняване на значителни вреди наказанието е от 3 до 8 години.', type: 'added' },
              { lineNumber: 3, content: 'Същото наказание се налага и за разпространение на зловреден софтуер.', type: 'added' },
            ],
          },
        ],
        votingRecord: {
          id: 'vote-4',
          date: '2024-10-01',
          lawId: 'law-3',
          versionId: 'v4',
          totalVotes: 230,
          passed: true,
          ...generateVotes(deputies),
        },
      },
    ],
  },
  {
    id: 'law-4',
    title: 'Закон за защита на личните данни',
    shortTitle: 'ЗЗЛД',
    category: 'administrative',
    status: 'active',
    currentVersion: 'v2',
    followers: 1850,
    lastUpdated: '2024-09-12',
    relatedLawIds: ['law-3'],
    versions: [
      {
        id: 'v1',
        versionNumber: 'v1',
        date: '2018-05-25',
        effectiveDate: '2018-05-25',
        summary: 'Транспониране на GDPR',
        changesCount: { added: 89, removed: 0, modified: 0 },
        changes: [],
      },
      {
        id: 'v2',
        versionNumber: 'v2',
        date: '2024-09-12',
        effectiveDate: '2024-11-01',
        summary: 'Регулации за изкуствен интелект и автоматизирано вземане на решения',
        changesCount: { added: 22, removed: 0, modified: 8 },
        changes: [
          {
            articleNumber: '25а',
            title: 'Автоматизирано вземане на решения',
            changes: [
              { lineNumber: 1, content: 'Субектът на данни има право да не бъде обект на решение, основаващо се единствено на автоматизирано обработване.', type: 'unchanged' },
              { lineNumber: 2, content: 'Това включва решения, взети от системи с изкуствен интелект.', type: 'added' },
              { lineNumber: 3, content: 'Администраторът е длъжен да осигури човешки преглед при поискване.', type: 'added' },
            ],
          },
        ],
        votingRecord: {
          id: 'vote-5',
          date: '2024-09-08',
          lawId: 'law-4',
          versionId: 'v2',
          totalVotes: 225,
          passed: true,
          ...generateVotes(deputies),
        },
      },
    ],
  },
  {
    id: 'law-5',
    title: 'Закон за опазване на околната среда',
    shortTitle: 'ЗООС',
    category: 'environmental',
    status: 'active',
    currentVersion: 'v3',
    followers: 980,
    lastUpdated: '2024-08-20',
    relatedLawIds: [],
    versions: [
      {
        id: 'v1',
        versionNumber: 'v1',
        date: '2019-01-01',
        effectiveDate: '2019-04-01',
        summary: 'Основен закон за околната среда',
        changesCount: { added: 156, removed: 0, modified: 0 },
        changes: [],
      },
      {
        id: 'v2',
        versionNumber: 'v2',
        date: '2022-07-01',
        effectiveDate: '2022-10-01',
        summary: 'Европейска зелена сделка - първи пакет',
        changesCount: { added: 35, removed: 5, modified: 20 },
        changes: [],
      },
      {
        id: 'v3',
        versionNumber: 'v3',
        date: '2024-08-20',
        effectiveDate: '2024-10-01',
        summary: 'Въглеродна неутралност и кръгова икономика',
        changesCount: { added: 28, removed: 3, modified: 15 },
        changes: [
          {
            articleNumber: '15а',
            title: 'Въглеродна неутралност',
            changes: [
              { lineNumber: 1, content: 'България се задължава да постигне въглеродна неутралност до 2050 г.', type: 'added' },
              { lineNumber: 2, content: 'Междинната цел е намаляване на емисиите с 55% до 2030 г.', type: 'added' },
            ],
          },
        ],
        votingRecord: {
          id: 'vote-6',
          date: '2024-08-15',
          lawId: 'law-5',
          versionId: 'v3',
          totalVotes: 220,
          passed: false,
          ...generateVotes(deputies),
        },
      },
    ],
  },
];

// Recent changes for the homepage
export const recentChanges: RecentChange[] = [
  {
    lawId: 'law-1',
    lawTitle: 'Закон за данък върху добавената стойност',
    versionId: 'v3',
    date: '2024-12-15',
    changeType: 'added',
    snippet: 'Нови правила за електронна търговия и задължителни електронни фактури',
  },
  {
    lawId: 'law-2',
    lawTitle: 'Кодекс на труда',
    versionId: 'v2',
    date: '2024-11-28',
    changeType: 'modified',
    snippet: 'Право на прекъсване и компенсации за дистанционна работа',
  },
  {
    lawId: 'law-3',
    lawTitle: 'Наказателен кодекс',
    versionId: 'v4',
    date: '2024-10-05',
    changeType: 'modified',
    snippet: 'Завишени наказания за киберпрестъпления - до 8 години затвор',
  },
  {
    lawId: 'law-4',
    lawTitle: 'Закон за защита на личните данни',
    versionId: 'v2',
    date: '2024-09-12',
    changeType: 'added',
    snippet: 'Нови правила за изкуствен интелект и автоматизирани решения',
  },
];

// Controversial votes
export const controversialVotes: ControversialVote[] = [
  {
    lawId: 'law-5',
    lawTitle: 'Закон за опазване на околната среда',
    voteId: 'vote-6',
    date: '2024-08-15',
    votesFor: 98,
    votesAgainst: 112,
    margin: 14,
  },
  {
    lawId: 'law-1',
    lawTitle: 'Закон за данък върху добавената стойност',
    voteId: 'vote-2',
    date: '2024-12-10',
    votesFor: 125,
    votesAgainst: 108,
    margin: 17,
  },
];

// Helper functions
export function getLawById(id: string): Law | undefined {
  return laws.find(law => law.id === id);
}

export function getDeputyById(id: string): Deputy | undefined {
  return deputies.find(deputy => deputy.id === id);
}

export function getDeputiesByParty(partyId: string): Deputy[] {
  return deputies.filter(deputy => deputy.party.id === partyId);
}

export function searchLaws(query: string): Law[] {
  const lowerQuery = query.toLowerCase();
  return laws.filter(law => 
    law.title.toLowerCase().includes(lowerQuery) ||
    law.shortTitle?.toLowerCase().includes(lowerQuery) ||
    law.category.toLowerCase().includes(lowerQuery)
  );
}

export function searchDeputies(query: string): Deputy[] {
  const lowerQuery = query.toLowerCase();
  return deputies.filter(deputy =>
    deputy.name.toLowerCase().includes(lowerQuery) ||
    deputy.party.name.toLowerCase().includes(lowerQuery) ||
    deputy.constituency.toLowerCase().includes(lowerQuery)
  );
}
