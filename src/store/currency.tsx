import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { fetchUsdToGelRate } from '../api/exchange'

export type Currency = 'USD' | 'GEL'

interface CurrencyState {
  currency: Currency
  rateUsdToGel: number
  toggleCurrency: () => void
  formatPrice: (usdAmount: number) => string
}

const CURRENCY_KEY = 'petshop.currency'

const CurrencyContext = createContext<CurrencyState | undefined>(undefined)

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = (localStorage.getItem(CURRENCY_KEY) as Currency | null) || 'USD'
    return saved === 'GEL' ? 'GEL' : 'USD'
  })
  const [rateUsdToGel, setRateUsdToGel] = useState<number>(2.7)

  useEffect(() => {
    fetchUsdToGelRate().then(setRateUsdToGel).catch(() => {})
  }, [])

  useEffect(() => {
    localStorage.setItem(CURRENCY_KEY, currency)
  }, [currency])

  const toggleCurrency = () => setCurrency(prev => (prev === 'USD' ? 'GEL' : 'USD'))

  const formatPrice = (usdAmount: number) => {
    if (currency === 'USD') return `$${usdAmount.toFixed(2)}`
    const gel = usdAmount * rateUsdToGel
    return `${gel.toFixed(2)} GEL`
  }

  const value = useMemo<CurrencyState>(() => ({ currency, rateUsdToGel, toggleCurrency, formatPrice }), [currency, rateUsdToGel])

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider')
  return ctx
} 