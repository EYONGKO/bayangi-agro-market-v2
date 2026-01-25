import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, MessageSquare, User, Store, TrendingUp, Package, CreditCard, Settings } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { loadProfile } from '../data/profileStore';
import { getAllOrders } from '../data/ordersStore';
import { loadThreads } from '../utils/chatStore';
import { useWishlist } from '../context/WishlistContext';
import { theme } from '../theme/colors';

export default function AccountDashboard() {
  const profile = loadProfile();
  const orders = getAllOrders();
  const threads = loadThreads();
  const { wishlistIds } = useWishlist();

  const recentOrders = orders.slice(0, 3);
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <PageLayout>
      <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${theme.colors.primary.background} 0%, ${theme.colors.primary.light}40% 50%, ${theme.colors.primary.main} 100%)` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6 mb-6" style={{ borderColor: theme.colors.neutral[200], boxShadow: `0 4px 20px ${theme.colors.ui.shadow}` }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)` }}>
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold" style={{ color: theme.colors.neutral[900] }}>Welcome back, {profile.name}!</h1>
                    <p className="text-sm" style={{ color: theme.colors.neutral[600] }}>Manage your account and track your orders</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  to="/seller"
                  className="text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
                  style={{ background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)` }}
                >
                  <Store className="w-4 h-4" />
                  Seller Dashboard
                </Link>
                <Link
                  to="/chat"
                  className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
                  style={{ background: theme.colors.ui.white, borderColor: theme.colors.neutral[200], color: theme.colors.neutral[900], border: `1px solid ${theme.colors.neutral[200]}` }}
                >
                  <MessageSquare className="w-4 h-4" />
                  Messages
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard
              icon={ShoppingBag}
              title="Total Orders"
              value={orders.length.toString()}
              subtitle="All time"
              to="/account/orders"
              gradient="from-green-600 to-green-800"
            />
            <StatCard
              icon={Heart}
              title="Wishlist"
              value={wishlistIds.length.toString()}
              subtitle="Saved items"
              to="/wishlist"
              gradient="from-green-500 to-green-700"
            />
            <StatCard
              icon={MessageSquare}
              title="Messages"
              value={threads.length.toString()}
              subtitle="Active chats"
              to="/chat"
              gradient="from-green-400 to-green-600"
            />
            <StatCard
              icon={CreditCard}
              title="Total Spent"
              value={`FCFA${totalSpent.toLocaleString()}`}
              subtitle="All time"
              gradient="from-green-700 to-green-900"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6" style={{ borderColor: theme.colors.neutral[200], boxShadow: `0 4px 20px ${theme.colors.ui.shadow}` }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)` }}>
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold" style={{ color: theme.colors.neutral[900] }}>Recent Orders</h2>
                      <p className="text-sm" style={{ color: theme.colors.neutral[600] }}>Your latest purchases</p>
                    </div>
                  </div>
                  <Link
                    to="/account/orders"
                    className="text-sm font-semibold transition-colors"
                    style={{ color: theme.colors.primary.main }}
                  >
                    View All →
                  </Link>
                </div>

                {recentOrders.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                    <p style={{ color: theme.colors.neutral[600] }} className="mb-4">Start shopping to see your orders here</p>
                    <Link
                      to="/"
                      className="inline-block text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200"
                      style={{ background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)` }}
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="border rounded-xl p-4 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                        style={{ background: `linear-gradient(to bottom right, ${theme.colors.ui.white}, ${theme.colors.neutral[50]})`, borderColor: theme.colors.neutral[200] }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)` }}>
                              {order.items.length}
                            </div>
                            <div>
                              <div className="font-bold" style={{ color: theme.colors.neutral[900] }}>{order.id}</div>
                              <div className="text-sm" style={{ color: theme.colors.neutral[600] }}>{order.items.length} items</div>
                            </div>
                          </div>
                          <Badge text={order.status} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm" style={{ color: theme.colors.neutral[600] }}>
                            {new Date().toLocaleDateString()}
                          </div>
                          <div className="font-bold" style={{ color: theme.colors.neutral[900] }}>FCFA{order.total.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Profile & Quick Actions */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6" style={{ borderColor: theme.colors.neutral[200], boxShadow: `0 4px 20px ${theme.colors.ui.shadow}` }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)` }}>
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: theme.colors.neutral[900] }}>Profile</h2>
                    <p className="text-sm" style={{ color: theme.colors.neutral[600] }}>Your account info</p>
                  </div>
                </div>

                <div className="border rounded-xl p-4 mb-4" style={{ background: `linear-gradient(to bottom right, ${theme.colors.neutral[50]}, ${theme.colors.ui.white})`, borderColor: theme.colors.neutral[200] }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)` }}>
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold" style={{ color: theme.colors.neutral[900] }}>{profile.name}</div>
                      <div className="text-sm" style={{ color: theme.colors.neutral[600] }}>{profile.email}</div>
                    </div>
                  </div>
                  {profile.phone && (
                    <div className="text-sm" style={{ color: theme.colors.neutral[600] }} className="mb-3">
                      📱 {profile.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    {profile.verifiedSeller ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: `${theme.colors.primary.light}40%`, color: theme.colors.primary.main }}>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.colors.primary.main }}></div>
                        Verified Seller
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: `${theme.colors.neutral[200]}`, color: theme.colors.neutral[700] }}>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.colors.neutral[500] }}></div>
                        Not Verified
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  to="/account/profile"
                  className="block w-full text-center text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  style={{ background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)` }}
                >
                  Edit Profile
                </Link>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6" style={{ borderColor: theme.colors.neutral[200], boxShadow: `0 4px 20px ${theme.colors.ui.shadow}` }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)` }}>
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: theme.colors.neutral[900] }}>Quick Actions</h2>
                    <p className="text-sm" style={{ color: theme.colors.neutral[600] }}>Shortcuts</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    to="/cart"
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ShoppingBag className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">View Cart</span>
                  </Link>
                  <Link
                    to="/wishlist"
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Heart className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Wishlist</span>
                  </Link>
                  <Link
                    to="/account/orders"
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Package className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">All Orders</span>
                  </Link>
                  <Link
                    to="/"
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <TrendingUp className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Browse Products</span>
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
  to,
  gradient
}: {
  icon: any;
  title: string;
  value: string;
  subtitle: string;
  to?: string;
  gradient: string;
}) {
  const content = (
    <div className="bg-white rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
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
