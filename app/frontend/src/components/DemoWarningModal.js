import React, { useState, useEffect } from 'react';

const DemoWarningModal = () => {
    // İptal edildi: Kullanıcılar bu uyarıyı artık görmeyecek
    return null;

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Sadece daha önce kapatmadıysa göster
        const hasSeenWarning = localStorage.getItem('hasSeenDemoWarning');
        if (!hasSeenWarning) {
            // Animasyonlu gelmesi için küçük bir gecikme
            const timer = setTimeout(() => setIsOpen(true), 500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('hasSeenDemoWarning', 'true');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-white/10 animate-slide-up relative">
                
                {/* Header Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-rose-500 to-red-500"></div>

                <div className="p-6 md:p-8">
                    {/* Icon */}
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-5 mx-auto">
                        <span className="text-2xl md:text-3xl">👋</span>
                    </div>

                    {/* Content */}
                    <div className="text-center">
                        <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
                            ExVitrin'e Hoş Geldiniz!
                        </h2>
                        <p className="text-sm md:text-base text-gray-600 dark:text-neutral-400 mb-6 leading-relaxed">
                            Bu websitesi <strong>tanıtım ve portfolyo amaçlı</strong> olarak hazırlanmıştır. <br/><br/>
                            Site üzerinde yapılan hiçbir işlem, satın alma, ilan verme veya paket ödemesi <strong>gerçek değildir ve sizden hiçbir şekilde ücret tahsil edilmez.</strong><br/><br/>
                            Tüm özellikleri özgürce test edebilir ve platformu deneyimleyebilirsiniz.
                        </p>
                    </div>

                    {/* Action */}
                    <button
                        onClick={handleClose}
                        className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] transition-all text-white font-bold py-3 md:py-4 rounded-xl text-sm md:text-base uppercase tracking-wider shadow-lg shadow-red-500/20"
                    >
                        Anladım, Test Etmeye Başla
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DemoWarningModal;
