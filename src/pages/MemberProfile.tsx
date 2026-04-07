import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Mail, Phone, Linkedin, Globe, Instagram } from "lucide-react";
import { useMember } from "@/hooks/useMembers";

export default function MemberProfile() {
  const { slug } = useParams();
  const { data: member, isLoading } = useMember(slug);

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32 mb-8" />
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-48 h-48 bg-gray-200 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-100 rounded w-1/3" />
                <div className="h-20 bg-gray-100 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-ah-dark mb-4">Member not found</h1>
          <Link to="/members" className="text-ah-red hover:underline">
            View all members
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/members" className="text-ah-red text-sm hover:underline mb-8 inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Members
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-ah-red/5 p-8 flex flex-col md:flex-row gap-8">
            <div className="w-48 h-48 rounded-lg overflow-hidden flex-shrink-0 mx-auto md:mx-0 shadow-md">
              {member.headshot_url ? (
                <img src={member.headshot_url} alt={member.full_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-5xl font-bold text-gray-400">
                  {member.first_name?.charAt(0)}
                </div>
              )}
            </div>
            <div className="text-center md:text-left">
              <p className="text-sm text-ah-red uppercase tracking-wider font-medium mb-1">Meet</p>
              <h1 className="text-3xl md:text-4xl font-bold text-ah-dark mb-2">
                {member.full_name}
              </h1>
              {member.profession_category && (
                <span className="inline-block bg-ah-red text-white text-sm px-4 py-1 rounded-full font-medium mb-3">
                  {member.profession_category}
                </span>
              )}
              {member.business_name && (
                <p className="text-ah-dark font-medium">{member.business_name}</p>
              )}
              {member.tagline && (
                <p className="text-ah-gray-text mt-2">{member.tagline}</p>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="p-8 space-y-8">
            {member.bio && (
              <div>
                <h2 className="font-semibold text-ah-dark mb-2">About</h2>
                <p className="text-ah-gray-text leading-relaxed">{member.bio}</p>
              </div>
            )}

            {member.ideal_referral && (
              <div>
                <h2 className="font-semibold text-ah-dark mb-2">Ideal Referral</h2>
                <p className="text-ah-gray-text leading-relaxed">{member.ideal_referral}</p>
              </div>
            )}

            {member.testimonial && (
              <div className="bg-ah-gray rounded-lg p-6">
                <p className="text-ah-dark italic">"{member.testimonial}"</p>
              </div>
            )}

            {/* Contact */}
            <div>
              <h2 className="font-semibold text-ah-dark mb-3">Connect</h2>
              <div className="flex flex-wrap gap-3">
                {member.public_email && member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 text-sm bg-ah-gray px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-ah-red" /> {member.email}
                  </a>
                )}
                {member.public_phone && member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="inline-flex items-center gap-2 text-sm bg-ah-gray px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-ah-red" /> {member.phone}
                  </a>
                )}
                {member.linkedin_url && (
                  <a
                    href={member.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm bg-ah-gray px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-ah-red" /> LinkedIn
                  </a>
                )}
                {member.website && (
                  <a
                    href={member.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm bg-ah-gray px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Globe className="w-4 h-4 text-ah-red" /> Website
                  </a>
                )}
                {member.instagram_handle && (
                  <a
                    href={`https://instagram.com/${member.instagram_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm bg-ah-gray px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Instagram className="w-4 h-4 text-ah-red" /> @{member.instagram_handle}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12 py-10 bg-ah-gray rounded-xl">
          <h2 className="text-xl font-bold text-ah-dark mb-3">
            Want to meet {member.first_name} and the rest of the chapter?
          </h2>
          <Link
            to={`/visit?ref=${member.slug}`}
            className="inline-flex items-center gap-2 bg-ah-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-ah-red-dark transition-colors"
          >
            Register to Visit <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
