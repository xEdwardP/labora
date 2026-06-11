import { Star } from 'lucide-react'

const freelancers = [
  { name: 'Carlos Mendoza',  role: 'Desarrollador Full Stack', rate: '$35/hora', stars: 5,  bg: 'linear-gradient(135deg,#6B2FDB,#8b5cf6)', initials: 'CM' },
  { name: 'Ana Gutiérrez',   role: 'Diseñadora UI/UX',         rate: '$28/hora', stars: 4,  bg: 'linear-gradient(135deg,#e066cc,#f472b6)', initials: 'AG' },
  { name: 'Luis Torres',     role: 'Marketing Digital',         rate: '$22/hora', stars: 5,  bg: 'linear-gradient(135deg,#10b981,#34d399)', initials: 'LT' },
  { name: 'María Rodríguez', role: 'Redactora SEO',             rate: '$18/hora', stars: 4,  bg: 'linear-gradient(135deg,#3b82f6,#60a5fa)', initials: 'MR' },
]

export default function FeaturedFreelancers() {
  return (
    <section style={{ background: '#f4f4f4', padding: '64px 40px' }}>
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#6B2FDB', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
        Talento verificado
      </p>
      <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#1a1a2e', marginBottom: '8px' }}>
        Profesionales destacados
      </h2>
      <p style={{ fontSize: '15px', color: '#666', marginBottom: '40px' }}>
        Freelancers con experiencia comprobada listos para tu proyecto
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {freelancers.map(({ name, role, rate, stars, bg, initials }) => (
          <div key={name} style={{
            background: '#fff', borderRadius: '12px', padding: '20px',
            textAlign: 'center', border: '1px solid #eee',
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: bg, margin: '0 auto 12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: '16px',
            }}>
              {initials}
            </div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e', marginBottom: '2px' }}>{name}</p>
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>{role}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginBottom: '8px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} color="#f59e0b" fill={i < stars ? '#f59e0b' : 'none'} />
              ))}
            </div>
            <p style={{ fontSize: '12px', color: '#6B2FDB', fontWeight: 600 }}>{rate}</p>
          </div>
        ))}
      </div>
    </section>
  )
}