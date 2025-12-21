import type { 
  ApiDeputy, 
  ApiBill, 
  ApiBillDetails, 
  ApiParty, 
  ApiVoteSession,
  ApiVote 
} from './parliamentApi';
import type { 
  Deputy, 
  Party, 
  Law, 
  Version, 
  VotingRecord, 
  Vote,
  VoteType 
} from '@/types';

// Color palette for parties without defined colors
const PARTY_COLORS = [
  '#3B82F6', // blue
  '#EF4444', // red
  '#10B981', // green
  '#F59E0B', // amber
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
];

let colorIndex = 0;
const partyColorMap = new Map<string, string>();

function getPartyColor(partyName: string, providedColor?: string): string {
  if (providedColor) return providedColor;
  
  if (!partyColorMap.has(partyName)) {
    partyColorMap.set(partyName, PARTY_COLORS[colorIndex % PARTY_COLORS.length]);
    colorIndex++;
  }
  
  return partyColorMap.get(partyName)!;
}

export function transformParty(apiParty: ApiParty): Party {
  return {
    id: String(apiParty.id),
    name: apiParty.name,
    shortName: apiParty.short_name || apiParty.name.substring(0, 4).toUpperCase(),
    color: getPartyColor(apiParty.name, apiParty.color),
  };
}

export function transformDeputy(apiDeputy: ApiDeputy): Deputy {
  const party: Party = {
    id: apiDeputy.party || 'unknown',
    name: apiDeputy.party || 'Независим',
    shortName: apiDeputy.party?.substring(0, 4).toUpperCase() || 'НЕЗ',
    color: getPartyColor(apiDeputy.party || 'unknown', apiDeputy.party_color),
  };

  return {
    id: String(apiDeputy.id),
    name: apiDeputy.name,
    party,
    constituency: apiDeputy.region || 'Неизвестен',
    photo: apiDeputy.photo,
    consistencyScore: 85 + Math.floor(Math.random() * 15), // Placeholder until we calculate real data
    attendance: 80 + Math.floor(Math.random() * 20), // Placeholder
  };
}

export function transformBillToLaw(apiBill: ApiBill): Law {
  const currentDate = new Date().toISOString();
  
  return {
    id: String(apiBill.id),
    title: apiBill.title,
    shortTitle: apiBill.signature,
    category: apiBill.type || 'Общ',
    status: mapBillStatus(apiBill.status),
    currentVersion: '1.0',
    versions: [{
      id: '1',
      versionNumber: '1.0',
      date: apiBill.date,
      effectiveDate: apiBill.date,
      summary: `Законопроект ${apiBill.signature}`,
      changes: [],
      changesCount: { added: 0, removed: 0, modified: 0 },
    }],
    followers: Math.floor(Math.random() * 1000),
    lastUpdated: apiBill.date,
    relatedLawIds: [],
  };
}

export function transformBillDetailsToLaw(apiBill: ApiBillDetails): Law {
  const versions: Version[] = apiBill.stages?.map((stage, index) => ({
    id: String(stage.id || index + 1),
    versionNumber: `${index + 1}.0`,
    date: stage.date,
    effectiveDate: stage.date,
    summary: stage.name,
    changes: [],
    votingRecord: undefined, // Will be populated separately
    changesCount: { added: 0, removed: 0, modified: 0 },
  })) || [{
    id: '1',
    versionNumber: '1.0',
    date: apiBill.date,
    effectiveDate: apiBill.date,
    summary: 'Първоначална версия',
    changes: [],
    changesCount: { added: 0, removed: 0, modified: 0 },
  }];

  return {
    id: String(apiBill.id),
    title: apiBill.title,
    shortTitle: apiBill.signature,
    category: apiBill.type || 'Общ',
    status: mapBillStatus(apiBill.status),
    currentVersion: versions[versions.length - 1]?.versionNumber || '1.0',
    versions,
    followers: Math.floor(Math.random() * 1000),
    lastUpdated: apiBill.date,
    relatedLawIds: [],
  };
}

function mapBillStatus(status?: string): 'active' | 'repealed' | 'amended' {
  if (!status) return 'active';
  
  const statusLower = status.toLowerCase();
  if (statusLower.includes('отхвърлен') || statusLower.includes('оттеглен')) {
    return 'repealed';
  }
  if (statusLower.includes('изменен') || statusLower.includes('променен')) {
    return 'amended';
  }
  return 'active';
}

export function transformVoteSession(apiVote: ApiVoteSession, lawId: string): VotingRecord {
  return {
    id: String(apiVote.id),
    date: apiVote.date,
    lawId,
    versionId: '1',
    totalVotes: apiVote.votes_for + apiVote.votes_against + apiVote.abstained,
    votesFor: [],
    votesAgainst: [],
    abstained: [],
    absent: [],
    passed: apiVote.passed,
  };
}

export function transformVoteDetails(
  apiVotes: ApiVote[], 
  voteSession: ApiVoteSession,
  lawId: string
): VotingRecord {
  const votesFor: Vote[] = [];
  const votesAgainst: Vote[] = [];
  const abstained: Vote[] = [];
  const absent: Vote[] = [];

  apiVotes.forEach(vote => {
    const transformedVote: Vote = {
      deputyId: String(vote.mp_id),
      vote: vote.vote as VoteType,
      date: voteSession.date,
    };

    switch (vote.vote) {
      case 'for':
        votesFor.push(transformedVote);
        break;
      case 'against':
        votesAgainst.push(transformedVote);
        break;
      case 'abstained':
        abstained.push(transformedVote);
        break;
      case 'absent':
        absent.push(transformedVote);
        break;
    }
  });

  return {
    id: String(voteSession.id),
    date: voteSession.date,
    lawId,
    versionId: '1',
    totalVotes: votesFor.length + votesAgainst.length + abstained.length,
    votesFor,
    votesAgainst,
    abstained,
    absent,
    passed: voteSession.passed,
  };
}

// Helper to create mock parties from deputy data
export function extractPartiesFromDeputies(deputies: ApiDeputy[]): Party[] {
  const partyMap = new Map<string, Party>();
  
  deputies.forEach(deputy => {
    const partyName = deputy.party || 'Независим';
    if (!partyMap.has(partyName)) {
      partyMap.set(partyName, {
        id: partyName.toLowerCase().replace(/\s+/g, '-'),
        name: partyName,
        shortName: partyName.substring(0, 4).toUpperCase(),
        color: getPartyColor(partyName, deputy.party_color),
      });
    }
  });
  
  return Array.from(partyMap.values());
}
