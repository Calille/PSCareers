// Database type definitions for the PS Careers Supabase schema.
//
// This file mirrors the structure produced by `supabase gen types typescript`
// (which requires Docker locally) and is hand-maintained for now. To
// regenerate from the live database after schema changes, run:
//
//     npx supabase login
//     npx supabase link --project-ref kekqpfszqvpmbacbabtj
//     npx supabase gen types typescript --linked > types/database.ts
//
// Generated types replace this file verbatim.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      consultants: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          job_title: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          job_title?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          job_title?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'consultants_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };

      jobs: {
        Row: {
          id: string;
          title: string;
          slug: string | null;
          description: string;
          summary: string | null;
          requirements: string | null;
          location: string;
          region: string | null;
          sector: string;
          contract_type: string;
          salary_min: number | null;
          salary_max: number | null;
          salary_display: string | null;
          closing_date: string | null;
          start_date: string | null;
          status: 'draft' | 'pending_review' | 'live' | 'closed' | 'rejected';
          source: 'consultant' | 'employer';
          created_by: string | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug?: string | null;
          description: string;
          summary?: string | null;
          requirements?: string | null;
          location: string;
          region?: string | null;
          sector: string;
          contract_type: string;
          salary_min?: number | null;
          salary_max?: number | null;
          salary_display?: string | null;
          closing_date?: string | null;
          start_date?: string | null;
          status?: 'draft' | 'pending_review' | 'live' | 'closed' | 'rejected';
          source?: 'consultant' | 'employer';
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string | null;
          description?: string;
          summary?: string | null;
          requirements?: string | null;
          location?: string;
          region?: string | null;
          sector?: string;
          contract_type?: string;
          salary_min?: number | null;
          salary_max?: number | null;
          salary_display?: string | null;
          closing_date?: string | null;
          start_date?: string | null;
          status?: 'draft' | 'pending_review' | 'live' | 'closed' | 'rejected';
          source?: 'consultant' | 'employer';
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'jobs_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'consultants';
            referencedColumns: ['id'];
          },
        ];
      };

      employer_submissions: {
        Row: {
          id: string;
          job_id: string;
          organisation_name: string;
          organisation_type: string;
          contact_name: string;
          contact_job_title: string;
          contact_email: string;
          contact_phone: string;
          additional_notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          organisation_name: string;
          organisation_type: string;
          contact_name: string;
          contact_job_title: string;
          contact_email: string;
          contact_phone: string;
          additional_notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          organisation_name?: string;
          organisation_type?: string;
          contact_name?: string;
          contact_job_title?: string;
          contact_email?: string;
          contact_phone?: string;
          additional_notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'employer_submissions_job_id_fkey';
            columns: ['job_id'];
            isOneToOne: true;
            referencedRelation: 'jobs';
            referencedColumns: ['id'];
          },
        ];
      };

      candidates: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string;
          current_job_title: string;
          years_experience_band: string;
          region: string;
          contract_type_sought: string;
          cv_path: string;
          message: string | null;
          consent_given: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          phone: string;
          current_job_title: string;
          years_experience_band: string;
          region: string;
          contract_type_sought: string;
          cv_path: string;
          message?: string | null;
          consent_given?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string;
          current_job_title?: string;
          years_experience_band?: string;
          region?: string;
          contract_type_sought?: string;
          cv_path?: string;
          message?: string | null;
          consent_given?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };

      employers: {
        Row: {
          id: string;
          organisation_name: string;
          organisation_type: string;
          contact_name: string;
          contact_job_title: string;
          email: string;
          phone: string;
          hiring_volume: string | null;
          message: string | null;
          consent_given: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          organisation_name: string;
          organisation_type: string;
          contact_name: string;
          contact_job_title: string;
          email: string;
          phone: string;
          hiring_volume?: string | null;
          message?: string | null;
          consent_given?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          organisation_name?: string;
          organisation_type?: string;
          contact_name?: string;
          contact_job_title?: string;
          email?: string;
          phone?: string;
          hiring_volume?: string | null;
          message?: string | null;
          consent_given?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };

      applications: {
        Row: {
          id: string;
          job_id: string;
          full_name: string;
          email: string;
          phone: string;
          cv_path: string;
          message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          full_name: string;
          email: string;
          phone: string;
          cv_path: string;
          message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          full_name?: string;
          email?: string;
          phone?: string;
          cv_path?: string;
          message?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'applications_job_id_fkey';
            columns: ['job_id'];
            isOneToOne: false;
            referencedRelation: 'jobs';
            referencedColumns: ['id'];
          },
        ];
      };

      enquiries: {
        Row: {
          id: string;
          enquiry_type: 'contact_form' | 'candidate_intro_request' | 'general';
          name: string;
          email: string;
          phone: string | null;
          organisation: string | null;
          subject: string | null;
          message: string;
          i_am_a: string | null;
          candidate_reference: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          enquiry_type: 'contact_form' | 'candidate_intro_request' | 'general';
          name: string;
          email: string;
          phone?: string | null;
          organisation?: string | null;
          subject?: string | null;
          message: string;
          i_am_a?: string | null;
          candidate_reference?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          enquiry_type?: 'contact_form' | 'candidate_intro_request' | 'general';
          name?: string;
          email?: string;
          phone?: string | null;
          organisation?: string | null;
          subject?: string | null;
          message?: string;
          i_am_a?: string | null;
          candidate_reference?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };

    Views: { [_ in never]: never };
    Functions: {
      handle_new_user: {
        Args: Record<string, never>;
        Returns: unknown;
      };
      set_updated_at: {
        Args: Record<string, never>;
        Returns: unknown;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
