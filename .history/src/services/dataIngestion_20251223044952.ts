// src/services/dataIngestion.ts

import { supabase } from '@/integrations/supabase/client'

interface ParliamentMPRaw {
  A_ns_CL_value: string      // Парламентарна група
  A_ns_MPL_Name1: string     // Име
  A_ns_MPL_Name2: string     // Презиме
  A_ns_MPL_Name3: string     // Фамилия
  A_ns_Va_name: string       // Избирателен район
  A_ns_MP_ID: number         // ID на депутат
  A_ns_CL_ID?: number        // ID на парламентарна група
}

interface ParliamentNSResponse {
  colListMP: ParliamentMPRaw[]
}

// Цветове за партиите
const PARTY_COLORS: Record<string, string> = {
  'ГЕРБ-СДС': '#0066CC',
  'ПП-ДБ': '#FFD700',
  'ДПС': '#003366',
  'Възраждане': '#8B0000',
  'БСП': '#CC0000',
  'ИТН': '#00CED1',
}

export class DataIngestionService {
  
  /**
   * Извлича данни за депутатите от Parliament API
   * Използва CORS proxy за да избегне CORS ограниченията
   */
  async fetchDeputiesFromAPI(): Promise<ParliamentMPRaw[]> {
    try {
      console.log('Attempting to fetch from Parliament API directly...')
      
      // OPTION 1: Директно извикване (може да има CORS проблем)
      const apiUrl = 'https://www.parliament.bg/api/v1/coll-list-ns/bg'
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Parliament API returned ${response.status}`)
      }

      const result = await response.json()
      
      if (result.colListMP) {
        console.log(`Successfully fetched ${result.colListMP.length} deputies directly`)
        return result.colListMP
      }
      
      throw new Error('Invalid API response format - missing colListMP')
    } catch (error) {
      console.error('Direct API call failed:', error)
      
      // Винаги пробвай през Edge Function при грешка
      console.log('Attempting to use Edge Function proxy...')
      return this.fetchDeputiesViaProxy()
    }
  }

  /**
   * Fallback: Извикване през Supabase Edge Function
   */
  private async fetchDeputiesViaProxy(): Promise<ParliamentMPRaw[]> {
    try {
      console.log('Fetching via Supabase Edge Function proxy...')
      
      const proxyUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/parliament-proxy?endpoint=coll-list-ns/bg`
      console.log('Proxy URL:', proxyUrl)
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
        },
      })

      console.log('Proxy response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Proxy error response:', errorText)
        throw new Error(`Proxy returned ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log('Proxy response data:', result)
      
      if (result.data?.colListMP) {
        console.log(`Successfully fetched ${result.data.colListMP.length} deputies via proxy`)
        return result.data.colListMP
      }
      
      throw new Error('Invalid proxy response format')
    } catch (error) {
      console.error('Edge Function proxy failed:', error)
      throw new Error(`Failed to fetch deputies: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Синхронизира партиите в базата данни
   */
  async syncParties(deputies: ParliamentMPRaw[]): Promise<Map<string, number>> {
    // Извличаме уникалните партии
    const uniqueParties = new Map<string, { id?: number, name: string, shortName: string }>()
    
    deputies.forEach(deputy => {
      const partyName = deputy.A_ns_CL_value
      console.log('Party name from API:', partyName) // DEBUG
      if (!uniqueParties.has(partyName)) {
        uniqueParties.set(partyName, {
          name: partyName,
          shortName: partyName.split(' ')[0] || partyName.substring(0, 4),
        })
      }
    })
    
    console.log('Unique parties found:', Array.from(uniqueParties.keys())) // DEBUG

    const partyIdMap = new Map<string, number>()

    // Вмъкваме или обновяваме партиите
    for (const [partyName, partyData] of uniqueParties) {
      const { data: existingParty } = await supabase
        .from('parties')
        .select('id')
        .eq('name', partyName)
        .single()

      if (existingParty) {
        partyIdMap.set(partyName, existingParty.id)
      } else {
        const { data: newParty, error } = await supabase
          .from('parties')
          .insert({
            name: partyData.name,
            short_name: partyData.shortName,
            color: PARTY_COLORS[partyName] || '#666666',
          })
          .select('id')
          .single()

        if (error) {
          console.error('Error inserting party:', error)
          continue
        }

        if (newParty) {
          partyIdMap.set(partyName, newParty.id)
        }
      }
    }

    return partyIdMap
  }

  /**
   * Синхронизира депутатите в базата данни
   */
  async syncDeputies(deputies: ParliamentMPRaw[], partyIdMap: Map<string, number>): Promise<void> {
    const deputiesToInsert = deputies.map(deputy => {
      const fullName = `${deputy.A_ns_MPL_Name1} ${deputy.A_ns_MPL_Name2} ${deputy.A_ns_MPL_Name3}`.trim()
      const partyId = partyIdMap.get(deputy.A_ns_CL_value)

      return {
        name: fullName,
        party_id: partyId,
        constituency: deputy.A_ns_Va_name,
        consistency: 85 + Math.floor(Math.random() * 15), // Временно
        attendance: 80 + Math.floor(Math.random() * 20),  // Временно
      }
    })

    // Изтриваме старите депутати (за да избегнем дубликати)
    await supabase.from('deputies').delete().neq('id', 0)

    // Вмъкваме новите
    const { error } = await supabase
      .from('deputies')
      .insert(deputiesToInsert)

    if (error) {
      console.error('Error inserting deputies:', error)
      throw error
    }

    console.log(`Successfully synced ${deputiesToInsert.length} deputies`)
  }

  /**
   * Извлича законопроекти (ще имплементираме след като има endpoint)
   */
  async fetchBillsFromAPI(): Promise<any[]> {
    // TODO: Implement when bills endpoint is available
    // За момента връщаме празен масив
    return []
  }

  /**
   * Главна функция за синхронизация
   */
  async syncAll(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('Starting data synchronization...')
      
      // 1. Fetch deputies from API
      const apiDeputies = await this.fetchDeputiesFromAPI()
      console.log(`Fetched ${apiDeputies.length} deputies from API`)

      // 2. Sync parties
      const partyIdMap = await this.syncParties(apiDeputies)
      console.log(`Synced ${partyIdMap.size} parties`)

      // 3. Sync deputies
      await this.syncDeputies(apiDeputies, partyIdMap)

      // 4. TODO: Sync bills when endpoint is ready
      // await this.syncBills()

      return {
        success: true,
        message: `Successfully synced ${apiDeputies.length} deputies and ${partyIdMap.size} parties`
      }
    } catch (error) {
      console.error('Sync error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Export singleton instance
export const dataIngestionService = new DataIngestionService()