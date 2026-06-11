import { auth } from '@/auth'
import { Users, BarChart3, Bell, TrendingUp } from 'lucide-react'

const stats = [
  { label: 'Usuarios totales', value: '1,234', icon: Users, change: '+12%', color: 'bg-blue-500' },
  { label: 'Visitas hoy', value: '567', icon: BarChart3, change: '+8%', color: 'bg-green-500' },
  { label: 'Notificaciones', value: '23', icon: Bell, change: '-3%', color: 'bg-yellow-500' },
  { label: 'Crecimiento', value: '18%', icon: TrendingUp, change: '+5%', color: 'bg-purple-500' },
]

export default async function HomePage() {
  const session = await auth()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          ¡Hola, {session?.user?.name ?? 'Usuario'}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Bienvenido a tu panel de control.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map(({ label, value, icon: Icon, change, color }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{label}</span>
              <div className={`${color} p-2 rounded-lg`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-gray-900">{value}</span>
              <span className={`text-xs font-medium ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder de contenido */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Actividad reciente</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-48" />
                <div className="h-2 bg-gray-100 rounded animate-pulse w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}