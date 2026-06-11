import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { hasAlreadyApplied } from '@/actions/proposals'
import ProposalForm from '@/components/proposals/ProposalForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Submit Proposal | Labora',
  description: 'Send a proposal for this project',
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProposalPage({ params }: Props) {
  const { id } = await params
  const session = await auth()

  if (!session?.user) redirect('/login')
  if (session.user.role !== 'FREELANCER') redirect(`/projects/${id}`)

  const project = await prisma.project.findUnique({
    where: { id },
    select: { id: true, title: true, status: true, clientId: true },
  })

  if (!project) redirect('/projects')
  if (project.status !== 'OPEN') redirect(`/projects/${id}`)
  if (project.clientId === session.user.id) redirect(`/projects/${id}`)

  const alreadyApplied = await hasAlreadyApplied(id)
  if (alreadyApplied) redirect(`/projects/${id}`)

  return (
    <div style={{ padding: '40px 24px', maxWidth: 680, margin: '0 auto' }}>
      <ProposalForm projectId={project.id} projectTitle={project.title} />
    </div>
  )
}