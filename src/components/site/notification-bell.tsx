'use client'

import { useEffect, useState, useRef } from 'react'
import { Bell, X, Info, Tag, Gift, AlertTriangle, Megaphone } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  title: string
  body: string
  type: string
  link: string
  isActive: boolean
  createdAt: string
}

interface StoreStatus {
  accepting: boolean
  message: string
}

// 24 hours in milliseconds
const READ_EXPIRY = 24 * 60 * 60 * 1000

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [storeStatus, setStoreStatus] = useState<StoreStatus>({ accepting: true, message: '' })
  const [unreadIds, setUnreadIds] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [bellAnimating, setBellAnimating] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch notifications + store status on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notifRes, statusRes] = await Promise.all([
          fetch('/api/content/notifications'),
          fetch('/api/content/store-status'),
        ])
        const notifs = await notifRes.json()
        const status = await statusRes.json()
        setNotifications(notifs)
        setStoreStatus(status)

        // Load read notifications from localStorage
        const readData = localStorage.getItem('ss_read_notifications')
        const readMap: Record<string, number> = readData ? JSON.parse(readData) : {}

        // Filter out expired reads (older than 24h) — those become "unread" again
        const now = Date.now()
        const validReads = Object.entries(readMap)
          .filter(([, ts]) => now - ts < READ_EXPIRY)
          .reduce((acc, [id, ts]) => ({ ...acc, [id]: ts }), {} as Record<string, number>)

        // Save cleaned reads back
        localStorage.setItem('ss_read_notifications', JSON.stringify(validReads))

        // Unread = active notifications that haven't been read (or read expired)
        const unread = notifs
          .filter((n: Notification) => !validReads[n.id])
          .map((n: Notification) => n.id)
        setUnreadIds(unread)

        // Ring the bell if there are unread notifications
        if (unread.length > 0) {
          setBellAnimating(true)
          setTimeout(() => setBellAnimating(false), 600)
        }
      } catch {
        // silent fail
      }
    }
    fetchData()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', onClick)
      return () => document.removeEventListener('mousedown', onClick)
    }
  }, [isOpen])

  const markAsRead = (id: string) => {
    // Mark as read with timestamp
    const readData = localStorage.getItem('ss_read_notifications')
    const readMap: Record<string, number> = readData ? JSON.parse(readData) : {}
    readMap[id] = Date.now()
    localStorage.setItem('ss_read_notifications', JSON.stringify(readMap))

    // Remove from unread
    setUnreadIds((prev) => prev.filter((uid) => uid !== id))
  }

  const markAllAsRead = () => {
    const readData = localStorage.getItem('ss_read_notifications')
    const readMap: Record<string, number> = readData ? JSON.parse(readData) : {}
    const now = Date.now()
    notifications.forEach((n) => {
      readMap[n.id] = now
    })
    localStorage.setItem('ss_read_notifications', JSON.stringify(readMap))
    setUnreadIds([])
  }

  const handleToggle = () => {
    const next = !isOpen
    setIsOpen(next)
    if (next) {
      setBellAnimating(true)
      setTimeout(() => setBellAnimating(false), 600)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'OFFER': return <Megaphone className="h-4 w-4 text-[#FF2D55]" />
      case 'COUPON': return <Tag className="h-4 w-4 text-[#22c55e]" />
      case 'WARNING': return <AlertTriangle className="h-4 w-4 text-[#FF2D55]" />
      default: return <Info className="h-4 w-4 text-white/60" />
    }
  }

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const unreadCount = unreadIds.length

  return (
    <>
      {/* Store Status Banner (shows when orders paused) — sits below navbar */}
      {!storeStatus.accepting && (
        <div className="fixed left-0 right-0 top-[60px] z-[55] border-b border-[#FF2D55]/40 bg-[#FF2D55]/10 backdrop-blur-md animate-slide-down">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center">
            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 text-[#FF2D55]" />
            <p className="font-mono-tech text-[10px] text-white/80">
              {storeStatus.message || 'Orders temporarily paused — check back soon'}
            </p>
          </div>
        </div>
      )}

      {/* Notification Bell */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={handleToggle}
          className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-white/80 transition-all hover:border-[#2A2A2A] hover:text-white"
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        >
          <Bell className={cn('h-5 w-5 transition-colors group-hover:text-white', bellAnimating && 'animate-bell-ring')} />

          {/* Unread badge */}
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF2D55] px-1 text-[9px] font-bold text-white animate-badge-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown — fixed positioning to avoid overflow on mobile */}
        {isOpen && (
          <div
            className="fixed z-50 w-[calc(100vw-2rem)] max-w-sm overflow-hidden border border-[#2A2A2A] bg-[#0a0a0a] shadow-2xl animate-slide-up-fade"
            style={{
              top: '4rem',
              right: '1rem',
              maxHeight: 'calc(100vh-6rem)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#2A2A2A] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="font-mono-tech text-[10px] uppercase tracking-wider text-white/60">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="font-mono-tech text-[9px] text-[#FF2D55]">
                    {unreadCount} NEW
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="font-mono-tech text-[9px] uppercase tracking-wider text-white/40 transition-colors hover:text-[#FF2D55]"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications list */}
            <div className="max-h-96 overflow-y-auto no-scrollbar">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 p-8 text-center">
                  <Bell className="h-8 w-8 text-white/10" />
                  <p className="font-mono-tech text-[10px] text-white/30">No notifications</p>
                </div>
              ) : (
                notifications.map((notif) => {
                  const isUnread = unreadIds.includes(notif.id)
                  return (
                    <button
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={cn(
                        'flex w-full items-start gap-3 border-b border-[#2A2A2A]/50 px-4 py-3 text-left transition-colors hover:bg-white/[0.02]',
                        isUnread && 'bg-[#FF2D55]/[0.03]'
                      )}
                    >
                      {/* Icon */}
                      <div className="mt-0.5 flex-shrink-0">
                        {isUnread ? (
                          getIcon(notif.type)
                        ) : (
                          <div className="opacity-40">{getIcon(notif.type)}</div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn('text-xs font-bold', isUnread ? 'text-white' : 'text-white/50')}>
                            {notif.title}
                          </p>
                          {isUnread && (
                            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#FF2D55]" />
                          )}
                        </div>
                        <p className={cn('mt-0.5 text-xs', isUnread ? 'text-white/60' : 'text-white/30')}>
                          {notif.body}
                        </p>
                        <p className="mt-1 font-mono-tech text-[9px] text-white/20">
                          {formatTime(notif.createdAt)}
                        </p>
                      </div>
                    </button>
                  )
                })
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-[#2A2A2A] px-4 py-2">
              <p className="font-mono-tech text-center text-[9px] text-white/20">
                Read notifications auto-dismiss after 24h
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
