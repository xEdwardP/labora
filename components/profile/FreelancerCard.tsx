'use client'

import { useRouter } from 'next/navigation'
import { MapPin, DollarSign } from 'lucide-react'

interface FreelancerCardProps {
  freelancer: {
    id: string
    name: string | null
    email: string
    image: string | null
    profile: {
      bio:        string | null
      skills:     string[]
      hourlyRate: number | null
      country:    string | null
      avatarUrl:  string | null
    } | null
  }
}

export default function FreelancerCard({ freelancer }: FreelancerCardProps) {
  const router = useRouter()
  const profile = freelancer.profile
  const avatar  = profile?.avatarUrl ?? freelancer.image
  const initial = (freelancer.name ?? freelancer.email)[0].toUpperCase()

  return (
    <div
      onClick={() => router.push(`/freelancers/${freelancer.id}`)}
      style={{
        background: 'white',
        borderRadius: 14,
        padding: '22px 20px',
        border: '1px solid #efefef',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 18px rgba(107,47,219,0.10)'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
      }}
    >
      {/* Avatar + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {avatar ? (
          <img
            src={avatar}
            alt={freelancer.name ?? ''}
            style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
        ) : (
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: '#ede7f6', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, color: '#6B2FDB', fontSize: 20,
            flexShrink: 0,
          }}>
            {initial}
          </div>
        )}
        <div>
          <p style={{ fontWeight: 700, color: '#1a1a2e', fontSize: 15, marginBottom: 2 }}>
            {freelancer.name ?? 'Freelancer'}
          </p>
          {profile?.country && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#aaa' }}>
              <MapPin size={12} />
              <span style={{ fontSize: 12 }}>{profile.country}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      {profile?.bio && (
        <p style={{
          fontSize: 13,
          color: '#666',
          lineHeight: 1.55,
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {profile.bio}
        </p>
      )}

      {/* Skills */}
      {profile?.skills && profile.skills.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {profile.skills.slice(0, 4).map((skill) => (
            <span key={skill} style={{
              padding: '3px 10px',
              background: '#f3eeff',
              color: '#6B2FDB',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 500,
            }}>
              {skill}
            </span>
          ))}
          {profile.skills.length > 4 && (
            <span style={{ fontSize: 12, color: '#aaa', padding: '3px 4px' }}>
              +{profile.skills.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Hourly rate */}
      {profile?.hourlyRate && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 'auto' }}>
          <DollarSign size={14} color="#6B2FDB" />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>
            {profile.hourlyRate}/hr
          </span>
        </div>
      )}

    </div>
  )
}