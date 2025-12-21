import { useQuery } from '@tanstack/react-query';
import * as api from '@/services/parliamentApi';
import * as transformers from '@/services/transformers';
import { laws as mockLaws, deputies as mockDeputies, parties as mockParties } from '@/data/mockData';
import type { Deputy, Law, Party, VotingRecord } from '@/types';

// Deputies hooks
export function useDeputies() {
  return useQuery({
    queryKey: ['deputies'],
    queryFn: async (): Promise<Deputy[]> => {
      try {
        const apiDeputies = await api.fetchDeputies();
        if (apiDeputies.length > 0) {
          return apiDeputies.map(transformers.transformDeputy);
        }
        // Fall back to mock data
        console.log('Using mock deputy data');
        return mockDeputies;
      } catch (error) {
        console.log('API failed, using mock deputy data:', error);
        return mockDeputies;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

export function useDeputy(id: string) {
  return useQuery({
    queryKey: ['deputy', id],
    queryFn: async (): Promise<Deputy | null> => {
      try {
        const apiDeputy = await api.fetchDeputyById(id);
        if (apiDeputy) {
          return transformers.transformDeputy(apiDeputy);
        }
      } catch (error) {
        console.log('API failed, using mock deputy data:', error);
      }
      // Fall back to mock data
      return mockDeputies.find(d => d.id === id) || null;
    },
    enabled: !!id,
    retry: 1,
  });
}

// Parties hook
export function useParties() {
  return useQuery({
    queryKey: ['parties'],
    queryFn: async (): Promise<Party[]> => {
      try {
        const apiParties = await api.fetchParties();
        if (apiParties.length > 0) {
          return apiParties.map(transformers.transformParty);
        }
      } catch (error) {
        console.log('API failed, using mock party data:', error);
      }
      return mockParties;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
}

// Extract parties from deputies as fallback
export function usePartiesFromDeputies() {
  const { data: deputies } = useDeputies();
  
  return useQuery({
    queryKey: ['parties-from-deputies'],
    queryFn: async (): Promise<Party[]> => {
      try {
        const apiDeputies = await api.fetchDeputies();
        if (apiDeputies.length > 0) {
          return transformers.extractPartiesFromDeputies(apiDeputies);
        }
      } catch (error) {
        console.log('Using mock party data');
      }
      return mockParties;
    },
    enabled: !deputies || deputies.length === 0,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}

// Bills/Laws hooks
export function useBills(params?: { page?: number; search?: string; year?: number }) {
  return useQuery({
    queryKey: ['bills', params],
    queryFn: async (): Promise<Law[]> => {
      try {
        const apiBills = await api.fetchBills(params);
        if (apiBills.length > 0) {
          return apiBills.map(transformers.transformBillToLaw);
        }
      } catch (error) {
        console.log('API failed, using mock law data:', error);
      }
      // Fall back to mock data
      return mockLaws;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
}

export function useBill(id: string) {
  return useQuery({
    queryKey: ['bill', id],
    queryFn: async (): Promise<Law | null> => {
      try {
        const apiBill = await api.fetchBillById(id);
        if (apiBill) {
          return transformers.transformBillDetailsToLaw(apiBill);
        }
      } catch (error) {
        console.log('API failed, using mock law data:', error);
      }
      // Fall back to mock data
      return mockLaws.find(l => l.id === id) || null;
    },
    enabled: !!id,
    retry: 1,
  });
}

// Search hook
export function useSearchBills(query: string) {
  return useQuery({
    queryKey: ['search-bills', query],
    queryFn: async (): Promise<Law[]> => {
      try {
        const apiBills = await api.searchBills(query);
        if (apiBills.length > 0) {
          return apiBills.map(transformers.transformBillToLaw);
        }
      } catch (error) {
        console.log('API search failed, using mock data:', error);
      }
      // Fall back to filtering mock data
      return mockLaws.filter(law => 
        law.title.toLowerCase().includes(query.toLowerCase()) ||
        law.shortTitle?.toLowerCase().includes(query.toLowerCase())
      );
    },
    enabled: query.length >= 2,
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 1,
  });
}

// Voting hooks - using mock data structure for vote sessions
export function useVoteSessions(params?: { page?: number; billId?: string }) {
  return useQuery({
    queryKey: ['vote-sessions', params],
    queryFn: async () => {
      try {
        const sessions = await api.fetchVoteSessions(params);
        if (sessions.length > 0) {
          return sessions;
        }
      } catch (error) {
        console.log('API failed, using mock vote data:', error);
      }
      // Extract vote sessions from mock laws
      const voteSessions = mockLaws.flatMap(law => 
        law.versions
          .filter(v => v.votingRecord)
          .map(v => ({
            id: v.votingRecord!.id,
            date: v.votingRecord!.date,
            title: law.title,
            votes_for: v.votingRecord!.votesFor.length,
            votes_against: v.votingRecord!.votesAgainst.length,
            abstained: v.votingRecord!.abstained.length,
            absent: v.votingRecord!.absent.length,
            passed: v.votingRecord!.passed,
          }))
      );
      return voteSessions;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useVoteDetails(voteId: string, lawId: string) {
  return useQuery({
    queryKey: ['vote-details', voteId],
    queryFn: async (): Promise<VotingRecord | null> => {
      try {
        const [votes, sessions] = await Promise.all([
          api.fetchVoteDetails(voteId),
          api.fetchVoteSessions(),
        ]);
        
        const session = sessions.find(s => String(s.id) === voteId);
        if (session && votes.length > 0) {
          return transformers.transformVoteDetails(votes, session, lawId);
        }
      } catch (error) {
        console.log('API failed, using mock vote details:', error);
      }
      // Fall back to mock data
      const law = mockLaws.find(l => l.id === lawId);
      if (law) {
        const version = law.versions.find(v => v.votingRecord?.id === voteId);
        return version?.votingRecord || null;
      }
      return null;
    },
    enabled: !!voteId && !!lawId,
    retry: 1,
  });
}

// Sessions hook
export function useSessions() {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      try {
        const sessions = await api.fetchSessions();
        if (sessions.length > 0) {
          return sessions;
        }
      } catch (error) {
        console.log('API failed for sessions');
      }
      return [];
    },
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}

// Combined hook for party statistics
export function usePartyStats() {
  const { data: deputies, isLoading: deputiesLoading } = useDeputies();
  
  const partyStats = deputies?.reduce((acc, deputy) => {
    const partyId = deputy.party.id;
    if (!acc[partyId]) {
      acc[partyId] = {
        party: deputy.party,
        deputyCount: 0,
        totalConsistency: 0,
        totalAttendance: 0,
      };
    }
    acc[partyId].deputyCount++;
    acc[partyId].totalConsistency += deputy.consistencyScore;
    acc[partyId].totalAttendance += deputy.attendance;
    return acc;
  }, {} as Record<string, {
    party: Party;
    deputyCount: number;
    totalConsistency: number;
    totalAttendance: number;
  }>);

  const stats = partyStats ? Object.values(partyStats).map(({ party, deputyCount, totalConsistency, totalAttendance }) => ({
    party,
    deputyCount,
    avgConsistency: Math.round(totalConsistency / deputyCount),
    avgAttendance: Math.round(totalAttendance / deputyCount),
  })) : [];

  return {
    data: stats,
    isLoading: deputiesLoading,
  };
}
