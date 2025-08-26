import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Animal } from '../types/animal'

export interface CartItem {
  animal: Animal
  quantity: number
}

interface ShopState {
  wishlistIds: Set<string>
  cartItems: Map<string, CartItem>
  toggleWishlist: (animal: Animal) => void
  addToCart: (animal: Animal) => void
  increment: (id: string) => void
  decrement: (id: string) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  totals: {
    itemCount: number
    subtotal: number
  }
}

const WISHLIST_KEY = 'petshop.wishlist'
const CART_KEY = 'petshop.cart'

const ShopContext = createContext<ShopState | undefined>(undefined)

export const ShopProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(() => {
    try {
      const wl = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]') as string[]
      return new Set(wl)
    } catch {
      return new Set()
    }
  })

  const [cartItems, setCartItems] = useState<Map<string, CartItem>>(() => {
    try {
      const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]') as { animal: Animal; quantity: number }[]
      return new Map(cart.map(c => [c.animal.id, c]))
    } catch {
      return new Map()
    }
  })

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(Array.from(wishlistIds)))
  }, [wishlistIds])

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(Array.from(cartItems.values())))
  }, [cartItems])

  const toggleWishlist = (animal: Animal) => {
    setWishlistIds(prev => {
      const next = new Set(prev)
      if (next.has(animal.id)) next.delete(animal.id)
      else next.add(animal.id)
      return next
    })
  }

  const addToCart = (animal: Animal) => {
    setCartItems(prev => {
      const next = new Map(prev)
      const existing = next.get(animal.id)
      if (existing) existing.quantity += 1
      else next.set(animal.id, { animal, quantity: 1 })
      return next
    })
  }

  const increment = (id: string) => {
    setCartItems(prev => {
      const next = new Map(prev)
      const item = next.get(id)
      if (item) item.quantity += 1
      return next
    })
  }

  const decrement = (id: string) => {
    setCartItems(prev => {
      const next = new Map(prev)
      const item = next.get(id)
      if (!item) return next
      item.quantity -= 1
      if (item.quantity <= 0) next.delete(id)
      return next
    })
  }

  const removeFromCart = (id: string) => {
    setCartItems(prev => {
      const next = new Map(prev)
      next.delete(id)
      return next
    })
  }

  const clearCart = () => {
    setCartItems(new Map())
  }

  const totals = useMemo(() => {
    let count = 0
    let sum = 0
    cartItems.forEach(({ animal, quantity }) => {
      count += quantity
      sum += animal.price * quantity
    })
    return { itemCount: count, subtotal: sum }
  }, [cartItems])

  const value: ShopState = {
    wishlistIds,
    cartItems,
    toggleWishlist,
    addToCart,
    increment,
    decrement,
    removeFromCart,
    clearCart,
    totals,
  }

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export const useShop = () => {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used within ShopProvider')
  return ctx
} 