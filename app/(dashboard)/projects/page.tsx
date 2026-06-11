import { getProjects } from '@/actions/projects'
import { auth } from '@/auth'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import ProjectFilters from '@/components/projects/ProjectFilters'
import ProjectCard from '@/components/projects/ProjectCard'

export default async function ProjectsPage() {
  const [session, projects] = await Promise.all([auth(), getProjects()])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a2e', marginBottom: '4px' }}>
            Proyectos disponibles
          </h1>
          <p style={{ fontSize: '14px', color: '#888' }}>
            {projects.length} proyectos abiertos
          </p>
        </div>
        {session?.user.role === 'CLIENT' && (
          <Link href="/projects/new" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#6B2FDB', color: '#fff', borderRadius: '24px',
            padding: '10px 20px', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
          }}>
            <Plus size={16} />
            Publicar proyecto
          </Link>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', alignItems: 'start' }}>
        <ProjectFilters />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '12px', border: '1px solid #eee' }}>
              <p style={{ color: '#888', fontSize: '15px' }}>No hay proyectos disponibles por el momento.</p>
            </div>
          ) : (
            projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}