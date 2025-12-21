import { useQuery } from '@tanstack/react-query';
import * as api from '@/services/parliamentApi';
import * as transformers from '@/services/transformers';
import type { Deputy, Law, Party, VotingRecord } from '@/types';

// Deputies hooks
export function useDeputies() {
  return useQuery({
    queryKey: ['deputies'],
    queryFn: async (): Promise<Deputy[]> => {
      const apiDeputies = await api.fetchDeputies();
      return apiDeputies.map(transformers.transformDeputy);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useDeputy(id: string) {
  return useQuery({
    queryKey: ['deputy', id],
    queryFn: async (): Promise<Deputy | null> => {
      const apiDeputy = await api.fetchDeputyById(id);
      return apiDeputy ? transformers.transformDeputy(apiDeputy) : null;
    },
    enabled: !!id,
  });
}

// Parties hook
export function useParties() {
  return useQuery({
    queryKey: ['parties'],
    queryFn: async (): Promise<Party[]> => {
      const apiParties = await api.fetchParties();
      return apiParties.map(transformers.transformParty);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Extract parties from deputies as fallback
export function usePartiesFromDeputies() {
  const { data: deputies } = useDeputies();
  
  return useQuery({
    queryKey: ['parties-from-deputies'],
    queryFn: async (): Promise<Party[]> => {
      const apiDeputies = await api.fetchDeputies();
      return transformers.extractPartiesFromDeputies(apiDeputies);
    },
    enabled: !deputies || deputies.length === 0,
    staleTime: 10 * 60 * 1000,
  });
}

// Bills/Laws hooks
export function useBills(params?: { page?: number; search?: string; year?: number }) {
  return useQuery({
    queryKey: ['bills', params],
    queryFn: async (): Promise<Law[]> => {
      const apiBills = await api.fetchBills(params);
      return apiBills.map(transformers.transformBillToLaw);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useBill(id: string) {
  return useQuery({
    queryKey: ['bill', id],
    queryFn: async (): Promise<Law | null> => {
      const apiBill = await api.fetchBillById(id);
      return apiBill ? transformers.transformBillDetailsToLaw(apiBill) : null;
    },
    enabled: !!id,
  });
}

// Search hook
export function useSearchBills(query: string) {
  return useQuery({
    queryKey: ['search-bills', query],
    queryFn: async (): Promise<Law[]> => {
      const apiBills = await api.searchBills(query);
      return apiBills.map(transformers.transformBillToLaw);
    },
    enabled: query.length >= 2,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Voting hooks
export function useVoteSessions(params?: { page?: number; billId?: string }) {
  return useQuery({
    queryKey: ['vote-sessions', params],
    queryFn: async () => {
      const sessions = await api.fetchVoteSessions(params);
      return sessions;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useVoteDetails(voteId: string, lawId: string) {
  return useQuery({
    queryKey: ['vote-details', voteId],
    queryFn: async (): Promise<VotingRecord | null> => {
      const [votes, sessions] = await Promise.all([
        api.fetchVoteDetails(voteId),
        api.fetchVoteSessions(),
      ]);
      
      const session = sessions.find(s => String(s.id) === voteId);
      if (!session) return null;
      
      return transformers.transformVoteDetails(votes, session, lawId);
    },
    enabled: !!voteId && !!lawId,
  });
}

// Sessions hook
export function useSessions() {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: api.fetchSessions,
    staleTime: 10 * 60 * 1000,
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
