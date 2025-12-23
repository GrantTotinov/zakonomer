export function useDeputies() {
  return useQuery({
    queryKey: ['deputies'],
    queryFn: async (): Promise<Deputy[]> => {
      const { data, error } = await supabase
        .from('deputies')
        .select(`
          *,
          party:parties(*)
        `)
        .order('name')

      if (error) throw error
      
      return data.map(d => ({
        id: String(d.id),
        name: d.name,
        party: {
          id: String(d.party.id),
          name: d.party.name,
          shortName: d.party.short_name,
          color: d.party.color,
        },
        constituency: d.constituency,
        photo: d.photo,
        consistencyScore: d.consistency,
        attendance: d.attendance,
      }))
    },
    staleTime: 5 * 60 * 1000,
  })
}