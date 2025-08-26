import { Link, NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'
import CurrencyToggle from './CurrencyToggle'

const Navbar = () => {
  return (
    <nav className={styles.container}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <img src="/logo.svg" alt="PetShop" width={20} height={20} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          PetShop
        </Link>
        <ul className={styles.navList}>
          <li>
            <NavLink to="/animals" className={styles.navLink}>
              Animals
            </NavLink>
          </li>
          <li>
            <NavLink to="/wishlist" className={styles.navLink}>
              Wishlist
            </NavLink>
          </li>
          <li>
            <NavLink to="/cart" className={styles.navLink}>
              Cart
            </NavLink>
          </li>
          <li>
            <NavLink to="/categories" className={styles.navLink}>
              Categories
            </NavLink>
          </li>
        </ul>
        <div className={styles.actions}>
          <CurrencyToggle />
        </div>
      </div>
    </nav>
  )
}

export default Navbar 