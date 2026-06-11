import Link from 'next/link'

const footerLinks = {
  'Plataforma': [
    { label: 'Publicar proyecto', href: '/register' },
    { label: 'Explorar proyectos', href: '/projects' },
    { label: 'Freelancers', href: '/freelancers' },
  ],
  'Empresa': [
    { label: 'Sobre nosotros', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Trabaja con nosotros', href: '#' },
  ],
  'Soporte': [
    { label: 'Centro de ayuda', href: '#' },
    { label: 'Contáctanos', href: '#' },
    { label: 'Términos de uso', href: '#' },
    { label: 'Privacidad', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer style={{ background: '#1a1a2e', padding: '48px 40px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '32px', marginBottom: '40px' }}>
        {/* Brand */}
        <div>
          <Link href="/" style={{ fontSize: '20px', fontWeight: 700, color: '#fff', textDecoration: 'none', display: 'block', marginBottom: '12px' }}>
            l<span style={{ color: '#f97316' }}>•</span>bora
          </Link>
          <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.7, maxWidth: '220px' }}>
            La plataforma de trabajo freelance más confiable de América Latina.
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {title}
            </h4>
            {links.map(({ label, href }) => (
              <Link key={label} href={href} style={{ display: 'block', fontSize: '13px', color: '#888', textDecoration: 'none', marginBottom: '8px' }}>
                {label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #2e2e4a', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: '12px', color: '#555' }}>© 2025 Labora. Todos los derechos reservados.</p>
        <div style={{ display: 'flex', gap: '16px' }}>
          {['Instagram', 'Facebook', 'Twitter', 'LinkedIn'].map((s) => (
            <span key={s} style={{ fontSize: '12px', color: '#555', cursor: 'pointer' }}>{s}</span>
          ))}
        </div>
      </div>
    </footer>
  )
}