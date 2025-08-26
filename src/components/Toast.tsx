import { createContext, useContext, useMemo, useState } from 'react'
import styles from './Toast.module.css'

type ToastType = 'success' | 'error'

interface ToastItem {
  id: number
  message: string
  type: ToastType
}

interface ToastContextValue {
  show: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<ToastItem[]>([])

  const show = (message: string, type: ToastType = 'success') => {
    const id = Date.now() + Math.random()
    const item: ToastItem = { id, message, type }
    setItems(prev => [...prev, item])
    setTimeout(() => {
      setItems(prev => prev.filter(t => t.id !== id))
    }, 2500)
  }

  const value = useMemo<ToastContextValue>(() => ({ show }), [])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.container}>
        {items.map(t => (
          <div key={t.id} className={`${styles.toast} ${t.type === 'success' ? styles.success : styles.error}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
} 