import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import { Suspense, lazy } from 'react'

const Home = lazy(() => import('./pages/Home'))
const Animals = lazy(() => import('./pages/Animals'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Cart = lazy(() => import('./pages/Cart'))
const Categories = lazy(() => import('./pages/Categories'))
const CategoryList = lazy(() => import('./pages/CategoryList'))
const AnimalDetail = lazy(() => import('./pages/AnimalDetail'))

const App = () => {
  return (
    <div>
      <Navbar />
      <Suspense fallback={<div style={{ padding: 16 }}>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/animals" element={<Animals />} />
          <Route path="/animals/:id" element={<AnimalDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:type" element={<CategoryList />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App