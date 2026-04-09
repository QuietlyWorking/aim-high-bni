import type { OrgConfig, Member } from "./types";

export function organizationSchema(chapter: OrgConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: `${chapter.name}`,
    url: `https://${chapter.domain}`,
    description: `Southern California's premier online business networking chapter`,
    areaServed: chapter.region,
    email: chapter.contactEmail,
    ...(chapter.logoUrl ? { logo: chapter.logoUrl } : {}),
  };
}

export function personSchema(member: Member, domain: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.full_name,
    url: `https://${domain}/members/${member.slug}`,
    jobTitle: member.profession_category || undefined,
    ...(member.business_name ? { worksFor: { "@type": "Organization", name: member.business_name } } : {}),
    ...(member.headshot_url ? { image: member.headshot_url } : {}),
    ...(member.bio ? { description: member.bio } : {}),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
