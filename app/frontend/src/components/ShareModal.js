import React from 'react';

export const ShareModal = ({ isOpen, onClose, url, title }) => {
  if (!isOpen) return null;

  const shareOptions = [
    {
      name: 'Facebook',
      icon: (
        <svg className="w-6 h-6 fill-currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-0.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      color: 'bg-[#1877F2]',
      onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
    },
    {
      name: 'WhatsApp',
      icon: (
        <svg className="w-6 h-6 fill-currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-0.297-0.149-1.758-0.867-2.03-0.967-0.273-0.099-0.471-0.148-0.67.15-0.197.297-0.767.966-0.94 1.164-0.173.199-0.347.223-0.644.075-0.297-0.15-1.255-0.463-2.39-1.475-0.883-0.788-1.48-1.761-1.653-2.059-0.173-0.297-0.018-0.458.13-0.606.134-0.133.298-0.347.446-0.52.149-0.174.198-0.298.298-0.497.099-0.198.05-0.371-0.025-0.52-0.075-0.149-0.669-1.612-0.916-2.207-0.242-0.579-0.487-0.5-0.669-0.51-0.173-0.008-0.371-0.01-0.57-0.01-0.198 0-0.52.074-0.792.372-0.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-0.085 1.758-0.719 2.006-1.413.248-0.694.248-1.289.173-1.413-0.074-0.124-0.272-0.198-0.57-0.347m-5.421 7.403h-0.004a9.27 9.27 0 01-4.723-1.292l-0.339-0.202-3.51.92 1.017-3.65-0.213-0.339a9.204 9.204 0 01-1.513-5.07c0-5.116 4.158-9.273 9.274-9.273 2.479 0 4.808.966 6.557 2.715a9.192 9.192 0 012.711 6.56c0 5.117-4.158 9.275-9.276 9.275m8.211-17.487A11.026 11.026 0 0012.048 1.177c-6.115 0-11.09 4.974-11.09 11.088 0 2.112.553 4.135 1.611 5.922L.787 23l4.981-1.304c1.722.94 3.655 1.437 5.626 1.437h.005c6.114 0 11.089-4.975 11.089-11.088 0-2.937-1.144-5.698-3.235-7.791z" />
        </svg>
      ),
      color: 'bg-[#25D366]',
      onClick: () => {
        const text = `${title} ilanını ExVitrin'de keşfedin!`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
      }
    },
    {
      name: 'X (Twitter)',
      icon: (
        <svg className="w-6 h-6 fill-currentColor" viewBox="0 0 1200 1227">
          <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" />
        </svg>
      ),
      color: 'bg-black',
      onClick: () => {
        const text = `${title} ilanını ExVitrin'de keşfedin!`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
      }
    },
    {
      name: 'Bağlantı',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
      ),
      color: 'bg-gray-500',
      onClick: () => {
        navigator.clipboard.writeText(url).then(() => {
          alert('Bağlantı panoya kopyalandı!');
          onClose();
        });
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-end p-4 bg-black/20 dark:bg-black/40 backdrop-blur-[2px]" onClick={onClose}>
      <div
        className="bg-white dark:bg-neutral-900 w-64 rounded-2xl overflow-hidden shadow-2xl transition-all mt-16 animate-in slide-in-from-top-4 duration-200 border border-transparent dark:border-white/5"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-3 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-neutral-950/50">
          <h3 className="text-sm font-bold text-gray-900 dark:text-neutral-50">İlanı Paylaş</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          {shareOptions.map((opt, i) => (
            <button key={i} onClick={opt.onClick} className="flex items-center gap-3 p-2 rounded-xl border border-gray-50 hover:bg-gray-50 active:scale-95 transition-all w-full text-left">
              <div className={`${opt.color} w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm flex-shrink-0`}>
                {React.cloneElement(opt.icon, { className: 'w-4 h-4 fill-currentColor' })}
              </div>
              <span className="text-[11px] font-bold text-gray-700 dark:text-neutral-300 leading-tight">{opt.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
