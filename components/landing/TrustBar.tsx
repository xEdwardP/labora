const companies = ['ACME', 'NEXCORP', 'TECHTLA', 'GRUPO MX', 'INNOVA', 'DEVHUB']

export default function TrustBar() {
  return (
    <div style={{ background: '#f4f4f4', padding: '48px 40px', textAlign: 'center' }}>
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '28px' }}>
        Empresas que confían en Labora
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
        {companies.map((c) => (
          <div key={c} style={{
            background: '#fff', borderRadius: '8px', padding: '10px 20px',
            fontSize: '13px', fontWeight: 700, color: '#aaa', letterSpacing: '1px',
            border: '1px solid #e8e8e8',
          }}>
            {c}
          </div>
        ))}
      </div>
    </div>
  )
}