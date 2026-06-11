'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { categoryLabels } from '@/lib/project-utils'
import { Category } from '@/app/generated/prisma/client'

const budgetRanges = [
  { label: 'Cualquier presupuesto', min: undefined, max: undefined },
  { label: 'Menos de $500',         min: 0,         max: 500 },
  { label: '$500 - $2,000',         min: 500,       max: 2000 },
  { label: '$2,000 - $5,000',       min: 2000,      max: 5000 },
  { label: 'Más de $5,000',         min: 5000,      max: undefined },
]

export default function ProjectFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get('category')

  const handleCategory = (cat: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (cat) params.set('category', cat)
    else params.delete('category')
    router.push(`/projects?${params.toString()}`)
  }

  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eee', padding: '20px', position: 'sticky', top: '80px' }}>
      <p style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e', marginBottom: '16px' }}>Categorías</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '24px' }}>
        <button onClick={() => handleCategory(null)} style={{
          textAlign: 'left', padding: '8px 12px', borderRadius: '8px', border: 'none',
          cursor: 'pointer', fontSize: '13px', fontWeight: 500,
          background: !selectedCategory ? '#f0eafb' : 'transparent',
          color: !selectedCategory ? '#6B2FDB' : '#555',
        }}>
          Todas las categorías
        </button>
        {Object.entries(categoryLabels).map(([key, label]) => (
          <button key={key} onClick={() => handleCategory(key)} style={{
            textAlign: 'left', padding: '8px 12px', borderRadius: '8px', border: 'none',
            cursor: 'pointer', fontSize: '13px', fontWeight: 500,
            background: selectedCategory === key ? '#f0eafb' : 'transparent',
            color: selectedCategory === key ? '#6B2FDB' : '#555',
          }}>
            {label}
          </button>
        ))}
      </div>

      <p style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e', marginBottom: '16px' }}>Presupuesto</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {budgetRanges.map(({ label }) => (
          <button key={label} style={{
            textAlign: 'left', padding: '8px 12px', borderRadius: '8px', border: 'none',
            cursor: 'pointer', fontSize: '13px', fontWeight: 500,
            background: 'transparent', color: '#555',
          }}>
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}