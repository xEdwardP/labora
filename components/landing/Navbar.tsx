import Link from 'next/link'

export default function Navbar() {
  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #e8e8e8',
      padding: '0 40px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <Link href="/" style={{
        display: 'flex', alignItems: 'center', gap: '2px',
        fontSize: '22px', fontWeight: 700, color: '#6B2FDB', textDecoration: 'none',
      }}>
        l<span style={{ color: '#f97316' }}>•</span>bora
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <Link href="/projects" style={{
          fontSize: '14px', fontWeight: 500, color: '#6B2FDB', textDecoration: 'none',
          paddingBottom: '4px', borderBottom: '2px solid #6B2FDB',
        }}>
          Quiero contratar
        </Link>
        <Link href="/projects" style={{
          fontSize: '14px', fontWeight: 500, color: '#333', textDecoration: 'none',
          paddingBottom: '4px', borderBottom: '2px solid transparent',
        }}>
          Quiero trabajar
        </Link>
      </div>

      {/* Auth buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link href="/login" style={{
          fontSize: '14px', fontWeight: 500, color: '#333', textDecoration: 'none',
        }}>
          Ingresa
        </Link>
        <Link href="/register" style={{
          background: '#6B2FDB', color: '#fff', borderRadius: '24px',
          padding: '9px 20px', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
        }}>
          Regístrate
        </Link>
      </div>
    </nav>
  )
}