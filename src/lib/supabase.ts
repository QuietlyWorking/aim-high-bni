import { createClient } from "@supabase/supabase-js";
import type { OrgConfig, Member, Testimonial, Recognition, ChapterStats } from "./types";

let client: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (client) return client;
  const url = import.meta.env.SUPABASE_URL;
  const key = import.meta.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
  }
  client = createClient(url, key);
  return client;
}

export async function fetchOrgByDomain(domain: string): Promise<OrgConfig | null> {
  const sb = getClient();

  // Strip port for local dev and normalize
  const cleanDomain = domain.replace(/:\d+$/, "").toLowerCase();

  // Try exact domain match first
  const { data, error } = await sb
    .from("organizations")
    .select("*")
    .eq("domain", cleanDomain)
    .eq("subscription_status", "active")
    .single();

  if (error || !data) {
    // Fallback: try by org ID env var (for dev/preview deployments)
    const fallbackId = import.meta.env.AIM_HIGH_ORG_ID;
    if (fallbackId) {
      const { data: fallback } = await sb
        .from("organizations")
        .select("*")
        .eq("id", fallbackId)
        .single();
      if (fallback) return mapOrg(fallback);
    }
    return null;
  }

  return mapOrg(data);
}

function mapOrg(row: Record<string, unknown>): OrgConfig {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    domain: row.domain as string,
    chapterType: row.chapter_type as string,
    region: row.region as string,
    meetingDay: row.meeting_day as string,
    meetingTime: row.meeting_time as string,
    meetingLocation: row.meeting_location as string,
    meetingFormat: row.meeting_format as string,
    timezone: row.timezone as string,
    contactEmail: (row.contact_email as string) || `hello@${row.domain as string}`,
    logoUrl: row.logo_url as string | null,
    memberCount: row.member_count as number || 0,
    maxMembers: row.max_members as number || 40,
    visitorRegistrarName: row.visitor_registrar_name as string | null,
    visitorRegistrarEmail: row.visitor_registrar_email as string | null,
  };
}

export async function fetchMembers(orgId: string): Promise<Member[]> {
  const sb = getClient();
  const { data, error } = await sb
    .from("members")
    .select("*")
    .eq("organization_id", orgId)
    .eq("status", "active")
    .eq("public_profile", true)
    .order("full_name");
  if (error) throw error;
  return data as Member[];
}

export async function fetchMember(orgId: string, slug: string): Promise<Member | null> {
  const sb = getClient();
  const { data, error } = await sb
    .from("members")
    .select("*")
    .eq("organization_id", orgId)
    .eq("slug", slug)
    .eq("status", "active")
    .single();
  if (error) return null;
  return data as Member;
}

export async function fetchTestimonials(orgId: string, featuredOnly = false): Promise<Testimonial[]> {
  const sb = getClient();
  let query = sb
    .from("public_chapter_testimonials")
    .select("*")
    .eq("organization_id", orgId)
    .order("display_order");

  if (featuredOnly) {
    query = query.eq("is_featured", true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Testimonial[];
}

export async function fetchMemberTestimonials(orgId: string, memberSlug: string): Promise<Testimonial[]> {
  const sb = getClient();
  const { data, error } = await sb
    .from("public_chapter_testimonials")
    .select("*")
    .eq("organization_id", orgId)
    .eq("about_member_slug", memberSlug)
    .order("display_order");
  if (error) throw error;
  return data as Testimonial[];
}

export async function fetchMemberRecognitions(orgId: string, memberSlug: string): Promise<Recognition[]> {
  const sb = getClient();
  const { data, error } = await sb
    .from("public_member_recognitions")
    .select("*")
    .eq("organization_id", orgId)
    .eq("to_member_slug", memberSlug)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Recognition[];
}

export async function fetchChapterStats(orgId: string): Promise<ChapterStats> {
  const sb = getClient();
  const { count, error } = await sb
    .from("members")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", orgId)
    .eq("status", "active");
  if (error) throw error;

  // TODO: Pull tyfcb, referrals, visitors from org settings or stats table
  return {
    memberCount: count || 0,
    tyfcb12Month: "$1.99M+",
    referralsGiven: "46+",
    visitorsPerYear: "100+",
  };
}
