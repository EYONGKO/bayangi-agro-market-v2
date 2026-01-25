import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { useCart } from '../context/CartContext';
import { theme } from '../theme/colors';

type Step = 'details' | 'payment' | 'confirm' | 'success';

type PaymentProvider = 'mtn' | 'orange';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart, getTotalPrice } = useCart();

  const [step, setStep] = useState<Step>('details');
  const [processing, setProcessing] = useState(false);
  const [contact, setContact] = useState({
    fullName: '',
    phone: '',
    address: '',
  });

  const [payment, setPayment] = useState({
    provider: 'mtn' as PaymentProvider,
    momoNumber: '',
    confirmedPaid: false,
  });

  const subtotal = getTotalPrice();
  const shipping = useMemo(() => (subtotal >= 50000 ? 0 : 5000), [subtotal]);
  const total = subtotal + shipping;

  const canContinueDetails =
    contact.fullName.trim() && contact.phone.trim() && contact.address.trim();

  const canContinuePayment = payment.momoNumber.trim();

  const handleBack = () => {
    if (step === 'details') return navigate('/cart');
    if (step === 'payment') return setStep('details');
    if (step === 'confirm') return setStep('payment');
    if (step === 'success') return navigate('/');
  };

  const handlePayNow = () => {
    if (!canContinueDetails || !canContinuePayment) return;
    if (!payment.confirmedPaid) return;
    setProcessing(true);
    window.setTimeout(() => {
      clearCart();
      setProcessing(false);
      setStep('success');
    }, 1200);
  };

  if (cart.length === 0 && step !== 'success') {
    return (
      <PageLayout>
        <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${theme.colors.primary.background} 0%, ${theme.colors.primary.light}40% 50%, ${theme.colors.primary.main} 100%)` }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-10 text-center" style={{ borderColor: theme.colors.neutral[200], boxShadow: `0 4px 20px ${theme.colors.ui.shadow}` }}>
              <h1 className="text-2xl font-extrabold" style={{ color: theme.colors.neutral[900] }}>Your cart is empty</h1>
              <p className="mt-2" style={{ color: theme.colors.neutral[600] }}>Add items to your cart before checking out.</p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/global-market" className="px-7 py-3 rounded-xl font-bold text-center" style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`,
                  color: theme.colors.ui.white
                }}>Browse products</Link>
                <Link to="/cart" className="px-7 py-3 rounded-xl font-bold text-center" style={{
                  background: theme.colors.ui.white,
                  border: `1px solid ${theme.colors.neutral[200]}`,
                  color: theme.colors.neutral[900]
                }}>Back to cart</Link>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${theme.colors.primary.background} 0%, ${theme.colors.primary.light}40% 50%, ${theme.colors.primary.main} 100%)` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6" style={{ borderColor: theme.colors.neutral[200], boxShadow: `0 4px 20px ${theme.colors.ui.shadow}` }}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <button onClick={handleBack} className="px-4 py-2 rounded-xl font-bold transition-all" style={{
                background: theme.colors.ui.white,
                border: `1px solid ${theme.colors.neutral[200]}`,
                color: theme.colors.neutral[900]
              }} onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.colors.neutral[50];
              }} onMouseLeave={(e) => {
                e.currentTarget.style.background = theme.colors.ui.white;
              }}>Back</button>
              <div className="text-right">
                <div className="text-xs font-bold" style={{ color: theme.colors.neutral[600] }}>Order total</div>
                <div className="text-2xl font-extrabold" style={{ color: theme.colors.neutral[900] }}>FCFA{total.toLocaleString()}</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-2 text-sm font-bold">
              <div className="px-3 py-2 rounded-xl text-center" style={{
                background: step === 'details' ? `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)` : theme.colors.neutral[100],
                color: step === 'details' ? theme.colors.ui.white : theme.colors.neutral[700]
              }}>
                Details
              </div>
              <div className="px-3 py-2 rounded-xl text-center" style={{
                background: step === 'payment' ? `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)` : theme.colors.neutral[100],
                color: step === 'payment' ? theme.colors.ui.white : theme.colors.neutral[700]
              }}>
                Payment
              </div>
              <div className="px-3 py-2 rounded-xl text-center" style={{
                background: step === 'confirm' ? `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)` : theme.colors.neutral[100],
                color: step === 'confirm' ? theme.colors.ui.white : theme.colors.neutral[700]
              }}>
                Confirm
              </div>
              <div className="px-3 py-2 rounded-xl text-center" style={{
                background: step === 'success' ? `linear-gradient(135deg, ${theme.colors.primary.light} 0%, ${theme.colors.primary.main} 100%)` : theme.colors.neutral[100],
                color: step === 'success' ? theme.colors.ui.white : theme.colors.neutral[700]
              }}>
                Done
              </div>
            </div>

            {step !== 'success' && (
              <div className="mt-6 rounded-2xl p-5" style={{ background: theme.colors.neutral[50], border: `1px solid ${theme.colors.neutral[200]}` }}>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="text-sm font-extrabold" style={{ color: theme.colors.neutral[900] }}>Order Summary</div>
                  <div className="text-xs font-bold" style={{ color: theme.colors.neutral[600] }}>{cart.length} item{cart.length === 1 ? '' : 's'}</div>
                </div>

                <div className="mt-4 space-y-3">
                  {cart.slice(0, 4).map((item) => (
                    <div key={`${item.id}-${item.community}`} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" style={{ border: `1px solid ${theme.colors.neutral[200]}` }} />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold truncate" style={{ color: theme.colors.neutral[900] }}>{item.name}</div>
                        <div className="text-xs" style={{ color: theme.colors.neutral[600] }}>Qty: {item.quantity}</div>
                      </div>
                      <div className="text-sm font-extrabold" style={{ color: theme.colors.neutral[900] }}>FCFA{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                  {cart.length > 4 && (
                    <div className="text-xs font-semibold" style={{ color: theme.colors.neutral[600] }}>+ {cart.length - 4} more item(s)</div>
                  )}
                </div>

                <div className="mt-4 pt-4 space-y-2 text-sm" style={{ borderTop: `1px solid ${theme.colors.neutral[200]}` }}>
                  <div className="flex items-center justify-between">
                    <span style={{ color: theme.colors.neutral[600] }}>Subtotal</span>
                    <span className="font-bold" style={{ color: theme.colors.neutral[900] }}>FCFA{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: theme.colors.neutral[600] }}>Shipping</span>
                    <span className="font-bold" style={{ color: theme.colors.neutral[900] }}>{shipping === 0 ? 'Free' : `FCFA${shipping.toLocaleString()}`}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: theme.colors.neutral[900], fontWeight: '800' }}>Total</span>
                    <span style={{ color: theme.colors.neutral[900], fontWeight: '800' }}>FCFA{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {step === 'details' && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1" style={{ color: theme.colors.neutral[700] }}>Full name</label>
                  <input
                    value={contact.fullName}
                    onChange={(e) => setContact((p) => ({ ...p, fullName: e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 focus:outline-none"
                    style={{
                      border: `1px solid ${theme.colors.neutral[200]}`,
                      color: theme.colors.neutral[900]
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = theme.colors.primary.main;
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.colors.primary.light}40%`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = theme.colors.neutral[200];
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1" style={{ color: theme.colors.neutral[700] }}>Phone</label>
                  <input
                    value={contact.phone}
                    onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 focus:outline-none"
                    style={{
                      border: `1px solid ${theme.colors.neutral[200]}`,
                      color: theme.colors.neutral[900]
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = theme.colors.primary.main;
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.colors.primary.light}40%`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = theme.colors.neutral[200];
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    placeholder="e.g. +237 6xx xxx xxx"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold mb-1" style={{ color: theme.colors.neutral[700] }}>Delivery address</label>
                  <input
                    value={contact.address}
                    onChange={(e) => setContact((p) => ({ ...p, address: e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 focus:outline-none"
                    style={{
                      border: `1px solid ${theme.colors.neutral[200]}`,
                      color: theme.colors.neutral[900]
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = theme.colors.primary.main;
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.colors.primary.light}40%`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = theme.colors.neutral[200];
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    placeholder="Street, landmark, house number"
                  />
                </div>

                <div className="sm:col-span-2 flex justify-end">
                  <button
                    type="button"
                    disabled={!canContinueDetails}
                    onClick={() => setStep('payment')}
                    className="px-6 py-3 rounded-xl font-bold transition-all"
                    style={{
                      background: canContinueDetails ? `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)` : theme.colors.neutral[300],
                      color: canContinueDetails ? theme.colors.ui.white : theme.colors.neutral[500],
                      cursor: canContinueDetails ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Continue to payment
                  </button>
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div className="mt-6 space-y-4">
                <div className="text-lg font-extrabold" style={{ color: theme.colors.neutral[900] }}>Payment</div>
                <div className="text-sm" style={{ color: theme.colors.neutral[600] }}>
                  Choose your provider and enter the number you will use to pay.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPayment((p) => ({ ...p, provider: 'mtn' }))}
                    className="p-4 rounded-xl border-2 font-bold transition-all"
                    style={{
                      borderColor: payment.provider === 'mtn' ? theme.colors.primary.main : theme.colors.neutral[200],
                      background: payment.provider === 'mtn' ? `${theme.colors.primary.light}40%` : theme.colors.ui.white,
                      color: theme.colors.neutral[900]
                    }}
                  >
                    MTN MoMo
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayment((p) => ({ ...p, provider: 'orange' }))}
                    className="p-4 rounded-xl border font-bold transition-all"
                    style={{
                      borderColor: payment.provider === 'orange' ? theme.colors.primary.main : theme.colors.neutral[200],
                      background: payment.provider === 'orange' ? `${theme.colors.primary.light}40%` : theme.colors.ui.white,
                      color: theme.colors.neutral[900]
                    }}
                  >
                    Orange MoMo
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1" style={{ color: theme.colors.neutral[700] }}>
                    {payment.provider === 'mtn' ? 'MTN MoMo number' : 'Orange MoMo number'}
                  </label>
                  <input
                    value={payment.momoNumber}
                    onChange={(e) => setPayment((p) => ({ ...p, momoNumber: e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 focus:outline-none"
                    style={{
                      border: `1px solid ${theme.colors.neutral[200]}`,
                      color: theme.colors.neutral[900]
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = theme.colors.primary.main;
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.colors.primary.light}40%`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = theme.colors.neutral[200];
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    placeholder="e.g. +237 6xx xxx xxx"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm font-semibold" style={{ color: theme.colors.neutral[700] }}>
                  <input
                    type="checkbox"
                    checked={payment.confirmedPaid}
                    onChange={(e) => setPayment((p) => ({ ...p, confirmedPaid: e.target.checked }))}
                  />
                  I confirm I will pay using this number
                </label>

                <div className="flex justify-between gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="px-6 py-3 rounded-xl font-bold transition-all"
                    style={{
                      background: theme.colors.ui.white,
                      border: `1px solid ${theme.colors.neutral[200]}`,
                      color: theme.colors.neutral[900]
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = theme.colors.neutral[50];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = theme.colors.ui.white;
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={!canContinuePayment}
                    onClick={() => setStep('confirm')}
                    className="px-6 py-3 rounded-xl font-bold transition-all"
                    style={{
                      background: canContinuePayment ? `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)` : theme.colors.neutral[300],
                      color: canContinuePayment ? theme.colors.ui.white : theme.colors.neutral[500],
                      cursor: canContinuePayment ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Review order
                  </button>
                </div>
              </div>
            )}

            {step === 'confirm' && (
              <div className="mt-6 space-y-4">
                <div className="text-lg font-extrabold" style={{ color: theme.colors.neutral[900] }}>Confirm your order</div>
                <div className="rounded-xl p-4" style={{ background: theme.colors.neutral[50], border: `1px solid ${theme.colors.neutral[200]}` }}>
                  <div className="text-sm font-bold" style={{ color: theme.colors.neutral[700] }}>Delivery</div>
                  <div className="text-sm mt-1" style={{ color: theme.colors.neutral[700] }}>Name: {contact.fullName}</div>
                  <div className="text-sm" style={{ color: theme.colors.neutral[700] }}>Phone: {contact.phone}</div>
                  <div className="text-sm" style={{ color: theme.colors.neutral[700] }}>Address: {contact.address}</div>
                </div>
                <div className="rounded-xl p-4" style={{ background: theme.colors.neutral[50], border: `1px solid ${theme.colors.neutral[200]}` }}>
                  <div className="text-sm font-bold" style={{ color: theme.colors.neutral[700] }}>Payment</div>
                  <div className="text-sm mt-1" style={{ color: theme.colors.neutral[700] }}>Provider: {payment.provider === 'mtn' ? 'MTN MoMo' : 'Orange MoMo'}</div>
                  <div className="text-sm" style={{ color: theme.colors.neutral[700] }}>Number: {payment.momoNumber}</div>
                </div>
                {!payment.confirmedPaid && (
                  <div className="text-sm font-semibold rounded-xl p-3" style={{
                    color: theme.colors.neutral[700],
                    background: `${theme.colors.primary.light}40%`,
                    border: `1px solid ${theme.colors.primary.light}60%`
                  }}>
                    Please tick "I confirm I will pay using this number" before completing payment.
                  </div>
                )}
                <div className="flex justify-between gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setStep('payment')}
                    className="px-6 py-3 rounded-xl font-bold transition-all"
                    style={{
                      background: theme.colors.ui.white,
                      border: `1px solid ${theme.colors.neutral[200]}`,
                      color: theme.colors.neutral[900]
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = theme.colors.neutral[50];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = theme.colors.ui.white;
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={!payment.confirmedPaid || processing}
                    onClick={handlePayNow}
                    className="px-6 py-3 rounded-xl font-bold transition-all"
                    style={{
                      background: (payment.confirmedPaid && !processing) ? `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)` : theme.colors.neutral[300],
                      color: (payment.confirmedPaid && !processing) ? theme.colors.ui.white : theme.colors.neutral[500],
                      cursor: (payment.confirmedPaid && !processing) ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {processing ? 'Processing…' : 'Confirm & Pay'}
                  </button>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="mt-6 text-center">
                <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center font-extrabold" style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary.light} 0%, ${theme.colors.primary.main} 100%)`,
                  color: theme.colors.ui.white
                }}>
                  ✓
                </div>
                <div className="mt-4 text-2xl font-extrabold" style={{ color: theme.colors.neutral[900] }}>Order completed</div>
                <div className="mt-2" style={{ color: theme.colors.neutral[600] }}>Your payment was confirmed and your order is now processing.</div>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/global-market" className="px-7 py-3 rounded-xl font-bold text-center" style={{
                    background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`,
                    color: theme.colors.ui.white
                  }}>Continue shopping</Link>
                  <Link to="/" className="px-7 py-3 rounded-xl font-bold text-center" style={{
                    background: theme.colors.ui.white,
                    border: `1px solid ${theme.colors.neutral[200]}`,
                    color: theme.colors.neutral[900]
                  }}>Go home</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
