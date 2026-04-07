import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Mail, Phone, Linkedin, Globe, Instagram, Quote, Heart, Send, Copy, Download, Share2, Check } from "lucide-react";
import { useMember } from "@/hooks/useMembers";
import { useMemberTestimonials } from "@/hooks/useTestimonials";
import { useMemberRecognitions } from "@/hooks/useRecognitions";
import { useState } from "react";

export default function MemberProfile() {
  const { slug } = useParams();
  const { data: member, isLoading } = useMember(slug);
  const { data: testimonials } = useMemberTestimonials(slug);
  const { data: recognitions } = useMemberRecognitions(slug);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const cardLink = slug ? `https://aimhighbni.com/card/${slug}` : "";

  const allQuotes = [
    ...(testimonials || []).map((t) => ({ text: t.quote, source: "testimonial" as const })),
    ...(recognitions || []).map((r) => ({ text: r.message, source: "recognition" as const, from: r.from_member_name })),
  ];

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
          <Link to="/members" className="text-ah-red hover:underline">View all members</Link>
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
              <h1 className="text-3xl md:text-4xl font-bold text-ah-dark mb-2">{member.full_name}</h1>
              {member.profession_category && (
                <span className="inline-block bg-ah-red text-white text-sm px-4 py-1 rounded-full font-medium mb-3">
                  {member.profession_category}
                </span>
              )}
              {member.business_name && <p className="text-ah-dark font-medium">{member.business_name}</p>}
              {member.tagline && <p className="text-ah-gray-text mt-2">{member.tagline}</p>}
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

            {/* Contact */}
            <div>
              <h2 className="font-semibold text-ah-dark mb-3">Connect</h2>
              <div className="flex flex-wrap gap-3">
                {member.public_email && member.email && (
                  <a href={`mailto:${member.email}`} className="inline-flex items-center gap-2 text-sm bg-ah-gray px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    <Mail className="w-4 h-4 text-ah-red" /> {member.email}
                  </a>
                )}
                {member.public_phone && member.phone && (
                  <a href={`tel:${member.phone}`} className="inline-flex items-center gap-2 text-sm bg-ah-gray px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    <Phone className="w-4 h-4 text-ah-red" /> {member.phone}
                  </a>
                )}
                {member.linkedin_url && (
                  <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm bg-ah-gray px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    <Linkedin className="w-4 h-4 text-ah-red" /> LinkedIn
                  </a>
                )}
                {member.website && (
                  <a href={member.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm bg-ah-gray px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    <Globe className="w-4 h-4 text-ah-red" /> Website
                  </a>
                )}
                {member.instagram_handle && (
                  <a href={`https://instagram.com/${member.instagram_handle}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm bg-ah-gray px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    <Instagram className="w-4 h-4 text-ah-red" /> @{member.instagram_handle}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Virtual Business Card */}
        {member.card_jpg_url && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-ah-dark mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-ah-red" />
              {member.first_name}'s Card
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <img
                src={member.card_jpg_url}
                alt={`${member.full_name} business card`}
                className="w-full max-w-lg rounded-lg shadow-md mx-auto"
              />
              <div className="flex flex-wrap gap-3 justify-center mt-6">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(cardLink).then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    });
                  }}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    copied
                      ? "bg-green-500 text-white"
                      : "bg-ah-red text-white hover:bg-ah-red-dark"
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Share Link"}
                </button>
                <a
                  href={member.card_jpg_url}
                  download={`${member.slug}-card.jpg`}
                  className="inline-flex items-center gap-2 bg-ah-gray text-ah-dark px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  <Download className="w-4 h-4" /> Download JPG
                </a>
              </div>
              <p className="text-xs text-ah-gray-text text-center mt-3">
                Share this link anywhere — we'll track every click so {member.first_name} gets credit.
              </p>
            </div>
          </div>
        )}

        {/* Testimonials & Recognitions */}
        {allQuotes.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-ah-dark mb-6">
              What people say about {member.first_name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allQuotes.map((q, i) => (
                <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <Quote className="w-6 h-6 text-ah-red/20 mb-2" />
                  <p className="text-ah-dark text-sm leading-relaxed">"{q.text}"</p>
                  {q.source === "recognition" && q.from && (
                    <p className="text-xs text-ah-gray-text mt-2">&mdash; {q.from}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* You Got Caught / Write a testimonial */}
        <div className="mt-8 bg-ah-gray rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-ah-dark flex items-center gap-2">
              <Heart className="w-5 h-5 text-ah-red" />
              Say something nice about {member.first_name}
            </h2>
            {!showForm && !submitted && (
              <button
                onClick={() => setShowForm(true)}
                className="text-ah-red text-sm font-medium hover:underline"
              >
                Write a note
              </button>
            )}
          </div>

          {!showForm && !submitted && (
            <p className="text-sm text-ah-gray-text">
              Had a great experience with {member.first_name}? Received a referral? Let them know!
            </p>
          )}

          {showForm && !submitted && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
                setShowForm(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-ah-dark mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ah-red/50 focus:border-ah-red"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ah-dark mb-1">Your Message</label>
                <textarea
                  required
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ah-red/50 focus:border-ah-red resize-none"
                  placeholder={`What would you like to say about ${member.first_name}?`}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-ah-red text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-ah-red-dark transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-ah-gray-text text-sm hover:text-ah-dark transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {submitted && (
            <div className="text-center py-4">
              <p className="text-ah-dark font-medium">Thank you for your kind words!</p>
              <p className="text-sm text-ah-gray-text mt-1">
                Your message will appear after review.
              </p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 py-10 bg-white rounded-xl shadow-sm border border-gray-100">
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
