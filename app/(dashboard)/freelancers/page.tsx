import { getFreelancers } from '@/actions/profile'
import FreelancerCard from '@/components/profile/FreelancerCard'
import { Users } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Freelancers | Labora',
  description: 'Browse talented freelancers available for hire',
}

export default async function FreelancersPage() {
  const freelancers = await getFreelancers()

  return (
    <div style={{ padding: '40px 24px', maxWidth: 1100, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e', marginBottom: 6 }}>
          Buscar freelancers
        </h1>
        <p style={{ color: '#888', fontSize: 14 }}>
          {freelancers.length} freelancer{freelancers.length !== 1 ? 's' : ''} disponibles para contratar
        </p>
      </div>

      {/* Grid */}
      {freelancers.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}>
          <Users size={44} color="#d0c4f0" />
          <p style={{ fontSize: 15, fontWeight: 600, color: '#999' }}>Ningún freelancer disponible</p>
          <p style={{ fontSize: 13, color: '#bbb' }}>¡Vuelve más tarde!</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {freelancers.map((freelancer) => (
            <FreelancerCard key={freelancer.id} freelancer={freelancer} />
          ))}
        </div>
      )}

    </div>
  )
}