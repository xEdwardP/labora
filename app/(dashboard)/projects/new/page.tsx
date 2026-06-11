import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import NewProjectForm from '@/components/projects/NewProjectForm'

export default async function NewProjectPage() {
  const session = await auth()

  if (session?.user.role !== 'CLIENT') redirect('/projects')

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a2e', marginBottom: '4px' }}>
          Publicar proyecto
        </h1>
        <p style={{ fontSize: '14px', color: '#888' }}>
          Completa los detalles de tu proyecto para recibir propuestas
        </p>
      </div>
      <NewProjectForm />
    </div>
  )
}