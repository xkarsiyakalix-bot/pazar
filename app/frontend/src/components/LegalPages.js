import React, { useEffect } from 'react';
import { t } from '../translations';

export const AnimalProtectionPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 py-12 px-4 shadow-sm">
      <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
        {/* Header Section */}
        <div className="bg-red-600 px-8 py-10 text-white text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h0.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-0.77-1.333-2.694-1.333-3.464 0L3.34 16c-0.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
            {t.footer.animalLawLink}
          </h1>
          <p className="text-red-100 font-medium max-w-2xl mx-auto">
            5199 Sayılı Hayvanları Koruma Kanunu ve Yasal Yükümlülükler Hakkında Bilgilendirme
          </p>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-12 space-y-8">
          <section className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 border-l-4 border-red-500">
            <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-50 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Yasal Uyarı Metni
            </h2>
            <p className="text-gray-700 dark:text-neutral-300 leading-relaxed text-lg italic">
              "{t.footer.animalLawDisclaimer}"
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-50 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              Kapsam ve Sorumluluk
            </h2>
            <div className="prose prose-red dark:prose-invert text-gray-600 dark:text-neutral-400 space-y-4 max-w-none">
              <p>
                ExVitrin platformu, kullanıcıların çeşitli kategorilerde ilanlar paylaşabildiği dijital bir pazaryeridir.
                Evcil hayvan kategorisinde paylaşılan ilanlar için aşağıdaki hususların bilinmesi yasal bir gerekliliktir:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Yer Sağlayıcı Konumu:</strong> ExVitrin, 5651 sayılı İnternet Ortamında Yapılan Yayınların Düzenlenmesi ve Bu Yayınlar Yoluyla İşlenen Suçlarla Mücadele Edilmesi Hakkında Kanun uyarınca "Yer Sağlayıcı" sıfatıyla hizmet vermektedir. Platform, içeriği kontrol etme sorumluluğuna sahip değildir.</li>
                <li><strong>Satış Tarafı Değildir:</strong> İşlemler sadece alıcı ve satıcı arasında gerçekleşir. ExVitrin bu işlemlerde aracı, komisyoncu veya garantör değildir.</li>
                <li><strong>Hayvan Sağlığı ve Refahı:</strong> İlan edilen canlıların sağlık durumu, aşılama kayıtları ve yaşam koşulları tamamen ilanı veren kullanıcının beyanı ve sorumluluğundadır.</li>
                <li><strong>Mevzuata Uyum:</strong> İlan sahiplerinin 5199 sayılı kanunda belirtilen tüm usul ve esaslara uyması zorunludur. Yasaklı ırkların satışı veya kanuna aykırı her türlü faaliyet yasaktır.</li>
              </ul>
            </div>
          </section>

          <section className="bg-blue-50 dark:bg-blue-500/10 rounded-2xl p-6 text-sm text-blue-800 dark:text-blue-300 flex gap-4 border border-blue-100 dark:border-blue-500/20">
            <svg className="w-6 h-6 shrink-0 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h0.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>
              Herhangi bir yasa dışı durum veya kanun aykırılık tespit ettiğiniz ilanları platformumuzun "İlanı Bildir" özelliğini kullanarak tarafımıza iletebilirsiniz. Gereken durumlarda yetkili mercilerle iş birliği yapılmaktadır.
            </p>
          </section>
        </div>

        {/* Footer Section */}
        <div className="bg-gray-100 dark:bg-white/5 p-8 text-center text-sm text-gray-500 dark:text-neutral-500 border-t border-gray-200 dark:border-white/5">
          <p>© 2025 ExVitrin - Hayvan Hakları ve Toplumsal Sorumluluk Politikası</p>
        </div>
      </div>
    </div>
  );
};

export const RealEstateLegalPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 py-12 px-4 shadow-sm">
      <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
        {/* Header Section */}
        <div className="bg-blue-600 px-8 py-10 text-white text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
            {t.footer.realEstateLawLink}
          </h1>
          <p className="text-blue-100 font-medium max-w-2xl mx-auto">
            Emlak Alım-Satım ve Kiralama İşlemlerinde Yasal Yükümlülükler
          </p>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-12 space-y-8">
          <section className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 border-l-4 border-blue-500">
            <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-50 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Yasal Uyarı Metni
            </h2>
            <p className="text-gray-700 dark:text-neutral-300 leading-relaxed text-lg italic">
              "{t.footer.realEstateDisclaimer}"
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-50 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              Önemli Bilgiler
            </h2>
            <div className="prose prose-blue dark:prose-invert text-gray-600 dark:text-neutral-400 space-y-4 max-w-none">
              <p>
                Emlak ilanları yayınlayan ve bu ilanlardan faydalanan kullanıcılarımızın dikkat etmesi gereken önemli hususlar:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Tapu Kontrolü:</strong> Gayrimenkul alım-satımında mutlaka tapu kaydını ve malik bilgilerini kontrol ediniz. Sahte tapu veya yetkisiz satış girişimlerine karşı dikkatli olunuz.</li>
                <li><strong>Emlak Danışmanı Yetkilendirmesi:</strong> İlan sahibinin yetkili bir emlak danışmanı olup olmadığını, varsa yetki belgesi numarasını sorgulayınız.</li>
                <li><strong>Ön Ödeme Riski:</strong> Görüşme yapmadan veya gayrimenkulü yerinde görmeden kesinlikle ön ödeme yapmayınız.</li>
                <li><strong>Sözleşme İncelemesi:</strong> Kira veya satış sözleşmelerini imzalamadan önce hukuki danışmanlık alınız.</li>
                <li><strong>Platform Sorumluluğu:</strong> ExVitrin sadece ilan yayınlama platformudur. Taraflar arasındaki anlaşmazlıklar, sözleşme ihlalleri veya hukuki sorunlardan sorumlu değildir.</li>
              </ul>
            </div>
          </section>

          <section className="bg-amber-50 dark:bg-amber-500/10 rounded-2xl p-6 text-sm text-amber-800 dark:text-amber-300 flex gap-4 border border-amber-100 dark:border-amber-500/20">
            <svg className="w-6 h-6 shrink-0 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h0.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-0.77-1.333-2.694-1.333-3.464 0L3.34 16c-0.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>
              Şüpheli veya dolandırıcılık amacı taşıdığını düşündüğünüz emlak ilanlarını "İlanı Bildir" özelliğini kullanarak tarafımıza bildirebilirsiniz.
            </p>
          </section>
        </div>

        {/* Footer Section */}
        <div className="bg-gray-100 dark:bg-white/5 p-8 text-center text-sm text-gray-500 dark:text-neutral-500 border-t border-gray-200 dark:border-white/5">
          <p>© 2025 ExVitrin - Emlak İlanları Yasal Uyarı ve Kullanıcı Bilgilendirmesi</p>
        </div>
      </div>
    </div>
  );
};

export const VehicleLegalPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 py-12 px-4 shadow-sm">
      <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
        {/* Header Section */}
        <div className="bg-orange-600 px-8 py-10 text-white text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
            {t.footer.vehicleLawLink}
          </h1>
          <p className="text-orange-100 font-medium max-w-2xl mx-auto">
            Araç Alım-Satımında Yasal Yükümlülükler ve Tüketici Hakları
          </p>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-12 space-y-8">
          <section className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 border-l-4 border-orange-500">
            <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-50 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              Yasal Uyarı Metni
            </h2>
            <p className="text-gray-700 dark:text-neutral-300 leading-relaxed text-lg italic">
              "{t.footer.vehicleDisclaimer}"
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-50 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              Araç Alımında Dikkat Edilmesi Gerekenler
            </h2>
            <div className="prose prose-orange dark:prose-invert text-gray-600 dark:text-neutral-400 space-y-4 max-w-none">
              <p>
                İkinci el araç alım-satımında kullanıcılarımızın güvenliği için aşağıdaki hususlara dikkat edilmelidir:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Tramer Kaydı:</strong> Aracın kaza geçmişini, hasar kayıtlarını ve sigorta bilgilerini mutlaka Tramer sisteminden sorgulayınız.</li>
                <li><strong>Ekspertiz Raporu:</strong> Bağımsız bir ekspertiz firmasından araç değerlendirme raporu alınız.</li>
                <li><strong>Ruhsat ve Belge Kontrolü:</strong> Aracın ruhsatı, trafik sigortası ve muayene belgelerinin güncel ve geçerli olduğundan emin olunuz.</li>
                <li><strong>Kilometre Doğrulaması:</strong> Kilometre saatinin değiştirilip değiştirilmediğini servis kayıtları ve muayene raporarıyla teyit ediniz.</li>
                <li><strong>Ticari Satıcılardan Alım:</strong> Ticari satıcılardan alımlarda 6 ay garanti hakkınız bulunmaktadır. Tüketici Kanunu kapsamındaki haklarınızı biliniz.</li>
                <li><strong>Bireysel Satıcılardan Alım:</strong> Bireysel satıcılardan alımlarda satıcının kimlik bilgilerini ve araç üzerindeki yetkisini kontrol ediniz.</li>
              </ul>
            </div>
          </section>

          <section className="bg-red-50 dark:bg-red-500/10 rounded-2xl p-6 text-sm text-red-800 dark:text-red-300 flex gap-4 border border-red-100 dark:border-red-500/20">
            <svg className="w-6 h-6 shrink-0 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h0.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-0.77-1.333-2.694-1.333-3.464 0L3.34 16c-0.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>
              Yanıltıcı bilgi içeren, sahte belge veya kilometre tahrifi yapılmış araç ilanlarını "İlanı Bildir" özelliğini kullanarak bildirmenizi rica ederiz.
            </p>
          </section>
        </div>

        {/* Footer Section */}
        <div className="bg-gray-100 dark:bg-white/5 p-8 text-center text-sm text-gray-500 dark:text-neutral-500 border-t border-gray-200 dark:border-white/5">
          <p>© 2025 ExVitrin - Vasıta İlanları Yasal Uyarı ve Tüketici Bilgilendirmesi</p>
        </div>
      </div>
    </div>
  );
};
