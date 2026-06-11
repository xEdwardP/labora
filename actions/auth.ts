'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

export async function registerUser(data: {
  name: string
  email: string
  password: string
}) {
  const exists = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (exists) return { error: 'El email ya está registrado' }

  const hashedPassword = await bcrypt.hash(data.password, 12)

  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  })

  await signIn('credentials', {
    email: data.email,
    password: data.password,
    redirectTo: '/home',
  })
}

export async function loginUser(data: {
  email: string
  password: string
}) {
  try {
    await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirectTo: '/home',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Credenciales inválidas' }
        default:
          return { error: 'Algo salió mal' }
      }
    }
    throw error
  }
}