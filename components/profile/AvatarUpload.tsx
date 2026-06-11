'use client'

import { useState, useRef } from 'react'
import { uploadAvatar } from '@/actions/profile'
import { toast } from 'sonner'
import { Camera, Loader2 } from 'lucide-react'

interface AvatarUploadProps {
  currentUrl: string | null
  name: string | null
}

export default function AvatarUpload({ currentUrl, name }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Local preview immediately
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const newUrl = await uploadAvatar(formData)
      setPreview(newUrl)
      toast.success('Avatar updated!')
    } catch (err: unknown) {
      setPreview(currentUrl) // revert on error
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setLoading(false)
      // Reset input so same file can be re-selected
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const initial = (name ?? 'U')[0].toUpperCase()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>

      {/* Avatar circle */}
      <div
        onClick={() => !loading && inputRef.current?.click()}
        style={{
          position: 'relative',
          width: 96, height: 96,
          borderRadius: '50%',
          cursor: loading ? 'not-allowed' : 'pointer',
          flexShrink: 0,
        }}
      >
        {/* Image or initial */}
        {preview ? (
          <img
            src={preview}
            alt={name ?? 'Avatar'}
            style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: 96, height: 96, borderRadius: '50%',
            background: '#ede7f6', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 32, fontWeight: 700, color: '#6B2FDB',
          }}>
            {initial}
          </div>
        )}

        {/* Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.38)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: loading ? 1 : 0,
          transition: 'opacity 0.2s',
        }}
          onMouseEnter={(e) => {
            if (!loading)
              (e.currentTarget as HTMLDivElement).style.opacity = '1'
          }}
          onMouseLeave={(e) => {
            if (!loading)
              (e.currentTarget as HTMLDivElement).style.opacity = '0'
          }}
        >
          {loading
            ? <Loader2 size={22} color="white" style={{ animation: 'spin 1s linear infinite' }} />
            : <Camera size={22} color="white" />
          }
        </div>
      </div>

      <p style={{ fontSize: 12, color: '#aaa', textAlign: 'center' }}>
        JPG, PNG or WebP · max 3MB
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}