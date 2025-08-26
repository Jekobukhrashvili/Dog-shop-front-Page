import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchAnimalById } from '../api/animals'
import type { Animal } from '../types/animal'
import { useShop } from '../store/shop'
import { useCurrency } from '../store/currency'

const AnimalDetail = () => {
  const { id } = useParams()
  const [animal, setAnimal] = useState<Animal | null>(null)
  const { addToCart, wishlistIds, toggleWishlist } = useShop()
  const { formatPrice } = useCurrency()

  useEffect(() => {
    if (!id) return
    fetchAnimalById(id).then(setAnimal).catch(console.error)
  }, [id])

  if (!animal) {
    return <div style={{ padding: 16 }}>Loading...</div>
  }

  const wished = wishlistIds.has(animal.id)

  return (
    <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <img src={animal.imageUrl} alt={animal.name} style={{ width: '100%', borderRadius: 12 }} />
      </div>
      <div>
        <h1 style={{ marginTop: 0 }}>{animal.name}</h1>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{formatPrice(animal.price)}</div>
        <p>{animal.description}</p>
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button onClick={() => addToCart(animal)}>Add to cart 🛒</button>
          <button onClick={() => toggleWishlist(animal)}>{wished ? '♥ In wishlist' : '♡ Add to wishlist'}</button>
        </div>
      </div>
    </div>
  )
}

export default AnimalDetail 