'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  Briefcase,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

const navItems = [
  { href: '/home',     label: 'Inicio',    icon: Home },
  { href: '/projects', label: 'Proyectos', icon: Briefcase },
  { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
]

const bottomItems = [
  { href: '/help', label: 'Ayuda', icon: HelpCircle },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`
        h-screen bg-gray-900 text-white flex flex-col
        transition-all duration-300 relative
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 bg-gray-900 border border-gray-700 rounded-full p-1 z-10"
      >
        <ChevronLeft
          className={`w-3 h-3 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Logo */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-3 h-16">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold">B</span>
        </div>
        {!collapsed && (
          <span className="font-semibold text-lg truncate">Boilerplate</span>
        )}
      </div>

      {/* Nav principal */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm
                ${isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Parte inferior */}
      <div className="p-3 border-t border-gray-800 space-y-1">
        {bottomItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            title={collapsed ? label : undefined}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors text-sm"
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          title={collapsed ? 'Cerrar sesión' : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-red-900/40 hover:text-red-400 transition-colors text-sm"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  )
}