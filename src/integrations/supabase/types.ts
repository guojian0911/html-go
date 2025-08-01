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
      chapters: {
        Row: {
          created_at: string | null
          id: string
          number: number
          storage_path: string
          title: string
          tutorial_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          number: number
          storage_path: string
          title: string
          tutorial_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          number?: number
          storage_path?: string
          title?: string
          tutorial_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapters_tutorial_id_fkey"
            columns: ["tutorial_id"]
            isOneToOne: false
            referencedRelation: "tutorials"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          created_timestamp: string
          id: string
          last_interacted_at: string | null
          message_count: number | null
          name: string | null
          project_name: string
          updated_timestamp: string
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          created_timestamp?: string
          id: string
          last_interacted_at?: string | null
          message_count?: number | null
          name?: string | null
          project_name: string
          updated_timestamp?: string
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          created_timestamp?: string
          id?: string
          last_interacted_at?: string | null
          message_count?: number | null
          name?: string | null
          project_name?: string
          updated_timestamp?: string
          workspace_id?: string
        }
        Relationships: []
      }
      cursor_categories: {
        Row: {
          color: string
          created_at: string | null
          description: string
          icon: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          color: string
          created_at?: string | null
          description: string
          icon: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cursor_rule_favorites: {
        Row: {
          created_at: string | null
          id: string
          rule_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          rule_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          rule_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      cursor_rule_files: {
        Row: {
          content: string
          created_at: string | null
          file_order: number | null
          id: string
          language: string
          name: string
          path: string
          rule_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          file_order?: number | null
          id?: string
          language?: string
          name: string
          path: string
          rule_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          file_order?: number | null
          id?: string
          language?: string
          name?: string
          path?: string
          rule_id?: string | null
        }
        Relationships: []
      }
      cursor_rules: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string
          display_name: string
          file_count: number | null
          id: string
          name: string
          popularity: number | null
          tags: string[] | null
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description: string
          display_name: string
          file_count?: number | null
          id?: string
          name: string
          popularity?: number | null
          tags?: string[] | null
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string
          display_name?: string
          file_count?: number | null
          id?: string
          name?: string
          popularity?: number | null
          tags?: string[] | null
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          message_order: number
          request_id: string
          role: string
          timestamp: string | null
          workspace_files: Json | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          message_order: number
          request_id: string
          role: string
          timestamp?: string | null
          workspace_files?: Json | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          message_order?: number
          request_id?: string
          role?: string
          timestamp?: string | null
          workspace_files?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          provider: string | null
          provider_id: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          provider?: string | null
          provider_id?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          provider?: string | null
          provider_id?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          id: string
          name: string
          path: string
          platform: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          path: string
          platform: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          path?: string
          platform?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: []
      }
      prompts: {
        Row: {
          category: string
          content: string
          created_at: string
          description: string
          example_output: string | null
          fork_count: number
          fork_from: string | null
          id: string
          is_public: boolean
          share_count: number
          stars_count: number
          state: number
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          view_count: number
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          description: string
          example_output?: string | null
          fork_count?: number
          fork_from?: string | null
          id?: string
          is_public?: boolean
          share_count?: number
          stars_count?: number
          state?: number
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          view_count?: number
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          description?: string
          example_output?: string | null
          fork_count?: number
          fork_from?: string | null
          id?: string
          is_public?: boolean
          share_count?: number
          stars_count?: number
          state?: number
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "prompts_fork_from_fkey"
            columns: ["fork_from"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      render_pages: {
        Row: {
          code_type: string
          created_at: string
          description: string | null
          html_content: string
          id: string
          is_protected: boolean
          password: string | null
          share_count: number
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          view_count: number
        }
        Insert: {
          code_type?: string
          created_at?: string
          description?: string | null
          html_content: string
          id?: string
          is_protected?: boolean
          password?: string | null
          share_count?: number
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          view_count?: number
        }
        Update: {
          code_type?: string
          created_at?: string
          description?: string | null
          html_content?: string
          id?: string
          is_protected?: boolean
          password?: string | null
          share_count?: number
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_render_pages_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "render_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      render_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      tutorials: {
        Row: {
          config: Json | null
          created_at: string | null
          id: string
          is_public: boolean
          language: string
          source_type: string
          source_url: string | null
          status: string
          title: string
          updated_at: string | null
          user_id: string
          view_count: number
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          id?: string
          is_public?: boolean
          language?: string
          source_type: string
          source_url?: string | null
          status?: string
          title: string
          updated_at?: string | null
          user_id: string
          view_count?: number
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          id?: string
          is_public?: boolean
          language?: string
          source_type?: string
          source_url?: string | null
          status?: string
          title?: string
          updated_at?: string | null
          user_id?: string
          view_count?: number
        }
        Relationships: []
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
