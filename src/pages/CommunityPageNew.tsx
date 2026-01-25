import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Star, Package, Globe, Store, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import type { Product } from '../context/CartContext';
import { fetchAllProducts, subscribeProductsChanged } from '../api/productsApi';
import ProductMiniCard from '../components/globalMarket/ProductMiniCard';

const CommunityPageNew = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  
  const [activeNav, setActiveNav] = useState('community');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const communityName = id ? id.charAt(0).toUpperCase() + id.slice(1) : 'Community';

  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const loadProducts = () => {
    let mounted = true;
    fetchAllProducts()
      .then((data) => {
        if (mounted) setAllProducts(data);
      })
      .catch(() => {
        if (mounted) setAllProducts([]);
      });
    return () => {
      mounted = false;
    };
  };

  useEffect(() => {
    const cleanupLoad = loadProducts();
    const unsubscribe = subscribeProductsChanged(() => {
      loadProducts();
    });
    return () => {
      cleanupLoad();
      unsubscribe();
    };
  }, []);

  const communityProducts = useMemo(() => {
    const all = allProducts;
    // Filter by community if id is present, otherwise show some defaults or all
    if (id) {
        // Case insensitive comparison for community
        const filtered = all.filter(p => p.community.toLowerCase() === id.toLowerCase());
        return filtered.length > 0 ? filtered : all.slice(0, 4); // Fallback to some products if none found
    }
    return all.slice(0, 4);
  }, [allProducts, id]);

  const handleNavClick = (navItem: string) => {
    setActiveNav(navItem);
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Navigation Bar */}
      <nav style={{
        background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
        padding: '15px 20px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Logo */}
          <div style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: 'white',
            letterSpacing: '-0.5px'
          }}>
            <Link to="/" style={{ 
              color: 'white', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Globe size={28} />
              Local Roots - {communityName}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            alignItems: 'center' 
          }} className="desktop-nav">
            <button 
              onClick={() => {
                handleNavClick('community');
                scrollToSection('community-section');
              }}
              style={{ 
                color: 'white', 
                background: activeNav === 'community' ? 'rgba(255,255,255,0.25)' : 'transparent',
                border: activeNav === 'community' ? '2px solid rgba(255,255,255,0.4)' : '2px solid transparent',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: activeNav === 'community' ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Community
            </button>
            <button 
              onClick={() => {
                handleNavClick('global-market');
                scrollToSection('global-market-section');
              }}
              style={{ 
                color: 'white', 
                background: activeNav === 'global-market' ? 'rgba(255,255,255,0.25)' : 'transparent',
                border: activeNav === 'global-market' ? '2px solid rgba(255,255,255,0.4)' : '2px solid transparent',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: activeNav === 'global-market' ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Global Market
            </button>
            <button 
              onClick={() => {
                handleNavClick('top-vendors');
                scrollToSection('top-vendors-section');
              }}
              style={{ 
                color: 'white', 
                background: activeNav === 'top-vendors' ? 'rgba(255,255,255,0.25)' : 'transparent',
                border: activeNav === 'top-vendors' ? '2px solid rgba(255,255,255,0.4)' : '2px solid transparent',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: activeNav === 'top-vendors' ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Top Market Vendors
            </button>
          </div>

          {/* Icons and Mobile Menu */}
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            alignItems: 'center' 
          }}>
            {/* Search Icon */}
            <button style={{
              background: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            {/* Cart Icon */}
            <Link to="/cart" style={{
              background: 'rgba(255,255,255,0.3)',
              border: '2px solid rgba(255,255,255,0.5)',
              borderRadius: '8px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.3s ease',
              textDecoration: 'none'
            }}>
              <ShoppingCart size={20} color="white" />
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: '#e74c3c',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '10px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(231, 76, 60, 0.4)'
              }}>0</span>
            </Link>

            {/* Mobile Menu Button */}
            <button 
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '6px',
                padding: '8px',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div style={{
            position: 'fixed',
            top: '70px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999
          }}
          onClick={() => setIsMobileMenuOpen(false)}>
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '280px',
              height: '100%',
              background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
              padding: '20px',
              boxShadow: '-4px 0 20px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <button 
                  onClick={() => {
                    handleNavClick('community');
                    scrollToSection('community-section');
                    setIsMobileMenuOpen(false);
                  }}
                  style={{ 
                    color: 'white', 
                    background: activeNav === 'community' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                    border: activeNav === 'community' ? '2px solid rgba(255,255,255,0.4)' : '2px solid transparent',
                    padding: '12px 16px',
                    borderRadius: '20px',
                    fontSize: '16px',
                    fontWeight: activeNav === 'community' ? '600' : '500',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  Community
                </button>
                <button 
                  onClick={() => {
                    handleNavClick('global-market');
                    scrollToSection('global-market-section');
                    setIsMobileMenuOpen(false);
                  }}
                  style={{ 
                    color: 'white', 
                    background: activeNav === 'global-market' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                    border: activeNav === 'global-market' ? '2px solid rgba(255,255,255,0.4)' : '2px solid transparent',
                    padding: '12px 16px',
                    borderRadius: '20px',
                    fontSize: '16px',
                    fontWeight: activeNav === 'global-market' ? '600' : '500',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  Global Market
                </button>
                <button 
                  onClick={() => {
                    handleNavClick('top-vendors');
                    scrollToSection('top-vendors-section');
                    setIsMobileMenuOpen(false);
                  }}
                  style={{ 
                    color: 'white', 
                    background: activeNav === 'top-vendors' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                    border: activeNav === 'top-vendors' ? '2px solid rgba(255,255,255,0.4)' : '2px solid transparent',
                    padding: '12px 16px',
                    borderRadius: '20px',
                    fontSize: '16px',
                    fontWeight: activeNav === 'top-vendors' ? '600' : '500',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  Top Market Vendors
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div style={{ paddingTop: '80px' }}>
        {/* Community Section */}
        <section id="community-section" style={{ 
          padding: '60px 20px', 
          background: '#ffffff',
          minHeight: '500px'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              textAlign: 'center',
              marginBottom: '40px',
              color: '#2c3e50',
              fontWeight: '700'
            }}>
              {communityName} Community
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px',
              marginTop: '40px'
            }}>
              {/* Community Features */}
              <div style={{
                background: '#f8f9fa',
                padding: '30px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}>
                <Store size={48} color="#2ecc71" style={{ marginBottom: '20px' }} />
                <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>Local Vendors</h3>
                <p style={{ color: '#6c757d', lineHeight: '1.6' }}>
                  Connect with authentic local vendors selling traditional products and crafts.
                </p>
              </div>
              <div style={{
                background: '#f8f9fa',
                padding: '30px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}>
                <Package size={48} color="#2ecc71" style={{ marginBottom: '20px' }} />
                <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>Fresh Products</h3>
                <p style={{ color: '#6c757d', lineHeight: '1.6' }}>
                  Discover fresh, locally-sourced products directly from community farmers.
                </p>
              </div>
              <div style={{
                background: '#f8f9fa',
                padding: '30px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}>
                <Star size={48} color="#2ecc71" style={{ marginBottom: '20px' }} />
                <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>Quality Assured</h3>
                <p style={{ color: '#6c757d', lineHeight: '1.6' }}>
                  All products are quality-checked and rated by community members.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Global Market Section */}
        <section id="global-market-section" style={{ 
          padding: '60px 20px', 
          background: '#e6f2e6',
          minHeight: '500px'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              textAlign: 'center',
              marginBottom: '40px',
              color: '#2c3e50',
              fontWeight: '700'
            }}>
              Global Market
            </h2>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              textAlign: 'center',
              color: '#6c757d',
              marginBottom: '40px',
              maxWidth: '800px',
              margin: '0 auto 40px',
              lineHeight: '1.6'
            }}>
              Explore products from {communityName} that are available for global shipping
            </p>
            {/* Global Market Content */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '25px'
            }}>
              {/* Community Products */}
              {communityProducts.map((product) => (
                <ProductMiniCard
                  key={product.id}
                  product={product}
                  isWishlisted={isWishlisted(product.id)}
                  onToggleWishlist={() => toggleWishlist(product.id)}
                  onAddToCart={() => addToCart(product)}
                  style={{ width: '100%' }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Top Market Vendors Section */}
        <section id="top-vendors-section" style={{ 
          padding: '60px 20px', 
          background: '#ffffff',
          minHeight: '500px'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              textAlign: 'center',
              marginBottom: '40px',
              color: '#2c3e50',
              fontWeight: '700'
            }}>
              Top Market Vendors
            </h2>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              textAlign: 'center',
              color: '#6c757d',
              marginBottom: '40px',
              maxWidth: '800px',
              margin: '0 auto 40px',
              lineHeight: '1.6'
            }}>
              Meet the top-rated vendors from {communityName} community
            </p>
            {/* Top Vendors Content */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px'
            }}>
              {/* Sample Top Vendors */}
              {[1, 2, 3].map((vendor) => (
                <div key={vendor} style={{
                  background: '#f8f9fa',
                  padding: '30px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #2ecc71, #27ae60)',
                    margin: '0 auto 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: '700'
                  }}>
                    V{vendor}
                  </div>
                  <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Vendor Name {vendor}</h3>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} color="#ffc107" fill="#ffc107" />
                    ))}
                  </div>
                  <p style={{ color: '#6c757d', lineHeight: '1.6', marginBottom: '20px' }}>
                    Specializing in traditional crafts and local produce with over 10 years of experience.
                  </p>
                  <button style={{
                    background: '#2ecc71',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    View Products
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

    </div>
  );
};

export default CommunityPageNew;
