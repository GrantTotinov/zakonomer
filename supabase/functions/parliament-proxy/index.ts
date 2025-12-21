import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Parliament API uses POST with form-data for most endpoints
const PARLIAMENT_API_BASE = 'https://parliament.bg/pub/api';

// Map our internal endpoint names to Parliament API endpoints
const ENDPOINT_MAP: Record<string, { path: string; method: 'GET' | 'POST'; params?: Record<string, string> }> = {
  'mp': { path: 'ns-mp', method: 'POST', params: { action: 'list' } },
  'bills': { path: 'zp-search', method: 'POST', params: { action: 'search' } },
  'votes': { path: 'plenary-stenograms', method: 'POST', params: { action: 'list' } },
  'parties': { path: 'ns-groups', method: 'POST', params: { action: 'list' } },
  'sessions': { path: 'sessions', method: 'POST', params: { action: 'list' } },
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const endpoint = url.searchParams.get('endpoint');
    
    if (!endpoint) {
      return new Response(
        JSON.stringify({ error: 'Missing endpoint parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get endpoint configuration or use default
    const endpointConfig = ENDPOINT_MAP[endpoint] || { 
      path: endpoint, 
      method: 'GET' as const 
    };

    const parliamentUrl = `${PARLIAMENT_API_BASE}/${endpointConfig.path}`;
    console.log(`Proxying request to: ${parliamentUrl} (method: ${endpointConfig.method})`);

    let response: Response;

    if (endpointConfig.method === 'POST') {
      // Use form-data for POST requests
      const formData = new URLSearchParams();
      if (endpointConfig.params) {
        Object.entries(endpointConfig.params).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }

      response = await fetch(parliamentUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        body: formData.toString(),
      });
    } else {
      response = await fetch(parliamentUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });
    }

    const contentType = response.headers.get('content-type') || '';
    const responseText = await response.text();
    
    console.log(`Response status: ${response.status}, content-type: ${contentType}`);
    
    // Check if we got HTML instead of JSON
    if (contentType.includes('text/html') || responseText.trim().startsWith('<!')) {
      console.error('Received HTML instead of JSON. First 200 chars:', responseText.substring(0, 200));
      
      // Return empty array to allow fallback to mock data
      return new Response(
        JSON.stringify({ 
          error: 'Parliament API returned HTML instead of JSON',
          fallback: true,
          data: []
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Try to parse as JSON
    try {
      const data = JSON.parse(responseText);
      console.log(`Successfully parsed JSON response`);
      
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', responseText.substring(0, 200));
      
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON response from Parliament API',
          fallback: true,
          data: []
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Proxy error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage, fallback: true, data: [] }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
