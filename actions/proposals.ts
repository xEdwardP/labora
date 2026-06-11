'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { ProposalStatus, ProjectStatus, NotificationType } from '@/app/generated/prisma/client'


export async function createProposal(data: {
  projectId: string
  amount: number
  estimatedDays: number
  message: string
}) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')
  if (session.user.role !== 'FREELANCER') throw new Error('Only freelancers can send proposals')

  const alreadyApplied = await hasAlreadyApplied(data.projectId)
  if (alreadyApplied) throw new Error('You already applied to this project')

  const project = await prisma.project.findUnique({
    where: { id: data.projectId },
    select: { id: true, title: true, clientId: true, status: true },
  })
  if (!project) throw new Error('Project not found')
  if (project.status !== 'OPEN') throw new Error('Project is no longer accepting proposals')

  const proposal = await prisma.proposal.create({
    data: {
      projectId: data.projectId,
      freelancerId: session.user.id,
      amount: data.amount,
      estimatedDays: data.estimatedDays,
      message: data.message,
    },
  })

  await prisma.notification.create({
    data: {
      userId: project.clientId,
      type: NotificationType.NEW_PROPOSAL,
      title: 'New proposal received',
      body: `A freelancer submitted a proposal for "${project.title}"`,
      link: `/my-projects`,
    },
  })

  revalidatePath(`/projects/${data.projectId}`)
  return proposal
}


export async function getProposalsByProject(projectId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { clientId: true },
  })
  if (!project || project.clientId !== session.user.id) throw new Error('Forbidden')

  return prisma.proposal.findMany({
    where: { projectId },
    include: {
      freelancer: {
        select: { id: true, name: true, image: true, email: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}


export async function getMyProposals() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  return prisma.proposal.findMany({
    where: { freelancerId: session.user.id },
    include: {
      project: {
        select: { id: true, title: true, category: true, status: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}


export async function updateProposalStatus(
  proposalId: string,
  status: 'ACCEPTED' | 'REJECTED'
) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  const proposal = await prisma.proposal.findUnique({
    where: { id: proposalId },
    include: {
      project: { select: { id: true, title: true, clientId: true } },
    },
  })
  if (!proposal) throw new Error('Proposal not found')
  if (proposal.project.clientId !== session.user.id) throw new Error('Forbidden')

  if (status === 'ACCEPTED') {
    await acceptProposal(proposal)
  } else {
    await rejectProposal(proposal)
  }

  revalidatePath('/my-projects')
}


async function acceptProposal(proposal: {
  id: string
  freelancerId: string
  projectId: string
  project: { id: string; title: string; clientId: string }
}) {
  await prisma.proposal.update({
    where: { id: proposal.id },
    data: { status: ProposalStatus.ACCEPTED },
  })

  await prisma.project.update({
    where: { id: proposal.projectId },
    data: { status: ProjectStatus.IN_PROGRESS },
  })

  const otherProposals = await prisma.proposal.findMany({
    where: {
      projectId: proposal.projectId,
      id: { not: proposal.id },
      status: ProposalStatus.PENDING,
    },
    select: { id: true, freelancerId: true },
  })

  if (otherProposals.length > 0) {
    await prisma.proposal.updateMany({
      where: {
        projectId: proposal.projectId,
        id: { not: proposal.id },
        status: ProposalStatus.PENDING,
      },
      data: { status: ProposalStatus.REJECTED },
    })

    await prisma.notification.createMany({
      data: otherProposals.map((p) => ({
        userId: p.freelancerId,
        type: NotificationType.PROPOSAL_REJECTED,
        title: 'Proposal not selected',
        body: `Your proposal for "${proposal.project.title}" was not selected`,
        link: `/my-proposals`,
      })),
    })
  }

  await prisma.notification.create({
    data: {
      userId: proposal.freelancerId,
      type: NotificationType.PROPOSAL_ACCEPTED,
      title: 'Proposal accepted! 🎉',
      body: `Your proposal for "${proposal.project.title}" was accepted`,
      link: `/my-proposals`,
    },
  })
}


async function rejectProposal(proposal: {
  id: string
  freelancerId: string
  project: { title: string }
}) {
  await prisma.proposal.update({
    where: { id: proposal.id },
    data: { status: ProposalStatus.REJECTED },
  })

  await prisma.notification.create({
    data: {
      userId: proposal.freelancerId,
      type: NotificationType.PROPOSAL_REJECTED,
      title: 'Proposal rejected',
      body: `Your proposal for "${proposal.project.title}" was not selected`,
      link: `/my-proposals`,
    },
  })
}


export async function hasAlreadyApplied(projectId: string): Promise<boolean> {
  const session = await auth()
  if (!session?.user?.id) return false

  const existing = await prisma.proposal.findUnique({
    where: {
      projectId_freelancerId: {
        projectId,
        freelancerId: session.user.id,
      },
    },
  })

  return !!existing
}