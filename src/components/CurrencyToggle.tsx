import { useCurrency } from '../store/currency'
import styles from './CurrencyToggle.module.css'

const CurrencyToggle = () => {
  const { currency, toggleCurrency } = useCurrency()
  return (
    <button className={styles.button} onClick={toggleCurrency}>
      {currency === 'USD' ? 'Show GEL' : 'Show USD'}
    </button>
  )
}

export default CurrencyToggle 