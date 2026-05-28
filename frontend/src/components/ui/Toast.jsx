import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback(({ message, type = 'info', duration = 3500 }) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }, [])

  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map(t => (
          <div
            key={t.id}
            className="flex items-center gap-3 px-4 py-3 bg-[#111520] border border-[#252D40] rounded-xl shadow-2xl animate-slide-up min-w-[280px] max-w-sm"
          >
            {t.type === 'success' && <CheckCircle size={15} className="text-emerald-400 shrink-0" />}
            {t.type === 'error' && <XCircle size={15} className="text-red-400 shrink-0" />}
            <p className="text-sm text-[#E8ECF4] flex-1">{t.message}</p>
            <button onClick={() => remove(t.id)} className="text-[#525C6E] hover:text-[#8B95A8]">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be inside ToastProvider')
  return ctx
}