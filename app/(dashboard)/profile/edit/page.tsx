import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getOwnProfile } from '@/actions/profile'
import ProfileForm from '@/components/profile/ProfileForm'
import AvatarUpload from '@/components/profile/AvatarUpload'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Profile | Labora',
  description: 'Edit your public profile',
}

export default async function ProfileEditPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const profile = await getOwnProfile()

  const initial = {
    bio:        profile?.bio        ?? '',
    skills:     profile?.skills     ?? [],
    hourlyRate: profile?.hourlyRate ?? null,
    country:    profile?.country    ?? '',
    portfolio:  profile?.portfolio  ?? [],
  }

  return (
    <div style={{ padding: '40px 24px', maxWidth: 680, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e', marginBottom: 6 }}>
          Mi Perfil
        </h1>
        <p style={{ color: '#888', fontSize: 14 }}>
          Esta información será visible para los clientes que naveguen por los freelancers
        </p>
      </div>

      {/* Avatar */}
      <div style={{
        background: 'white',
        borderRadius: 14,
        padding: '28px 24px',
        border: '1px solid #efefef',
        marginBottom: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
      }}>
        <AvatarUpload
          currentUrl={profile?.avatarUrl ?? session.user.image ?? null}
          name={session.user.name ?? null}
        />
      </div>

      {/* Profile form */}
      <div style={{
        background: 'white',
        borderRadius: 14,
        padding: '28px 24px',
        border: '1px solid #efefef',
      }}>
        <ProfileForm initial={initial} />
      </div>

    </div>
  )
}