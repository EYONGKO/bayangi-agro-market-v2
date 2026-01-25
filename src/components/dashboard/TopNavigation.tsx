import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function TopNavigation() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/85 backdrop-blur border-b border-slate-200 z-50">
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-extrabold text-sm">LR</span>
          </div>
          <div className="leading-tight">
            <div className="text-base font-extrabold text-slate-900">Local Roots</div>
            <div className="hidden sm:block text-xs font-semibold text-slate-500">Dashboard</div>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors" aria-label="Notifications">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors" aria-label="Settings">
                <Settings className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  signOut();
                  navigate('/');
                }}
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <Link
                to="/account"
                className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <div className="w-9 h-9 bg-emerald-50 ring-1 ring-emerald-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-emerald-700" />
                </div>
                <span className="hidden sm:inline font-semibold text-sm">{currentUser?.name || 'Profile'}</span>
              </Link>
            </>
          ) : (
            <Link
              to="/auth"
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
