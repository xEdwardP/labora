'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createProject } from '@/actions/projects'
import { Category, BudgetType } from '@/app/generated/prisma/client'
import { categoryLabels, budgetTypeLabels } from '@/lib/project-utils'

export default function NewProjectForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as Category,
    budget: '',
    budgetType: 'FIXED' as BudgetType,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.category) {
      toast.error('Selecciona una categoría')
      return
    }

    setLoading(true)
    const result = await createProject({
      ...formData,
      budget: parseFloat(formData.budget),
    })
    setLoading(false)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(result?.success!)
      router.push('/projects')
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    border: '1.5px solid #e8e8e8', fontSize: '14px', outline: 'none',
    fontFamily: 'inherit', background: '#fff', color: '#1a1a2e',
  }

  const labelStyle = {
    display: 'block', fontSize: '13px', fontWeight: 600,
    color: '#444', marginBottom: '6px',
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eee', padding: '32px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <div>
          <label style={labelStyle}>Título del proyecto *</label>
          <input
            type="text"
            placeholder="Ej: Desarrollo de tienda online en Next.js"
            required
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Descripción *</label>
          <textarea
            placeholder="Describe detalladamente qué necesitas, tecnologías requeridas, entregables esperados..."
            required
            rows={6}
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        <div>
          <label style={labelStyle}>Categoría *</label>
          <select
            required
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
            style={inputStyle}
          >
            <option value="">Selecciona una categoría</option>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Presupuesto (USD) *</label>
            <input
              type="number"
              placeholder="500"
              required
              min="1"
              value={formData.budget}
              onChange={e => setFormData({ ...formData, budget: e.target.value })}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Tipo de presupuesto</label>
            <select
              value={formData.budgetType}
              onChange={e => setFormData({ ...formData, budgetType: e.target.value as BudgetType })}
              style={inputStyle}
            >
              {Object.entries(budgetTypeLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '8px' }}>
          <button
            type="button"
            onClick={() => router.back()}
            style={{
              padding: '10px 24px', borderRadius: '24px', border: '1.5px solid #e8e8e8',
              background: 'transparent', fontSize: '14px', fontWeight: 600,
              color: '#555', cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 28px', borderRadius: '24px', border: 'none',
              background: loading ? '#a78bdb' : '#6B2FDB', color: '#fff',
              fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Publicando...' : 'Publicar proyecto'}
          </button>
        </div>
      </div>
    </form>
  )
}