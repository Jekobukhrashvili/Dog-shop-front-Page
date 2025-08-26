import client from './client'

export async function fetchUsdToGelRate(): Promise<number> {
  try {
    
    const res = await client.get<any>(`/docs/en/GEL/USD/1`)
    const rate = Number(res?.rate || res?.data?.rate || res?.amount || res?.result)
    if (Number.isFinite(rate) && rate > 0) return rate
    throw new Error('Invalid rate response')
  } catch {
    
    return 2.7
  }
} 