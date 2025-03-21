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
      campaigns: {
        Row: {
          campaign_uuid: string
          content: string | null
          created_at: string | null
          created_by_profile_id: number | null
          id: number
          name: string
          scheduled_at: string | null
          status: string | null
          team_id: number
          updated_at: string | null
        }
        Insert: {
          campaign_uuid?: string
          content?: string | null
          created_at?: string | null
          created_by_profile_id?: number | null
          id?: never
          name: string
          scheduled_at?: string | null
          status?: string | null
          team_id: number
          updated_at?: string | null
        }
        Update: {
          campaign_uuid?: string
          content?: string | null
          created_at?: string | null
          created_by_profile_id?: number | null
          id?: never
          name?: string
          scheduled_at?: string | null
          status?: string | null
          team_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_created_by_profile_id_fkey"
            columns: ["created_by_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          created_at: string | null
          id: number
          invited_by_profile_id: number | null
          profile_id: number
          role: Database["public"]["Enums"]["team_role"]
          team_id: number
        }
        Insert: {
          created_at?: string | null
          id?: never
          invited_by_profile_id?: number | null
          profile_id: number
          role: Database["public"]["Enums"]["team_role"]
          team_id: number
        }
        Update: {
          created_at?: string | null
          id?: never
          invited_by_profile_id?: number | null
          profile_id?: number
          role?: Database["public"]["Enums"]["team_role"]
          team_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "memberships_invited_by_profile_id_fkey"
            columns: ["invited_by_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          id: number
          user_uuid: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          user_uuid: string
        }
        Update: {
          created_at?: string | null
          id?: never
          user_uuid?: string
        }
        Relationships: []
      }
      source_data: {
        Row: {
          created_at: string
          error_log: string | null
          id: number
          processed: boolean
          raw_data: Json | null
          source_id: number
        }
        Insert: {
          created_at?: string
          error_log?: string | null
          id?: number
          processed?: boolean
          raw_data?: Json | null
          source_id?: number
        }
        Update: {
          created_at?: string
          error_log?: string | null
          id?: number
          processed?: boolean
          raw_data?: Json | null
          source_id?: number
        }
        Relationships: []
      }
      teams: {
        Row: {
          created_at: string | null
          credits_balance: number | null
          id: number
          name: string
          owner_profile_id: number
          plan_type: string
          team_uuid: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credits_balance?: number | null
          id?: never
          name: string
          owner_profile_id: number
          plan_type: string
          team_uuid?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credits_balance?: number | null
          id?: never
          name?: string
          owner_profile_id?: number
          plan_type?: string
          team_uuid?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_owner_profile_id_fkey"
            columns: ["owner_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      team_role: "owner" | "full_access" | "send_only" | "view_only"
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
