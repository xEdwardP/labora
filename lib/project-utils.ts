import { Category, BudgetType, ProjectStatus } from '@/app/generated/prisma/client'

export const categoryLabels: Record<Category, string> = {
  IT_PROGRAMMING:      'IT y Programación',
  DESIGN_MULTIMEDIA:   'Diseño y Multimedia',
  WRITING_TRANSLATION: 'Redacción y Traducción',
  SALES_MARKETING:     'Ventas y Marketing',
  FINANCE_MANAGEMENT:  'Finanzas y Gestión',
  LEGAL:               'Legal',
  ADMIN_SUPPORT:       'Soporte Administrativo',
  ENGINEERING:         'Ingeniería',
}

export const budgetTypeLabels: Record<BudgetType, string> = {
  FIXED:  'Precio fijo',
  HOURLY: 'Por hora',
}

export const statusLabels: Record<ProjectStatus, string> = {
  OPEN:        'Abierto',
  IN_PROGRESS: 'En progreso',
  COMPLETED:   'Completado',
  CANCELLED:   'Cancelado',
}

export const statusColors: Record<ProjectStatus, { bg: string; text: string }> = {
  OPEN:        { bg: '#f0fdf4', text: '#16a34a' },
  IN_PROGRESS: { bg: '#eff6ff', text: '#2563eb' },
  COMPLETED:   { bg: '#f0eafb', text: '#6B2FDB' },
  CANCELLED:   { bg: '#fff1f2', text: '#e11d48' },
}