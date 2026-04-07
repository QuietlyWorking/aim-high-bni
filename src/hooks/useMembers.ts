import { useQuery } from "@tanstack/react-query";
import { supabase, AIM_HIGH_ORG_ID } from "@/integrations/supabase/client";

export interface Member {
  id: string;
  slug: string;
  first_name: string;
  last_name: string;
  full_name: string;
  headshot_url: string | null;
  business_name: string | null;
  business_logo_url: string | null;
  profession_category: string | null;
  tagline: string | null;
  bio: string | null;
  ideal_referral: string | null;
  testimonial: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  website: string | null;
  instagram_handle: string | null;
  role: string;
  status: string;
  join_date: string | null;
  card_jpg_url: string | null;
  card_generated_at: string | null;
  public_profile: boolean;
  public_phone: boolean;
  public_email: boolean;
}

export function useMembers() {
  return useQuery({
    queryKey: ["members", AIM_HIGH_ORG_ID],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("organization_id", AIM_HIGH_ORG_ID)
        .eq("status", "active")
        .eq("public_profile", true)
        .order("full_name");
      if (error) throw error;
      return data as Member[];
    },
    enabled: !!AIM_HIGH_ORG_ID,
  });
}

export function useMember(slug: string | undefined) {
  return useQuery({
    queryKey: ["member", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("organization_id", AIM_HIGH_ORG_ID)
        .eq("slug", slug)
        .eq("status", "active")
        .single();
      if (error) throw error;
      return data as Member;
    },
    enabled: !!slug && !!AIM_HIGH_ORG_ID,
  });
}
