// src/hooks/useParliamentData.ts - Mock Data Version

import { useQuery } from '@tanstack/react-query'
import type { Deputy, Law, Party, VotingRecord } from '@/types'
import { 
  deputies as mockDeputies, 
  laws as mockLaws, 
  parties as mockParties,
  getLawById,
  getDeputyById,
  searchLaws,
  searchDeputies,
  recentChanges as mockRecentChanges,
  controversialVotes as mockControversialVotes
} from '@/data/mockData'

// ==================== DEPUTIES ====================

export function useDeputies() {
  return useQuery({
    queryKey: ['deputies'],
    queryFn: async (): Promise<Deputy[]> => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300))
      return mockDeputies
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useDeputy(id: string) {
  return useQuery({
    queryKey: ['deputy', id],
    queryFn: async (): Promise<Deputy | null> => {
      await new Promise(resolve => setTimeout(resolve, 200))
      return getDeputyById(id) || null
    },
    enabled: !!id,
  })
}

// ==================== PARTIES ====================

export function useParties() {
  return useQuery({
    queryKey: ['parties'],
    queryFn: async (): Promise<Party[]> => {
      await new Promise(resolve => setTimeout(resolve, 200))
      return mockParties
    },
    staleTime: 10 * 60 * 1000,
  })
}

// ==================== LAWS ====================

export function useBills(params?: { page?: number; search?: string; year?: number }) {
  return useQuery({
    queryKey: ['bills', params],
    queryFn: async (): Promise<Law[]> => {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      let result = [...mockLaws]
      
      if (params?.search) {
        result = searchLaws(params.search)
      }
      
      return result
    },
    staleTime: 2 * 60 * 1000,
  })
}

export function useBill(id: string) {
  return useQuery({
    queryKey: ['bill', id],
    queryFn: async (): Promise<Law | null> => {
      await new Promise(resolve => setTimeout(resolve, 200))
      return getLawById(id) || null
    },
    enabled: !!id,
  })
}

export function useSearchBills(query: string) {
  return useQuery({
    queryKey: ['search-bills', query],
    queryFn: async (): Promise<Law[]> => {
      await new Promise(resolve => setTimeout(resolve, 200))
      return searchLaws(query)
    },
    enabled: query.length >= 2,
    staleTime: 1 * 60 * 1000,
  })
}

export function useSearchDeputies(query: string) {
  return useQuery({
    queryKey: ['search-deputies', query],
    queryFn: async (): Promise<Deputy[]> => {
      await new Promise(resolve => setTimeout(resolve, 200))
      return searchDeputies(query)
    },
    enabled: query.length >= 2,
    staleTime: 1 * 60 * 1000,
  })
}

// ==================== VOTES ====================

export function useVoteSessions(params?: { page?: number; billId?: string }) {
  return useQuery({
    queryKey: ['vote-sessions', params],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Extract voting records from laws
      const votingRecords: VotingRecord[] = []
      mockLaws.forEach(law => {
        law.versions.forEach(version => {
          if (version.votingRecord) {
            votingRecords.push(version.votingRecord)
          }
        })
      })
      
      if (params?.billId) {
        return votingRecords.filter(v => v.lawId === params.billId)
      }
      
      return votingRecords
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useVoteDetails(voteId: string, lawId: string) {
  return useQuery({
    queryKey: ['vote-details', voteId],
    queryFn: async (): Promise<VotingRecord | null> => {
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const law = getLawById(lawId)
      if (!law) return null
      
      for (const version of law.versions) {
        if (version.votingRecord?.id === voteId) {
          return version.votingRecord
        }
      }
      
      return null
    },
    enabled: !!voteId && !!lawId,
  })
}

// ==================== RECENT CHANGES ====================

export function useRecentChanges() {
  return useQuery({
    queryKey: ['recent-changes'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 200))
      return mockRecentChanges
    },
    staleTime: 5 * 60 * 1000,
  })
}

// ==================== CONTROVERSIAL VOTES ====================

export function useControversialVotes() {
  return useQuery({
    queryKey: ['controversial-votes'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 200))
      return mockControversialVotes
    },
    staleTime: 5 * 60 * 1000,
  })
}

// ==================== PARTY STATS ====================

export function usePartyStats() {
  const { data: deputies, isLoading: deputiesLoading } = useDeputies()
  
  const partyStats = deputies?.reduce((acc, deputy) => {
    const partyId = deputy.party.id
    if (!acc[partyId]) {
      acc[partyId] = {
        party: deputy.party,
        deputyCount: 0,
        totalConsistency: 0,
        totalAttendance: 0,
      }
    }
    acc[partyId].deputyCount++
    acc[partyId].totalConsistency += deputy.consistencyScore
    acc[partyId].totalAttendance += deputy.attendance
    return acc
  }, {} as Record<string, {
    party: Party
    deputyCount: number
    totalConsistency: number
    totalAttendance: number
  }>)

  const stats = partyStats ? Object.values(partyStats).map(({ party, deputyCount, totalConsistency, totalAttendance }) => ({
    party,
    deputyCount,
    avgConsistency: Math.round(totalConsistency / deputyCount),
    avgAttendance: Math.round(totalAttendance / deputyCount),
  })) : []

  return {
    data: stats,
    isLoading: deputiesLoading,
  }
}
