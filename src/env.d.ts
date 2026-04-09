/// <reference path="../.astro/types.d.ts" />

interface OrgConfig {
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

declare namespace App {
  interface Locals {
    chapter: OrgConfig;
  }
}
