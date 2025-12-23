// src/hooks/useParliamentData.ts - FIXED VERSION

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Deputy, Law, Party, VotingRecord } from '@/types'

// ==================== DEPUTIES ====================

export function useDeputies() {
  return useQuery({
    queryKey: ['deputies'],
    queryFn: async (): Promise<Deputy[]> => {
      const { data, error } = await supabase
        .from('deputies')
        .select(`
          id,
          name,
          constituency,
          photo,
          consistency,
          attendance,
          party:parties (
            id,
            name,
            short_name,
            color
          )
        `)
        .order('name')

      if (error) {
        console.error('Error fetching deputies:', error)
        throw error
      }

      if (!data) return []

      return data.map((d) => ({
        id: String(d.id),
        name: d.name,
        constituency: d.constituency || 'Неизвестен',
        photo: d.photo || undefined,
        consistencyScore: d.consistency || 85,
        attendance: d.attendance || 90,
        party: {
          id: String((d.party as any)?.id || 0),
          name: (d.party as any)?.name || 'Независим',
          shortName: (d.party as any)?.short_name || 'НЕЗ',
          color: (d.party as any)?.color || '#666666',
        },
      }))
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useDeputy(id: string) {
  return useQuery({
    queryKey: ['deputy', id],
    queryFn: async (): Promise<Deputy | null> => {
      const { data, error } = await supabase
        .from('deputies')
        .select(`
          id,
          name,
          constituency,
          photo,
          consistency,
          attendance,
          party:parties (
            id,
            name,
            short_name,
            color
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching deputy:', error)
        return null
      }

      if (!data) return null

      return {
        id: String(data.id),
        name: data.name,
        constituency: data.constituency || 'Неизвестен',
        photo: data.photo,
        consistencyScore: data.consistency || 85,
        attendance: data.attendance || 90,
        party: {
          id: String((data.party as any)?.id || 0),
          name: (data.party as any)?.name || 'Независим',
          shortName: (data.party as any)?.short_name || 'НЕЗ',
          color: (data.party as any)?.color || '#666666',
        },
      }
    },
    enabled: !!id,
  })
}

// ==================== PARTIES ====================

export function useParties() {
  return useQuery({
    queryKey: ['parties'],
    queryFn: async (): Promise<Party[]> => {
      const { data, error } = await supabase
        .from('parties')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching parties:', error)
        throw error
      }

      if (!data) return []

      return data.map((p) => ({
        id: String(p.id),
        name: p.name,
        shortName: p.short_name || p.name.substring(0, 4),
        color: p.color || '#666666',
      }))
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// ==================== LAWS (Mock for now) ====================

export function useBills(params?: { page?: number; search?: string; year?: number }) {
  return useQuery({
    queryKey: ['bills', params],
    queryFn: async (): Promise<Law[]> => {
      // TODO: Implement when laws table is populated
      // For now return empty array
      return []
    },
    staleTime: 2 * 60 * 1000,
  })
}

export function useBill(id: string) {
  return useQuery({
    queryKey: ['bill', id],
    queryFn: async (): Promise<Law | null> => {
      // TODO: Implement when laws table is populated
      return null
    },
    enabled: !!id,
  })
}

export function useSearchBills(query: string) {
  return useQuery({
    queryKey: ['search-bills', query],
    queryFn: async (): Promise<Law[]> => {
      // TODO: Implement when laws table is populated
      return []
    },
    enabled: query.length >= 2,
    staleTime: 1 * 60 * 1000,
  })
}

// ==================== VOTES (Mock for now) ====================

export function useVoteSessions(params?: { page?: number; billId?: string }) {
  return useQuery({
    queryKey: ['vote-sessions', params],
    queryFn: async () => {
      // TODO: Implement when votes table is populated
      return []
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useVoteDetails(voteId: string, lawId: string) {
  return useQuery({
    queryKey: ['vote-details', voteId],
    queryFn: async (): Promise<VotingRecord | null> => {
      // TODO: Implement when vote_records table is populated
      return null
    },
    enabled: !!voteId && !!lawId,
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