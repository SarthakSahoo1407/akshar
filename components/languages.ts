export const languageMap = {
  en: 'english',
  hi: 'hindi',
  ta: 'tamil',
  te: 'telugu',
  or: 'odia',
  bn: 'bengali',
  mr: 'marathi',
  ml: 'malayalam',
  kn: 'kannada',
  as: 'assamese',
  gu: 'gujarati',
  ur: 'urdu',
  pa: 'punjabi',
  sa: 'sanskrit',
};

export type Language = keyof typeof languageMap;

export const languageList = Object.entries(languageMap).map(([code, name]) => ({
  code: code as Language,
  name,
}));
