import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:!bg-neutral-950 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'Gizlilik ve Çerez Politikası' }]} />
        
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 p-6 md:p-10 mt-6">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Gizlilik ve Çerez Politikası</h1>
          
          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-neutral-300 space-y-6">
            <p>Son güncellenme: {new Date().toLocaleDateString('tr-TR')}</p>
            
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Giriş</h2>
              <p>ExVitrin olarak kullanıcılarımızın gizliliğine ve kişisel verilerinin korunmasına büyük önem veriyoruz. Bu politika, sitemizi kullanırken toplanan verilerin nasıl kullanıldığını ve korunduğunu açıklar.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Toplanan Veriler</h2>
              <p>Kayıt olduğunuzda veya ilan verdiğinizde; adınız, e-posta adresiniz, telefon numaranız ve lokasyon bilgileriniz gibi temel veriler toplanabilir. Bu bilgiler sadece hizmet kalitesini artırmak ve kullanıcı güvenliğini sağlamak amacıyla kullanılır.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. Çerezler (Cookies)</h2>
              <p>Sitemizde size daha iyi bir deneyim sunabilmek, tercihlerinizi hatırlamak ve site trafiğini analiz etmek için çerezler kullanmaktayız. Çerezler, tarayıcınıza kaydedilen küçük metin dosyalarıdır. Tarayıcı ayarlarınızdan çerezleri istediğiniz zaman silebilir veya engelleyebilirsiniz.</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Zorunlu Çerezler:</strong> Sitenin temel fonksiyonlarının çalışması için gereklidir (örneğin oturum açma).</li>
                <li><strong>Performans Çerezleri:</strong> Sitemizi nasıl kullandığınızı analiz etmemizi sağlar (Google Analytics vb.).</li>
                <li><strong>İşlevsel Çerezler:</strong> Tercihlerinizi (karanlık mod, dil vb.) hatırlar.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">4. Veri Paylaşımı</h2>
              <p>Kişisel verileriniz, yasal zorunluluklar haricinde hiçbir şekilde üçüncü şahıslara satılmaz veya paylaşılmaz.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">5. İletişim</h2>
              <p>Gizlilik politikamız veya kişisel verilerinizle ilgili her türlü soru ve talebiniz için <strong>destek@exvitrin.com</strong> adresi üzerinden bizimle iletişime geçebilirsiniz.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
