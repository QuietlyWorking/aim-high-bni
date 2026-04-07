import { useQuery } from "@tanstack/react-query";
import { supabase, AIM_HIGH_ORG_ID } from "@/integrations/supabase/client";

export interface ChapterStats {
  memberCount: number;
  // Future: pull from org settings or a stats table
  tyfcb12Month: string;
  referralsGiven: string;
  visitorsPerYear: string;
}

export function useChapterStats() {
  return useQuery({
    queryKey: ["chapterStats", AIM_HIGH_ORG_ID],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("members")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", AIM_HIGH_ORG_ID)
        .eq("status", "active");
      if (error) throw error;

      return {
        memberCount: count || 18,
        tyfcb12Month: "$1.99M+",
        referralsGiven: "46+",
        visitorsPerYear: "100+",
      } as ChapterStats;
    },
    enabled: !!AIM_HIGH_ORG_ID,
  });
}
