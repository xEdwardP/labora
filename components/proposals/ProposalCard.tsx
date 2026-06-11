'use client'

import { useState } from 'react'
import { updateProposalStatus } from '@/actions/proposals'
import { toast } from 'sonner'
import { Clock, DollarSign, CheckCircle, XCircle } from 'lucide-react'

type ProposalStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'

interface ProposalCardProps {
  proposal: {
    id: string
    amount: number
    estimatedDays: number
    message: string
    status: ProposalStatus
    createdAt: Date
    freelancer: {
      id: string
      name: string | null
      email: string
      image: string | null
    }
  }
}

const statusStyles: Record<ProposalStatus, { bg: string; color: string; label: string }> = {
  PENDING:  { bg: '#fff8e1', color: '#f59e0b', label: 'Pending'  },
  ACCEPTED: { bg: '#e8f5e9', color: '#22c55e', label: 'Accepted' },
  REJECTED: { bg: '#fce4ec', color: '#ef4444', label: 'Rejected' },
}

export default function ProposalCard({ proposal }: ProposalCardProps) {
  const [loading, setLoading] = useState<'accept' | 'reject' | null>(null)
  const [currentStatus, setCurrentStatus] = useState<ProposalStatus>(proposal.status)

  const handleAction = async (action: 'ACCEPTED' | 'REJECTED') => {
    const key = action === 'ACCEPTED' ? 'accept' : 'reject'
    setLoading(key)
    try {
      await updateProposalStatus(proposal.id, action)
      setCurrentStatus(action)
      toast.success(action === 'ACCEPTED' ? 'Proposal accepted!' : 'Proposal rejected')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(null)
    }
  }

  const style = statusStyles[currentStatus]

  return (
    <div style={{
      background: 'white',
      borderRadius: 12,
      padding: '20px 24px',
      border: '1px solid #efefef',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
    }}>

      {/* Header: freelancer info + status badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {proposal.freelancer.image ? (
            <img
              src={proposal.freelancer.image}
              alt={proposal.freelancer.name ?? ''}
              style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: '#ede7f6', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, color: '#6B2FDB', fontSize: 16,
            }}>
              {(proposal.freelancer.name ?? proposal.freelancer.email)[0].toUpperCase()}
            </div>
          )}
          <div>
            <p style={{ fontWeight: 600, color: '#1a1a2e', fontSize: 14 }}>
              {proposal.freelancer.name ?? 'Freelancer'}
            </p>
            <p style={{ fontSize: 12, color: '#999' }}>{proposal.freelancer.email}</p>
          </div>
        </div>

        <span style={{
          padding: '4px 12px',
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 600,
          background: style.bg,
          color: style.color,
        }}>
          {style.label}
        </span>
      </div>

      {/* Bid details */}
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <DollarSign size={15} color="#6B2FDB" />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>
            ${proposal.amount.toLocaleString()}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Clock size={15} color="#6B2FDB" />
          <span style={{ fontSize: 14, color: '#555' }}>
            {proposal.estimatedDays} day{proposal.estimatedDays !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Cover message */}
      <p style={{
        fontSize: 13,
        color: '#555',
        lineHeight: 1.6,
        borderLeft: '3px solid #ede7f6',
        paddingLeft: 12,
        margin: 0,
      }}>
        {proposal.message}
      </p>

      {/* Actions — only if still PENDING */}
      {currentStatus === 'PENDING' && (
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button
            onClick={() => handleAction('ACCEPTED')}
            disabled={!!loading}
            style={{
              flex: 1,
              padding: '9px 0',
              borderRadius: 8,
              border: 'none',
              background: loading === 'accept' ? '#86efac' : '#22c55e',
              color: 'white',
              fontWeight: 600,
              fontSize: 13,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <CheckCircle size={15} />
            {loading === 'accept' ? 'Accepting...' : 'Accept'}
          </button>
          <button
            onClick={() => handleAction('REJECTED')}
            disabled={!!loading}
            style={{
              flex: 1,
              padding: '9px 0',
              borderRadius: 8,
              border: 'none',
              background: loading === 'reject' ? '#fca5a5' : '#ef4444',
              color: 'white',
              fontWeight: 600,
              fontSize: 13,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <XCircle size={15} />
            {loading === 'reject' ? 'Rejecting...' : 'Reject'}
          </button>
        </div>
      )}

    </div>
  )
}