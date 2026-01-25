import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PageLayout from '../components/PageLayout';

export default function AuthPage() {
  const { register, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { redirectTo?: string })?.redirectTo || '/account';
  const needSeller = (location.state as { needSeller?: boolean })?.needSeller || false;

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [staySigned, setStaySigned] = useState(true);
  const [role, setRole] = useState<'buyer' | 'seller' | 'both'>(needSeller ? 'seller' : 'buyer');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      if (mode === 'register') {
        await register({ name: name || 'User', email, password, role });
      } else {
        await signIn({ email, password });
      }
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout showCategoryNav={false}>
      <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 160px)', display: 'flex', justifyContent: 'center', padding: '32px 16px' }}>
        <div
          style={{
            width: 'min(720px, 100%)',
            background: '#ffffff',
            borderRadius: '18px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 16px 40px rgba(0,0,0,0.08)',
            display: 'grid',
            gridTemplateColumns: '1fr',
            overflow: 'hidden'
          }}
        >
          <div style={{ padding: '22px 22px 10px' }}>
            <div style={{ fontSize: '24px', fontWeight: 950, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Welcome back
            </div>
            <div style={{ marginTop: '6px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
              Sign in to continue, or create an account to start buying and selling.
            </div>

            <div
              style={{
                marginTop: '14px',
                display: 'flex',
                gap: '8px',
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '6px'
              }}
            >
              <button
                type="button"
                onClick={() => setMode('signin')}
                style={{
                  flex: 1,
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  fontWeight: 900,
                  background: mode === 'signin' ? '#ffffff' : 'transparent',
                  color: mode === 'signin' ? '#0f172a' : '#475569',
                  boxShadow: mode === 'signin' ? '0 8px 20px rgba(2,6,23,0.08)' : 'none'
                }}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                style={{
                  flex: 1,
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  fontWeight: 900,
                  background: mode === 'register' ? '#ffffff' : 'transparent',
                  color: mode === 'register' ? '#0f172a' : '#475569',
                  boxShadow: mode === 'register' ? '0 8px 20px rgba(2,6,23,0.08)' : 'none'
                }}
              >
                Register
              </button>
            </div>
          </div>

          <div style={{ padding: '0 22px 22px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {mode === 'register' && (
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', color: '#111827', marginBottom: '6px' }}>Name</label>
                  <div style={inputWrapStyle}>
                    <span style={inputIconStyle}>
                      <User2 size={16} />
                    </span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Your name"
                      style={inputStyle}
                    />
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', color: '#111827', marginBottom: '6px' }}>Email address</label>
                <div style={inputWrapStyle}>
                  <span style={inputIconStyle}>
                    <Mail size={16} />
                  </span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                    placeholder="you@example.com"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', color: '#111827', marginBottom: '6px' }}>Password</label>
                <div style={inputWrapStyle}>
                  <span style={inputIconStyle}>
                    <Lock size={16} />
                  </span>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      background: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#0f172a'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', color: '#111827', marginBottom: '6px' }}>I am a</label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {(['buyer', 'seller', 'both'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '12px',
                          border: role === r ? '2px solid #111827' : '1px solid #e5e7eb',
                          background: role === r ? '#111827' : '#fff',
                          color: role === r ? '#fff' : '#111827',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        {r === 'both' ? 'Buyer & Seller' : r === 'seller' ? 'Seller' : 'Buyer'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                <input
                  id="stay-signed"
                  type="checkbox"
                  checked={staySigned}
                  onChange={(e) => setStaySigned(e.target.checked)}
                  style={{ width: '18px', height: '18px' }}
                />
                <label htmlFor="stay-signed" style={{ fontSize: '13px', color: '#111827' }}>
                  Stay signed in
                </label>
              </div>

              {error && (
                <div
                  style={{
                    borderRadius: '14px',
                    border: '1px solid #fecaca',
                    background: '#fef2f2',
                    color: '#991b1b',
                    fontWeight: 800,
                    fontSize: '13px',
                    padding: '10px 12px'
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '4px',
                  background: loading ? '#334155' : '#111827',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px',
                  fontWeight: 800,
                  fontSize: '15px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.9 : 1
                }}
              >
                {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Register'}
              </button>

              {mode === 'signin' && (
                <div style={{ textAlign: 'center', marginTop: '6px' }}>
                  <a href="#" style={{ fontSize: '13px', color: '#111827', textDecoration: 'none' }}>
                    Forgot your password?
                  </a>
                </div>
              )}

              <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px', color: '#6b7280' }}>OR</div>

              <SocialButton label="Continue with Google" />
              <SocialButton label="Continue with Facebook" />
              <SocialButton label="Continue with Apple" />
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 46px 12px 40px',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  fontSize: '14px',
  outline: 'none',
  background: '#f8fafc',
  color: '#0f172a'
};

const inputWrapStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
};

const inputIconStyle: React.CSSProperties = {
  position: 'absolute',
  left: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#64748b',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',
};

function SocialButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      style={{
        width: '100%',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        background: '#fff',
        color: '#111827',
        padding: '12px',
        fontWeight: 800,
        cursor: 'pointer'
      }}
      onClick={() => alert('Social login is a placeholder in this demo.')}
    >
      {label}
    </button>
  );
}

