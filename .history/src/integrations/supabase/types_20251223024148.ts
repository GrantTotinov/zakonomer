// src/integrations/supabase/types.ts - TEMPORARY TYPES

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      parties: {
        Row: {
          id: number
          name: string
          short_name: string | null
          color: string | null
          created_at: string | null
        }
        Insert: {
          id?: number
          name: string
          short_name?: string | null
          color?: string | null
          created_at?: string | null
        }
        Update: {
          id?: number
          name?: string
          short_name?: string | null
          color?: string | null
          created_at?: string | null
        }
      }
      deputies: {
        Row: {
          id: number
          name: string
          party_id: number | null
          constituency: string | null
          photo: string | null
          consistency: number | null
          attendance: number | null
          created_at: string | null
        }
        Insert: {
          id?: number
          name: string
          party_id?: number | null
          constituency?: string | null
          photo?: string | null
          consistency?: number | null
          attendance?: number | null
          created_at?: string | null
        }
        Update: {
          id?: number
          name?: string
          party_id?: number | null
          constituency?: string | null
          photo?: string | null
          consistency?: number | null
          attendance?: number | null
          created_at?: string | null
        }
      }
      laws: {
        Row: {
          id: number
          title: string
          short_title: string | null
          category: string | null
          status: string | null
          followers: number | null
          last_updated: string | null
          created_at: string | null
        }
        Insert: {
          id?: number
          title: string
          short_title?: string | null
          category?: string | null
          status?: string | null
          followers?: number | null
          last_updated?: string | null
          created_at?: string | null
        }
        Update: {
          id?: number
          title?: string
          short_title?: string | null
          category?: string | null
          status?: string | null
          followers?: number | null
          last_updated?: string | null
          created_at?: string | null
        }
      }
      law_versions: {
        Row: {
          id: number
          law_id: number | null
          version_number: string | null
          date: string | null
          effective_date: string | null
          summary: string | null
          created_at: string | null
        }
        Insert: {
          id?: number
          law_id?: number | null
          version_number?: string | null
          date?: string | null
          effective_date?: string | null
          summary?: string | null
          created_at?: string | null
        }
        Update: {
          id?: number
          law_id?: number | null
          version_number?: string | null
          date?: string | null
          effective_date?: string | null
          summary?: string | null
          created_at?: string | null
        }
      }
      articles: {
        Row: {
          id: number
          law_version_id: number | null
          article_number: string | null
          title: string | null
          change_type: string | null
          content: string | null
          old_content: string | null
          created_at: string | null
        }
        Insert: {
          id?: number
          law_version_id?: number | null
          article_number?: string | null
          title?: string | null
          change_type?: string | null
          content?: string | null
          old_content?: string | null
          created_at?: string | null
        }
        Update: {
          id?: number
          law_version_id?: number | null
          article_number?: string | null
          title?: string | null
          change_type?: string | null
          content?: string | null
          old_content?: string | null
          created_at?: string | null
        }
      }
      votes: {
        Row: {
          id: number
          law_id: number | null
          law_version_id: number | null
          date: string | null
          total_votes: number | null
          passed: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: number
          law_id?: number | null
          law_version_id?: number | null
          date?: string | null
          total_votes?: number | null
          passed?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: number
          law_id?: number | null
          law_version_id?: number | null
          date?: string | null
          total_votes?: number | null
          passed?: boolean | null
          created_at?: string | null
        }
      }
      vote_records: {
        Row: {
          id: number
          vote_id: number | null
          deputy_id: number | null
          vote: string | null
          created_at: string | null
        }
        Insert: {
          id?: number
          vote_id?: number | null
          deputy_id?: number | null
          vote?: string | null
          created_at?: string | null
        }
        Update: {
          id?: number
          vote_id?: number | null
          deputy_id?: number | null
          vote?: string | null
          created_at?: string | null
        }
      }
      recent_changes: {
        Row: {
          id: number
          law_id: number | null
          law_version_id: number | null
          date: string | null
          change_type: string | null
          snippet: string | null
          created_at: string | null
        }
        Insert: {
          id?: number
          law_id?: number | null
          law_version_id?: number | null
          date?: string | null
          change_type?: string | null
          snippet?: string | null
          created_at?: string | null
        }
        Update: {
          id?: number
          law_id?: number | null
          law_version_id?: number | null
          date?: string | null
          change_type?: string | null
          snippet?: string | null
          created_at?: string | null
        }
      }
      controversial_votes: {
        Row: {
          id: number
          law_id: number | null
          vote_id: number | null
          date: string | null
          votes_for: number | null
          votes_against: number | null
          margin: number | null
          created_at: string | null
        }
        Insert: {
          id?: number
          law_id?: number | null
          vote_id?: number | null
          date?: string | null
          votes_for?: number | null
          votes_against?: number | null
          margin?: number | null
          created_at?: string | null
        }
        Update: {
          id?: number
          law_id?: number | null
          vote_id?: number | null
          date?: string | null
          votes_for?: number | null
          votes_against?: number | null
          margin?: number | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}