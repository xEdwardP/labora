import Link from 'next/link'
import { FileText, CheckCircle, Clock, ArrowRight, Search } from 'lucide-react'

interface FreelancerDashboardProps {
  name: string | null
  stats: {
    totalProposals:    number
    acceptedProposals: number
    pendingProposals:  number
    rejectedProposals: number
  }
}

export default function FreelancerDashboard({ name, stats }: FreelancerDashboardProps) {
  const successRate = stats.totalProposals > 0
    ? Math.round((stats.acceptedProposals / stats.totalProposals) * 100)
    : 0

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* Greeting */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1a1a2e', marginBottom: 6 }}>
          Bienvenido de nuevo{name ? `, ${name.split(' ')[0]}` : ''}! 👋
        </h1>
        <p style={{ color: '#888', fontSize: 15 }}>
          Aquí tienes un resumen de tu actividad de propuestas
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
            label: 'Total Sent',
            value: stats.totalProposals,
            color: '#6B2FDB',
            bg:    '#f3eeff',
            icon:  <FileText size={20} color="#6B2FDB" />,
          },
          {
            label: 'Accepted',
            value: stats.acceptedProposals,
            color: '#22c55e',
            bg:    '#e8f5e9',
            icon:  <CheckCircle size={20} color="#22c55e" />,
          },
          {
            label: 'Pending',
            value: stats.pendingProposals,
            color: '#f59e0b',
            bg:    '#fff8e1',
            icon:  <Clock size={20} color="#f59e0b" />,
          },
          {
            label: 'Success Rate',
            value: `${successRate}%`,
            color: '#3b82f6',
            bg:    '#e3f2fd',
            icon:  <CheckCircle size={20} color="#3b82f6" />,
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
          href="/projects"
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
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Explorar Proyectos</p>
            <p style={{ fontSize: 13, opacity: 0.8 }}>Encuentra nuevas oportunidades para aplicar</p>
          </div>
          <Search size={22} style={{ flexShrink: 0 }} />
        </Link>

        <Link
          href="/my-proposals"
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
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Mis Propuestas</p>
            <p style={{ fontSize: 13, color: '#888' }}>
              {stats.pendingProposals > 0
                ? `${stats.pendingProposals} proposal${stats.pendingProposals !== 1 ? 's' : ''} pending`
                : 'No pending proposals'}
            </p>
          </div>
          <ArrowRight size={20} color="#6B2FDB" style={{ flexShrink: 0 }} />
        </Link>
      </div>

    </div>
  )
}