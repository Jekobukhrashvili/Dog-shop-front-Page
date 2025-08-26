import styles from './Testimonials.module.css'

const testimonials = [
  { name: 'Maya K.', rating: 5, text: 'Found the perfect cat! Smooth experience and great service.' },
  { name: 'Giorgi N.', rating: 4, text: 'Adopted a friendly dog. Fast process and helpful staff.' },
  { name: 'Ana B.', rating: 5, text: 'Website is easy to use. Love the wishlist and cart features.' },
]

const Stars = ({ count }: { count: number }) => (
  <div className={styles.stars}>{'★'.repeat(count)}{'☆'.repeat(5 - count)}</div>
)

const Testimonials = () => {
  return (
    <div className={styles.section}>
      <div className={styles.grid}>
        {testimonials.map((t, i) => (
          <div key={i} className={styles.card}>
            <Stars count={t.rating} />
            <div className={styles.text}>{t.text}</div>
            <div className={styles.name}>{t.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Testimonials 