/**
 * Skeleton Configuration
 * 
 * KULLANIM:
 * - enabled: true  -> Skeleton yükleme ekranları gösterilir (modern)
 * - enabled: false -> Eski spinner yükleme göstergesi kullanılır
 * 
 * İstemediğinizde bu dosyayı açıp enabled'ı false yapmanız yeterli!
 */

export const SKELETON_CONFIG = {
    enabled: true, // Skeleton'ları devre dışı bırakmak için false yapın

    // Animasyon hızı (ms)
    animationDuration: 1500,

    // Skeleton renkleri (isteğe bağlı özelleştirme)
    colors: {
        base: 'bg-gray-200',
        highlight: 'bg-gray-300'
    }
};
