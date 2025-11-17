export function getVoiceLanguageCode(speakerLanguage: string): 'en-US' | 'es-ES' {
  const lang = speakerLanguage.toLowerCase();
  if (lang === 'english') return 'en-US';
  if (lang === 'spanish') return 'es-ES';
  // Default to English for unsupported languages
  return 'en-US';
}

export function isVoiceSupported(language: string): boolean {
  const supported = ['english', 'spanish'];
  return supported.includes(language.toLowerCase());
}
