import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { OrgConfig, Member, Testimonial, Recognition, ChapterStats } from "./types";

// Create a Supabase client from explicit credentials (passed from runtime context)
export function createSupabaseClient(url: string, key: string): SupabaseClient {
  return createClient(url, key);
}

// The chapter columns this public site may read. NEVER select("*") on organizations: the public key can read only these
// columns (2026-09-26), and a star select fails outright. Before this, the site read the whole row, so anyone with the
// public key could read the chapter's private settings (including member growth notes), dues and roster setup.
const PUBLIC_ORG_COLUMNS = [
  "id", "name", "slug", "domain", "chapter_type", "region", "meeting_day", "meeting_time", "meeting_location",
  "meeting_format", "timezone", "logo_url", "member_count", "max_members",
].join(", ");

export async function fetchOrgByDomain(
  sb: SupabaseClient,
  domain: string,
  fallbackOrgId?: string,
): Promise<OrgConfig | null> {
  // Strip port for local dev and normalize
  const cleanDomain = domain.replace(/:\d+$/, "").toLowerCase();

  // Try exact domain match first
  const { data, error } = await sb
    .from("organizations")
    .select(PUBLIC_ORG_COLUMNS)
    .eq("domain", cleanDomain)
    .eq("subscription_status", "active")
    .single();

  if (error || !data) {
    // Fallback: try by org ID (for dev/preview deployments)
    if (fallbackOrgId) {
      const { data: fallback } = await sb
        .from("organizations")
        .select(PUBLIC_ORG_COLUMNS)
        .eq("id", fallbackOrgId)
        .single();
      if (fallback) return mapOrg(fallback);
    }
    return null;
  }

  return mapOrg(data);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatTime(t: string): string {
  // Convert "11:30:00" or "11:30" to "11:30 AM"
  const parts = t.split(":");
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1] || "00";
  const ampm = hours >= 12 ? "PM" : "AM";
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes} ${ampm}`;
}

function mapOrg(row: Record<string, unknown>): OrgConfig {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    domain: row.domain as string,
    chapterType: row.chapter_type as string,
    region: row.region as string,
    meetingDay: capitalize(row.meeting_day as string),
    meetingTime: formatTime(row.meeting_time as string),
    meetingLocation: row.meeting_location as string,
    meetingFormat: row.meeting_format as string,
    timezone: row.timezone as string,
    contactEmail: (row.contact_email as string) || `hello@${row.domain as string}`,
    logoUrl: row.logo_url as string | null,
    memberCount: row.member_count as number || 0,
    maxMembers: row.max_members as number || 40,
    // Not public (and not shown anywhere on the site): kept in the type, never read.
    visitorRegistrarName: null,
    visitorRegistrarEmail: null,
  };
}

// The member columns this public site may read. NEVER select("*") on members: the public key can read only these
// columns (2026-09-26), and a star select fails outright. A member's email and phone come ONLY from the
// public_members view, which returns each one only when that member chose to show it. Before this, the site read
// the raw row, so anyone with the public key could read the phone numbers of members who had hidden them.
const PUBLIC_MEMBER_COLUMNS = [
  "id", "slug", "first_name", "last_name", "full_name", "headshot_url", "business_name", "business_logo_url",
  "profession_category", "tagline", "bio", "ideal_referral", "linkedin_url", "website", "instagram_handle",
  "status", "join_date", "card_jpg_url", "card_generated_at", "public_profile", "public_phone", "public_email",
  "testimonials_enabled", "card_shareable", "card_redirect_url",
].join(", ");

type PublicMemberRow = Omit<Member, "email" | "phone" | "role" | "testimonial">;

// Attach each member's public contact details (null unless the member chose to show them).
async function withPublicContact(sb: SupabaseClient, rows: PublicMemberRow[]): Promise<Member[]> {
  if (rows.length === 0) return [];
  const { data, error } = await sb
    .from("public_members")
    .select("id, email, phone")
    .in("id", rows.map((r) => r.id));
  if (error) throw error;
  const contact = new Map((data || []).map((c) => [c.id as string, c]));
  return rows.map((r) => ({
    ...r,
    email: (contact.get(r.id)?.email as string | null) ?? null,
    phone: (contact.get(r.id)?.phone as string | null) ?? null,
    role: "member",
    testimonial: null,
  }));
}

export async function fetchMembers(sb: SupabaseClient, orgId: string): Promise<Member[]> {
  const { data, error } = await sb
    .from("members")
    .select(PUBLIC_MEMBER_COLUMNS)
    .eq("organization_id", orgId)
    .eq("status", "active")
    .eq("public_profile", true)
    .order("full_name");
  if (error) throw error;
  return withPublicContact(sb, (data || []) as unknown as PublicMemberRow[]);
}

export async function fetchMember(sb: SupabaseClient, orgId: string, slug: string): Promise<Member | null> {
  const { data, error } = await sb
    .from("members")
    .select(PUBLIC_MEMBER_COLUMNS)
    .eq("organization_id", orgId)
    .eq("slug", slug)
    .eq("status", "active")
    .eq("public_profile", true)
    .single();
  if (error || !data) return null;
  const [member] = await withPublicContact(sb, [data as unknown as PublicMemberRow]);
  return member ?? null;
}

export async function fetchTestimonials(sb: SupabaseClient, orgId: string, featuredOnly = false): Promise<Testimonial[]> {
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

export async function fetchMemberTestimonials(sb: SupabaseClient, orgId: string, memberSlug: string): Promise<Testimonial[]> {
  const { data, error } = await sb
    .from("public_chapter_testimonials")
    .select("*")
    .eq("organization_id", orgId)
    .eq("about_member_slug", memberSlug)
    .order("display_order");
  if (error) throw error;
  return data as Testimonial[];
}

export async function fetchMemberRecognitions(sb: SupabaseClient, orgId: string, memberSlug: string): Promise<Recognition[]> {
  const { data, error } = await sb
    .from("public_member_recognitions")
    .select("*")
    .eq("organization_id", orgId)
    .eq("to_member_slug", memberSlug)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Recognition[];
}

export interface UpcomingSpeaker {
  assigned_date: string;
  presentation_topic: string | null;
  presentation_category: string | null;
  member: {
    slug: string;
    full_name: string;
    first_name: string;
    headshot_url: string | null;
    profession_category: string | null;
    business_name: string | null;
  } | null;
}

export interface PublicEvent {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  event_date: string;
  start_time: string;
  end_time: string | null;
  event_type: string;
  format: string;
  location_name: string | null;
  location_address: string | null;
  virtual_link: string | null;
  max_capacity: number | null;
}

export async function fetchUpcomingSpeakers(sb: SupabaseClient, orgId: string): Promise<UpcomingSpeaker[]> {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await sb
    .from("speaker_queue")
    .select(`
      assigned_date, presentation_topic, presentation_category,
      member:members(slug, full_name, first_name, headshot_url, profession_category, business_name, public_profile)
    `)
    .eq("organization_id", orgId)
    .eq("status", "scheduled")
    .gte("assigned_date", today)
    .order("assigned_date", { ascending: true })
    .limit(4);
  if (error) return [];
  return (data as Array<UpcomingSpeaker & { member: { public_profile?: boolean } | null }>)
    .filter((s) => s.member && s.member.public_profile !== false) as UpcomingSpeaker[];
}

export async function fetchPublicEvents(sb: SupabaseClient, orgId: string): Promise<PublicEvent[]> {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await sb
    .from("events")
    .select("id, name, slug, description, event_date, start_time, end_time, event_type, format, location_name, location_address, virtual_link, max_capacity, image_url, image_urls, recap_image_urls, recurrence_parent_id")
    .eq("organization_id", orgId)
    .eq("is_public", true)
    .eq("status", "published")
    .gte("event_date", today)
    .order("event_date", { ascending: true })
    .limit(20);
  if (error) return [];
  return data as PublicEvent[];
}

export async function fetchPastPublicEvents(sb: SupabaseClient, orgId: string, limit = 10): Promise<PublicEvent[]> {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await sb
    .from("events")
    .select("id, name, slug, description, event_date, start_time, end_time, event_type, format, location_name, location_address, virtual_link, max_capacity, image_url, image_urls, recap_image_urls, recurrence_parent_id")
    .eq("organization_id", orgId)
    .eq("is_public", true)
    .eq("status", "published")
    .lt("event_date", today)
    .order("event_date", { ascending: false })
    .limit(limit);
  if (error) return [];
  // Only return events that have at least one photo
  return (data || []).filter((e: any) => {
    const hasImg = e.image_url || (e.image_urls && e.image_urls.length > 0) || (e.recap_image_urls && e.recap_image_urls.length > 0);
    return hasImg;
  }) as PublicEvent[];
}

export async function fetchPastEventRecapPhotos(sb: SupabaseClient, orgId: string, parentId: string): Promise<string[]> {
  const today = new Date().toISOString().split("T")[0];
  // Include both the parent event itself and its children
  const { data, error } = await sb
    .from("events")
    .select("recap_image_urls")
    .eq("organization_id", orgId)
    .or(`recurrence_parent_id.eq.${parentId},id.eq.${parentId}`)
    .lt("event_date", today)
    .order("event_date", { ascending: false })
    .limit(3);
  if (error) return [];
  const photos: string[] = [];
  for (const e of data || []) {
    const urls = (e as any).recap_image_urls as string[] | null;
    if (urls) photos.push(...urls);
  }
  return photos.slice(0, 6);
}

export async function fetchChapterStats(sb: SupabaseClient, orgId: string): Promise<ChapterStats> {
  const { count, error } = await sb
    .from("members")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", orgId)
    .eq("status", "active");
  if (error) throw error;

  return {
    memberCount: count || 0,
    tyfcb12Month: "$1.99M+",
    referralsGiven: "46+",
    visitorsPerYear: "100+",
  };
}
