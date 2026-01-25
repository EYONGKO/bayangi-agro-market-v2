import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { CartItem, Product } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import PageLayout from '../components/PageLayout';
import { theme } from '../theme/colors';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [savedForLater, setSavedForLater] = useState<CartItem[]>([]);

  const handleRemoveItem = (productId: number, productName: string) => {
    if (window.confirm(`Are you sure you want to remove ${productName} from your cart?`)) {
      removeFromCart(productId);
    }
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId, 'this item');
    } else {
      updateQuantity(productId, quantity);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Add some products first!');
      return;
    }

    navigate('/checkout');
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to remove all items from your cart?')) {
      clearCart();
    }
  };

  const handleSaveForLater = (item: CartItem) => {
    removeFromCart(item.id);
    setSavedForLater(prev => [{ ...item, quantity: 1 }, ...prev]);
  };

  const handleMoveToCart = (item: CartItem) => {
    setSavedForLater(prev => prev.filter(i => !(i.id === item.id && i.community === item.community)));

    const productLike: Product = {
      id: item.id,
      name: item.name,
      price: item.price,
      description: '',
      image: item.image,
      category: 'Others',
      community: item.community,
      vendor: 'Local Vendor',
      likes: item.likes
    };

    addToCart(productLike);
    updateQuantity(item.id, item.quantity);
  };

  const subtotal = getTotalPrice();
  const shipping = useMemo(() => (subtotal >= 50000 ? 0 : 5000), [subtotal]);
  const tax = 0;
  const total = subtotal + shipping + tax;

  return (
    <PageLayout>
      <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${theme.colors.primary.background} 0%, ${theme.colors.primary.light}40% 50%, ${theme.colors.primary.main} 100%)` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6 mb-6" style={{ borderColor: theme.colors.neutral[200], boxShadow: `0 4px 20px ${theme.colors.ui.shadow}` }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)` }}>
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold" style={{ color: theme.colors.neutral[900] }}>Shopping Cart</h1>
                    <p className="text-sm mt-1" style={{ color: theme.colors.neutral[600] }}>
                      {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
                    </p>
                  </div>
                </div>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="bg-white border px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
                  style={{ borderColor: theme.colors.neutral[200], color: theme.colors.neutral[700] }}
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-12 text-center" style={{ borderColor: theme.colors.neutral[200], boxShadow: `0 4px 20px ${theme.colors.ui.shadow}` }}>
              <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${theme.colors.primary.light}40%, ${theme.colors.primary.background})` }}>
                <ShoppingBag className="w-12 h-12" style={{ color: theme.colors.primary.main }} />
              </div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: theme.colors.neutral[900] }}>Your cart is empty</h2>
              <p className="mb-8 max-w-md mx-auto" style={{ color: theme.colors.neutral[600] }}>
                Add some products from our communities to get started shopping
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                style={{ background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)` }}
              >
                <ShoppingBag className="w-5 h-5" />
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6 mb-6" style={{ borderColor: theme.colors.neutral[200], boxShadow: `0 4px 20px ${theme.colors.ui.shadow}` }}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-bold" style={{ color: theme.colors.neutral[900] }}>Your Items</h2>
                      <p className="text-sm mt-1" style={{ color: theme.colors.neutral[600] }}>Review your items and checkout when you're ready</p>
                    </div>
                    <Link
                      to="/"
                      className="text-sm font-semibold transition-colors flex items-center gap-1"
                      style={{ color: theme.colors.primary.main }}
                    >
                      Continue shopping
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={`${item.id}-${item.community}`}
                      className="bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 p-4"
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-24 h-24 flex-shrink-0">
                          <Link to={`/product/${item.id}`} className="block">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full rounded-lg object-cover border border-gray-200"
                            />
                          </Link>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-4 mb-3">
                            <div className="flex-1 min-w-0">
                              <Link
                                to={`/product/${item.id}`}
                                className="block font-bold hover:transition-colors line-clamp-2"
                                style={{ color: theme.colors.neutral[900] }}
                                onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.primary.main}
                                onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.neutral[900]}
                              >
                                {item.name}
                              </Link>
                              <p className="text-sm mt-1" style={{ color: theme.colors.neutral[600] }}>
                                From <span className="font-semibold capitalize" style={{ color: theme.colors.neutral[700] }}>{item.community}</span>
                              </p>
                              <p className="text-sm mt-1" style={{ color: theme.colors.neutral[600] }}>
                                FCFA{item.price.toLocaleString()} each
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold" style={{ color: theme.colors.neutral[900] }}>
                                FCFA{(item.price * item.quantity).toLocaleString()}
                              </div>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center rounded-full" style={{ background: theme.colors.neutral[50], border: `1px solid ${theme.colors.neutral[200]}` }}>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="p-2 rounded-full transition-colors"
                                style={{ background: 'transparent', border: 'none' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = theme.colors.neutral[100]}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                aria-label="Decrease quantity"
                              >
                                <Minus size={16} style={{ color: theme.colors.neutral[700] }} />
                              </button>
                              <span className="px-4 py-2 text-sm font-bold min-w-[3rem] text-center" style={{ color: theme.colors.neutral[900] }}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="p-2 rounded-full transition-colors"
                                style={{ background: 'transparent', border: 'none' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = theme.colors.neutral[100]}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                aria-label="Increase quantity"
                              >
                                <Plus size={16} style={{ color: theme.colors.neutral[700] }} />
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleWishlist(item.id)}
                                className="p-2 rounded-lg transition-colors hover:bg-gray-50"
                                aria-label={isWishlisted(item.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                              >
                                <Heart
                                  size={18}
                                  className={isWishlisted(item.id) ? 'text-red-500 fill-red-500' : 'text-gray-600'}
                                />
                              </button>
                              <button
                                onClick={() => handleSaveForLater(item)}
                                className="text-sm font-semibold text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                Save for later
                              </button>
                              <button
                                onClick={() => handleRemoveItem(item.id, item.name)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                aria-label="Remove item"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Saved for Later */}
                {savedForLater.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 mt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Saved for Later</h3>
                    <div className="space-y-3">
                      {savedForLater.map(item => (
                        <div
                          key={`saved-${item.id}-${item.community}`}
                          className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-gray-900 truncate">{item.name}</div>
                            <div className="text-sm text-gray-600 mt-1">₦{item.price.toLocaleString()}</div>
                          </div>
                          <button
                            onClick={() => handleMoveToCart(item)}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 text-sm whitespace-nowrap"
                          >
                            Move to cart
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="lg:sticky lg:top-6 h-fit">
                <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6 mb-4" style={{ borderColor: theme.colors.neutral[200], boxShadow: `0 4px 20px ${theme.colors.ui.shadow}` }}>
                  <h3 className="text-lg font-bold mb-4" style={{ color: theme.colors.neutral[900] }}>Order Summary</h3>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: theme.colors.neutral[600] }}>Subtotal</span>
                      <span className="font-bold" style={{ color: theme.colors.neutral[900] }}>{subtotal.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: theme.colors.neutral[600] }}>Shipping</span>
                      <span className="font-bold" style={{ color: theme.colors.neutral[900] }}>
                        {shipping === 0 ? 'Free' : `${shipping.toLocaleString()} FCFA`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: theme.colors.neutral[600] }}>Tax</span>
                      <span className="font-bold" style={{ color: theme.colors.neutral[900] }}>{tax.toLocaleString()} FCFA</span>
                    </div>
                  </div>

                  <div className="pt-4 mb-4" style={{ borderTop: `1px solid ${theme.colors.neutral[200]}` }}>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold" style={{ color: theme.colors.neutral[900] }}>Total</span>
                      <span className="text-xl font-bold" style={{ color: theme.colors.neutral[900] }}>{total.toLocaleString()} FCFA</span>
                    </div>
                  </div>

                  <div className="text-xs rounded-lg p-3" style={{ color: theme.colors.neutral[600], background: `${theme.colors.primary.light}40%`, border: `1px solid ${theme.colors.primary.light}60%` }}>
                    <span className="font-semibold">💡 Free shipping</span> on orders 50,000 FCFA+
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full px-6 py-4 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`,
                    color: theme.colors.ui.white
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${theme.colors.primary.dark} 0%, ${theme.colors.primary.main} 100%)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`;
                  }}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default CartPage;
