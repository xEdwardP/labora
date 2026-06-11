'use client'

import Link from 'next/link'
import { DollarSign, Calendar } from 'lucide-react'
import { categoryLabels, budgetTypeLabels, statusColors, statusLabels } from '@/lib/project-utils'
import { Category, BudgetType, ProjectStatus } from '@/app/generated/prisma/client'

type Props = {
  project: {
    id: string
    title: string
    description: string
    category: Category
    budget: number
    budgetType: BudgetType
    status: ProjectStatus
    createdAt: Date
    client: { name: string | null }
  }
}

export default function ProjectCard({ project }: Props) {
  return (
    <Link href={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#fff', borderRadius: '12px', border: '1.5px solid #eee',
        padding: '24px', cursor: 'pointer', transition: 'border-color 0.2s',
      }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = '#6B2FDB')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = '#eee')}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <span style={{
            fontSize: '12px', fontWeight: 600, background: '#f0eafb',
            color: '#6B2FDB', borderRadius: '20px', padding: '4px 12px',
          }}>
            {categoryLabels[project.category]}
          </span>
          <span style={{
            fontSize: '12px', fontWeight: 600, borderRadius: '20px', padding: '4px 12px',
            background: statusColors[project.status].bg,
            color: statusColors[project.status].text,
          }}>
            {statusLabels[project.status]}
          </span>
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', marginBottom: '8px' }}>
          {project.title}
        </h3>
        <p style={{
          fontSize: '14px', color: '#666', lineHeight: 1.6, marginBottom: '16px',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {project.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '15px', fontWeight: 700, color: '#1a1a2e' }}>
              <DollarSign size={15} color="#6B2FDB" />
              {project.budget.toLocaleString()} {budgetTypeLabels[project.budgetType]}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#aaa' }}>
            <Calendar size={12} />
            {new Date(project.createdAt).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
          </div>
        </div>
      </div>
    </Link>
  )
}