import React, { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { slugToCategoryMap, slugToSubCategoryMap } from '../config/categoryConfigs';
import { AlleKategorienPage } from '../AlleKategorienPage';
import LoadingSpinner from '../components/LoadingSpinner';
import { CategorySEO } from '../SEO';

// Map of "categorySlug/subCategorySlug" → specific page component
// This ensures uniqueness when the same subSlug exists in multiple categories
const specificPageMap = {
  // === MODA & GÜZELLİK ===
  'moda-guzellik/kadin-giyimi':        lazy(() => import('../DamenbekleidungPage')),
  'moda-guzellik/erkek-giyimi':        lazy(() => import('../HerrenbekleidungPage')),
  'moda-guzellik/kadin-ayakkabilari':  lazy(() => import('../DamenschuhePage')),
  'moda-guzellik/erkek-ayakkabilari':  lazy(() => import('../HerrenschuhePage')),
  'moda-guzellik/canta-aksesuarlar':   lazy(() => import('../TaschenAccessoiresPage')),
  'moda-guzellik/saat-taki':           lazy(() => import('../UhrenSchmuckPage')),
  'moda-guzellik/guzellik-saglik':     lazy(() => import('../BeautyGesundheitPage')),
  'moda-guzellik/diger-moda-guzellik': lazy(() => import('../WeiteresModeBeautyPage')),

  // === ELEKTRONİK ===
  'elektronik/fotograf-kamera':                   lazy(() => import('../FotoPage')),
  'elektronik/dizustu-bilgisayarlar':             lazy(() => import('../NotebooksPage')),
  'elektronik/diz-ustu-bilgisayarlar':            lazy(() => import('../NotebooksPage')),
  'elektronik/cep-telefonu-telefon':              lazy(() => import('../HandyTelefonPage')),
  'elektronik/ev-aletleri':                       lazy(() => import('../HaushaltsgeraetePage')),
  'elektronik/konsollar':                         lazy(() => import('../KonsolenPage')),
  'elektronik/bilgisayarlar':                     lazy(() => import('../PCsPage')),
  'elektronik/bilgisayar-aksesuarlari-yazilim':   lazy(() => import('../PCZubehoerSoftwarePage')),
  'elektronik/tabletler-e-okuyucular':            lazy(() => import('../TabletsReaderPage')),
  'elektronik/tv-video':                          lazy(() => import('../TVVideoPage')),
  'elektronik/video-oyunlari':                    lazy(() => import('../VideospielePage')),
  'elektronik/diger-elektronik':                  lazy(() => import('../WeitereElektronikPage')),
  'elektronik/elektronik-hizmetler':              lazy(() => import('../ElektronikDienstleistungenPage')),
  'elektronik/ses-hifi':                          lazy(() => import('../AudioHifiPage')),

  // === EMLAK ===
  'emlak/kiralik-daireler':            lazy(() => import('../MietwohnungenPage')),
  'emlak/satilik-daireler':            lazy(() => import('../EigentumswohnungenPage')),
  'emlak/satilik-evler':               lazy(() => import('../HaeuserZumKaufPage')),
  'emlak/kiralik-evler':               lazy(() => import('../HaeuserZurMietePage')),
  'emlak/tatil-evi-yurt-disi-emlak':   lazy(() => import('../FerienAuslandsimmobilienPage')),
  'emlak/garaj-otopark':               lazy(() => import('../GaragenStellplaetzePage')),
  'emlak/ticari-emlak':                lazy(() => import('../GewerbeimmobilienPage')),
  'emlak/arsa-bahce':                  lazy(() => import('../GrundstueckeGaertenPage')),
  'emlak/satilik-yazlik':              lazy(() => import('../SatilikYazlikPage')),
  'emlak/yeni-projeler':               lazy(() => import('../NeubauprojektePage')),
  'emlak/tasimacilik-nakliye':         lazy(() => import('../UmzugTransportPage')),
  'emlak/diger-emlak':                 lazy(() => import('../WeitereImmobilienPage')),
  'emlak/gecici-konaklama-paylasimli-ev': lazy(() => import('../AufZeitWGPage')),
  'emlak/konteyner':                   lazy(() => import('../ContainerPage')),

  // === EV & BAHÇE ===
  'ev-bahce/oturma-odasi':             lazy(() => import('../WohnzimmerPage')),
  'ev-bahce/yatak-odasi':              lazy(() => import('../SchlafzimmerPage')),
  'ev-bahce/mutfak-yemek-odasi':       lazy(() => import('../KuecheEsszimmerPage')),
  'ev-bahce/lamba-aydinlatma':         lazy(() => import('../LampenLichtPage')),
  'ev-bahce/bahce-malzemeleri-bitkiler': lazy(() => import('../GartenzubehoerPflanzenPage')),
  'ev-bahce/ev-tekstili':              lazy(() => import('../HeimtextilienPage')),
  'ev-bahce/ev-tadilati':              lazy(() => import('../HeimwerkenPage')),
  'ev-bahce/dekorasyon':               lazy(() => import('../DekorationPage')),
  'ev-bahce/ofis':                     lazy(() => import('../BueroPage')),
  'ev-bahce/diger-ev-bahce':           lazy(() => import('../WeiteresHausGartenPage')),
  'ev-bahce/banyo':                    lazy(() => import('../BadezimmerPage')),
  'ev-bahce/ev-hizmetleri':            lazy(() => import('../DienstleistungenHausGartenPage')),

  // === EVCİL HAYVANLAR ===
  'evcil-hayvanlar/baliklar':          lazy(() => import('../FischePage')),
  'evcil-hayvanlar/kopekler':          lazy(() => import('../HundePage')),
  'evcil-hayvanlar/kedi':              lazy(() => import('../KatzenPage')),
  'evcil-hayvanlar/kediler':           lazy(() => import('../KatzenPage')),
  'evcil-hayvanlar/kucuk-hayvanlar':   lazy(() => import('../KleintierePage')),
  'evcil-hayvanlar/ciftlik-hayvanlari': lazy(() => import('../NutztierePage')),
  'evcil-hayvanlar/atlar':             lazy(() => import('../PferdePage')),
  'evcil-hayvanlar/hayvan-bakimi-egitimi': lazy(() => import('../TierbetreuungTrainingPage')),
  'evcil-hayvanlar/kayip-hayvanlar':   lazy(() => import('../VermissTierePage')),
  'evcil-hayvanlar/kuslar':            lazy(() => import('../VoegelPage')),
  'evcil-hayvanlar/aksesuarlar':       lazy(() => import('../TierzubehoerPage')),

  // === ANNE, BEBEK & ÇOCUK ===
  'aile-cocuk-bebek/oyuncaklar':               lazy(() => import('../SpielzeugPage')),
  'aile-cocuk-bebek/bebek-arabalari-pusetler':  lazy(() => import('../KinderwagenBuggysPage')),
  'aile-cocuk-bebek/bebek-odasi-mobilyalari':   lazy(() => import('../KinderzimmermobelPage')),
  'aile-cocuk-bebek/cocuk-odasi-mobilyalari':   lazy(() => import('../KinderzimmermobelPage')),
  'aile-cocuk-bebek/diger-aile-cocuk-bebek':    lazy(() => import('../WeiteresFamilieKindBabyPage')),
  'aile-cocuk-bebek/bebek-cocuk-giyimi':        lazy(() => import('../BabyKinderkleidungPage')),
  'aile-cocuk-bebek/bebek-cocuk-ayakkabilari':  lazy(() => import('../BabyKinderschuhePage')),
  'aile-cocuk-bebek/bebek-ekipmanlari':         lazy(() => import('../BabyAusstattungPage')),
  'aile-cocuk-bebek/oto-koltuklari':            lazy(() => import('../BabyschalenKindersitzePage')),
  'aile-cocuk-bebek/babysitter-cocuk-bakimi':   lazy(() => import('../BabysitterKinderbetreuungPage')),
  'aile-cocuk-bebek/yasli-bakimi':             lazy(() => import('../AltenpflegePage')),

  // === İŞ İLANLARI ===
  'is-ilanlari/gastronomi-turizm':                lazy(() => import('../GastronomieTourismusPage')),
  'is-ilanlari/musteri-hizmetleri-cagri-merkezi': lazy(() => import('../KundenserviceCallCenterPage')),
  'is-ilanlari/ek-isler':                         lazy(() => import('../MiniNebenjobsPage')),
  'is-ilanlari/mini-nebenjobs':                    lazy(() => import('../MiniNebenjobsPage')),
  'is-ilanlari/sosyal-sektor-bakim':               lazy(() => import('../SozialerSektorPflegePage')),
  'is-ilanlari/tasimacilik-lojistik':              lazy(() => import('../TransportLogistikVerkehrPage')),
  'is-ilanlari/satis-pazarlama':                   lazy(() => import('../SalesPurchasingMarketingPage')),
  'is-ilanlari/staj':                              lazy(() => import('../PraktikaPage')),
  'is-ilanlari/diger-is-ilanlari':                 lazy(() => import('../WeitereJobsPage')),
  'is-ilanlari/buro-yonetim':                      lazy(() => import('../BueroarbeitVerwaltungPage')),
  'is-ilanlari/buroarbeit-yonetim':                lazy(() => import('../BueroarbeitVerwaltungPage')),
  'is-ilanlari/insaat-sanat-uretim':              lazy(() => import('../BauHandwerkProduktionPage')),
  'is-ilanlari/mesleki-egitim':                    lazy(() => import('../AusbildungPage')),

  // === EĞLENCE, HOBİ & MAHALLE ===
  'eglence-hobi-mahalle/ezoterizm-spiritualizm':    lazy(() => import('../EsoterikSpirituellesFreizeitPage')),
  'eglence-hobi-mahalle/yiyecek-icecek':            lazy(() => import('../EssenTrinkenPage')),
  'eglence-hobi-mahalle/bos-zaman-aktiviteleri':    lazy(() => import('../FreizeitaktivitaetenPage')),
  'eglence-hobi-mahalle/el-sanatlari-hobi':         lazy(() => import('../HandarbeitBastelnKunsthandwerkPage')),
  'eglence-hobi-mahalle/sanat-antikalar':           lazy(() => import('../KunstAntiquitaetenPage')),
  'eglence-hobi-mahalle/sanatcilar-muzisyenler':    lazy(() => import('../KuenstlerMusikerPage')),
  'eglence-hobi-mahalle/model-yapimi':              lazy(() => import('../ModellbauPage')),
  'eglence-hobi-mahalle/seyahat-etkinlik-hizmetleri': lazy(() => import('../ReiseEventservicesPage')),
  'eglence-hobi-mahalle/koleksiyon':                lazy(() => import('../SammelnPage')),
  'eglence-hobi-mahalle/spor-kamp':                 lazy(() => import('../SportCampingPage')),
  'eglence-hobi-mahalle/bit-pazari':                lazy(() => import('../TroedelPage')),
  'eglence-hobi-mahalle/kayip-buluntu':             lazy(() => import('../VerlorenGefundenPage')),
  'eglence-hobi-mahalle/diger-eglence-hobi-mahalle': lazy(() => import('../WeiteresFreizeitHobbyNachbarschaftPage')),

  // === MÜZİK, FİLM & KİTAP ===
  'muzik-film-kitap/muzik-cdler':              lazy(() => import('../MusikCDsPage')),
  'muzik-film-kitap/muzik-cd':                 lazy(() => import('../MusikCDsPage')),
  'muzik-film-kitap/muzik-enstrumanlari':      lazy(() => import('../MusikinstrumentePage')),
  'muzik-film-kitap/film-dvd':                 lazy(() => import('../FilmDVDPage')),
  'muzik-film-kitap/ders-kitaplari-okul-egitim': lazy(() => import('../FachbuecherSchuleStudiumPage')),
  'muzik-film-kitap/kitap-dergi':              lazy(() => import('../BuecherZeitschriftenPage')),
  'muzik-film-kitap/kirtasiye':               lazy(() => import('../BueroSchreibwarenPage')),
  'muzik-film-kitap/cizgi-romanlar':           lazy(() => import('../ComicsPage')),
  'muzik-film-kitap/diger-muzik-film-kitap':  lazy(() => import('../WeitereMusikFilmeBuecherPage')),

  // === BİLETLER ===
  'biletler/konserler':                        lazy(() => import('../KonzertePage')),
  'biletler/spor':                             lazy(() => import('../SportTicketsPage')),
  'biletler/tiyatro-muzikal':                  lazy(() => import('../TheaterMusicalPage')),
  'biletler/hediye-kartlari':                  lazy(() => import('../GutscheinePage')),
  'biletler/cocuk':                            lazy(() => import('../KinderTicketsPage')),
  'biletler/cocuk-etkinlikleri':               lazy(() => import('../KinderTicketsPage')),
  'biletler/diger-biletler':                   lazy(() => import('../WeitereEintrittskartenTicketsPage')),
  'biletler/tren-toplu-tasima':               lazy(() => import('../BahnOEPNVPage')),
  'biletler/komedi-kabare':                    lazy(() => import('../ComedyKabarettPage')),

  // === HİZMETLER ===
  'hizmetler/sanatcilar-muzisyenler':          lazy(() => import('../DienstleistungenKuenstlerMusikerPage')),
  'hizmetler/tasimacilik-nakliye':             lazy(() => import('../DienstleistungenUmzugTransportPage')),
  'hizmetler/diger-hizmetler':                 lazy(() => import('../DienstleistungenWeiterePage')),
  'hizmetler/elektronik':                      lazy(() => import('../DienstleistungenElektronikPage')),
  'hizmetler/ev-bahce':                        lazy(() => import('../DienstleistungenHausGartenPage')),
  'hizmetler/seyahat-etkinlik':                lazy(() => import('../DienstleistungenReiseEventPage')),
  'hizmetler/hayvan-bakimi-egitimi':           lazy(() => import('../DienstleistungenTierbetreuungPage')),
  'hizmetler/yasli-bakimi':                    lazy(() => import('../DienstleistungenAltenpflegePage')),
  'hizmetler/otomobil-bisiklet-tekne-servisi':  lazy(() => import('../DienstleistungenAutoRadBootPage')),
  'hizmetler/babysitter-cocuk-bakimi':         lazy(() => import('../DienstleistungenBabysitterPage')),

  // === ÜCRETSİZ & TAKAS ===
  'ucretsiz-takas/takas':                      lazy(() => import('../TauschenPage')),
  'ucretsiz-takas/kiralama':                   lazy(() => import('../VerleihenPage')),
  'ucretsiz-takas/ucretsiz':                   lazy(() => import('../VerschenkenPage')),

  // === EĞİTİM & KURSLAR ===
  'egitim-kurslar/dans-kurslari':              lazy(() => import('../TanzkursePage')),
  'egitim-kurslar/spor-kurslari':              lazy(() => import('../SportkursePage')),
  'egitim-kurslar/muzik-san-dersleri':         lazy(() => import('../MusikGesangPage')),
  'egitim-kurslar/dil-kurslari':               lazy(() => import('../SprachkursePage')),
  'egitim-kurslar/ozel-ders':                  lazy(() => import('../NachhilfePage')),
  'egitim-kurslar/yemek-pastacilik-kurslari':  lazy(() => import('../KochenBackenPage')),
  'egitim-kurslar/sanat-tasarim-kurslari':     lazy(() => import('../KunstGestaltungPage')),
  'egitim-kurslar/surekli-egitim':             lazy(() => import('../WeiterbildungPage')),
  'egitim-kurslar/diger-dersler-kurslar':      lazy(() => import('../WeitereUnterrichtKursePage')),
  'egitim-kurslar/diger-egitim-kurslar':       lazy(() => import('../WeitereUnterrichtKursePage')),
  'egitim-kurslar/ezoterizm-spiritualizm':     lazy(() => import('../EsoterikSpirituellesPage')),
  'egitim-kurslar/bilgisayar-kurslari':        lazy(() => import('../ComputerkursePage')),

  // === OTOMOBİL, BİSİKLET & TEKNE ===
  'vasita/otomobiller':                  lazy(() => import('../AutosPage')),
  'vasita/oto-parca-lastik':            lazy(() => import('../AutoteilePage')),
  'vasita/motosiklet-scooter':           lazy(() => import('../MotorradPage')),
  'vasita/motosiklet-parca-aksesuarlar': lazy(() => import('../MotorradteilePage')),
  'vasita/ticari-araclar-romorklar':     lazy(() => import('../NutzfahrzeugePage')),
  'vasita/karavan-motokaravan':          lazy(() => import('../WohnwagenPage')),
  'vasita/tamir-servis':                 lazy(() => import('../ReparaturenPage')),
  'vasita/diger-otomobil-bisiklet-tekne': lazy(() => import('../WeiteresAutoRadBootPage')),
  'vasita/bisiklet-aksesuarlar':         lazy(() => import('../BikesPage')),
  'vasita/tekne-tekne-malzemeleri':      lazy(() => import('../BootePage')),
};

// Map of categorySlug → main category page component
const mainPageMap = {
  'vasita': lazy(() => import('../AutoRadBootPage')),
  'emlak':                   lazy(() => import('../ImmobilienPage')),
  'ev-bahce':                lazy(() => import('../HausGartenPage')),
  'moda-guzellik':           lazy(() => import('../ModeBeautyPage')),
  'elektronik':              lazy(() => import('../ElektronikPage')),
  'evcil-hayvanlar':         lazy(() => import('../HaustierePage')),
  'aile-cocuk-bebek':         lazy(() => import('../FamilieKindBabyPage')),
  'is-ilanlari':             lazy(() => import('../JobsPage')),
  'eglence-hobi-mahalle':    lazy(() => import('../FreizeitHobbyNachbarschaftPage')),
  'muzik-film-kitap':        lazy(() => import('../MusikFilmeBuecherPage')),
  'biletler':                lazy(() => import('../EintrittskartenTicketsPage')),
  'hizmetler':               lazy(() => import('../DienstleistungenPage')),
  'ucretsiz-takas':          lazy(() => import('../VerschenkenTauschenPage')),
  'egitim-kurslar':          lazy(() => import('../UnterrichtKursePage')),
  'komsu-yardimi':           lazy(() => import('../NachbarschaftshilfeMainPage')),
};

const Fallback = (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="large" />
  </div>
);

const DynamicCategoryPage = ({ toggleFavorite, isFavorite, category: propCategory, subCategory: propSubCategory }) => {
  const params = useParams();
  const categorySlug = propCategory || params.categorySlug || params.slug || '';
  const subCategorySlug = propSubCategory || params.subCategorySlug || params.subSlug || '';

  // Resolve names for SEO
  const categoryName = categorySlug
    ? Object.entries(slugToCategoryMap).find(
        ([key]) => key.toLowerCase() === categorySlug.toLowerCase()
      )?.[1]
    : null;

  const subCategoryName = subCategorySlug
    ? (Object.entries(slugToSubCategoryMap).find(
        ([key]) => key.toLowerCase() === subCategorySlug.toLowerCase()
      )?.[1] || subCategorySlug.replace(/-/g, ' '))
    : null;

  const seoElement = categoryName ? (
    <CategorySEO category={categoryName} subCategory={subCategoryName} />
  ) : null;

  // 1. Check Subcategory specific page
  if (categorySlug && subCategorySlug) {
    const compositeKey = `${categorySlug.toLowerCase()}/${subCategorySlug.toLowerCase()}`;
    const SpecificPage = specificPageMap[compositeKey];

    if (SpecificPage) {
      return (
        <Suspense fallback={Fallback}>
          {seoElement}
          <SpecificPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />
        </Suspense>
      );
    }
  }

  // 2. Check Main Category specific page
  if (categorySlug && !subCategorySlug) {
    const MainCategoryPage = mainPageMap[categorySlug.toLowerCase()];
    if (MainCategoryPage) {
      return (
        <Suspense fallback={Fallback}>
          {seoElement}
          <MainCategoryPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />
        </Suspense>
      );
    }
  }

  if (!categoryName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Kategori Bulunamadı</h1>
          <p className="text-gray-500">Aradığınız kategori mevcut değil veya taşınmış olabilir.</p>
        </div>
      </div>
    );
  }

  // Fall back to AlleKategorienPage for unrecognized combinations
  return (
    <>
      {seoElement}
      <AlleKategorienPage
        initialCategory={categoryName}
        initialSubCategory={subCategoryName}
        toggleFavorite={toggleFavorite}
        isFavorite={isFavorite}
      />
    </>
  );
};

export default DynamicCategoryPage;
