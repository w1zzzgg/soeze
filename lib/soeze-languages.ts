// =============================================================================
// SOEZE MULTILINGUAL PHONETIC DATA
// =============================================================================
// IMPORTANT: These are PHONETIC adaptations, NOT literal translations.
// The goal is to represent how the SOUND of "SO" and "EZE" would be written
// in each language's native script.
//
// "SO" → The sound "so" (like "so" in "solo")
// "EZE" → The sound "easy" / "ee-zee"
//
// REPLACE_ME — VERIFY PHONETIC SPELLING
// All entries should be verified by a native speaker of each language
// before final publication.
// =============================================================================

export interface SoezeLanguage {
  language: string;
  code: string;
  // PHONETIC — NOT LITERAL TRANSLATION
  so: string;
  // PHONETIC — NOT LITERAL TRANSLATION (approximate "ee-zee" sound)
  eze: string;
}

// Deterministic pairing order for the animation cycle.
// Each cycle shows one language pair. The system steps through this array.
export const SOEZE_LANGUAGES: SoezeLanguage[] = [
  {
    language: "English",
    code: "en",
    so: "SO",
    eze: "EZE",
  },
  {
    language: "Marathi",
    code: "mr",
    // REPLACE_ME — VERIFY PHONETIC SPELLING
    so: "सो",
    eze: "ईझी",
  },
  {
    language: "Hindi",
    code: "hi",
    // REPLACE_ME — VERIFY PHONETIC SPELLING
    so: "सो",
    eze: "ईज़ी",
  },
  {
    language: "Sanskrit",
    code: "sa",
    // REPLACE_ME — VERIFY PHONETIC SPELLING
    so: "सो",
    eze: "ईझी",
  },
  {
    language: "Japanese",
    code: "ja",
    // REPLACE_ME — VERIFY PHONETIC SPELLING
    so: "ソ",
    eze: "イージー",
  },
  {
    language: "Korean",
    code: "ko",
    // REPLACE_ME — VERIFY PHONETIC SPELLING
    so: "소",
    eze: "이지",
  },
  {
    language: "Chinese",
    code: "zh",
    // REPLACE_ME — VERIFY PHONETIC SPELLING
    so: "嗦",
    eze: "易知",
  },
  {
    language: "Arabic",
    code: "ar",
    // REPLACE_ME — VERIFY PHONETIC SPELLING
    so: "سو",
    eze: "إيزي",
  },
  {
    language: "Spanish",
    code: "es",
    so: "SO",
    eze: "IZI",
  },
  {
    language: "French",
    code: "fr",
    so: "SO",
    eze: "IZÉ",
  },
  {
    language: "German",
    code: "de",
    so: "SO",
    eze: "ISI",
  },
  {
    language: "Russian",
    code: "ru",
    // REPLACE_ME — VERIFY PHONETIC SPELLING
    so: "СО",
    eze: "ИЗИ",
  },
  {
    language: "Tamil",
    code: "ta",
    // REPLACE_ME — VERIFY PHONETIC SPELLING
    so: "சோ",
    eze: "இஸி",
  },
  {
    language: "Telugu",
    code: "te",
    // REPLACE_ME — VERIFY PHONETIC SPELLING
    so: "సో",
    eze: "ఈజీ",
  },
  {
    language: "Kannada",
    code: "kn",
    // REPLACE_ME — VERIFY PHONETIC SPELLING
    so: "ಸೋ",
    eze: "ಈಜಿ",
  },
  {
    language: "Malayalam",
    code: "ml",
    // REPLACE_ME — VERIFY PHONETIC SPELLING
    so: "സോ",
    eze: "ഈസി",
  },
];

// Pastel color pairs for each language pair cycle (light mode then dark mode).
// Colors rotate through a curated palette as languages change.
// Each entry: [soColor, ezeColor]
export const SOEZE_COLOR_CYCLES_LIGHT: [string, string][] = [
  ["#c4b5fd", "#fda4af"], // lavender + rose
  ["#a5f3fc", "#fca5a5"], // cyan + salmon
  ["#bbf7d0", "#fde68a"], // mint + amber
  ["#c4b5fd", "#fcd34d"], // lavender + gold
  ["#a5f3fc", "#f9a8d4"], // cyan + pink
  ["#bfdbfe", "#fda4af"], // blue + rose
  ["#d9f99d", "#fca5a5"], // lime + salmon
  ["#c4b5fd", "#fed7aa"], // lavender + peach
  ["#a5f3fc", "#fda4af"], // back to start variation
];

export const SOEZE_COLOR_CYCLES_DARK: [string, string][] = [
  ["#a78bfa", "#fb7185"], // violet + coral
  ["#67e8f9", "#f87171"], // sky + red
  ["#6ee7b7", "#fbbf24"], // emerald + amber
  ["#a78bfa", "#fcd34d"], // violet + gold
  ["#67e8f9", "#f472b6"], // sky + pink
  ["#93c5fd", "#fb7185"], // blue + coral
  ["#a3e635", "#f87171"], // lime + red
  ["#a78bfa", "#fb923c"], // violet + orange
  ["#67e8f9", "#fb7185"], // back to start variation
];
