import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import HomePage from './pages/HomePage-simple';
import CommunityPage from './pages/CommunityPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AddProductPage from './pages/AddProductPage';
import GlobalMarketPage from './pages/GlobalMarketPage';
import TopArtisansPage from './pages/TopArtisansPage';
import './App.css';

function AppLocalRoots() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/community/:id" element={<CommunityPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/add-product" element={<AddProductPage />} />
            <Route path="/global-market" element={<GlobalMarketPage />} />
            <Route path="/top-artisans" element={<TopArtisansPage />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default AppLocalRoots;