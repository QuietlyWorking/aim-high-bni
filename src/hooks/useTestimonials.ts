import { useQuery } from "@tanstack/react-query";
import { supabase, AIM_HIGH_ORG_ID } from "@/integrations/supabase/client";

export interface Testimonial {
  id: string;
  author_name: string;
  author_role: string;
  author_headshot_url: string | null;
  author_business_name: string | null;
  author_profession_category: string | null;
  quote: string;
  context: string | null;
  is_featured: boolean;
  display_order: number;
  source_date: string | null;
}

export function useTestimonials(featuredOnly = false) {
  return useQuery({
    queryKey: ["testimonials", AIM_HIGH_ORG_ID, featuredOnly],
    queryFn: async () => {
      let query = supabase
        .from("public_chapter_testimonials")
        .select("*")
        .eq("organization_id", AIM_HIGH_ORG_ID)
        .order("display_order");

      if (featuredOnly) {
        query = query.eq("is_featured", true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Testimonial[];
    },
    enabled: !!AIM_HIGH_ORG_ID,
  });
}
