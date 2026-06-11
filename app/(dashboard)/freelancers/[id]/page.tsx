import { auth } from "@/auth";
import { getProfileByUserId } from "@/actions/profile";
import { redirect, notFound } from "next/navigation";
import { MapPin, DollarSign, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const profile = await getProfileByUserId(id);
  return {
    title: profile?.user?.name
      ? `${profile.user.name} | Labora`
      : "Freelancer Profile | Labora",
  };
}

export default async function FreelancerProfilePage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  const profile = await getProfileByUserId(id);
  if (!profile) notFound();

  const { user } = profile;
  const avatar = profile.avatarUrl ?? user.image;
  const initial = (user.name ?? user.email)[0].toUpperCase();

  // Determine CTA destination
  const ctaHref = !session
    ? "/register"
    : session.user.role === "CLIENT"
      ? "/projects/new"
      : null;

  return (
    <div style={{ padding: "40px 24px", maxWidth: 780, margin: "0 auto" }}>
      {/* Back */}
      <Link
        href="/freelancers"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: "#888",
          fontSize: 14,
          textDecoration: "none",
          marginBottom: 28,
        }}
      >
        <ArrowLeft size={15} /> Back to Freelancers
      </Link>

      {/* Profile card */}
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: "32px 28px",
          border: "1px solid #efefef",
          marginBottom: 20,
        }}
      >
        {/* Top: avatar + info + CTA */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 20,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {avatar ? (
              <img
                src={avatar}
                alt={user.name ?? ""}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "#ede7f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  color: "#6B2FDB",
                  fontSize: 28,
                }}
              >
                {initial}
              </div>
            )}
            <div>
              <h1
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#1a1a2e",
                  marginBottom: 6,
                }}
              >
                {user.name ?? "Freelancer"}
              </h1>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {profile.country && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      color: "#aaa",
                      fontSize: 13,
                    }}
                  >
                    <MapPin size={13} />
                    <span>{profile.country}</span>
                  </div>
                )}
                {profile.hourlyRate && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      color: "#6B2FDB",
                      fontSize: 13,
                    }}
                  >
                    <DollarSign size={13} />
                    <span style={{ fontWeight: 600 }}>
                      {profile.hourlyRate}/hr
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CTA — only for clients or logged-out users */}
          {ctaHref && (
            <Link
              href={ctaHref}
              style={{
                padding: "11px 24px",
                background: "#6B2FDB",
                color: "white",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              {session ? "Post a Project" : "Hire Me"}
            </Link>
          )}
        </div>

        {/* Bio */}
        {profile.bio && (
          <div style={{ marginBottom: 24 }}>
            <h2
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#1a1a2e",
                marginBottom: 10,
              }}
            >
              Bio
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "#555",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {profile.bio}
            </p>
          </div>
        )}

        {/* Skills */}
        {profile.skills.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h2
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#1a1a2e",
                marginBottom: 10,
              }}
            >
              Skills
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    padding: "5px 14px",
                    background: "#f3eeff",
                    color: "#6B2FDB",
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio */}
        {profile.portfolio.length > 0 && (
          <div>
            <h2
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#1a1a2e",
                marginBottom: 10,
              }}
            >
              Portafolio
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {profile.portfolio.map((url) => (
                <div
                  key={url}
                  onClick={() =>
                    window.open(url, "_blank", "noopener,noreferrer")
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 14px",
                    background: "#f9f6ff",
                    borderRadius: 8,
                    color: "#6B2FDB",
                    fontSize: 13,
                    cursor: "pointer",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap" as const,
                  }}
                >
                  <ExternalLink size={14} style={{ flexShrink: 0 }} />
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap" as const,
                    }}
                  >
                    {url}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
