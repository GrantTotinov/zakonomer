import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Parliament API base URL
const PARLIAMENT_API_BASE = 'https://parliament.bg/pub/api';

// Current legislature (51st National Assembly)
const CURRENT_NS = '51';

// Map our internal endpoint names to Parliament API endpoints with required params
const ENDPOINT_MAP: Record<string, { path: string; method: 'GET' | 'POST'; params: Record<string, string> }> = {
  'mp': { 
    path: 'ns-mp', 
    method: 'POST', 
    params: { action: 'list', ns: CURRENT_NS } 
  },
  'bills': { 
    path: 'zp-search', 
    method: 'POST', 
    params: { action: 'search', ns: CURRENT_NS } 
  },
  'votes': { 
    path: 'plenary-stenograms', 
    method: 'POST', 
    params: { action: 'list', ns: CURRENT_NS } 
  },
  'parties': { 
    path: 'ns-groups', 
    method: 'POST', 
    params: { action: 'list', ns: CURRENT_NS } 
  },
  'sessions': { 
    path: 'sessions', 
    method: 'POST', 
    params: { action: 'list', ns: CURRENT_NS } 
  },
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

    // Parse endpoint - could be "mp" or "mp/123"
    const [baseEndpoint, ...pathParts] = endpoint.split('/');
    const endpointConfig = ENDPOINT_MAP[baseEndpoint];
    
    if (!endpointConfig) {
      console.log(`Unknown endpoint: ${baseEndpoint}, will try direct path`);
      // Try direct path as fallback
      const parliamentUrl = `${PARLIAMENT_API_BASE}/${endpoint}`;
      const response = await fetch(parliamentUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });
      
      const data = await response.text();
      try {
        const jsonData = JSON.parse(data);
        return new Response(JSON.stringify(jsonData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch {
        return new Response(
          JSON.stringify({ error: 'Invalid response', fallback: true, data: [] }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const parliamentUrl = `${PARLIAMENT_API_BASE}/${endpointConfig.path}`;
    console.log(`Proxying request to: ${parliamentUrl} (method: ${endpointConfig.method})`);

    // Build form data with required params
    const formData = new URLSearchParams();
    Object.entries(endpointConfig.params).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    // Add ID if present in path (e.g., mp/123)
    if (pathParts.length > 0) {
      formData.append('id', pathParts[0]);
    }

    console.log(`Request params: ${formData.toString()}`);

    const response = await fetch(parliamentUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: formData.toString(),
    });

    const contentType = response.headers.get('content-type') || '';
    const responseText = await response.text();
    
    console.log(`Response status: ${response.status}, content-type: ${contentType}`);
    console.log(`Response length: ${responseText.length} chars`);
    
    // Check if we got HTML instead of JSON
    if (contentType.includes('text/html') || responseText.trim().startsWith('<!') || responseText.trim().startsWith('<html')) {
      console.error('Received HTML instead of JSON. First 300 chars:', responseText.substring(0, 300));
      
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
      console.log(`Successfully parsed JSON response, type: ${typeof data}, isArray: ${Array.isArray(data)}`);
      
      // Log first item structure for debugging
      if (Array.isArray(data) && data.length > 0) {
        console.log(`First item keys: ${Object.keys(data[0]).join(', ')}`);
      } else if (data && typeof data === 'object') {
        console.log(`Response keys: ${Object.keys(data).join(', ')}`);
      }
      
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', responseText.substring(0, 300));
      
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