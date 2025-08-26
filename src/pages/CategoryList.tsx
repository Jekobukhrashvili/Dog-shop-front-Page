import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchAnimalsByType } from '../api/animals'
import type { Animal, AnimalType } from '../types/animal'
import AnimalCard from '../components/AnimalCard'

const CategoryList = () => {
  const params = useParams()
  const type = (params.type as AnimalType) || 'cats'
  const [animals, setAnimals] = useState<Animal[]>([])

  useEffect(() => {
    fetchAnimalsByType(type)
      .then(setAnimals)
      .catch(console.error)
  }, [type])

  return (
    <div>
      <h1 style={{ padding: 16, margin: 0 }}>{type.charAt(0).toUpperCase() + type.slice(1)}</h1>
      <AnimalCard animals={animals} />
    </div>
  )
}

export default CategoryList 