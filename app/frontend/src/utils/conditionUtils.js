/**
 * Condition translation and formatting utility
 * Normalizes all database condition variants (German / slug / Turkish) into clean Turkish labels.
 */
export const CONDITION_MAP = {
  // German / slug values
  'neu': 'Yeni',
  'Neu': 'Yeni',
  'neu_mit_etikett': 'Yeni (Etiketli)',
  'neu mit etikett': 'Yeni (Etiketli)',
  'sehr_gut': 'Çok İyi',
  'sehr gut': 'Çok İyi',
  'Sehr gut': 'Çok İyi',
  'gut': 'İyi',
  'Gut': 'İyi',
  'in_ordnung': 'İdare Eder',
  'in ordnung': 'İdare Eder',
  'In Ordnung': 'İdare Eder',
  'gebraucht': 'İkinci El',
  'Gebraucht': 'İkinci El',
  'defekt': 'Arızalı',
  'Defekt': 'Arızalı',

  // Turkish values (identity)
  'Yeni': 'Yeni',
  'Yeni (Etiketli)': 'Yeni (Etiketli)',
  'Yeni & Etiketli': 'Yeni (Etiketli)',
  'Çok İyi': 'Çok İyi',
  'İyi': 'İyi',
  'İdare Eder': 'İdare Eder',
  'Makul': 'İdare Eder',
  'İkinci El': 'İkinci El',
  'Arızalı': 'Arızalı',
  'Kusurlu': 'Arızalı',
  'Sıfır': 'Sıfır'
};

export const formatCondition = (val) => {
  if (!val) return '';
  const trimmed = String(val).trim();
  if (CONDITION_MAP[trimmed]) return CONDITION_MAP[trimmed];

  const lower = trimmed.toLowerCase();
  for (const [k, v] of Object.entries(CONDITION_MAP)) {
    if (k.toLowerCase() === lower) return v;
  }
  return trimmed;
};

export default formatCondition;
