'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProposal } from '@/actions/proposals'
import { toast } from 'sonner'

interface ProposalFormProps {
  projectId: string
  projectTitle: string
}

export default function ProposalForm({ projectId, projectTitle }: ProposalFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    amount: '',
    estimatedDays: '',
    message: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.amount || !form.estimatedDays || !form.message.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      await createProposal({
        projectId,
        amount: parseFloat(form.amount),
        estimatedDays: parseInt(form.estimatedDays),
        message: form.message.trim(),
      })
      toast.success('Proposal sent successfully!')
      router.push(`/projects/${projectId}`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>
        Submit a Proposal
      </h1>
      <p style={{ color: '#666', marginBottom: 28, fontSize: 14 }}>
        For: <span style={{ fontWeight: 600, color: '#6B2FDB' }}>{projectTitle}</span>
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Amount */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>
            Bid Amount (USD)
          </label>
          <input
            name="amount"
            type="number"
            min="1"
            step="0.01"
            placeholder="e.g. 500"
            value={form.amount}
            onChange={handleChange}
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              border: '1.5px solid #e0e0e0',
              fontSize: 14,
              outline: 'none',
              color: '#1a1a2e',
            }}
          />
        </div>

        {/* Estimated Days */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>
            Estimated Delivery (days)
          </label>
          <input
            name="estimatedDays"
            type="number"
            min="1"
            placeholder="e.g. 7"
            value={form.estimatedDays}
            onChange={handleChange}
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              border: '1.5px solid #e0e0e0',
              fontSize: 14,
              outline: 'none',
              color: '#1a1a2e',
            }}
          />
        </div>

        {/* Cover Message */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>
            Cover Letter
          </label>
          <textarea
            name="message"
            rows={6}
            placeholder="Describe your experience, approach, and why you're the best fit..."
            value={form.message}
            onChange={handleChange}
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              border: '1.5px solid #e0e0e0',
              fontSize: 14,
              outline: 'none',
              color: '#1a1a2e',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
          <button
            type="button"
            onClick={() => router.back()}
            style={{
              flex: 1,
              padding: '11px 0',
              borderRadius: 8,
              border: '1.5px solid #e0e0e0',
              background: 'white',
              color: '#666',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 2,
              padding: '11px 0',
              borderRadius: 8,
              border: 'none',
              background: loading ? '#b39ddb' : '#6B2FDB',
              color: 'white',
              fontWeight: 600,
              fontSize: 14,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Sending...' : 'Send Proposal'}
          </button>
        </div>

      </form>
    </div>
  )
}