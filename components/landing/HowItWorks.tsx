'use client'

import { useState } from 'react'

const steps = {
  client: [
    { n: 1, title: 'Publica tu proyecto',   desc: 'Describe lo que necesitas, el presupuesto y el plazo. Es gratis y toma menos de 5 minutos.' },
    { n: 2, title: 'Recibe propuestas',      desc: 'Los freelancers envían sus propuestas con precio y tiempo estimado. Tú eliges el mejor.' },
    { n: 3, title: 'Contrata y paga seguro', desc: 'El pago queda protegido hasta que apruebes el trabajo. Sin riesgos para tu negocio.' },
  ],
  freelancer: [
    { n: 1, title: 'Crea tu perfil',    desc: 'Muestra tus habilidades, experiencia y portafolio para destacar frente a los clientes.' },
    { n: 2, title: 'Envía propuestas',  desc: 'Encuentra proyectos que se adapten a tu perfil y envía tu propuesta con precio y tiempo.' },
    { n: 3, title: 'Trabaja y cobra',   desc: 'Completa el proyecto y recibe tu pago de forma segura directo en tu cuenta.' },
  ],
}

export default function HowItWorks() {
  const [tab, setTab] = useState<'client' | 'freelancer'>('client')

  return (
    <section style={{ background: '#fff', padding: '64px 40px' }}>
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#6B2FDB', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
        Simple y rápido
      </p>
      <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#1a1a2e', marginBottom: '32px' }}>
        ¿Cómo funciona Labora?
      </h2>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #e8e8e8', marginBottom: '48px' }}>
        {(['client', 'freelancer'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '12px 28px', fontSize: '15px', fontWeight: 600,
            background: 'none', border: 'none', cursor: 'pointer',
            color: tab === t ? '#6B2FDB' : '#888',
            borderBottom: tab === t ? '3px solid #6B2FDB' : '3px solid transparent',
            marginBottom: '-2px',
          }}>
            {t === 'client' ? 'Soy cliente' : 'Soy freelancer'}
          </button>
        ))}
      </div>

      {/* Steps */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
        {steps[tab].map(({ n, title, desc }) => (
          <div key={n} style={{ textAlign: 'center', padding: '24px 16px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: '#f0eafb', color: '#6B2FDB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', fontWeight: 700, margin: '0 auto 16px',
            }}>
              {n}
            </div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a2e', marginBottom: '8px' }}>{title}</p>
            <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6 }}>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}