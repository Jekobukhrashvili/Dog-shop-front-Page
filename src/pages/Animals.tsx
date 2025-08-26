import { useEffect, useState } from 'react'
import { fetchAllAnimals } from '../api/animals'
import type { Animal } from '../types/animal'
import AnimalCard from '../components/AnimalCard'

const Animals = () => {
  const [animals, setAnimals] = useState<Animal[]>([])

  useEffect(() => {
    fetchAllAnimals().then(setAnimals).catch(console.error)
  }, [])

  return (
    <div>
      <h1 style={{ padding: 16, margin: 0 }}>Animals</h1>
      <AnimalCard animals={animals} />
    </div>
  )
}

export default Animals 