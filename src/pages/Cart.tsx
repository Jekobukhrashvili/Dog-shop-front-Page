import { useShop } from '../store/shop'
import { purchase } from '../api/animals'
import { useState } from 'react'
import { useCurrency } from '../store/currency'

const rowStyle = { display: 'grid', gridTemplateColumns: '80px 1fr auto auto auto', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #eee' }

const Cart = () => {
  const { cartItems, totals, increment, decrement, removeFromCart, clearCart } = useShop()
  const { formatPrice } = useCurrency()
  const items = Array.from(cartItems.values())
  const [buying, setBuying] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const onBuyNow = async () => {
    try {
      setBuying(true)
      setMessage(null)
      const payload = items.map(({ animal, quantity }) => ({ id: animal.id, quantity }))
      await purchase(payload)
      clearCart()
      setMessage('Purchase successful!')
    } catch (e: any) {
      setMessage(e?.message || 'Purchase failed')
    } finally {
      setBuying(false)
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ marginTop: 0 }}>Cart</h1>
      {items.length === 0 ? (
        <div>No items in cart.</div>
      ) : (
        <div>
          {items.map(({ animal, quantity }) => (
            <div key={animal.id} style={rowStyle}>
              <img src={animal.imageUrl} alt={animal.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
              <div>
                <div style={{ fontWeight: 600 }}>{animal.name}</div>
                <div style={{ color: '#555' }}>{formatPrice(animal.price)} each</div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button onClick={() => decrement(animal.id)} disabled={buying}>-</button>
                <span>{quantity}</span>
                <button onClick={() => increment(animal.id)} disabled={buying}>+</button>
              </div>
              <div style={{ fontWeight: 600 }}>{formatPrice(animal.price * quantity)}</div>
              <button onClick={() => removeFromCart(animal.id)} disabled={buying}>Remove</button>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Total: {formatPrice(totals.subtotal)}</div>
            <button onClick={onBuyNow} disabled={buying}>
              {buying ? 'Processing...' : 'Buy Now'}
            </button>
          </div>
          {message && <div style={{ marginTop: 12 }}>{message}</div>}
        </div>
      )}
    </div>
  )
}

export default Cart 