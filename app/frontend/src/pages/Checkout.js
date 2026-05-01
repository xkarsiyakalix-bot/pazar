import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { t } from '../translations';

export const Checkout = ({ cartItems, setCartItems }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    email: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('paypal');

  const total = cartItems.reduce((sum, item) => {
    if (!item.price) return sum;
    const priceStr = String(item.price);
    // Almanca format: 1.800,50 TL → 1800.50
    // Önce TL ve boşlukları temizle, sonra binlik ayırıcı noktaları kaldır, virgülü noktaya çevir
    const cleanPrice = priceStr.replace(' TL', '').replace(/\s/g, '').trim();
    const price = parseFloat(cleanPrice.replace(/\./g, '').replace(',', '.')) || 0;
    return sum + (price * (item.quantity || 1));
  }, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Miktar güncelleme fonksiyonu
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = [...cartItems];
    updatedCart[index] = { ...updatedCart[index], quantity: newQuantity };
    setCartItems(updatedCart);
  };

  // Ürün silme fonksiyonu
  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Email bildirimi gönder
    const orderData = {
      orderId: `ORD-${Date.now()}`,
      email: formData.email,
      items: cartItems,
      total: `${total.toFixed(2).replace('.', ',')} TL`,
      customerName: `${formData.firstName} ${formData.lastName}`,
      address: `${formData.address}, ${formData.zip} ${formData.city}`
    };

    // Email bildirimini simüle et
    console.log('📧 Sending order confirmation email...');
    console.log('Order Data:', orderData);

    // LocalStorage'dan email ayarlarını kontrol et
    const emailSettings = JSON.parse(localStorage.getItem('emailSettings') || '{"orderConfirmation":true}');
    if (emailSettings.orderConfirmation) {
      console.log('✅ Order confirmation email sent to:', orderData.email);
      console.log('📦 Order ID:', orderData.orderId);
      console.log('💰 Total:', orderData.total);
    }

    alert(`Siparişiniz için teşekkür ederiz!\n\nSipariş Numarası: ${orderData.orderId}\n\n${formData.email} adresine bir onay e-postası gönderildi.`);
    setCartItems([]);
    navigate('/');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.cart.empty}</h2>
        <p className="text-gray-600 mb-8">{t.cart.addItems}</p>
        <button
          onClick={() => navigate('/')}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          {t.cart.continueShopping}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t.checkout.title}</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">{t.checkout.deliveryAddress}</h2>
            <form id="checkout-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.addListing.firstName}</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.addListing.lastName}</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.addListing.streetHouse}</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.checkout.postalCode}</label>
                <input
                  type="text"
                  name="zip"
                  required
                  value={formData.zip}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.addListing.city}</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.addListing.emailAddress}</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>
            </form>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">{t.checkout.paymentMethod}</h2>
            <div className="space-y-3">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-red-500 focus:ring-red-400"
                />
                <span className="ml-3 font-medium">PayPal</span>
              </label>
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="credit_card"
                  checked={paymentMethod === 'credit_card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-red-500 focus:ring-red-400"
                />
                <span className="ml-3 font-medium">Kreditkarte</span>
              </label>
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="invoice"
                  checked={paymentMethod === 'invoice'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-red-500 focus:ring-red-400"
                />
                <span className="ml-3 font-medium">Rechnung</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">{t.checkout.orderSummary}</h2>
            <div className="space-y-6 mb-6">
              {(() => {
                // Ürünleri satıcıya göre grupla
                const groupedBySeller = cartItems.reduce((acc, item) => {
                  const sellerId = item.sellerId || 'unknown';
                  if (!acc[sellerId]) {
                    acc[sellerId] = [];
                  }
                  acc[sellerId].push(item);
                  return acc;
                }, {});

                return Object.entries(groupedBySeller).map(([sellerId, items]) => {
                  const seller = mockSellers[sellerId] || {
                    name: t.cart.unknownSeller,
                    initials: '?',
                    level: t.addListing.private,
                    rating: t.addListing.options.new,
                    profileImage: 'https://i.pravatar.cc/150'
                  };

                  return (
                    <div key={sellerId} className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors">
                      {/* Satıcı Profili - Üstte ve Tıklanabilir */}
                      <div
                        onClick={() => navigate(`/seller/${seller?.user_number || sellerId}`)}
                        className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 mb-3 cursor-pointer hover:from-red-50 hover:to-orange-50 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          {/* Satıcı Profil Resmi */}
                          <div className="relative flex-shrink-0">
                            {seller.profileImage ? (
                              <img
                                src={seller.profileImage}
                                alt={seller.name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md group-hover:border-red-300 transition-colors"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
                                {seller.initials}
                              </div>
                            )}
                            {/* Online Status Badge */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>

                          {/* Satıcı Detayları */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-gray-900 truncate group-hover:text-red-600 transition-colors">{seller.name}</p>
                              {seller.level === 'Gewerblich' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-0.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-0.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-0.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-0.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  Pro
                                </span>
                              )}
                            </div>

                            {/* Bewertung */}
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-3.5 h-3.5 ${i < (seller.rating === 'Sehr gut' ? 5 : seller.rating === 'Gut' ? 4 : 3) ? 'text-yellow-400' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-0.921 1.603-0.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-0.364 1.118l1.07 3.292c.3.921-0.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-0.784.57-1.838-0.197-1.539-1.118l1.07-3.292a1 1 0 00-0.364-1.118L2.98 8.72c-0.783-0.57-0.38-1.81.588-1.81h3.461a1 1 0 00.951-0.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-xs text-gray-600">({seller.totalRatings || 0})</span>
                            </div>

                            {/* Antwortzeit */}
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-xs text-gray-600">Yanıt süresi: {seller.responseTime || 'birkaç saat'}</span>
                            </div>
                          </div>

                          {/* Profil anzeigen Icon */}
                          <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Satıcının Ürünleri */}
                      <div className="space-y-3">
                        {items.map((item, itemIndex) => {
                          // Orijinal cart index'ini bul
                          const cartIndex = cartItems.findIndex(cartItem =>
                            cartItem.id === item.id && cartItem.sellerId === item.sellerId
                          );

                          return (
                            <div key={itemIndex} className="flex gap-3 text-sm bg-white rounded-lg p-3 border border-gray-100 hover:border-gray-200 transition-colors">
                              <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium line-clamp-2 text-sm mb-2">{item.title}</p>

                                {/* Miktar Kontrolü */}
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">{t.cart.quantity}:</span>
                                  <div className="flex items-center border border-gray-300 rounded-full bg-white overflow-hidden">
                                    <button
                                      onClick={() => updateQuantity(cartIndex, (item.quantity || 1) - 1)}
                                      className="px-2 py-1 hover:bg-gray-50 text-gray-600 transition-colors"
                                      type="button"
                                    >
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                      </svg>
                                    </button>
                                    <div className="w-10 text-center font-medium text-gray-900 text-xs border-x border-gray-300 py-1">
                                      {item.quantity || 1}
                                    </div>
                                    <button
                                      onClick={() => updateQuantity(cartIndex, (item.quantity || 1) + 1)}
                                      className="px-2 py-1 hover:bg-gray-50 text-gray-600 transition-colors"
                                      type="button"
                                    >
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                      </svg>
                                    </button>
                                  </div>

                                  {/* Silme Butonu */}
                                  <button
                                    onClick={() => removeItem(cartIndex)}
                                    className="ml-auto p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                                    title={t.cart.remove}
                                    type="button"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-0.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <div className="font-semibold text-red-600 text-sm whitespace-nowrap flex-shrink-0">
                                {(() => {
                                  const priceStr = String(item.price);
                                  const cleanPrice = priceStr.replace(' TL', '').replace(/\s/g, '').trim();
                                  const unitPrice = parseFloat(cleanPrice.replace(/\./g, '').replace(',', '.')) || 0;
                                  const totalPrice = unitPrice * (item.quantity || 1);
                                  return totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' TL';
                                })()}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Satıcı Toplam */}
                      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {t.checkout.subtotal} ({items.reduce((total, item) => total + (item.quantity || 1), 0)} {t.cart.item})
                        </span>
                        <span className="font-semibold text-gray-900">
                          {items.reduce((sum, item) => {
                            const priceStr = String(item.price);
                            // Almanca format: 1.800,50 TL → 1800.50
                            const cleanPrice = priceStr.replace(' TL', '').replace(/\s/g, '').trim();
                            const price = parseFloat(cleanPrice.replace(/\./g, '').replace(',', '.')) || 0;
                            return sum + (price * (item.quantity || 1));
                          }, 0).toFixed(2).replace('.', ',')} TL
                        </span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>{t.checkout.subtotal}</span>
                <span>{total.toFixed(2).replace('.', ',')} TL</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t.checkout.shipping}</span>
                <span>{t.checkout.free}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                <span>{t.checkout.total}</span>
                <span>{total.toFixed(2).replace('.', ',')} TL</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              className="w-full mt-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {t.checkout.buyNow}
            </button>

            <p className="text-xs text-gray-500 mt-4 text-center">
              {t.checkout.termsConsent}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
// Placeholder Components for Meins Dropdown

export default Checkout;
