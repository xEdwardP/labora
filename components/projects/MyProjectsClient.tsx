'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProposalCard from '@/components/proposals/ProposalCard'
import { ChevronDown, ChevronUp, Plus, FolderOpen } from 'lucide-react'
import { statusLabels, statusColors } from '@/lib/project-utils'

type ProjectStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
type ProposalStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'

interface Project {
  id: string
  title: string
  category: string
  budget: number
  budgetType: string
  status: ProjectStatus
  createdAt: Date
}

interface Proposal {
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

interface Props {
  projects: Project[]
  proposalsMap: Record<string, Proposal[]>
}

export default function MyProjectsClient({ projects, proposalsMap }: Props) {
  const router = useRouter()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (projects.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
      }}>
        <FolderOpen size={44} color="#d0c4f0" />
        <p style={{ fontSize: 15, fontWeight: 600, color: '#999' }}>No projects yet</p>
        <p style={{ fontSize: 13, color: '#bbb' }}>Post your first project to start receiving proposals</p>
        <button
          onClick={() => router.push('/projects/new')}
          style={{
            marginTop: 8,
            padding: '10px 24px',
            background: '#6B2FDB',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Plus size={16} />
          Post a Project
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {projects.map((project) => {
        const proposals = proposalsMap[project.id] ?? []
        const isExpanded = expandedId === project.id
        const pendingCount = proposals.filter((p) => p.status === 'PENDING').length
        const statusStyle = statusColors[project.status]

        return (
          <div key={project.id} style={{
            background: 'white',
            borderRadius: 14,
            border: '1px solid #efefef',
            overflow: 'hidden',
          }}>

            {/* Project row */}
            <div
              onClick={() => setExpandedId(isExpanded ? null : project.id)}
              style={{
                padding: '20px 24px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
                    {project.title}
                  </h3>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 600,
                    background: statusStyle?.bg ?? '#f4f4f4',
                    color: statusStyle?.text ?? '#888',
                  }}>
                    {statusLabels[project.status]}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#888' }}>
                  <span>${project.budget.toLocaleString()} {project.budgetType === 'HOURLY' ? '/hr' : 'fixed'}</span>
                  <span>·</span>
                  <span>
                    {proposals.length} proposal{proposals.length !== 1 ? 's' : ''}
                    {pendingCount > 0 && (
                      <span style={{
                        marginLeft: 6,
                        background: '#fff8e1',
                        color: '#f59e0b',
                        fontWeight: 700,
                        padding: '1px 7px',
                        borderRadius: 10,
                        fontSize: 11,
                      }}>
                        {pendingCount} pending
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <div style={{ color: '#6B2FDB' }}>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>

            {/* Proposals panel */}
            {isExpanded && (
              <div style={{
                borderTop: '1px solid #f0f0f0',
                padding: '20px 24px',
                background: '#fafafa',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}>
                {proposals.length === 0 ? (
                  <p style={{ fontSize: 13, color: '#bbb', textAlign: 'center', padding: '20px 0' }}>
                    No proposals received yet
                  </p>
                ) : (
                  proposals.map((proposal) => (
                    <ProposalCard key={proposal.id} proposal={proposal} />
                  ))
                )}
              </div>
            )}

          </div>
        )
      })}
    </div>
  )
}