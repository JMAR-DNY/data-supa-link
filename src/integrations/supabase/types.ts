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
      ai_prompts: {
        Row: {
          content: string
          created_at: string | null
          created_by_profile_id: number | null
          id: number
          name: string
          purpose: string | null
          team_editable: boolean | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by_profile_id?: number | null
          id?: never
          name: string
          purpose?: string | null
          team_editable?: boolean | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by_profile_id?: number | null
          id?: never
          name?: string
          purpose?: string | null
          team_editable?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_prompts_created_by_profile_id_fkey"
            columns: ["created_by_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          api_provider_id: number | null
          created_at: string | null
          created_by_profile_id: number | null
          id: number
          name: string | null
          vault_key: string
        }
        Insert: {
          api_provider_id?: number | null
          created_at?: string | null
          created_by_profile_id?: number | null
          id?: never
          name?: string | null
          vault_key: string
        }
        Update: {
          api_provider_id?: number | null
          created_at?: string | null
          created_by_profile_id?: number | null
          id?: never
          name?: string | null
          vault_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_api_provider_id_fkey"
            columns: ["api_provider_id"]
            isOneToOne: true
            referencedRelation: "api_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_keys_created_by_profile_id_fkey"
            columns: ["created_by_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      api_providers: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          website: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: never
          name: string
          website?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: never
          name?: string
          website?: string | null
        }
        Relationships: []
      }
      api_usage: {
        Row: {
          action: string
          api_provider_id: number | null
          cost_usd: number | null
          created_at: string | null
          id: number
          metadata: Json | null
          usage_units: number | null
        }
        Insert: {
          action: string
          api_provider_id?: number | null
          cost_usd?: number | null
          created_at?: string | null
          id?: never
          metadata?: Json | null
          usage_units?: number | null
        }
        Update: {
          action?: string
          api_provider_id?: number | null
          cost_usd?: number | null
          created_at?: string | null
          id?: never
          metadata?: Json | null
          usage_units?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_api_provider_id_fkey"
            columns: ["api_provider_id"]
            isOneToOne: false
            referencedRelation: "api_providers"
            referencedColumns: ["id"]
          },
        ]
      }
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
      companies: {
        Row: {
          active: boolean | null
          awards: string | null
          created_at: string | null
          employee_count: number | null
          founded: number | null
          id: number
          industry: string | null
          keywords: string | null
          leadership: string | null
          modified_at: string | null
          name: string | null
          products_services: string | null
          raw_source_id: number | null
          revenue_range: string | null
          summary: string | null
          target_market: string | null
          team_id: number
          usp: string | null
        }
        Insert: {
          active?: boolean | null
          awards?: string | null
          created_at?: string | null
          employee_count?: number | null
          founded?: number | null
          id?: never
          industry?: string | null
          keywords?: string | null
          leadership?: string | null
          modified_at?: string | null
          name?: string | null
          products_services?: string | null
          raw_source_id?: number | null
          revenue_range?: string | null
          summary?: string | null
          target_market?: string | null
          team_id: number
          usp?: string | null
        }
        Update: {
          active?: boolean | null
          awards?: string | null
          created_at?: string | null
          employee_count?: number | null
          founded?: number | null
          id?: never
          industry?: string | null
          keywords?: string | null
          leadership?: string | null
          modified_at?: string | null
          name?: string | null
          products_services?: string | null
          raw_source_id?: number | null
          revenue_range?: string | null
          summary?: string | null
          target_market?: string | null
          team_id?: number
          usp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      company_addresses: {
        Row: {
          active: boolean | null
          address_line_1: string | null
          address_line_2: string | null
          city: string | null
          company_id: number | null
          created_at: string | null
          id: number
          modified_at: string | null
          postal: string | null
          raw_source_id: number | null
          state: string | null
        }
        Insert: {
          active?: boolean | null
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          company_id?: number | null
          created_at?: string | null
          id?: never
          modified_at?: string | null
          postal?: string | null
          raw_source_id?: number | null
          state?: string | null
        }
        Update: {
          active?: boolean | null
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          company_id?: number | null
          created_at?: string | null
          id?: never
          modified_at?: string | null
          postal?: string | null
          raw_source_id?: number | null
          state?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_addresses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_email_addresses: {
        Row: {
          active: boolean | null
          address: string | null
          company_id: number | null
          created_at: string | null
          id: number
          modified_at: string | null
          raw_source_id: number | null
          status_id: number | null
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          company_id?: number | null
          created_at?: string | null
          id?: never
          modified_at?: string | null
          raw_source_id?: number | null
          status_id?: number | null
        }
        Update: {
          active?: boolean | null
          address?: string | null
          company_id?: number | null
          created_at?: string | null
          id?: never
          modified_at?: string | null
          raw_source_id?: number | null
          status_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "company_email_addresses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_company_email_status"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "statuses"
            referencedColumns: ["id"]
          },
        ]
      }
      company_phone_numbers: {
        Row: {
          active: boolean | null
          company_id: number | null
          created_at: string | null
          id: number
          modified_at: string | null
          phone_number: string | null
          raw_source_id: number | null
        }
        Insert: {
          active?: boolean | null
          company_id?: number | null
          created_at?: string | null
          id?: never
          modified_at?: string | null
          phone_number?: string | null
          raw_source_id?: number | null
        }
        Update: {
          active?: boolean | null
          company_id?: number | null
          created_at?: string | null
          id?: never
          modified_at?: string | null
          phone_number?: string | null
          raw_source_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "company_phone_numbers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_urls: {
        Row: {
          active: boolean | null
          company_id: number | null
          created_at: string | null
          id: number
          modified_at: string | null
          raw_source_id: number | null
          url: string | null
        }
        Insert: {
          active?: boolean | null
          company_id?: number | null
          created_at?: string | null
          id?: never
          modified_at?: string | null
          raw_source_id?: number | null
          url?: string | null
        }
        Update: {
          active?: boolean | null
          company_id?: number | null
          created_at?: string | null
          id?: never
          modified_at?: string | null
          raw_source_id?: number | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_urls_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_addresses: {
        Row: {
          active: boolean | null
          address_line_1: string | null
          address_line_2: string | null
          city: string | null
          contact_id: number | null
          created_at: string | null
          id: number
          modified_at: string | null
          postal: string | null
          raw_source_id: number | null
          state: string | null
        }
        Insert: {
          active?: boolean | null
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          contact_id?: number | null
          created_at?: string | null
          id?: never
          modified_at?: string | null
          postal?: string | null
          raw_source_id?: number | null
          state?: string | null
        }
        Update: {
          active?: boolean | null
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          contact_id?: number | null
          created_at?: string | null
          id?: never
          modified_at?: string | null
          postal?: string | null
          raw_source_id?: number | null
          state?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_addresses_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_email_addresses: {
        Row: {
          active: boolean | null
          address: string | null
          contact_id: number | null
          created_at: string | null
          id: number
          modified_at: string | null
          raw_source_id: number | null
          status_id: number | null
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          contact_id?: number | null
          created_at?: string | null
          id?: never
          modified_at?: string | null
          raw_source_id?: number | null
          status_id?: number | null
        }
        Update: {
          active?: boolean | null
          address?: string | null
          contact_id?: number | null
          created_at?: string | null
          id?: never
          modified_at?: string | null
          raw_source_id?: number | null
          status_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_email_addresses_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_contact_email_status"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "statuses"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_phone_numbers: {
        Row: {
          active: boolean | null
          contact_id: number | null
          created_at: string | null
          id: number
          modified_at: string | null
          phone_number: string | null
          raw_source_id: number | null
        }
        Insert: {
          active?: boolean | null
          contact_id?: number | null
          created_at?: string | null
          id?: never
          modified_at?: string | null
          phone_number?: string | null
          raw_source_id?: number | null
        }
        Update: {
          active?: boolean | null
          contact_id?: number | null
          created_at?: string | null
          id?: never
          modified_at?: string | null
          phone_number?: string | null
          raw_source_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_phone_numbers_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_urls: {
        Row: {
          active: boolean | null
          contact_id: number | null
          created_at: string | null
          id: number
          modified_at: string | null
          raw_source_id: number | null
          url: string | null
        }
        Insert: {
          active?: boolean | null
          contact_id?: number | null
          created_at?: string | null
          id?: never
          modified_at?: string | null
          raw_source_id?: number | null
          url?: string | null
        }
        Update: {
          active?: boolean | null
          contact_id?: number | null
          created_at?: string | null
          id?: never
          modified_at?: string | null
          raw_source_id?: number | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_urls_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          active: boolean | null
          created_at: string | null
          first_name: string | null
          id: number
          last_name: string | null
          modified_at: string | null
          raw_source_id: number | null
          team_id: number
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          first_name?: string | null
          id?: never
          last_name?: string | null
          modified_at?: string | null
          raw_source_id?: number | null
          team_id: number
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          first_name?: string | null
          id?: never
          last_name?: string | null
          modified_at?: string | null
          raw_source_id?: number | null
          team_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "contacts_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts_companies: {
        Row: {
          active: boolean | null
          company_id: number | null
          contact_id: number | null
          created_at: string | null
          id: number
          modified_at: string | null
          raw_source_id: number | null
        }
        Insert: {
          active?: boolean | null
          company_id?: number | null
          contact_id?: number | null
          created_at?: string | null
          id?: never
          modified_at?: string | null
          raw_source_id?: number | null
        }
        Update: {
          active?: boolean | null
          company_id?: number | null
          contact_id?: number | null
          created_at?: string | null
          id?: never
          modified_at?: string | null
          raw_source_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_companies_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      list_tags: {
        Row: {
          list_id: number
          tag_id: number
        }
        Insert: {
          list_id: number
          tag_id: number
        }
        Update: {
          list_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "list_tags_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "list_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      lists: {
        Row: {
          created_at: string | null
          created_by_profile_id: number | null
          description: string | null
          id: number
          name: string
          team_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by_profile_id?: number | null
          description?: string | null
          id?: never
          name: string
          team_id: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by_profile_id?: number | null
          description?: string | null
          id?: never
          name?: string
          team_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lists_created_by_profile_id_fkey"
            columns: ["created_by_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lists_team_id_fkey"
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
          role_id: number
          team_id: number
        }
        Insert: {
          created_at?: string | null
          id?: never
          invited_by_profile_id?: number | null
          profile_id: number
          role_id: number
          team_id: number
        }
        Update: {
          created_at?: string | null
          id?: never
          invited_by_profile_id?: number | null
          profile_id?: number
          role_id?: number
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
            foreignKeyName: "memberships_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
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
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          permissions: Json | null
          scope: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id: number
          name: string
          permissions?: Json | null
          scope: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          permissions?: Json | null
          scope?: string
        }
        Relationships: []
      }
      source_data: {
        Row: {
          created_at: string
          error_log: string | null
          id: number
          list_id: number | null
          processed: boolean
          raw_data: Json | null
          source_id: number
        }
        Insert: {
          created_at?: string
          error_log?: string | null
          id?: number
          list_id?: number | null
          processed?: boolean
          raw_data?: Json | null
          source_id?: number
        }
        Update: {
          created_at?: string
          error_log?: string | null
          id?: number
          list_id?: number | null
          processed?: boolean
          raw_data?: Json | null
          source_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "source_data_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
        ]
      }
      source_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: never
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: never
          name?: string
        }
        Relationships: []
      }
      sources: {
        Row: {
          created_at: string | null
          created_by_profile_id: number | null
          description: string | null
          file_name: string | null
          id: number
          metadata: Json | null
          name: string | null
          origin_url: string | null
          record_count: number | null
          source_type_id: number | null
          status_id: number | null
          team_id: number
        }
        Insert: {
          created_at?: string | null
          created_by_profile_id?: number | null
          description?: string | null
          file_name?: string | null
          id?: never
          metadata?: Json | null
          name?: string | null
          origin_url?: string | null
          record_count?: number | null
          source_type_id?: number | null
          status_id?: number | null
          team_id: number
        }
        Update: {
          created_at?: string | null
          created_by_profile_id?: number | null
          description?: string | null
          file_name?: string | null
          id?: never
          metadata?: Json | null
          name?: string | null
          origin_url?: string | null
          record_count?: number | null
          source_type_id?: number | null
          status_id?: number | null
          team_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "sources_created_by_profile_id_fkey"
            columns: ["created_by_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sources_source_type_id_fkey"
            columns: ["source_type_id"]
            isOneToOne: false
            referencedRelation: "source_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sources_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "statuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sources_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      statuses: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: never
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: never
          name?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          active: boolean
          color: string | null
          created_at: string | null
          created_by_profile_id: number | null
          id: number
          name: string
          team_id: number
        }
        Insert: {
          active?: boolean
          color?: string | null
          created_at?: string | null
          created_by_profile_id?: number | null
          id?: never
          name: string
          team_id: number
        }
        Update: {
          active?: boolean
          color?: string | null
          created_at?: string | null
          created_by_profile_id?: number | null
          id?: never
          name?: string
          team_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tags_created_by_profile_id_fkey"
            columns: ["created_by_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tags_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
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
      user_roles: {
        Row: {
          granted_at: string | null
          granted_by_profile_id: number | null
          profile_id: number
          role_id: number
        }
        Insert: {
          granted_at?: string | null
          granted_by_profile_id?: number | null
          profile_id: number
          role_id: number
        }
        Update: {
          granted_at?: string | null
          granted_by_profile_id?: number | null
          profile_id?: number
          role_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_granted_by_profile_id_fkey"
            columns: ["granted_by_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_is_sysadmin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      check_team_membership: {
        Args: { team_id: number; user_uuid: string }
        Returns: boolean
      }
      check_team_owner: {
        Args: { team_id: number; user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
