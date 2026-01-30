import React, { useState } from 'react';
import { t } from './translations';
import { saveContactMessage } from './api/contact';
import { Breadcrumb } from './components/Breadcrumb';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            await saveContactMessage(formData);
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setStatus(''), 5000);
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
            setTimeout(() => setStatus(''), 5000);
        }
    };

    const breadcrumbItems = [
        { label: 'ExVitrin', path: '/' },
        { label: 'İletişim', isActive: true }
    ];

    return (
        <main className="flex-grow pt-12 pb-20 px-4 bg-gray-50/50">
            <div className="max-w-5xl mx-auto">


                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                        {t.contact.title}
                    </h1>
                    <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
                        Sorularınız, önerileriniz veya destek talepleriniz için bize her zaman ulaşabilirsiniz.
                        Size en kısa sürede dönüş yapacağız.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    {/* Contact Form */}
                    <div>
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Bize Mesaj Gönderin</h2>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-1">
                                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">{t.contact.name}</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Adınız Soyadınız"
                                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500/50 transition-all"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="md:col-span-1">
                                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">{t.contact.email}</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="E-posta adresiniz"
                                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500/50 transition-all"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">{t.contact.subject}</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Konu başlığı"
                                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500/50 transition-all"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">{t.contact.message}</label>
                                    <textarea
                                        required
                                        rows={4}
                                        placeholder="Mesajınız..."
                                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500/50 transition-all resize-none"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>

                                <div className="md:col-span-2 mt-2">
                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-all shadow-sm hover:shadow-md text-sm uppercase tracking-wider disabled:opacity-50"
                                    >
                                        {status === 'loading' ? 'Gönderiliyor...' : t.contact.send}
                                    </button>
                                    {status === 'success' && (
                                        <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-2 text-green-700 text-xs font-semibold animate-in fade-in slide-in-from-top-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {t.contact.success}
                                        </div>
                                    )}
                                    {status === 'error' && (
                                        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-700 text-xs font-semibold">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Bir hata oluştu. Lütfen tekrar deneyin.
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ContactPage;
