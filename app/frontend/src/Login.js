import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

function Login() {
    const navigate = useNavigate();
    const { signIn } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.email || !formData.password) {
            setError('Lütfen tüm alanları doldurun');
            return;
        }

        setLoading(true);

        try {
            await signIn(formData.email, formData.password);
            // Redirect to home on successful login
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Geçersiz e-posta veya şifre');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-start justify-center px-4 pt-12 pb-8">
            <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8">
                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Giriş Yap</h2>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                E-Mail
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
                                placeholder="max@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Şifre
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
                                placeholder="Şifreniz"
                                required
                            />
                        </div>

                        <div className="text-right">
                            <button
                                type="button"
                                onClick={() => navigate('/forgot-password')}
                                className="text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                                Şifrenizi mi unuttunuz?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                        </button>
                    </form>
                </div>

                {/* Registration Benefits */}
                <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Henüz kayıtlı değil misiniz?</h3>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <h4 className="font-semibold text-gray-900">Her yerden erişilebilir favori listeniz</h4>
                                <p className="text-sm text-gray-600">Favorilerinizi kaydedin ve her cihazdan erişin</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <h4 className="font-semibold text-gray-900">Mesajları her yerden okuyun ve yanıtlayın</h4>
                                <p className="text-sm text-gray-600">Alıcılar ve satıcılarla doğrudan iletişim kurun</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <h4 className="font-semibold text-gray-900">İlanları kolay yönetin ve düzenleyin</h4>
                                <p className="text-sm text-gray-600">İlanlarınızı birkaç tıklamayla oluşturun, düzenleyin ve yönetin</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/register')}
                        className="w-full bg-white border-2 border-red-500 text-red-600 py-3 px-4 rounded-lg font-semibold hover:bg-red-50 transition-all"
                    >
                        30 saniyede kayıt olun
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
