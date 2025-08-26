import { Link } from 'react-router-dom'
import styles from './CategoryCard.module.css'
import type { Category } from '../api/animals'

interface Props {
  categories: Category[]
}

const CategoryCard = ({ categories }: Props) => {
  return (
    <div className={styles.grid}>
      {categories.map((category) => (
        <Link
          key={category.key}
          to={`/categories/${category.key}`}
          className={styles.card}
        >
          <img loading="lazy" src={category.imageUrl} alt={category.title} className={styles.image} />
          <div className={styles.label}>{category.title}</div>
        </Link>
      ))}
    </div>
  )
}

export default CategoryCard 