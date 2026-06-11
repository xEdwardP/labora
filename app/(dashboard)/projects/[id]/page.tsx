import { getProjectById } from '@/actions/projects'
import { auth } from '@/auth'
import { notFound } from 'next/navigation'
import { Calendar, DollarSign, Tag, User } from 'lucide-react'
import Link from 'next/link'
import { budgetTypeLabels, categoryLabels, statusColors, statusLabels } from '@/lib/project-utils'

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [project, session] = await Promise.all([getProjectById(id), auth()])

  if (!project) notFound()

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>

        {/* Main */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eee', padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <span style={{
                display: 'inline-block', fontSize: '12px', fontWeight: 600,
                background: '#f0eafb', color: '#6B2FDB',
                borderRadius: '20px', padding: '4px 12px', marginBottom: '12px',
              }}>
                {categoryLabels[project.category]}
              </span>
              <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a2e', marginBottom: '8px' }}>
                {project.title}
              </h1>
            </div>
            <span style={{
              fontSize: '12px', fontWeight: 600, borderRadius: '20px', padding: '4px 12px',
              background: statusColors[project.status].bg,
              color: statusColors[project.status].text,
            }}>
              {statusLabels[project.status]}
            </span>
          </div>

          <p style={{ fontSize: '15px', color: '#444', lineHeight: 1.8, marginBottom: '32px', whiteSpace: 'pre-wrap' }}>
            {project.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', borderTop: '1px solid #eee', paddingTop: '24px' }}>
            {[
              { icon: DollarSign, label: 'Presupuesto', value: `$${project.budget.toLocaleString()} ${budgetTypeLabels[project.budgetType]}` },
              { icon: Tag, label: 'Categoría', value: categoryLabels[project.category] },
              { icon: Calendar, label: 'Publicado', value: new Date(project.createdAt).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' }) },
              { icon: User, label: 'Cliente', value: project.client.name ?? 'Anónimo' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color="#6B2FDB" />
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#aaa', marginBottom: '2px' }}>{label}</p>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e' }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eee', padding: '24px' }}>
            <p style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a2e', marginBottom: '4px' }}>
              ${project.budget.toLocaleString()}
            </p>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>
              {budgetTypeLabels[project.budgetType]}
            </p>

            {session?.user.role === 'FREELANCER' && project.status === 'OPEN' && (
              <Link href={`/projects/${project.id}/proposal`} style={{
                display: 'block', textAlign: 'center',
                background: '#6B2FDB', color: '#fff', borderRadius: '24px',
                padding: '12px', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
              }}>
                Enviar propuesta
              </Link>
            )}

            {session?.user.role === 'CLIENT' && session.user.id === project.clientId && (
              <span style={{
                display: 'block', textAlign: 'center',
                background: '#f0eafb', color: '#6B2FDB', borderRadius: '24px',
                padding: '12px', fontSize: '14px', fontWeight: 600,
              }}>
                Tu proyecto
              </span>
            )}

            {!session && (
              <Link href="/login" style={{
                display: 'block', textAlign: 'center',
                background: '#6B2FDB', color: '#fff', borderRadius: '24px',
                padding: '12px', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
              }}>
                Inicia sesión para aplicar
              </Link>
            )}
          </div>

          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eee', padding: '24px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e', marginBottom: '16px' }}>Sobre el cliente</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'linear-gradient(135deg,#6B2FDB,#8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: '14px',
              }}>
                {project.client.name?.charAt(0).toUpperCase() ?? 'C'}
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e' }}>{project.client.name}</p>
                <p style={{ fontSize: '12px', color: '#888' }}>
                  Miembro desde {new Date(project.client.createdAt).toLocaleDateString('es', { year: 'numeric', month: 'long' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}