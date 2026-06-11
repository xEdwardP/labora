import Link from 'next/link'
import { CheckCircle, ShieldCheck, Lock } from 'lucide-react'

export default function Hero() {
  return (
    <section style={{
      background: '#f4f4f4',
      minHeight: '520px',
      display: 'flex',
      alignItems: 'center',
      padding: '60px 40px 40px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Left */}
      <div style={{ flex: 1, maxWidth: '520px', zIndex: 2 }}>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {[
            { icon: CheckCircle, label: 'Consulta gratuita' },
            { icon: ShieldCheck, label: 'Garantía de satisfacción' },
            { icon: Lock, label: 'Pagos protegidos' },
          ].map(({ icon: Icon, label }) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#444', fontWeight: 500 }}>
              <Icon size={15} color="#6B2FDB" />
              {label}
            </span>
          ))}
        </div>

        <h1 style={{ fontSize: '38px', fontWeight: 700, lineHeight: 1.2, color: '#1a1a2e', marginBottom: '16px' }}>
          Impulsa tu negocio con el{' '}
          <span style={{ color: '#6B2FDB' }}>mejor talento remoto</span>{' '}
          de América Latina
        </h1>

        <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.6, marginBottom: '32px', maxWidth: '420px' }}>
          Desarrolla tu negocio de manera rápida y segura.
          Te conectamos con miles de talentos en tu idioma y zona horaria.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/register" style={{
            background: '#6B2FDB', color: '#fff', borderRadius: '24px',
            padding: '12px 28px', fontSize: '15px', fontWeight: 600, textDecoration: 'none',
          }}>
            Quiero contratar
          </Link>
          <Link href="/register" style={{
            color: '#6B2FDB', fontSize: '15px', fontWeight: 500,
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            ¿Quieres trabajar? →
          </Link>
        </div>
      </div>

      {/* Right — floating avatars */}
      <div style={{ flex: 1, position: 'relative', minHeight: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Decorative rings */}
        {[
          { w: 180, h: 180, top: 20, right: 180, color: '#e066cc' },
          { w: 100, h: 100, bottom: 60, right: 80, color: '#4ecdc4' },
          { w: 70, h: 70, top: 80, right: 60, color: '#f97316' },
        ].map((r, i) => (
          <div key={i} style={{
            position: 'absolute', borderRadius: '50%',
            width: r.w, height: r.h,
            top: r.top, right: r.right, bottom: r.bottom,
            border: `2px solid ${r.color}`, opacity: 0.35,
          }} />
        ))}

        {/* Dot patterns */}
        <div style={{
          position: 'absolute', bottom: 80, left: 40,
          width: 50, height: 50, opacity: 0.4,
          backgroundImage: 'radial-gradient(circle, #6B2FDB 1.5px, transparent 1.5px)',
          backgroundSize: '8px 8px',
        }} />
        <div style={{
          position: 'absolute', top: 30, right: 40,
          width: 50, height: 50, opacity: 0.4,
          backgroundImage: 'radial-gradient(circle, #f97316 1.5px, transparent 1.5px)',
          backgroundSize: '8px 8px',
        }} />

        {/* Avatar circles */}
        {[
          { size: 90,  top: 30,  left: 80,  bg: 'linear-gradient(135deg,#7c6deb,#a98df5)', initials: 'CM' },
          { size: 75,  top: 10,  right: 120, bg: 'linear-gradient(135deg,#f97316,#fbbf24)', initials: 'AG' },
          { size: 100, top: 120, left: 20,  bg: 'linear-gradient(135deg,#6B2FDB,#8b5cf6)', initials: 'LT' },
          { size: 80,  top: 100, right: 40, bg: 'linear-gradient(135deg,#10b981,#34d399)', initials: 'MR' },
          { size: 85,  bottom: 80, left: 60, bg: 'linear-gradient(135deg,#e066cc,#f472b6)', initials: 'JP' },
          { size: 95,  bottom: 60, right: 160, bg: 'linear-gradient(135deg,#3b82f6,#60a5fa)', initials: 'VG' },
          { size: 70,  bottom: 20, right: 60, bg: 'linear-gradient(135deg,#f59e0b,#fcd34d)', initials: 'RH' },
        ].map(({ size, top, left, right, bottom, bg, initials }) => (
          <div key={initials} style={{
            position: 'absolute',
            width: size, height: size,
            top, left, right, bottom,
            borderRadius: '50%',
            background: bg,
            border: '3px solid #fff',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: size * 0.22,
          }}>
            {initials}
          </div>
        ))}
      </div>
    </section>
  )
}