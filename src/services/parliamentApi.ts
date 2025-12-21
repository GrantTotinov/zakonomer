const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// API response types from parliament.bg
export interface ApiDeputy {
  id: number;
  name: string;
  party: string;
  party_color?: string;
  region?: string;
  photo?: string;
  email?: string;
  birthdate?: string;
  education?: string;
}

export interface ApiBill {
  id: number;
  signature: string;
  title: string;
  date: string;
  type?: string;
  status?: string;
  submitters?: string[];
  committees?: string[];
}

export interface ApiBillDetails {
  id: number;
  signature: string;
  title: string;
  date: string;
  type?: string;
  status?: string;
  submitters?: ApiSubmitter[];
  stages?: ApiBillStage[];
  documents?: ApiDocument[];
  votes?: ApiVoteSession[];
}

export interface ApiSubmitter {
  id: number;
  name: string;
  type: 'mp' | 'committee' | 'government';
}

export interface ApiBillStage {
  id: number;
  name: string;
  date: string;
  result?: string;
}

export interface ApiDocument {
  id: number;
  title: string;
  date: string;
  url?: string;
  type?: string;
}

export interface ApiVoteSession {
  id: number;
  date: string;
  title: string;
  votes_for: number;
  votes_against: number;
  abstained: number;
  absent: number;
  passed: boolean;
}

export interface ApiVote {
  mp_id: number;
  mp_name: string;
  party: string;
  vote: 'for' | 'against' | 'abstained' | 'absent';
}

export interface ApiParty {
  id: number;
  name: string;
  short_name: string;
  color?: string;
  members_count?: number;
}

export interface ApiSession {
  id: number;
  date: string;
  title: string;
  type?: string;
}

// Response wrapper type from API
interface ApiResponse<T> {
  data?: T;
  error?: string;
  fallback?: boolean;
}

// Proxy function to call Parliament API through our edge function
async function callParliamentApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/parliament-proxy?endpoint=${encodeURIComponent(endpoint)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  const jsonData = await response.json();
  
  // Handle wrapped response format { data: [...], error: ..., fallback: ... }
  if (jsonData && typeof jsonData === 'object' && !Array.isArray(jsonData)) {
    // Check if it's an error/fallback response
    if (jsonData.fallback === true || jsonData.error) {
      console.warn('API returned fallback response:', jsonData.error);
      // Return data array if present, otherwise throw
      if (Array.isArray(jsonData.data)) {
        return jsonData.data as T;
      }
      throw new Error(jsonData.error || 'API fallback triggered');
    }
    
    // Check if response has a data property with array
    if (Array.isArray(jsonData.data)) {
      console.log(`API returned wrapped data with ${jsonData.data.length} items`);
      return jsonData.data as T;
    }
    
    // Check for other common wrapper patterns
    if (jsonData.items && Array.isArray(jsonData.items)) {
      return jsonData.items as T;
    }
    if (jsonData.results && Array.isArray(jsonData.results)) {
      return jsonData.results as T;
    }
    if (jsonData.list && Array.isArray(jsonData.list)) {
      return jsonData.list as T;
    }
  }
  
  // Return as-is if it's an array or other direct response
  return jsonData as T;
}

// API Functions
export async function fetchDeputies(): Promise<ApiDeputy[]> {
  try {
    const data = await callParliamentApi<ApiDeputy[]>('mp');
    return data || [];
  } catch (error) {
    console.error('Error fetching deputies:', error);
    return [];
  }
}

export async function fetchDeputyById(id: string): Promise<ApiDeputy | null> {
  try {
    const data = await callParliamentApi<ApiDeputy>(`mp/${id}`);
    return data;
  } catch (error) {
    console.error('Error fetching deputy:', error);
    return null;
  }
}

export async function fetchBills(params?: { 
  page?: number; 
  search?: string;
  year?: number;
}): Promise<ApiBill[]> {
  try {
    let endpoint = 'bills';
    const queryParams: string[] = [];
    
    if (params?.page) queryParams.push(`page=${params.page}`);
    if (params?.search) queryParams.push(`search=${encodeURIComponent(params.search)}`);
    if (params?.year) queryParams.push(`year=${params.year}`);
    
    if (queryParams.length > 0) {
      endpoint += '?' + queryParams.join('&');
    }
    
    const data = await callParliamentApi<ApiBill[]>(endpoint);
    return data || [];
  } catch (error) {
    console.error('Error fetching bills:', error);
    return [];
  }
}

export async function fetchBillById(id: string): Promise<ApiBillDetails | null> {
  try {
    const data = await callParliamentApi<ApiBillDetails>(`bills/${id}`);
    return data;
  } catch (error) {
    console.error('Error fetching bill:', error);
    return null;
  }
}

export async function fetchParties(): Promise<ApiParty[]> {
  try {
    const data = await callParliamentApi<ApiParty[]>('parties');
    return data || [];
  } catch (error) {
    console.error('Error fetching parties:', error);
    return [];
  }
}

export async function fetchVoteSessions(params?: {
  page?: number;
  billId?: string;
}): Promise<ApiVoteSession[]> {
  try {
    let endpoint = 'votes';
    const queryParams: string[] = [];
    
    if (params?.page) queryParams.push(`page=${params.page}`);
    if (params?.billId) queryParams.push(`bill_id=${params.billId}`);
    
    if (queryParams.length > 0) {
      endpoint += '?' + queryParams.join('&');
    }
    
    const data = await callParliamentApi<ApiVoteSession[]>(endpoint);
    return data || [];
  } catch (error) {
    console.error('Error fetching vote sessions:', error);
    return [];
  }
}

export async function fetchVoteDetails(voteId: string): Promise<ApiVote[]> {
  try {
    const data = await callParliamentApi<ApiVote[]>(`votes/${voteId}`);
    return data || [];
  } catch (error) {
    console.error('Error fetching vote details:', error);
    return [];
  }
}

export async function searchBills(query: string): Promise<ApiBill[]> {
  try {
    const data = await callParliamentApi<ApiBill[]>(`bills-search?q=${encodeURIComponent(query)}`);
    return data || [];
  } catch (error) {
    console.error('Error searching bills:', error);
    return [];
  }
}

export async function fetchSessions(): Promise<ApiSession[]> {
  try {
    const data = await callParliamentApi<ApiSession[]>('sessions');
    return data || [];
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
}
