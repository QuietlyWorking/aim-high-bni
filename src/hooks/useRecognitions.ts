import { useQuery } from "@tanstack/react-query";
import { supabase, AIM_HIGH_ORG_ID } from "@/integrations/supabase/client";

export interface Recognition {
  id: string;
  message: string;
  category: string;
  created_at: string;
  from_member_name: string;
  from_member_headshot: string | null;
  from_member_business: string | null;
}

export function useMemberRecognitions(memberId: string | undefined) {
  return useQuery({
    queryKey: ["recognitions", memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("public_member_recognitions")
        .select("*")
        .eq("organization_id", AIM_HIGH_ORG_ID)
        .eq("to_member_slug", memberId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Recognition[];
    },
    enabled: !!memberId && !!AIM_HIGH_ORG_ID,
  });
}
