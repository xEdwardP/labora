'use client'

import { Code, Palette, PenLine, Megaphone, Calculator, Scale, Headphones, Wrench } from 'lucide-react'

const categories = [
  { name: 'IT y Programación',        count: '4,200+', icon: Code,        bg: '#f0eafb', color: '#6B2FDB' },
  { name: 'Diseño y Multimedia',      count: '2,800+', icon: Palette,     bg: '#fef3f0', color: '#f97316' },
  { name: 'Redacción y Traducción',   count: '1,900+', icon: PenLine,     bg: '#f0fdf4', color: '#10b981' },
  { name: 'Ventas y Marketing',       count: '3,100+', icon: Megaphone,   bg: '#eff6ff', color: '#3b82f6' },
  { name: 'Finanzas y Gestión',       count: '980+',   icon: Calculator,  bg: '#fefce8', color: '#f59e0b' },
  { name: 'Legal',                    count: '540+',   icon: Scale,       bg: '#fdf4ff', color: '#a855f7' },
  { name: 'Soporte Administrativo',   count: '1,200+', icon: Headphones,  bg: '#fff1f2', color: '#f43f5e' },
  { name: 'Ingeniería',               count: '760+',   icon: Wrench,      bg: '#f0fdfa', color: '#14b8a6' },
]

export default function Categories() {
  return (
    <section style={{ padding: '64px 40px', background: '#fff' }}>
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#6B2FDB', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
        ¿Qué necesitas?
      </p>
      <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#1a1a2e', marginBottom: '8px' }}>
        Encuentra el talento que tu proyecto necesita
      </h2>
      <p style={{ fontSize: '15px', color: '#666', marginBottom: '40px' }}>
        Más de 8 categorías de profesionales listos para trabajar
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {categories.map(({ name, count, icon: Icon, bg, color }) => (
          <div key={name} style={{
            background: '#fff', borderRadius: '12px', padding: '24px 20px',
            cursor: 'pointer', border: '1.5px solid #eee',
            transition: 'border-color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#6B2FDB')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#eee')}
          >
            <div style={{
              width: '44px', height: '44px', borderRadius: '10px',
              background: bg, display: 'flex', alignItems: 'center',
              justifyContent: 'center', marginBottom: '14px',
            }}>
              <Icon size={22} color={color} />
            </div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e', marginBottom: '4px' }}>{name}</p>
            <p style={{ fontSize: '12px', color: '#888' }}>{count} proyectos</p>
          </div>
        ))}
      </div>
    </section>
  )
}