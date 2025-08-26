import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ShopProvider } from './store/shop'
import { ToastProvider, useToast } from './components/Toast'
import { bindToast, unbindToast } from './utils/toastEmitter'
import { CurrencyProvider } from './store/currency'

const ToastBinder = ({ children }: { children: React.ReactNode }) => {
  const { show } = useToast()
  useEffect(() => {
    bindToast(show)
    return () => unbindToast()
  }, [show])
  return children as any
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ShopProvider>
        <CurrencyProvider>
          <ToastProvider>
            <ToastBinder>
              <App />
            </ToastBinder>
          </ToastProvider>
        </CurrencyProvider>
      </ShopProvider>
    </BrowserRouter>
  </StrictMode>,
)
