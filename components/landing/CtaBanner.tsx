import Link from 'next/link'

export default function CtaBanner() {
  return (
    <section style={{
      background: '#6B2FDB', padding: '64px 40px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div>
        <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
          ¿Listo para hacer crecer tu negocio?
        </h2>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)' }}>
          Únete a miles de empresas que ya confían en Labora para encontrar el mejor talento.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
        <Link href="/register" style={{
          background: '#fff', color: '#6B2FDB', borderRadius: '24px',
          padding: '12px 28px', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
        }}>
          Publicar un proyecto
        </Link>
        <Link href="/register" style={{
          background: 'transparent', color: '#fff',
          border: '2px solid rgba(255,255,255,0.6)', borderRadius: '24px',
          padding: '12px 28px', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
        }}>
          Comenzar a trabajar
        </Link>
      </div>
    </section>
  )
}