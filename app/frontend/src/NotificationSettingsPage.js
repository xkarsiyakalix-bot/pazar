import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationSettingsPage = () => {
    const navigate = useNavigate();

    const [emailSettings, setEmailSettings] = useState({
        orderConfirmation: true,
        orderShipped: true,
        orderDelivered: true,
        newMessage: true,
        priceDrops: false,
        newListings: false,
        weeklyDigest: true,
        marketingEmails: false
    });

    const [testEmail, setTestEmail] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleToggle = (setting) => {
        setEmailSettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

    const handleSave = () => {
        // LocalStorage'a kaydet
        localStorage.setItem('emailSettings', JSON.stringify(emailSettings));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const sendTestEmail = () => {
        if (!testEmail) {
            alert('Lütfen bir e-posta adresi girin');
            return;
        }

        // Simüle edilmiş email gönderimi
        console.log('Test Email sent to:', testEmail);
        alert(`Test e-postası ${testEmail} adresine gönderildi!`);
    };

    const notificationGroups = [
        {
            title: 'Sipariş Bildirimleri',
            icon: '📦',
            settings: [
                { key: 'orderConfirmation', label: 'Sipariş Onayı', description: 'Siparişiniz onaylandığında e-posta alın' },
                { key: 'orderShipped', label: 'Kargo Bildirimi', description: 'Siparişiniz kargoya verildiğinde bildirim alın' },
                { key: 'orderDelivered', label: 'Teslimat Bildirimi', description: 'Siparişiniz teslim edildiğinde bildirim alın' }
            ]
        },
        {
            title: 'Mesajlar',
            icon: '💬',
            settings: [
                { key: 'newMessage', label: 'Yeni Mesajlar', description: 'Alıcılardan veya satıcılardan yeni mesaj geldiğinde bildirim alın' }
            ]
        },
        {
            title: 'İlanlar & Teklifler',
            icon: '🏷️',
            settings: [
                { key: 'priceDrops', label: 'Fiyat Düşüşleri', description: 'Favori listenizdeki ürünlerin fiyatı düştüğünde bildirim alın' },
                { key: 'newListings', label: 'Yeni İlanlar', description: 'Favori kategorilerinizdeki yeni ilanlar hakkında bildirim alın' }
            ]
        },
        {
            title: 'Bülten & Pazarlama',
            icon: '📧',
            settings: [
                { key: 'weeklyDigest', label: 'Haftalık Özet', description: 'Yeni teklifler hakkında haftalık özet e-postası alın' },
                { key: 'marketingEmails', label: 'Pazarlama E-postaları', description: 'Özel teklifler, indirimler ve promosyonlar' }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-red-500 text-white p-4">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-red-600 rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-2xl font-bold">E-posta Bildirimleri</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Success Message */}
                {showSuccess && (
                    <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-green-800 font-medium">Ayarlar başarıyla kaydedildi!</span>
                    </div>
                )}

                {/* Info Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <div className="flex items-start gap-4">
                        <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h0.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-2">E-posta Bildirimleri Hakkında</h3>
                            <p className="text-blue-800 text-sm">
                                E-posta ayarlarınızı yönetin ve hangi bildirimleri almak istediğinize karar verin.
                                Tercihlerinizi istediğiniz zaman değiştirebilirsiniz.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Notification Groups */}
                <div className="space-y-6">
                    {notificationGroups.map((group, idx) => (
                        <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <span className="text-2xl">{group.icon}</span>
                                    {group.title}
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {group.settings.map((setting) => (
                                    <div key={setting.key} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 mb-1">{setting.label}</h3>
                                                <p className="text-sm text-gray-600">{setting.description}</p>
                                            </div>
                                            <button
                                                onClick={() => handleToggle(setting.key)}
                                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${emailSettings[setting.key] ? 'bg-red-500' : 'bg-gray-200'
                                                    }`}
                                            >
                                                <span
                                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${emailSettings[setting.key] ? 'translate-x-5' : 'translate-x-0'
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Test Email Section */}
                <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Test e-postası gönder
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Bildirimlerin nasıl göründüğünü görmek için bir test e-postası gönderin.
                    </p>
                    <div className="flex gap-3">
                        <input
                            type="email"
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                            placeholder="e-posta@adresiniz.com"
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                        />
                        <button
                            onClick={sendTestEmail}
                            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                        >
                            Gönder
                        </button>
                    </div>
                </div>

                {/* Save Button */}
                <div className="mt-8 flex justify-end gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Ayarları Kaydet
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationSettingsPage;
