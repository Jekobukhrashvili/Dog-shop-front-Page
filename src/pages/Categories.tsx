import { useEffect, useState } from 'react'
import CategoryCard from '../components/CategoryCard'
import { fetchCategories, type Category } from '../api/animals'

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error)
  }, [])

  return (
    <div>
      <h1 style={{ padding: 16, margin: 0 }}>Categories</h1>
      <CategoryCard categories={categories} />
    </div>
  )
}

export default Categories 