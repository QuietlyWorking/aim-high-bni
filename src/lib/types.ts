export interface OrgConfig {
  id: string;
  name: string;
  slug: string;
  domain: string;
  chapterType: string;
  region: string;
  meetingDay: string;
  meetingTime: string;
  meetingLocation: string;
  meetingFormat: string;
  timezone: string;
  contactEmail: string;
  logoUrl: string | null;
  memberCount: number;
  maxMembers: number;
  visitorRegistrarName: string | null;
  visitorRegistrarEmail: string | null;
}

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
  about_member_id: string | null;
  about_member_slug: string | null;
  about_member_name: string | null;
}

export interface Recognition {
  id: string;
  message: string;
  category: string;
  created_at: string;
  from_member_name: string;
  from_member_headshot: string | null;
  from_member_business: string | null;
}

export interface ChapterStats {
  memberCount: number;
  tyfcb12Month: string;
  referralsGiven: string;
  visitorsPerYear: string;
}
