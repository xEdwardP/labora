import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ClientDashboard from '@/components/dashboard/ClientDashboard'
import FreelancerDashboard from '@/components/dashboard/FreelancerDashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home | Labora',
  description: 'Your Labora dashboard',
}

export default async function HomePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const userId = session.user.id
  const role   = session.user.role

  if (role === 'CLIENT') {
    // Fetch client stats
    const [projects, proposals] = await Promise.all([
      prisma.project.findMany({
        where: { clientId: userId },
        select: { id: true, status: true },
      }),
      prisma.proposal.findMany({
        where: { project: { clientId: userId } },
        select: { status: true },
      }),
    ])

    const stats = {
      totalProjects:    projects.length,
      activeProjects:   projects.filter((p) => p.status === 'IN_PROGRESS').length,
      totalProposals:   proposals.length,
      pendingProposals: proposals.filter((p) => p.status === 'PENDING').length,
    }

    return (
      <div style={{ padding: '40px 24px' }}>
        <ClientDashboard name={session.user.name ?? null} stats={stats} />
      </div>
    )
  }

  // FREELANCER
  const proposals = await prisma.proposal.findMany({
    where:  { freelancerId: userId },
    select: { status: true },
  })

  const stats = {
    totalProposals:    proposals.length,
    acceptedProposals: proposals.filter((p) => p.status === 'ACCEPTED').length,
    pendingProposals:  proposals.filter((p) => p.status === 'PENDING').length,
    rejectedProposals: proposals.filter((p) => p.status === 'REJECTED').length,
  }

  return (
    <div style={{ padding: '40px 24px' }}>
      <FreelancerDashboard name={session.user.name ?? null} stats={stats} />
    </div>
  )
}