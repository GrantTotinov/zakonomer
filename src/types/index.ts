export type VoteType = 'for' | 'against' | 'abstained' | 'absent';
export type LawStatus = 'active' | 'repealed' | 'amended';
export type ChangeType = 'added' | 'removed' | 'modified';

export interface Party {
  id: string;
  name: string;
  shortName: string;
  color: string;
}

export interface Deputy {
  id: string;
  name: string;
  party: Party;
  constituency: string;
  photo?: string;
  consistencyScore: number;
  attendance: number;
}

export interface Vote {
  deputyId: string;
  deputy?: Deputy;
  vote: VoteType;
  date: string;
}

export interface VotingRecord {
  id: string;
  date: string;
  lawId: string;
  versionId: string;
  totalVotes: number;
  votesFor: Vote[];
  votesAgainst: Vote[];
  abstained: Vote[];
  absent: Vote[];
  passed: boolean;
}

export interface DiffLine {
  lineNumber: number;
  content: string;
  type: ChangeType | 'unchanged';
  oldContent?: string;
}

export interface ArticleChange {
  articleNumber: string;
  title: string;
  changes: DiffLine[];
}

export interface Version {
  id: string;
  versionNumber: string;
  date: string;
  effectiveDate: string;
  summary: string;
  changes: ArticleChange[];
  votingRecord?: VotingRecord;
  changesCount: {
    added: number;
    removed: number;
    modified: number;
  };
}

export interface Law {
  id: string;
  title: string;
  shortTitle?: string;
  category: string;
  status: LawStatus;
  currentVersion: string;
  versions: Version[];
  followers: number;
  lastUpdated: string;
  relatedLawIds: string[];
}

export interface RecentChange {
  lawId: string;
  lawTitle: string;
  versionId: string;
  date: string;
  changeType: ChangeType;
  snippet: string;
}

export interface ControversialVote {
  lawId: string;
  lawTitle: string;
  voteId: string;
  date: string;
  votesFor: number;
  votesAgainst: number;
  margin: number;
}
