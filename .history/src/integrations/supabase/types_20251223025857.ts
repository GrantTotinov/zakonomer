// src/integrations/supabase/types.ts - CORRECTED VERSION

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12"
  }
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
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "deputies_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "law_versions_law_id_fkey"
            columns: ["law_id"]
            isOneToOne: false
            referencedRelation: "laws"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "articles_law_version_id_fkey"
            columns: ["law_version_id"]
            isOneToOne: false
            referencedRelation: "law_versions"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "votes_law_id_fkey"
            columns: ["law_id"]
            isOneToOne: false
            referencedRelation: "laws"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_law_version_id_fkey"
            columns: ["law_version_id"]
            isOneToOne: false
            referencedRelation: "law_versions"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "vote_records_vote_id_fkey"
            columns: ["vote_id"]
            isOneToOne: false
            referencedRelation: "votes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vote_records_deputy_id_fkey"
            columns: ["deputy_id"]
            isOneToOne: false
            referencedRelation: "deputies"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "recent_changes_law_id_fkey"
            columns: ["law_id"]
            isOneToOne: false
            referencedRelation: "laws"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recent_changes_law_version_id_fkey"
            columns: ["law_version_id"]
            isOneToOne: false
            referencedRelation: "law_versions"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "controversial_votes_law_id_fkey"
            columns: ["law_id"]
            isOneToOne: false
            referencedRelation: "laws"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "controversial_votes_vote_id_fkey"
            columns: ["vote_id"]
            isOneToOne: false
            referencedRelation: "votes"
            referencedColumns: ["id"]
          }
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never