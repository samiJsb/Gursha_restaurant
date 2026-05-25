import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRestaurant } from '../context/RestaurantContext';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, 
  Sparkles, 
  MapPin, 
  Phone, 
  Clock, 
  Plus, 
  Minus, 
  Trash2, 
  Utensils, 
  Send, 
  Calendar, 
  User as UserIcon, 
  CheckCircle2, 
  Heart, 
  X,
  CreditCard,
  QrCode,
  Globe,
  Share2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const { 
    menu, 
    cart, 
    coupon,
    addToCart, 
    removeFromCart, 
    updateCartQty, 
    applyCoupon, 
    submitOrder, 
    submitReservation 
  } = useRestaurant();
  
  const { profile } = useAuth();
  const navigate = useNavigate();

  // Categories and search filters
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [cartOpen, setCartOpen] = useState(false);
  
  // Checkout & Reservation Form State
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [name, setName] = useState(profile?.displayName || '');
  const [phone, setPhone] = useState(profile?.phoneNumber || '');
  const [deliveryType, setDeliveryType] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'TELEBIRR' | 'CBE_BIRR' | 'CHAPA' | 'CASH_ON_DELIVERY'>('CHAPA');
  const [couponCode, setCouponCode] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState<any>(null);

  // Reservation form
  const [resvName, setResvName] = useState(profile?.displayName || '');
  const [resvEmail, setResvEmail] = useState(profile?.email || '');
  const [resvPhone, setResvPhone] = useState('');
  const [resvDate, setResvDate] = useState('');
  const [resvTime, setResvTime] = useState('19:00');
  const [resvGuests, setResvGuests] = useState(2);
  const [resvOccasion, setResvOccasion] = useState('Dinner Date');
  const [resvRequests, setResvRequests] = useState('');
  const [resvSuccess, setResvSuccess] = useState(false);

  // Cart financial aggregates
  const cartSubtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const discountAmount = coupon ? Math.round(cartSubtotal * (coupon.value / 100)) : 0;
  const deliveryFee = deliveryType === 'DELIVERY' && cartSubtotal > 0 ? 150 : 0;
  const vAt = Math.round((cartSubtotal - discountAmount) * 0.15 * 10) / 10;
  const cartTotal = cartSubtotal - discountAmount + deliveryFee + vAt;

  const handleOrderCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || (deliveryType === 'DELIVERY' && !address)) {
      alert("Please fill out all required fields.");
      return;
    }

    const outcome = await submitOrder({
      customerName: name,
      customerPhone: phone,
      deliveryType,
      deliveryAddress: address,
      paymentMethod
    });

    if (outcome.success) {
      setSubmitSuccess({
        id: outcome.order?.id,
        total: outcome.order?.total,
        payment: paymentMethod,
        redirect: outcome.redirectUrl
      });
      setCheckoutOpen(false);
    }
  };

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resvName || !resvPhone || !resvDate) {
      alert("Please specify Name, Phone, and Preferred Celebration Date.");
      return;
    }
    const success = await submitReservation({
      name: resvName,
      email: resvEmail,
      phone: resvPhone,
      date: resvDate,
      time: resvTime,
      guestsCount: resvGuests,
      occasion: resvOccasion,
      specialRequests: resvRequests
    });
    if (success) {
      setResvSuccess(true);
      setTimeout(() => setResvSuccess(false), 8000);
      setResvName('');
      setResvPhone('');
      setResvDate('');
      setResvRequests('');
    }
  };

  const filteredMenuItems = activeCategory === 'all' 
    ? menu 
    : menu.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#070709] text-white selection:bg-amber-600 selection:text-black">
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 bg-[#070709]/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(217,119,6,0.2)]">
            <Utensils className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-[0.25em] bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-100">GURSHA</h1>
            <p className="text-[8px] font-semibold text-amber-500 uppercase tracking-widest -mt-1">Premium Addis Dining</p>
          </div>
        </div>

        {/* Global Nav */}
        <nav className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <a href="#about" className="hover:text-amber-500 transition-colors">Our Story</a>
          <a href="#menu" className="hover:text-amber-500 transition-colors">Royal Menu</a>
          <a href="#reservation" className="hover:text-amber-500 transition-colors">Reservations</a>
          <a href="#contact" className="hover:text-amber-500 transition-colors">Contact</a>
        </nav>

        {/* Icons Area */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCartOpen(true)}
            className="p-2.5 bg-gradient-to-b from-zinc-800 to-zinc-900 border border-white/10 rounded-xl flex items-center gap-2 relative group hover:border-amber-500/30 transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] font-bold text-white font-mono">{cart.length}</span>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            )}
          </button>

          <Link 
            to="/login"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_20px_rgba(217,119,6,0.2)]"
          >
            {profile?.role === 'admin' ? 'Operations Room' : 'Client Access'}
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden py-16 px-6 md:px-12 border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,119,6,0.08)_0%,transparent_70%)] pointer-events-none" />
        
        {/* Dynamic Pattern */}
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="max-w-4xl text-center space-y-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[9px] font-black uppercase tracking-[0.2em]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Fine Art of Ethiopian Culinary Elegance</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-sans font-black uppercase tracking-tight leading-[1.05]"
          >
            Savor the Luxury of <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-amber-200 to-white">
              Authentic Gursha
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 font-medium text-xs md:text-sm max-w-xl mx-auto leading-relaxed"
          >
            Immerse yourself in premium traditional Doro Wot stews, slow-cooked sizzling tibs tenderloins, and single-origin golden Sidamo coffee roasts crafted with Michelin-standard luxury in Addis Ababa.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a 
              href="#menu" 
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-600 to-amber-400 hover:from-amber-500 hover:to-amber-300 text-black text-[11px] font-black uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-amber-900/10 text-center"
            >
              Order Online System
            </a>
            <a 
              href="#reservation" 
              className="w-full sm:w-auto px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition-all text-center"
            >
              Book a Splendid Table
            </a>
          </motion.div>
        </div>

        {/* Decorative Grid items */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-12 text-zinc-500 text-[9px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-1.5"><Heart className="w-3 h-3 text-amber-500" /> Bole, Addis Ababa</div>
          <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-amber-500" /> +251 911 000 111</div>
        </div>
      </section>

      {/* Story / About Section */}
      <section id="about" className="py-24 px-6 md:px-12 border-b border-white/5 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.25em] block">Our Royal Legacy</span>
              <h3 className="text-3xl font-black uppercase tracking-tight">Elegance Stewed Over Centuries</h3>
            </div>
            <div className="space-y-4 text-xs text-zinc-400 leading-relaxed font-medium">
              <p>
                Gursha Premium celebrates the spirit of unity and deep culinary craft. Born from traditional clay fire hearths in the historic hills of Addis, we take indigenous ingredients—from sundried, red Berbere powder from Gojjam, to rich clarified grass-fed butter from Wolkite—and elevate them to high culinary art.
              </p>
              <p>
                Whether it is the rhythmic roasting of organic coffee beans with smoke signals flowing in a traditional ceremony, or our slow-tossed kitfo, every dynamic plate represents a warm "gursha"—a ritual of placing food directly into another's hand as a high mark of prestige and love.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl">
                <span className="block text-2xl font-black text-amber-500 font-mono">15+</span>
                <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold">Indigenous Stews</span>
              </div>
              <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl">
                <span className="block text-2xl font-black text-amber-500 font-mono">3</span>
                <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold">Luxe Lounges</span>
              </div>
              <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl">
                <span className="block text-2xl font-black text-amber-500 font-mono">10k+</span>
                <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold">Happy Patrons</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-tr from-amber-600/10 to-transparent absolute inset-0 rounded-2xl -m-4 blur-xl" />
            <img 
              src="https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=800" 
              alt="Traditional Coffee Roasting" 
              className="rounded-2xl border border-white/10 shadow-2xl relative z-10 object-cover w-full h-[380px]"
            />
          </div>
        </div>
      </section>

      {/* Online Ordering Center & Menu System */}
      <section id="menu" className="py-24 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.25em] block">Savor the Masterpieces</span>
              <h3 className="text-3xl font-black uppercase tracking-tight">Royal Culinary Exhibition</h3>
            </div>
            
            {/* Category Nav */}
            <div className="flex flex-wrap gap-2.5">
              {[
                { key: 'all', label: 'All Dishes' },
                { key: 'traditional', label: 'Traditional Wot' },
                { key: 'drinks', label: 'Awash Valley Juices' },
                { key: 'coffee', label: 'Sidamo Buna' }
              ].map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border ${
                    activeCategory === cat.key 
                      ? "bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/10" 
                      : "bg-zinc-900 border-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenuItems.map(item => (
              <div 
                key={item.id} 
                className="bg-[#0D0D11] border border-white/5 hover:border-amber-600/30 rounded-2xl overflow-hidden shadow-2xl group transition-all"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D11] via-transparent to-transparent" />
                  
                  {item.isChefRecommendation && (
                    <span className="absolute top-4 left-4 px-2.5 py-1 bg-amber-500 text-black text-[8px] font-black uppercase tracking-wider rounded-lg shadow-lg">
                      Chef Choice
                    </span>
                  )}

                  {item.spicyLevel !== undefined && item.spicyLevel > 0 && (
                    <span className="absolute top-4 right-4 px-2 py-1 bg-red-600 border border-red-500 text-white text-[8px] font-black tracking-widest rounded-lg">
                      {'🔥'.repeat(item.spicyLevel)}
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start gap-3">
                    <h4 className="text-sm font-black uppercase tracking-wider text-white group-hover:text-amber-500 transition-colors">
                      {item.name}
                    </h4>
                    <span className="text-sm font-black font-mono text-amber-500 shrink-0">
                      {item.price} <span className="text-[10px]">ETB</span>
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 font-medium leading-relaxed min-h-[48px]">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[9px] font-black text-zinc-500 font-mono uppercase tracking-widest">
                      Prep: {item.preparationTime} min
                    </span>
                    <button 
                      onClick={() => addToCart(item, 1)}
                      className="px-3.5 py-2 bg-zinc-800 hover:bg-amber-500 hover:text-black border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> Order online
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Reservation Section */}
      <section id="reservation" className="py-24 px-6 md:px-12 border-b border-white/5 relative">
        <div className="max-w-4xl mx-auto bg-[#0A0A0E] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 blur-3xl -mr-24 -mt-24 pointer-events-none" />
          
          <div className="text-center max-w-xl mx-auto space-y-4 mb-10">
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.25em] block">Imperial Seating</span>
            <h3 className="text-3xl font-black uppercase tracking-tight">Reserve a Royal Lounge Table</h3>
            <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
              Book a bespoke private booth, a business lunch lounge table, or a VIP coffee ceremony sector. Same-day approvals processed immediately in Addis Ababa.
            </p>
          </div>

          {resvSuccess ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 p-8 bg-amber-500/10 border border-amber-500/30 rounded-2xl"
            >
              <CheckCircle2 className="w-12 h-12 text-amber-500 mx-auto mb-4 animate-bounce" />
              <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2">Reservation Request Queued!</h4>
              <p className="text-[11px] text-zinc-400 max-w-sm mx-auto font-medium">
                Our chef administrator will call your phone number **{resvPhone}** to verify and lock in table number allocations for your celebrated {resvOccasion}.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleReservationSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">Client Name *</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3.5 w-3.5 h-3.5 text-zinc-500" />
                  <input 
                    type="text" 
                    value={resvName}
                    onChange={e => setResvName(e.target.value)}
                    placeholder="E.g., Kidus Yohannes"
                    className="w-full bg-zinc-900 border border-white/5 text-[11px] text-white p-3.5 pl-10 rounded-xl focus:outline-none focus:border-amber-500 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 w-3.5 h-3.5 text-zinc-500" />
                  <input 
                    type="tel" 
                    value={resvPhone}
                    onChange={e => setResvPhone(e.target.value)}
                    placeholder="E.g., +251 911 223344"
                    className="w-full bg-zinc-900 border border-white/5 text-[11px] text-white p-3.5 pl-10 rounded-xl focus:outline-none focus:border-amber-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">Patron Date *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 w-3.5 h-3.5 text-zinc-500" />
                  <input 
                    type="date" 
                    value={resvDate}
                    onChange={e => setResvDate(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/5 text-[11px] text-white p-3.5 pl-10 rounded-xl focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">Celebration Time</label>
                <input 
                  type="time" 
                  value={resvTime}
                  onChange={e => setResvTime(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/5 text-[11px] text-white p-3.5 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">Number of Guests</label>
                <select 
                  value={resvGuests}
                  onChange={e => setResvGuests(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-white/5 text-[11px] text-white p-3.5 rounded-xl focus:outline-none focus:border-amber-500"
                >
                  <option value={1}>1 Guest (Solitude Luxe)</option>
                  <option value={2}>2 Guests (Royal Couple)</option>
                  <option value={4}>4 Guests (Family Dining)</option>
                  <option value={6}>6 Guests (Premium Party Batch)</option>
                  <option value={10}>10+ Guests (Corporate Master Table)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">Occasion</label>
                <input 
                  type="text" 
                  value={resvOccasion}
                  onChange={e => setResvOccasion(e.target.value)}
                  placeholder="Anniversary, Birthday or Business"
                  className="w-full bg-zinc-900 border border-white/5 text-[11px] text-white p-3.5 rounded-xl focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">Special Wishes</label>
                <textarea 
                  value={resvRequests}
                  onChange={e => setResvRequests(e.target.value)}
                  placeholder="Any dietary preferences or preference of traditional seating layouts..."
                  className="w-full bg-zinc-900 border border-white/5 text-[11px] text-white p-3.5 rounded-xl focus:outline-none focus:border-amber-500 h-24 font-medium"
                />
              </div>

              <button 
                type="submit" 
                className="md:col-span-2 py-4 bg-amber-500 hover:bg-amber-600 text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-amber-900/10"
              >
                Send Table Request Signature
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer Area with Contacts, Telegram & WhatsApp */}
      <footer id="contact" className="bg-[#040406] py-16 px-6 md:px-12 border-t border-white/5 text-zinc-500">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                <Utensils className="w-4 h-4 text-black" />
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-widest">GURSHA</h4>
            </div>
            <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
              Serving unmatched luxury traditional and contemporary cuisines with true Ethiopian spirit. Proudly multi-channel (Telebirr/Chapa/CBE Birr API built).
            </p>
          </div>

          <div className="space-y-4">
            <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Lounges</h5>
            <ul className="space-y-2 text-[10px] font-medium text-zinc-400">
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-amber-500" /> Bole (Flagship Room)</li>
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-amber-500" /> Sarbet (VIP Lounge Zone)</li>
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-amber-500" /> Kazanchis Business Suites</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Connect with Us</h5>
            <ul className="space-y-2 text-[10px] font-medium text-zinc-400">
              <li><a href="https://t.me/gursha_delivery_bot" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 flex items-center gap-2"><Send className="w-3.5 h-3.5 text-[#0088cc]" /> Telegram Order Bot</a></li>
              <li><a href="https://wa.me/251911000111" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-[#25d366]" /> WhatsApp Concierge Chat</a></li>
              <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-amber-500" /> Desk: +251 911 000 111</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="text-[10px] font-black text-white uppercase tracking-widest">SaaS Developers</h5>
            <p className="text-[9px] text-zinc-500 leading-relaxed font-mono">
              Engineered with clean architectural layers, Express endpoints, Prisma schemas, and standard Tailwind for fast edge compilations.
            </p>
          </div>

        </div>

        <div className="max-w-6xl mx-auto border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] font-black uppercase tracking-widest">
          <span>&copy; {new Date().getFullYear()} Gursha Premium Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <span>Telebirr Integrated</span>
            <span>Chapa Verified</span>
            <span>CBE Birr Certified</span>
          </div>
        </div>
      </footer>


      {/* --- CART DRAWER OVERLAY --- */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="absolute inset-0 bg-black/80"
            />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute inset-y-0 right-0 max-w-md w-full bg-[#0B0B0E] border-l border-white/5 shadow-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-amber-500" />
                    <h3 className="text-xs font-black uppercase tracking-[0.25em]">Your Food Order</h3>
                  </div>
                  <button onClick={() => setCartOpen(false)} className="p-1 hover:text-amber-500 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <Utensils className="w-12 h-12 text-zinc-600 mx-auto opacity-30 animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">No dishes on queue</p>
                    <button 
                      onClick={() => setCartOpen(false)}
                      className="text-[9px] font-black text-amber-500 hover:underline uppercase tracking-widest"
                    >
                      Browse Royal Menu
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 overflow-y-auto max-h-[55vh] pr-2 scrollbar-thin">
                    {cart.map(item => (
                      <div key={item.id} className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img src={item.menuItem.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <h5 className="text-[11px] font-black uppercase tracking-wider text-white line-clamp-1">{item.menuItem.name}</h5>
                            <span className="text-[10px] font-black font-mono text-zinc-500">{item.menuItem.price} ETB</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <button 
                            onClick={() => updateCartQty(item.id, item.quantity - 1)}
                            className="p-1.5 bg-zinc-800 rounded-lg text-zinc-400 hover:text-amber-500"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-black font-mono text-white">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQty(item.id, item.quantity + 1)}
                            className="p-1.5 bg-zinc-800 rounded-lg text-zinc-400 hover:text-amber-500"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 bg-zinc-800/50 hover:bg-red-500/20 rounded-lg text-zinc-500 hover:text-red-400 ml-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-white/5 pt-6 space-y-6">
                  
                  {/* Coupon Area */}
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="ENTER COUPON: GURSHA15" 
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      className="flex-1 bg-zinc-900 border border-white/5 text-[10px] text-white p-2.5 rounded-xl uppercase font-mono tracking-widest focus:outline-none"
                    />
                    <button 
                      onClick={() => {
                        const verified = applyCoupon(couponCode);
                        if (!verified) alert("Invalid coupon code.");
                      }}
                      className="px-4 bg-zinc-800 hover:bg-amber-500 hover:text-black rounded-xl text-[9px] font-black uppercase tracking-wider transition-all"
                    >
                      Apply
                    </button>
                  </div>

                  {coupon && (
                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg flex justify-between items-center text-[9px] text-amber-400 font-bold uppercase tracking-widest">
                      <span>Promo coupon active:</span>
                      <span>-{coupon.value}%</span>
                    </div>
                  )}

                  {/* Pricing Matrix */}
                  <div className="space-y-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                    <div className="flex justify-between">
                      <span>Cart Subtotal</span>
                      <span className="text-white">{cartSubtotal} ETB</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-amber-500">
                        <span>Lounge discount</span>
                        <span>-{discountAmount} ETB</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Service Logistics VAT (15%)</span>
                      <span className="text-white">{vAt} ETB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Service Fee</span>
                      <span className="text-white">{deliveryFee} ETB</span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-3 text-sm text-amber-500 font-black">
                      <span>Grand Total</span>
                      <span>{cartTotal} ETB</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setCartOpen(false);
                      setCheckoutOpen(true);
                    }}
                    className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-400 text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl hover:opacity-95"
                  >
                    Proceed to Dining Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* --- CHECKOUT ENTRY OVERLAY --- */}
      <AnimatePresence>
        {checkoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setCheckoutOpen(false)}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-lg w-full bg-[#0E0E12] border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-white">Ethiopian Payment Processing</h4>
                </div>
                <button onClick={() => setCheckoutOpen(false)} className="text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleOrderCheckout} className="space-y-6">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">Customer Name *</label>
                    <input 
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="#almaz"
                      className="w-full bg-zinc-900 border border-white/5 text-[11px] p-3 rounded-xl focus:outline-none focus:border-amber-500 text-white font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">Recipient Phone *</label>
                    <input 
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+251 9..."
                      className="w-full bg-zinc-900 border border-white/5 text-[11px] p-3 rounded-xl focus:outline-none focus:border-amber-500 text-white font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">Fulfillment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button"
                      onClick={() => setDeliveryType('DELIVERY')}
                      className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                        deliveryType === 'DELIVERY' 
                          ? "bg-amber-500 text-black border-amber-500 font-black" 
                          : "bg-zinc-950 border-white/5 text-zinc-500"
                      }`}
                    >
                      Express Delivery
                    </button>
                    <button 
                      type="button"
                      onClick={() => setDeliveryType('PICKUP')}
                      className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                        deliveryType === 'PICKUP' 
                          ? "bg-amber-500 text-black border-amber-500 font-black" 
                          : "bg-zinc-950 border-white/5 text-zinc-500"
                      }`}
                    >
                      Bole Pickup Desk
                    </button>
                  </div>
                </div>

                {deliveryType === 'DELIVERY' && (
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">Logistics Home Address *</label>
                    <input 
                      type="text"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="Street address, Condominium suite, Addis Ababa"
                      className="w-full bg-zinc-900 border border-white/5 text-[11px] p-3 rounded-xl focus:outline-none focus:border-amber-500 text-white font-medium"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">Select Integrated Pay Platform</label>
                  <div className="grid grid-cols-2 gap-3 font-mono text-[9px] font-black uppercase">
                    {[
                      { id: 'CHAPA', name: 'Chapa (Cards/Birr)', color: 'border-emerald-500/20 text-emerald-400' },
                      { id: 'TELEBIRR', name: 'Telebirr Wallet', color: 'border-cyan-500/20 text-cyan-400' },
                      { id: 'CBE_BIRR', name: 'CBE Birr API', color: 'border-violet-500/20 text-violet-400' },
                      { id: 'CASH_ON_DELIVERY', name: 'Cash on Hand', color: 'border-zinc-500/20 text-zinc-400' }
                    ].map(pay => (
                      <button
                        key={pay.id}
                        type="button"
                        onClick={() => setPaymentMethod(pay.id as any)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                          paymentMethod === pay.id 
                            ? "bg-amber-500 text-black border-amber-500" 
                            : `bg-zinc-950 ${pay.color}`
                        }`}
                      >
                        <span>{pay.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-zinc-950/80 rounded-xl space-y-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-400 font-mono">
                  <div className="flex justify-between">
                    <span>Grand aggregate amount:</span>
                    <span className="text-white">{cartTotal} ETB</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-amber-900/10"
                >
                  Confirm & Initiate Gateway Signature
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* --- PAYMENT REDIRECT SIMULATION WINDOW --- */}
      <AnimatePresence>
        {submitSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black" />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-md w-full bg-[#0C0C10] border border-amber-500/20 rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Receipt Header */}
              <div className="bg-gradient-to-r from-amber-600 to-amber-500 p-8 text-black text-center space-y-2">
                <QrCode className="w-12 h-12 text-black mx-auto stroke-1" />
                <h4 className="text-sm font-black uppercase tracking-widest">Gateway Verified</h4>
                <p className="text-[10px] font-mono font-bold tracking-widest opacity-80">Reference: {submitSuccess.id}</p>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                
                <div className="text-center space-y-2">
                  <p className="text-[11px] text-zinc-400 font-medium">
                    Your {submitSuccess.payment} invoice has been dispatched successfully!
                  </p>
                  <h5 className="text-3xl font-black font-mono text-amber-500">
                    {submitSuccess.total} <span className="text-xs">ETB</span>
                  </h5>
                </div>

                <div className="p-4 bg-zinc-900/60 border border-white/5 rounded-xl space-y-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                  <div className="flex justify-between">
                    <span>Integrated Payee:</span>
                    <span className="text-white">GURSHA PREMIUM LTD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax Allocation ID:</span>
                    <span className="text-white">E-TIN-894012A</span>
                  </div>
                  <div className="flex justify-between border-t border-white/5 pt-2">
                    <span>Delivery System status:</span>
                    <span className="text-amber-500 animate-pulse">QUEUED PREPARATION</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {submitSuccess.redirect && (
                    <a 
                      href={submitSuccess.redirect}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-cyan-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all block text-center shadow-lg"
                    >
                      Authenticate in Superapp Gateway
                    </a>
                  )}
                  <button 
                    onClick={() => {
                      setSubmitSuccess(null);
                      navigate('/login'); // direct admin or track
                    }}
                    className="w-full py-3 bg-zinc-900 hover:bg-zinc-850 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-center text-white"
                  >
                    Track Live In Operations Desk
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
