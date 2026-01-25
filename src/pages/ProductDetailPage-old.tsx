import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Store, Package, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Sample product data - in a real app, this would come from an API
  const product = {
    id: parseInt(id || '1'),
    name: 'Handwoven Basket',
    price: 15000,
    description: 'Beautiful handwoven basket made from local materials. This exquisite piece showcases traditional craftsmanship and attention to detail.',
    image: 'https://via.placeholder.com/400x300?text=Handwoven+Basket',
    category: 'Crafts',
    community: 'kendem',
    vendor: 'Local Artisan',
    stock: 10,
    rating: 4.5,
    reviews: 12
  };

  const handleAddToCart = () => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/cart');
  };

  return (
    <div>
      {/* Header */}
      <div className="navbar">
        <div className="nav-container">
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={24} />
          </button>
          <h1 style={{ margin: 0, color: '#333' }}>Product Details</h1>
          <button className="cart-button" onClick={() => navigate('/cart')}>
            <ShoppingCart size={24} />
          </button>
        </div>
      </div>

      <div style={{ paddingTop: '80px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
            {/* Product Image */}
            <div>
              <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '15px' }} />
            </div>

            {/* Product Info */}
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>{product.name}</h1>
              <p style={{ color: '#2ecc71', fontSize: '1.2rem', marginBottom: '20px', textTransform: 'capitalize' }}>
                {product.community}
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', marginRight: '15px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      color="#ffc107"
                      fill={star <= product.rating ? "#ffc107" : "none"}
                    />
                  ))}
                </div>
                <span style={{ color: '#666' }}>
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2ecc71', marginBottom: '20px' }}>
                {product.price.toLocaleString()} CFA
              </div>
              
              <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: '1.6', marginBottom: '30px' }}>
                {product.description}
              </p>

              <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <Store size={20} color="#2ecc71" style={{ marginRight: '10px' }} />
                  <span>Vendor: {product.vendor}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <Package size={20} color="#2ecc71" style={{ marginRight: '10px' }} />
                  <span>Category: {product.category}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <CheckCircle size={20} color="#2ecc71" style={{ marginRight: '10px' }} />
                  <span>In Stock: {product.stock} units</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <button
                  onClick={handleAddToCart}
                  style={{
                    flex: 1,
                    background: 'white',
                    color: '#2ecc71',
                    border: '2px solid #2ecc71',
                    padding: '15px',
                    borderRadius: '25px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px'
                  }}
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                
                <button
                  onClick={handleBuyNow}
                  style={{
                    flex: 1,
                    background: '#2ecc71',
                    color: 'white',
                    border: 'none',
                    padding: '15px',
                    borderRadius: '25px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;