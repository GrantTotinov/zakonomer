export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          article_number: string | null
          change_type: string | null
          content: string | null
          created_at: string | null
          id: number
          law_version_id: number | null
          old_content: string | null
          title: string | null
        }
        Insert: {
          article_number?: string | null
          change_type?: string | null
          content?: string | null
          created_at?: string | null
          id?: number
          law_version_id?: number | null
          old_content?: string | null
          title?: string | null
        }
        Update: {
          article_number?: string | null
          change_type?: string | null
          content?: string | null
          created_at?: string | null
          id?: number
          law_version_id?: number | null
          old_content?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_law_version_id_fkey"
            columns: ["law_version_id"]
            isOneToOne: false
            referencedRelation: "law_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      controversial_votes: {
        Row: {
          created_at: string | null
          date: string | null
          id: number
          law_id: number | null
          margin: number | null
          vote_id: number | null
          votes_against: number | null
          votes_for: number | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          id?: number
          law_id?: number | null
          margin?: number | null
          vote_id?: number | null
          votes_against?: number | null
          votes_for?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          id?: number
          law_id?: number | null
          margin?: number | null
          vote_id?: number | null
          votes_against?: number | null
          votes_for?: number | null
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
          },
        ]
      }
      deputies: {
        Row: {
          attendance: number | null
          consistency: number | null
          constituency: string | null
          created_at: string | null
          id: number
          name: string
          party_id: number | null
          photo: string | null
        }
        Insert: {
          attendance?: number | null
          consistency?: number | null
          constituency?: string | null
          created_at?: string | null
          id?: number
          name: string
          party_id?: number | null
          photo?: string | null
        }
        Update: {
          attendance?: number | null
          consistency?: number | null
          constituency?: string | null
          created_at?: string | null
          id?: number
          name?: string
          party_id?: number | null
          photo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deputies_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
        ]
      }
      law_versions: {
        Row: {
          created_at: string | null
          date: string | null
          effective_date: string | null
          id: number
          law_id: number | null
          summary: string | null
          version_number: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          effective_date?: string | null
          id?: number
          law_id?: number | null
          summary?: string | null
          version_number?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          effective_date?: string | null
          id?: number
          law_id?: number | null
          summary?: string | null
          version_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "law_versions_law_id_fkey"
            columns: ["law_id"]
            isOneToOne: false
            referencedRelation: "laws"
            referencedColumns: ["id"]
          },
        ]
      }
      laws: {
        Row: {
          category: string | null
          created_at: string | null
          followers: number | null
          id: number
          last_updated: string | null
          short_title: string | null
          status: string | null
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          followers?: number | null
          id?: number
          last_updated?: string | null
          short_title?: string | null
          status?: string | null
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          followers?: number | null
          id?: number
          last_updated?: string | null
          short_title?: string | null
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      parties: {
        Row: {
          color: string | null
          created_at: string | null
          id: number
          name: string
          short_name: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: number
          name: string
          short_name?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: number
          name?: string
          short_name?: string | null
        }
        Relationships: []
      }
      recent_changes: {
        Row: {
          change_type: string | null
          created_at: string | null
          date: string | null
          id: number
          law_id: number | null
          law_version_id: number | null
          snippet: string | null
        }
        Insert: {
          change_type?: string | null
          created_at?: string | null
          date?: string | null
          id?: number
          law_id?: number | null
          law_version_id?: number | null
          snippet?: string | null
        }
        Update: {
          change_type?: string | null
          created_at?: string | null
          date?: string | null
          id?: number
          law_id?: number | null
          law_version_id?: number | null
          snippet?: string | null
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
          },
        ]
      }
      vote_records: {
        Row: {
          created_at: string | null
          deputy_id: number | null
          id: number
          vote: string | null
          vote_id: number | null
        }
        Insert: {
          created_at?: string | null
          deputy_id?: number | null
          id?: number
          vote?: string | null
          vote_id?: number | null
        }
        Update: {
          created_at?: string | null
          deputy_id?: number | null
          id?: number
          vote?: string | null
          vote_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vote_records_deputy_id_fkey"
            columns: ["deputy_id"]
            isOneToOne: false
            referencedRelation: "deputies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vote_records_vote_id_fkey"
            columns: ["vote_id"]
            isOneToOne: false
            referencedRelation: "votes"
            referencedColumns: ["id"]
          },
        ]
      }
      votes: {
        Row: {
          created_at: string | null
          date: string | null
          id: number
          law_id: number | null
          law_version_id: number | null
          passed: boolean | null
          total_votes: number | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          id?: number
          law_id?: number | null
          law_version_id?: number | null
          passed?: boolean | null
          total_votes?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          id?: number
          law_id?: number | null
          law_version_id?: number | null
          passed?: boolean | null
          total_votes?: number | null
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
          },
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
