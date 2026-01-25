import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Package, ShoppingBag, MessageSquare, Plus, TrendingUp, Star, Box, BarChart3, User } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { loadProfile } from '../data/profileStore';
import type { Product } from '../context/CartContext';
import { fetchAllProducts, subscribeProductsChanged } from '../api/productsApi';
import { getOrdersBySeller } from '../data/ordersStore';
import { loadThreads } from '../utils/chatStore';

export default function SellerDashboard() {
  const profile = loadProfile();
  const sellerId = profile.sellerId || 'local-artisan';

  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    let mounted = true;
    const loadProducts = () => {
      fetchAllProducts()
        .then((data) => {
          if (mounted) setAllProducts(data);
        })
        .catch(() => {
          if (mounted) setAllProducts([]);
        });
    };
    loadProducts();
    const unsubscribe = subscribeProductsChanged(() => loadProducts());
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const products = useMemo(() => {
    return allProducts.filter((p) => p.sellerId === sellerId);
  }, [allProducts, sellerId]);

  const orders = getOrdersBySeller(sellerId);
  const messages = loadThreads().filter((t) => t.sellerId === sellerId);

  const earnings = orders.reduce((sum, o) => sum + o.total, 0);
  const totalSold = orders.reduce((sum, o) => 
    sum + o.items.reduce((s, i) => s + i.quantity, 0), 0
  );

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-gray-600 text-sm">Welcome, {profile.name}</p>
                      {profile.verifiedSeller ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                          Not Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  to="/add-product"
                  className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </Link>
                <Link
                  to="/account"
                  className="bg-white border border-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  My Account
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard
              icon={DollarSign}
              title="Total Earnings"
              value={`₦${earnings.toLocaleString()}`}
              subtitle="All time revenue"
              gradient="from-green-500 to-emerald-600"
              trend="+12.5%"
            />
            <StatCard
              icon={ShoppingBag}
              title="Orders"
              value={orders.length.toString()}
              subtitle="Total orders"
              gradient="from-blue-500 to-cyan-600"
              trend="+8.2%"
            />
            <StatCard
              icon={Package}
              title="Products"
              value={products.length.toString()}
              subtitle="Active listings"
              gradient="from-purple-500 to-pink-600"
              to="/add-product"
            />
            <StatCard
              icon={MessageSquare}
              title="Messages"
              value={messages.length.toString()}
              subtitle="Customer inquiries"
              gradient="from-orange-500 to-red-600"
              to="/chat"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Performance */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <Box className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Product Performance</h2>
                      <p className="text-sm text-gray-600">Your product analytics</p>
                    </div>
                  </div>
                  <Link
                    to="/add-product"
                    className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    Add New →
                  </Link>
                </div>

                {products.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
                    <p className="text-gray-600 mb-4">Start selling by adding your first product</p>
                    <Link
                      to="/add-product"
                      className="inline-block bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-200"
                    >
                      Add Product
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.map((product) => {
                      const pOrders = orders.filter((o) => o.items.some((i) => i.productId === product.id));
                      const sold = pOrders.reduce(
                        (sum, o) => sum + o.items.filter((i) => i.productId === product.id).reduce((s, i) => s + i.quantity, 0),
                        0
                      );
                      return (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Package className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
                              <p className="text-sm text-gray-600">₦{product.price.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-200">
                            <div className="text-center">
                              <div className="text-xs text-gray-600 mb-1">Sold</div>
                              <div className="font-bold text-gray-900">{sold}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-600 mb-1">Stock</div>
                              <div className="font-bold text-gray-900">{product.stock ?? 'N/A'}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-600 mb-1">Rating</div>
                              <div className="font-bold text-gray-900 flex items-center justify-center gap-1">
                                {product.rating ?? '—'}
                                {product.rating && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6 mt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                      <p className="text-sm text-gray-600">Latest customer orders</p>
                    </div>
                  </div>
                  <Link
                    to="/account/orders"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    View All →
                  </Link>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order.id}
                        className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                              {order.items.length}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{order.id}</div>
                              <div className="text-xs text-gray-600">{order.items.length} items</div>
                            </div>
                          </div>
                          <Badge text={order.status} />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{new Date().toLocaleDateString()}</span>
                          <span className="font-bold text-gray-900">₦{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Analytics & Quick Actions */}
            <div className="space-y-6">
              {/* Performance Overview */}
              <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Performance</h2>
                    <p className="text-sm text-gray-600">Key metrics</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Total Revenue</span>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-xl font-bold text-gray-900">₦{earnings.toLocaleString()}</div>
                    <div className="text-xs text-green-600 font-semibold mt-1">+12.5% from last month</div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Items Sold</span>
                      <Package className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-xl font-bold text-gray-900">{totalSold}</div>
                    <div className="text-xs text-blue-600 font-semibold mt-1">Across all products</div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Avg. Order Value</span>
                      <DollarSign className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="text-xl font-bold text-gray-900">
                      ₦{orders.length > 0 ? Math.round(earnings / orders.length).toLocaleString() : '0'}
                    </div>
                    <div className="text-xs text-purple-600 font-semibold mt-1">Per transaction</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
                    <p className="text-sm text-gray-600">Manage your store</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    to="/add-product"
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Add New Product</span>
                  </Link>
                  <Link
                    to="/account/orders"
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ShoppingBag className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">View All Orders</span>
                  </Link>
                  <Link
                    to="/chat"
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MessageSquare className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Customer Messages</span>
                  </Link>
                  <Link
                    to="/account"
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">My Account</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  gradient,
  trend,
  to
}: {
  icon: any;
  title: string;
  value: string;
  subtitle: string;
  gradient: string;
  trend?: string;
  to?: string;
}) {
  const content = (
    <div className="bg-white rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm font-semibold text-gray-900 mb-1">{title}</div>
      <div className="text-xs text-gray-600">{subtitle}</div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block">
        {content}
      </Link>
    );
  }
  return content;
}

function Badge({ text }: { text: string }) {
  const styles = {
    delivered: 'bg-green-100 text-green-700 border-green-200',
    shipped: 'bg-blue-100 text-blue-700 border-blue-200',
    processing: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    pending: 'bg-orange-100 text-orange-700 border-orange-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[text as keyof typeof styles] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      {text.charAt(0).toUpperCase() + text.slice(1)}
    </span>
  );
}
