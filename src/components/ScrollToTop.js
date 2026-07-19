'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // A small timeout ensures React has flushed the new route's DOM
    // before we forcefully scroll, overriding any smooth-scroll conflicts
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }, 10)
    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
