'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function upsertProfile(data: {
  bio?: string
  skills?: string[]
  hourlyRate?: number
  country?: string
  portfolio?: string[]
}) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  const profile = await prisma.profile.upsert({
    where:  { userId: session.user.id },
    update: {
      bio:        data.bio        ?? undefined,
      skills:     data.skills     ?? undefined,
      hourlyRate: data.hourlyRate ?? undefined,
      country:    data.country    ?? undefined,
      portfolio:  data.portfolio  ?? undefined,
    },
    create: {
      userId:     session.user.id,
      bio:        data.bio        ?? '',
      skills:     data.skills     ?? [],
      hourlyRate: data.hourlyRate ?? null,
      country:    data.country    ?? null,
      portfolio:  data.portfolio  ?? [],
    },
  })

  revalidatePath('/profile/edit')
  revalidatePath(`/freelancers/${session.user.id}`)
  return profile
}

export async function getProfileByUserId(userId: string) {
  return prisma.profile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id:    true,
          name:  true,
          email: true,
          image: true,
          role:  true,
        },
      },
    },
  })
}

export async function getOwnProfile() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')
  return getProfileByUserId(session.user.id)
}

export async function uploadAvatar(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  const file = formData.get('avatar') as File
  if (!file || file.size === 0) throw new Error('No file provided')

  const maxSize = 3 * 1024 * 1024 // 3MB
  if (file.size > maxSize) throw new Error('File size must be under 3MB')

  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowed.includes(file.type)) throw new Error('Only JPG, PNG and WebP are allowed')

  const ext      = file.type.split('/')[1]
  const path     = `${session.user.id}.${ext}`
  const buffer   = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabaseAdmin.storage
    .from('avatars')
    .upload(path, buffer, {
      contentType: file.type,
      upsert: true,
    })

  if (uploadError) throw new Error(uploadError.message)

  const { data: urlData } = supabaseAdmin.storage
    .from('avatars')
    .getPublicUrl(path)

  const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`

  await Promise.all([
    prisma.profile.upsert({
      where:  { userId: session.user.id },
      update: { avatarUrl },
      create: { userId: session.user.id, avatarUrl, skills: [], portfolio: [] },
    }),
    prisma.user.update({
      where: { id: session.user.id },
      data:  { image: avatarUrl },
    }),
  ])

  revalidatePath('/profile/edit')
  revalidatePath(`/freelancers/${session.user.id}`)
  return avatarUrl
}

export async function getFreelancers() {
  return prisma.user.findMany({
    where: { role: 'FREELANCER' },
    select: {
      id:    true,
      name:  true,
      email: true,
      image: true,
      profile: {
        select: {
          bio:        true,
          skills:     true,
          hourlyRate: true,
          country:    true,
          avatarUrl:  true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}