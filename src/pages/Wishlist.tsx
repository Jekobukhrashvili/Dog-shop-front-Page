import { useEffect, useMemo, useState } from 'react'
import { useShop } from '../store/shop'
import AnimalCard from '../components/AnimalCard'
import { fetchAllAnimals } from '../api/animals'
import type { Animal } from '../types/animal'

const Wishlist = () => {
  const { wishlistIds } = useShop()
  const [allAnimals, setAllAnimals] = useState<Animal[]>([])

  useEffect(() => {
    fetchAllAnimals().then(setAllAnimals).catch(console.error)
  }, [])

  const animals = useMemo(
    () => allAnimals.filter((a) => wishlistIds.has(a.id)),
    [allAnimals, wishlistIds]
  )

  return (
    <div>
      <h1 style={{ padding: 16, margin: 0 }}>Wishlist</h1>
      {animals.length === 0 ? (
        <div style={{ padding: 16 }}>No items in wishlist.</div>
      ) : (
        <AnimalCard animals={animals} />
      )}
    </div>
  )
}

export default Wishlist 