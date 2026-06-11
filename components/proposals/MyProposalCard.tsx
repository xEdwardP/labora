'use client'

import { useRouter } from 'next/navigation'
import { Clock, DollarSign, ArrowRight } from 'lucide-react'

type ProposalStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'
type ProjectStatus  = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

interface MyProposalCardProps {
  proposal: {
    id: string
    amount: number
    estimatedDays: number
    status: ProposalStatus
    createdAt: Date
    project: {
      id: string
      title: string
      category: string
      status: ProjectStatus
    }
  }
}

const statusStyles: Record<ProposalStatus, { bg: string; color: string; label: string }> = {
  PENDING:  { bg: '#fff8e1', color: '#f59e0b', label: 'Pending'  },
  ACCEPTED: { bg: '#e8f5e9', color: '#22c55e', label: 'Accepted' },
  REJECTED: { bg: '#fce4ec', color: '#ef4444', label: 'Rejected' },
}

const categoryLabels: Record<string, string> = {
  IT_PROGRAMMING:       'IT & Programming',
  DESIGN_MULTIMEDIA:    'Design & Multimedia',
  WRITING_TRANSLATION:  'Writing & Translation',
  SALES_MARKETING:      'Sales & Marketing',
  FINANCE_MANAGEMENT:   'Finance & Management',
  LEGAL:                'Legal',
  ADMIN_SUPPORT:        'Admin Support',
  ENGINEERING:          'Engineering',
}

export default function MyProposalCard({ proposal }: MyProposalCardProps) {
  const router = useRouter()
  const style = statusStyles[proposal.status]

  return (
    <div
      onClick={() => router.push(`/projects/${proposal.project.id}`)}
      style={{
        background: 'white',
        borderRadius: 12,
        padding: '18px 22px',
        border: '1px solid #efefef',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(107,47,219,0.10)'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
      }}
    >
      {/* Project title + status badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, paddingRight: 12 }}>
          <p style={{ fontWeight: 700, color: '#1a1a2e', fontSize: 15, marginBottom: 4 }}>
            {proposal.project.title}
          </p>
          <span style={{ fontSize: 12, color: '#888' }}>
            {categoryLabels[proposal.project.category] ?? proposal.project.category}
          </span>
        </div>
        <span style={{
          padding: '4px 12px',
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 600,
          background: style.bg,
          color: style.color,
          whiteSpace: 'nowrap',
        }}>
          {style.label}
        </span>
      </div>

      {/* Bid details */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <DollarSign size={14} color="#6B2FDB" />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>
              ${proposal.amount.toLocaleString()}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Clock size={14} color="#6B2FDB" />
            <span style={{ fontSize: 13, color: '#555' }}>
              {proposal.estimatedDays} day{proposal.estimatedDays !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6B2FDB' }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>View project</span>
          <ArrowRight size={13} />
        </div>
      </div>

      {/* Submitted date */}
      <p style={{ fontSize: 12, color: '#bbb', margin: 0 }}>
        Submitted {new Date(proposal.createdAt).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
        })}
      </p>

    </div>
  )
}