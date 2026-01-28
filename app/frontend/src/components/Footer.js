import React from 'react';
import { t } from '../translations';

export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 mt-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:grid md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
                    {/* ExVitrin */}
                    <div className="hidden md:block">
                        <h3 className="text-white font-semibold mb-4">ExVitrin</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/hakkimizda" className="hover:text-white transition-colors">{t.footer.aboutUs}</a></li>
                            <li><a href="/mobile-apps" className="hover:text-white transition-colors">{t.footer.mobileApps}</a></li>
                            <li><a href="/hayvan-haklari-ve-yasal-uyari" className="hover:text-white transition-colors">{t.footer.animalLawLink}</a></li>
                            <li><a href="/emlak-ilanlari-yasal-uyari" className="hover:text-white transition-colors">{t.footer.realEstateLawLink}</a></li>
                            <li><a href="/vasita-ilanlari-yasal-uyari" className="hover:text-white transition-colors">{t.footer.vehicleLawLink}</a></li>
                            <li><a href="/iletisim" className="text-red-400 hover:text-red-300 font-semibold transition-colors mt-2 inline-block">📞 {t.contact.title}</a></li>
                        </ul>
                    </div>

                    {/* Für Unternehmen */}
                    <div className="hidden md:block">
                        <h3 className="text-white font-semibold mb-4">{t.footer.forCompanies}</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/packages" className="hover:text-white transition-colors">{t.footer.proPackages}</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">{t.footer.advertising}</a></li>
                        </ul>
                    </div>

                    {/* Allgemein + Logo + Social Media */}
                    <div className="flex flex-col items-center md:items-start gap-6">
                        <div className="flex items-center gap-3">
                            <img src="/logo_exvitrin_2026.png" alt="ExVitrin" className="h-12 w-auto" />
                            <span className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent tracking-tight">
                                exvitrin
                            </span>
                        </div>

                        {/* Social Media Icons */}
                        <div className="flex gap-4">
                            <a href="https://facebook.com/exvitrin" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Facebook">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a href="https://instagram.com/exvitrin" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Instagram">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a href="https://youtube.com/@exvitrin" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="YouTube">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                            <a href="https://www.tiktok.com/@exvitrin" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="TikTok">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                                </svg>
                            </a>
                            <a href="https://pinterest.com/exvitrin" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Pinterest">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
                                </svg>
                            </a>
                            <a href="https://threads.net/@exvitrin" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Threads">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.704-1.8 0-3.19-.65-4.14-1.93C6.87 14.79 6.3 12.96 6.3 10.77c0-2.19.57-4.02 1.69-5.44.95-1.28 2.34-1.93 4.14-1.93 1.8 0 3.19.65 4.14 1.93.95 1.28 1.42 3.11 1.42 5.44 0 .94-.06 1.76-.18 2.46.49.28.88.61 1.17.99.58.76.87 1.71.87 2.84 0 1.27-.38 2.37-1.14 3.29-1.76 2.12-4.29 3.19-7.54 3.19zm.014-2.717c1.08 0 1.898-.31 2.438-.93.54-.62.81-1.54.81-2.76 0-.81-.15-1.54-.45-2.19-.3-.65-.75-1.17-1.35-1.56-.6-.39-1.35-.59-2.25-.59-1.08 0-1.898.31-2.438.93-.54.62-.81 1.54-.81 2.76 0 1.22.27 2.14.81 2.76.54.62 1.358.93 2.438.93z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500 space-y-4">
                <p>{t.footer.copyright}</p>
            </div>
        </footer>
    );
};
