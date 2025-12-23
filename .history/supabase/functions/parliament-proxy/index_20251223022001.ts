// supabase/functions/parliament-proxy/index.ts
//@ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const PARLIAMENT_API_BASE = "https://www.parliament.bg/api/v1"
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ApiResponse {
  data?: any
  error?: string
  fallback?: boolean
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS })
  }

  try {
    const url = new URL(req.url)
    const endpoint = url.searchParams.get('endpoint')
    
    if (!endpoint) {
      return new Response(
        JSON.stringify({ error: 'Missing endpoint parameter' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      )
    }

    // Construct full API URL
    const apiUrl = `${PARLIAMENT_API_BASE}/${endpoint}`
    console.log('Fetching from Parliament API:', apiUrl)

    // Fetch from Parliament API with proper headers
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      throw new Error(`Parliament API returned ${response.status}`)
    }

    const data = await response.json()
    
    // Return wrapped response
    return new Response(
      JSON.stringify({ data, fallback: false }),
      { 
        status: 200, 
        headers: { 
          ...CORS_HEADERS, 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
        } 
      }
    )

  } catch (error) {
    console.error('Parliament API error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        fallback: true,
        data: [] 
      }),
      { 
        status: 500, 
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } 
      }
    )
  }
})