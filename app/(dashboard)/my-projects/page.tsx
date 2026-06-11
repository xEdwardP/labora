import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getMyProjects } from '@/actions/projects'
import { getProposalsByProject } from '@/actions/proposals'
import type { Metadata } from 'next'
import MyProjectsClient from '@/components/projects/MyProjectsClient'

export const metadata: Metadata = {
  title: 'My Projects | Labora',
  description: 'Manage your posted projects and review proposals',
}

export default async function MyProjectsPage() {
  const session = await auth()

  if (!session?.user) redirect('/login')
  if (session.user.role !== 'CLIENT') redirect('/home')

  const projects = await getMyProjects()

  // Fetch proposals for all projects in parallel
  const proposalsPerProject = await Promise.all(
    projects.map((project) =>
      getProposalsByProject(project.id).then((proposals) => ({
        projectId: project.id,
        proposals,
      }))
    )
  )

  const proposalsMap = Object.fromEntries(
    proposalsPerProject.map(({ projectId, proposals }) => [projectId, proposals])
  )

  return (
    <div style={{ padding: '40px 24px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e', marginBottom: 6 }}>
          My Projects
        </h1>
        <p style={{ color: '#888', fontSize: 14 }}>
          Review proposals and manage your active projects
        </p>
      </div>

      <MyProjectsClient projects={projects} proposalsMap={proposalsMap} />
    </div>
  )
}