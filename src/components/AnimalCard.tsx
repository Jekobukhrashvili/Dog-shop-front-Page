import { Link } from 'react-router-dom'
import styles from './AnimalCard.module.css'
import type { Animal } from '../types/animal'
import { useShop } from '../store/shop'
import { useCurrency } from '../store/currency'

interface Props {
  animals: Animal[]
}

const AnimalCard = ({ animals }: Props) => {
  const { wishlistIds, toggleWishlist, addToCart } = useShop()
  const { formatPrice } = useCurrency()

  return (
    <div className={styles.grid}>
      {animals.map((animal) => {
        const wished = wishlistIds.has(animal.id)
        return (
          <div className={styles.card} key={animal.id}>
            <Link to={`/animals/${animal.id}`}>
              <div className={styles.imageWrapper}>
                <img loading="lazy" src={animal.imageUrl} alt={animal.name} className={styles.image} />
              </div>
            </Link>
            <div className={styles.content}>
              <Link to={`/animals/${animal.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                <h3 className={styles.title}>{animal.name}</h3>
              </Link>
              <div className={styles.price}>{formatPrice(animal.price)}</div>
              <div className={styles.actions}>
                <button
                  aria-label="Add to wishlist"
                  className={`${styles.iconButton} ${wished ? styles.iconButtonActive : ''}`}
                  onClick={() => toggleWishlist(animal)}
                >
                  {wished ? '♥' : '♡'}
                </button>
                <button
                  aria-label="Add to cart"
                  className={styles.iconButton}
                  onClick={() => addToCart(animal)}
                >
                  🛒
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default AnimalCard 