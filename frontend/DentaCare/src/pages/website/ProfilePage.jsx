import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  User, Phone, Calendar, MapPin, Camera, Save,
  Edit2, Clock, DollarSign, CheckCircle, XCircle,
  CalendarDays, CreditCard, Ban, AlertCircle,
  ChevronRight, Filter
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useFadeIn } from '../../hooks/gsap';
import useAuthStore from '../../store/useAuth';
import useT from '../../hooks/useT';
import api from '../../lib/axios';
import Navbar from '../../components/website/Navbar';
import Footer from '../../components/website/Footer';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProfilePage() {
  const { user, token, updateUser } = useAuthStore();
  const t = useT();
  const navigate = useNavigate();

  const pageRef = useRef(null);
  const titleRef = useRef(null);
  const profileCardRef = useRef(null);
  const appointmentsRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '', email: '', phone: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAppointment, setPaymentAppointment] = useState(null);
  const [filter, setFilter] = useState('all');

  // Simple fade‑in (no scroll trigger)
  useFadeIn(titleRef, { y: -30, duration: 0.6 });
  useFadeIn(profileCardRef, { y: 0, duration: 0.7, delay: 0.2 });
  useFadeIn(appointmentsRef, { y: 0, duration: 0.7, delay: 0.3 });

  // Animation for appointment items (scroll‑triggered)
  useEffect(() => {
    if (!loadingAppointments && appointmentsRef.current) {
      const items = appointmentsRef.current.querySelectorAll('.appointment-item');
      if (!items.length) return;
      const ctx = gsap.context(() => {
        gsap.fromTo(items,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: {
              trigger: appointmentsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      }, appointmentsRef);
      return () => ctx.revert();
    }
  }, [loadingAppointments]);

  // Fetch user profile 
  const fetchedRef = useRef(false);
  useEffect(() => {
    if (fetchedRef.current) return;
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/user/profile', { headers: { token } });
        if (data.success) {
          setProfileData({
            name: data.user.name || '',
            email: data.user.email || '',
            phone: data.user.phone || ''
          });
          if (data.user.image) setImagePreview(data.user.image);
          fetchedRef.current = true;
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, [token]);

  // Fetch appointments with sorting
  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/appointment/list', { headers: { token } });
      if (data.success) {
        const sorted = [...data.appointments].sort((a, b) => {
          const dateA = a.slotDate.split('_').reverse().join('-');
          const dateB = b.slotDate.split('_').reverse().join('-');
          return dateB.localeCompare(dateA);
        });
        setAppointments(sorted);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoadingAppointments(false);
    }
  };
  useEffect(() => { fetchAppointments(); }, [token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      gsap.fromTo('.avatar-image', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3 });
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('phone', profileData.phone);
      if (imageFile) formData.append('image', imageFile);

      const { data } = await api.put('/user/update-profile', formData, {
        headers: { token, 'Content-Type': 'multipart/form-data' }
      });
      if (data.success) {
        updateUser(data.user);
        setProfileData({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || ''
        });
        if (data.user.image) setImagePreview(data.user.image);
        toast.success(t('profileUpdated') || 'Profile updated successfully');
        gsap.fromTo('.success-message', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, yoyo: true, repeat: 1 });
        setEditing(false);
        setImageFile(null);
      } else {
        toast.error(data.message || t('error'));
      }
    } catch (error) {
      toast.error(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;
    setCancellingId(selectedAppointment._id);
    try {
      const { data } = await api.post('/appointment/cancel', { appointmentId: selectedAppointment._id }, { headers: { token } });
      if (data.success) {
        toast.success(t('appointmentCancelled') || 'Appointment cancelled successfully');
        const cancelledItem = document.getElementById(`appointment-${selectedAppointment._id}`);
        if (cancelledItem) {
          gsap.to(cancelledItem, {
            opacity: 0, x: -20, duration: 0.3,
            onComplete: () => {
              setAppointments(appointments.map(apt =>
                apt._id === selectedAppointment._id ? { ...apt, cancelled: true } : apt
              ));
            }
          });
        } else {
          setAppointments(appointments.map(apt =>
            apt._id === selectedAppointment._id ? { ...apt, cancelled: true } : apt
          ));
        }
        setShowCancelModal(false);
        setSelectedAppointment(null);
      } else {
        toast.error(data.message || t('error'));
      }
    } catch (error) {
      toast.error(t('error'));
    } finally {
      setCancellingId(null);
    }
  };

  const handlePaymentClick = (appointment) => {
    gsap.fromTo('.payment-btn', { scale: 1 }, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
    setPaymentAppointment(appointment);
    setShowPaymentModal(true);
  };

  // --- Updated Stripe Handler ---
const handleStripePayment = async () => {
  if (!paymentAppointment) return;
  // Use a string to differentiate which one is loading
  setProcessingPayment('stripe'); 
  try {
    const { data } = await api.post('/payment/stripe-checkout', {
      appointmentId: paymentAppointment._id,
    }, { headers: { token } });

    if (data.success && data.sessionUrl) {
      window.location.href = data.sessionUrl;
    }
  } catch (error) {
    toast.error('Stripe redirect failed');
  } finally {
    setProcessingPayment(null);
  }
};

// --- Chargily Handler ---
const handleChargilyPayment = async () => {
  if (!paymentAppointment) return;
  setProcessingPayment('chargily');
  try {
    const { data } = await api.post('/payment/chargily-checkout', {
      appointmentId: paymentAppointment._id,
    }, { headers: { token } });

   
    if (data.success && data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
    } else {
      toast.error(data.message || 'Chargily error');
    }
  } catch (error) {
    console.error("Chargily Error:", error);
    toast.error('Chargily redirect failed');
  } finally {
    setProcessingPayment(null);
  }
};

  // --- Inside ProfilePage.jsx ---

const verifyPaymentStatus = async (appointmentId, paymentMethod, sessionId) => {
  try {
    const endpoint = paymentMethod === 'stripe' ? '/payment/stripe-verify' : '/payment/chargily-verify';
    
    // Stripe needs the sessionId, Chargily needs the appointmentId
    const payload = paymentMethod === 'stripe' ? { sessionId } : { appointmentId };

    const { data } = await api.post(endpoint, payload, { headers: { token } });
    
    if (data.success) {
      toast.success(t('paymentSuccess') || 'Payment successful!');
      fetchAppointments(); // Refresh the list to show "Paid" status
    } else {
      toast.error(data.message || 'Verification failed');
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    toast.error('Could not verify payment');
  }
};

useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentStatus = urlParams.get('payment_status');
  const appointmentId = urlParams.get('appointment_id');
  const paymentMethod = urlParams.get('payment_method');
  const sessionId = urlParams.get('session_id'); // Only for Stripe

  // Check if we just returned from a successful payment redirect
  if (paymentStatus === 'success' && appointmentId) {
    verifyPaymentStatus(appointmentId, paymentMethod, sessionId);
    
    // Clean the URL to remove sensitive IDs and prevent re-verification on refresh
    navigate('/profile', { replace: true });
  } else if (paymentStatus === 'cancelled') {
    toast.error('Payment was cancelled');
    navigate('/profile', { replace: true });
  }
}, [token]);

  const getStatusBadge = (apt) => {
  if (apt.cancelled) return { text: t('cancelled'), color: 'bg-red-100 text-red-600', icon: XCircle };
  if (apt.isCompleted) return { text: t('completed'), color: 'bg-green-100 text-green-600', icon: CheckCircle };
  
  // Logic: Paid online but not yet seen by doctor
  if (apt.isPaid) return { text: t('paidOnline'), color: 'bg-blue-100 text-blue-600', icon: CreditCard };
  
  // Default pending state
  return { text: t('pending'), color: 'bg-yellow-100 text-yellow-600', icon: Clock };
};

  const formatDate = (dateStr) => dateStr?.replace(/_/g, '/') || '';

  // Filter appointments
  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !apt.isCompleted && !apt.cancelled;
    if (filter === 'completed') return apt.isCompleted;
    if (filter === 'cancelled') return apt.cancelled;
    return true;
  });

  const counts = {
    all: appointments.length,
    pending: appointments.filter(a => !a.isCompleted && !a.cancelled).length,
    completed: appointments.filter(a => a.isCompleted).length,
    cancelled: appointments.filter(a => a.cancelled).length,
  };

  return (
    <>
      <Navbar />
      <div ref={pageRef} className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="absolute top-[-10%] right-[-5%] w-125 h-125 bg-[#CDE9FF]/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-100 h-100 bg-[#CDE9FF]/5 rounded-full blur-[100px]" />
        <div className="max-w-7xl mx-auto px-6">
          <h1 ref={titleRef} className="text-3xl font-bold text-text mb-8">
            {t('myProfile')}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Card */}
            <div ref={profileCardRef} className="lg:col-span-1">
              <div className="bg-white rounded-[10px] shadow-sm border border-border overflow-hidden sticky top-24">
                <div className="h-24 bg-linear-to-r from-primary-deep to-primary" />
                <div className="relative -mt-12 px-6">
                  <div className="relative inline-block avatar-image">
                    {imagePreview ? (
                      <img src={imagePreview} alt={profileData.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-primary-soft flex items-center justify-center border-4 border-white shadow-md">
                        <span className="text-3xl font-bold text-primary-deep">{profileData.name?.charAt(0) || 'U'}</span>
                      </div>
                    )}
                    {editing && (
                      <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-primary-deep transition">
                        <Camera size={14} />
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>
                <div className="p-6 pt-4">
                  {editing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-text">{t('name')}</label>
                        <input type="text" value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })} className="w-full mt-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-text">{t('phone')}</label>
                        <input type="tel" value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} className="w-full mt-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary" />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button onClick={() => setEditing(false)} className="flex-1 py-2 rounded-lg border border-border text-sub hover:bg-gray-50 transition">{t('cancel')}</button>
                        <button onClick={handleUpdateProfile} disabled={loading} className="flex-1 py-2 rounded-lg bg-primary text-white hover:bg-primary-deep transition flex items-center justify-center gap-2">
                          {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
                          {t('save')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold text-text">{profileData.name}</h2>
                      <p className="text-sub text-sm mt-1">{profileData.email}</p>
                      <div className="mt-4 space-y-2">
                        {profileData.phone && <div className="flex items-center gap-2 text-sub"><Phone size={14} /><span className="text-sm">{profileData.phone}</span></div>}
                      </div>
                      <button onClick={() => setEditing(true)} className="mt-6 w-full py-2 rounded-lg border border-primary text-primary hover:bg-primary/5 transition flex items-center justify-center gap-2">
                        <Edit2 size={16} /> {t('editProfile')}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Appointments */}
            <div ref={appointmentsRef} className="lg:col-span-2">
              <div className="bg-white rounded-[10px] shadow-sm border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="text-xl font-bold text-text flex items-center gap-2">
                    <CalendarDays size={20} className="text-primary" /> {t('myAppointments')}
                  </h2>
                </div>

                {/* Filter Tabs */}
                <div className="px-6 pt-4 pb-2 border-b border-border">
                  <div className="flex gap-2">
                    {['all', 'pending', 'completed', 'cancelled'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                          filter === f
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-gray-100 text-sub hover:bg-gray-200'
                        }`}
                      >
                        {t(f)} ({counts[f]})
                      </button>
                    ))}
                  </div>
                </div>

                {loadingAppointments ? (
                  <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
                ) : filteredAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarDays size={48} className="text-muted mx-auto mb-4" />
                    <p className="text-sub">{t('noAppointments')}</p>
                    <button onClick={() => navigate('/doctors')} className="mt-4 btn-primary py-2 px-4 rounded-lg">{t('bookAppointment')}</button>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {filteredAppointments.map((apt) => {
                      const status = getStatusBadge(apt);
                      const StatusIcon = status.icon;
                      return (
                        <div key={apt._id} id={`appointment-${apt._id}`} className="appointment-item p-6 hover:bg-gray-50 transition">
                          <div className="flex flex-wrap justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {apt.docData?.image ? <img src={apt.docData.image} alt="" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center"><span className="text-sm font-bold text-primary-deep">{apt.docData?.name?.charAt(0) || 'D'}</span></div>}
                                <div><h3 className="font-semibold text-text">{apt.docData?.name}</h3><p className="text-xs text-sub">{apt.docData?.speciality}</p></div>
                              </div>
                              <div className="grid grid-cols-2 gap-3 mt-3">
                                <div className="flex items-center gap-2 text-sm text-sub"><Calendar size={14} /><span>{formatDate(apt.slotDate)}</span></div>
                                <div className="flex items-center gap-2 text-sm text-sub"><Clock size={14} /><span>{apt.slotTime}</span></div>
                                <div className="flex items-center gap-2 text-sm font-semibold text-primary"><DollarSign size={14} /><span>{apt.amount}DA</span></div>
                                <div className="flex items-center gap-2"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}><StatusIcon size={12} />{status.text}</span></div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {!apt.cancelled && !apt.isCompleted && (
                                <>
                                  {!apt.isPaid && <button onClick={() => handlePaymentClick(apt)} disabled={processingPayment === apt._id} className="payment-btn flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-deep transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                                    {processingPayment === apt._id ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CreditCard size={14} />}
                                    {t('payNow')}
                                  </button>}
                                  <button onClick={() => { setSelectedAppointment(apt); setShowCancelModal(true); }} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition text-sm font-medium"><Ban size={14} />{t('cancel')}</button>
                                </>
                              )}
                              {apt.cancelled && <span className="text-xs text-muted">{t('cancelled')}</span>}
                              {apt.isCompleted && <span className="text-xs text-green-600">{t('completed')}</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && paymentAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary-soft flex items-center justify-center mx-auto mb-4"><CreditCard size={24} className="text-primary" /></div>
              <h3 className="text-xl font-bold text-text">Select Payment Method</h3>
              <p className="text-sub text-sm mt-1">Pay {paymentAppointment.amount}DA for appointment with {paymentAppointment.docData?.name}</p>
            </div>
            <div className="space-y-3">
              <button onClick={handleStripePayment} disabled={processingPayment !== null} className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-border hover:border-primary transition-all hover:shadow-md disabled:opacity-50">
                <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-[#635BFF]/10 flex items-center justify-center"><svg className="w-6 h-6 text-[#635BFF]" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 7.5h-3v6h3v-6zm-4.5 0h-3v6h3v-6zm-4.5 0H6v6h1.5v-6zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg></div><div className="text-left"><p className="font-semibold text-text">Pay with Stripe</p><p className="text-xs text-sub">Credit card, debit card, Apple Pay</p></div></div>
                {processingPayment === 'stripe' ? <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : <ChevronRight size={20} className="text-muted" />}
              </button>
              <button onClick={handleChargilyPayment} disabled={processingPayment !== null} className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-border hover:border-primary transition-all hover:shadow-md disabled:opacity-50">
                <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center"><svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg></div><div className="text-left"><p className="font-semibold text-text">Pay with Chargily</p><p className="text-xs text-sub">CIB, CCP, EDAHABIA, Visa, Mastercard</p></div></div>
                {processingPayment === 'chargily' ? <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : <ChevronRight size={20} className="text-muted" />}
              </button>
            </div>
            <button onClick={() => setShowPaymentModal(false)} className="w-full mt-6 py-2 text-sub hover:text-text transition">Cancel</button>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCancelModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-up">
            <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"><AlertCircle size={20} className="text-red-500" /></div><h3 className="text-lg font-bold text-text">{t('cancelAppointment')}</h3></div>
            <p className="text-sub mb-6">{t('cancelAppointmentConfirm', { doctor: selectedAppointment.docData?.name, date: formatDate(selectedAppointment.slotDate), time: selectedAppointment.slotTime })}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowCancelModal(false)} className="flex-1 py-2 rounded-lg border border-border text-sub hover:bg-gray-50 transition">{t('no')}</button>
              <button onClick={handleCancelAppointment} disabled={cancellingId === selectedAppointment._id} className="flex-1 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition flex items-center justify-center gap-2">
                {cancellingId === selectedAppointment._id ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Ban size={16} />}
                {t('yesCancel')}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}