import { useEffect, useState } from 'react'
import CategoryCard from '../components/CategoryCard'
import { fetchCategories, type Category } from '../api/animals'
import Testimonials from '../components/Testimonials'

const Home = () => {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error)
  }, [])

  return (
    <div>
      <section>
        <h1 style={{ padding: 16, margin: 0 }}>Explore by Category</h1>
        <CategoryCard categories={categories} />
      </section>
      <section>
        <h2 style={{ padding: 16, margin: 0 }}>What our customers say</h2>
        <Testimonials />
      </section>
    </div>
  )
}

export default Home 