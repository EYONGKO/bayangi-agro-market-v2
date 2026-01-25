import { Link } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { MessageCircle, Store, User, PlusSquare, Award } from 'lucide-react';
import { theme } from '../theme/colors';

const shortcuts = [
  { to: '/chat', label: 'Chat', icon: <MessageCircle size={22} /> },
  { to: '/global-market', label: 'Marketplace', icon: <Store size={22} /> },
  { to: '/top-artisans', label: 'Top Artisans', icon: <Award size={22} /> },
  { to: '/add-product', label: 'Add product', icon: <PlusSquare size={22} /> },
  { to: '/account', label: 'Profile', icon: <User size={22} /> },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="h-full p-6 lg:p-8">
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: theme.colors.neutral[900] }}>Dashboard</h1>
        <p className="mt-1 font-medium" style={{ color: theme.colors.neutral[600] }}>Welcome back. Quick links to get started.</p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl">
          {shortcuts.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="flex items-center gap-4 p-4 rounded-2xl transition-all"
              style={{
                background: theme.colors.ui.white,
                borderColor: theme.colors.neutral[200],
                border: `1px solid ${theme.colors.neutral[200]}`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = theme.colors.primary.main;
                e.currentTarget.style.backgroundColor = `${theme.colors.primary.light}40%`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme.colors.neutral[200];
                e.currentTarget.style.backgroundColor = theme.colors.ui.white;
              }}
            >
              <span style={{ color: theme.colors.neutral[500] }}>{s.icon}</span>
              <span className="font-semibold" style={{ color: theme.colors.neutral[800] }}>{s.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
