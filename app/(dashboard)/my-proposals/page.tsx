import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getMyProposals } from '@/actions/proposals'
import MyProposalCard from '@/components/proposals/MyProposalCard'
import { FileText } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Proposals | Labora',
  description: 'Track all your submitted proposals',
}

export default async function MyProposalsPage() {
  const session = await auth()

  if (!session?.user) redirect('/login')
  if (session.user.role !== 'FREELANCER') redirect('/home')

  const proposals = await getMyProposals()

  const counts = {
    total:    proposals.length,
    pending:  proposals.filter((p) => p.status === 'PENDING').length,
    accepted: proposals.filter((p) => p.status === 'ACCEPTED').length,
    rejected: proposals.filter((p) => p.status === 'REJECTED').length,
  }

  return (
    <div style={{ padding: '40px 24px', maxWidth: 780, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e', marginBottom: 6 }}>
          My Proposals
        </h1>
        <p style={{ color: '#888', fontSize: 14 }}>
          Track the status of all your submitted proposals
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
        marginBottom: 32,
      }}>
        {[
          { label: 'Total',    value: counts.total,    color: '#6B2FDB', bg: '#f3eeff' },
          { label: 'Pending',  value: counts.pending,  color: '#f59e0b', bg: '#fff8e1' },
          { label: 'Accepted', value: counts.accepted, color: '#22c55e', bg: '#e8f5e9' },
          { label: 'Rejected', value: counts.rejected, color: '#ef4444', bg: '#fce4ec' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: stat.bg,
            borderRadius: 10,
            padding: '14px 18px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 24, fontWeight: 800, color: stat.color, margin: 0 }}>
              {stat.value}
            </p>
            <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* List */}
      {proposals.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 0',
          color: '#bbb',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}>
          <FileText size={40} color="#d0c4f0" />
          <p style={{ fontSize: 15, fontWeight: 600, color: '#999' }}>No proposals yet</p>
          <p style={{ fontSize: 13 }}>Browse projects and send your first proposal</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {proposals.map((proposal) => (
            <MyProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      )}

    </div>
  )
}