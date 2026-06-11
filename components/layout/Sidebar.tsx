'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  Home,
  Briefcase,
  FolderOpen,
  FileText,
  Users,
  UserCircle,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { signOut } from 'next-auth/react'

const allNavItems = [
  { href: '/home',          label: 'Inicio',           icon: Home,        role: null           },
  { href: '/projects',      label: 'Proyectos',       icon: Briefcase,   role: null           },
  { href: '/my-projects',   label: 'Mis Proyectos',    icon: FolderOpen,  role: 'CLIENT'       },
  { href: '/my-proposals',  label: 'Mis Propuestas',   icon: FileText,    role: 'FREELANCER'   },
  { href: '/freelancers',   label: 'Freelancers',    icon: Users,       role: null           },
  { href: '/profile/edit',  label: 'Mi Perfil',     icon: UserCircle,  role: null           },
  // { href: '/notifications', label: 'Notificaciones',  icon: Bell,        role: null           },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [collapsed, setCollapsed] = useState(false)

  const role = session?.user?.role ?? null

  const navItems = allNavItems.filter(
    (item) => item.role === null || item.role === role
  )

  return (
    <aside style={{
      width: collapsed ? 68 : 230,
      minHeight: '100vh',
      background: 'white',
      borderRight: '1px solid #efefef',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.2s ease',
      position: 'relative',
      flexShrink: 0,
    }}>

      {/* Logo */}
      <div style={{
        padding: collapsed ? '24px 0' : '24px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderBottom: '1px solid #f0f0f0',
      }}>
        {!collapsed && (
          <span style={{ fontSize: 20, fontWeight: 800, color: '#6B2FDB' }}>
            Labora
          </span>
        )}
        {collapsed && (
          <span style={{ fontSize: 20, fontWeight: 800, color: '#6B2FDB' }}>L</span>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(({ href, label, icon: Icon, role: itemRole }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: collapsed ? '11px 0' : '11px 20px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                margin: '0 8px',
                borderRadius: 8,
                textDecoration: 'none',
                background: isActive ? '#f3eeff' : 'transparent',
                color: isActive ? '#6B2FDB' : '#555',
                fontWeight: isActive ? 600 : 400,
                fontSize: 14,
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLAnchorElement).style.background = '#f9f6ff'
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
              {!collapsed && <span>{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User info + logout */}
      <div style={{
        borderTop: '1px solid #f0f0f0',
        padding: collapsed ? '16px 0' : '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        {/* Avatar */}
        {session?.user?.image ? (
          <img
            src={session.user.image}
            alt={session.user.name ?? ''}
            style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
        ) : (
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: '#ede7f6', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, color: '#6B2FDB', fontSize: 14,
            flexShrink: 0,
          }}>
            {(session?.user?.name ?? session?.user?.email ?? 'U')[0].toUpperCase()}
          </div>
        )}

        {!collapsed && (
          <>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{
                fontSize: 13, fontWeight: 600, color: '#1a1a2e',
                margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {session?.user?.name ?? 'User'}
              </p>
              <p style={{ fontSize: 11, color: '#aaa', margin: 0 }}>
                {role === 'CLIENT' ? 'Client' : 'Freelancer'}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              title="Sign out"
              style={{
                background: 'none', border: 'none',
                cursor: 'pointer', color: '#bbb',
                padding: 4, borderRadius: 6,
                display: 'flex', alignItems: 'center',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = '#ef4444'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = '#bbb'
              }}
            >
              <LogOut size={16} />
            </button>
          </>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        style={{
          position: 'absolute',
          top: 28,
          right: -12,
          width: 24, height: 24,
          borderRadius: '50%',
          background: 'white',
          border: '1px solid #e0e0e0',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6B2FDB',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          zIndex: 10,
        }}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

    </aside>
  )
}