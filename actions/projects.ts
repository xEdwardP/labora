'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { Category, BudgetType } from '@/app/generated/prisma/client'
import { revalidatePath } from 'next/cache'

export async function createProject(data: {
  title: string
  description: string
  category: Category
  budget: number
  budgetType: BudgetType
}) {
  const session = await auth()

  if (!session) return { error: 'No autenticado' }
  if (session.user.role !== 'CLIENT') return { error: 'Solo los clientes pueden publicar proyectos' }

  await prisma.project.create({
    data: {
      ...data,
      clientId: session.user.id,
    },
  })

  revalidatePath('/projects')
  return { success: 'Proyecto publicado exitosamente' }
}

export async function getProjects(filters?: {
  category?: Category
  budgetMin?: number
  budgetMax?: number
}) {
  const where: any = { status: 'OPEN' }

  if (filters?.category) where.category = filters.category
  if (filters?.budgetMin || filters?.budgetMax) {
    where.budget = {}
    if (filters.budgetMin) where.budget.gte = filters.budgetMin
    if (filters.budgetMax) where.budget.lte = filters.budgetMax
  }

  return await prisma.project.findMany({
    where,
    include: { client: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getProjectById(id: string) {
  return await prisma.project.findUnique({
    where: { id },
    include: { client: { select: { id: true, name: true, image: true, createdAt: true } } },
  })
}

export async function getMyProjects() {
  const session = await auth()
  if (!session) return []

  return await prisma.project.findMany({
    where: { clientId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })
}