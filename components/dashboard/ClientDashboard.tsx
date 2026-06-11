import Link from 'next/link'
import { Briefcase, FileText, Plus, ArrowRight } from 'lucide-react'

interface ClientDashboardProps {
  name: string | null
  stats: {
    totalProjects:    number
    activeProjects:   number
    totalProposals:   number
    pendingProposals: number
  }
}

export default function ClientDashboard({ name, stats }: ClientDashboardProps) {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* Greeting */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1a1a2e', marginBottom: 6 }}>
          Bienvenido de nuevo{name ? `, ${name.split(' ')[0]}` : ''}! 👋
        </h1>
        <p style={{ color: '#888', fontSize: 15 }}>
          Aquí tienes un resumen de tus proyectos y propuestas recibidas
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 14,
        marginBottom: 36,
      }}>
        {[
          {
            label:   'Total Projects',
            value:   stats.totalProjects,
            color:   '#6B2FDB',
            bg:      '#f3eeff',
            icon:    <Briefcase size={20} color="#6B2FDB" />,
          },
          {
            label:   'Active Projects',
            value:   stats.activeProjects,
            color:   '#3b82f6',
            bg:      '#e3f2fd',
            icon:    <Briefcase size={20} color="#3b82f6" />,
          },
          {
            label:   'Proposals Received',
            value:   stats.totalProposals,
            color:   '#f59e0b',
            bg:      '#fff8e1',
            icon:    <FileText size={20} color="#f59e0b" />,
          },
          {
            label:   'Pending Review',
            value:   stats.pendingProposals,
            color:   '#22c55e',
            bg:      '#e8f5e9',
            icon:    <FileText size={20} color="#22c55e" />,
          },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: stat.bg,
            borderRadius: 12,
            padding: '20px 18px',
          }}>
            <div style={{ marginBottom: 12 }}>{stat.icon}</div>
            <p style={{ fontSize: 28, fontWeight: 800, color: stat.color, margin: 0 }}>
              {stat.value}
            </p>
            <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 14,
      }}>
        <Link
          href="/projects/new"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            background: '#6B2FDB',
            borderRadius: 12,
            textDecoration: 'none',
            color: 'white',
          }}
        >
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Publicar un nuevo proyecto</p>
            <p style={{ fontSize: 13, opacity: 0.8 }}>Encuentra el freelancer adecuado para tus necesidades</p>
          </div>
          <Plus size={24} style={{ flexShrink: 0 }} />
        </Link>

        <Link
          href="/my-projects"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            background: 'white',
            borderRadius: 12,
            textDecoration: 'none',
            color: '#1a1a2e',
            border: '1px solid #efefef',
          }}
        >
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Revisar propuestas</p>
            <p style={{ fontSize: 13, color: '#888' }}>
              {stats.pendingProposals > 0
                ? `${stats.pendingProposals} proposal${stats.pendingProposals !== 1 ? 's' : ''} waiting`
                : 'No pending proposals'}
            </p>
          </div>
          <ArrowRight size={20} color="#6B2FDB" style={{ flexShrink: 0 }} />
        </Link>
      </div>

    </div>
  )
}