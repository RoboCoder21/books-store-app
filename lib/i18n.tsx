import React, { createContext, useContext, useMemo, useState } from 'react';

export type Language = 'en' | 'am';

type I18nContextValue = {
  language: Language;
  t: (key: string) => string;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
};

const translations: Record<Language, Record<string, string>> = {
  en: {
    brandTitle: 'My Bookstore',
    brandSubtitle: 'Discover, listen, enjoy.',
    heroEyebrow: 'Daily reading',
    heroHeadline: 'A quick bookstore with audiobooks.',
    heroSubhead: 'New releases and curated shelves every week.',
    heroCta: 'Browse now',
    searchPlaceholder: 'Search books or authors',
    newArrivals: 'New arrivals',
    seeAll: 'See all',
    audiobooks: 'Audiobooks',
    listen: 'Listen',
    trending: 'Trending books',
    viewAll: 'View all',
    popularAuthors: 'Popular authors',
    allBooks: 'All books',
    booksTitle: 'Books',
    browseByCategory: 'Browse by category',
    allTitlesFree: 'All titles are free to download and read offline.',
    picks: 'picks',
    pillar_fiction: 'Fiction',
    pillar_nonfiction: 'Nonfiction',
    pillar_spiritual: 'Spiritual',
    all: 'All',
    signOut: 'Sign out',
  },
  am: {
    brandTitle: 'የእኔ የመጽሐፍ መደብር',
    brandSubtitle: 'ፈልጉ፣ ያዳመጡ፣ ይደሰቱ።',
    heroEyebrow: 'የቀን ንባብ',
    heroHeadline: 'ከኦዲዮ  መጽሐፍት ጋር ፈጣን መደብር።',
    heroSubhead: 'በየሳምንቱ አዳዲስ እትሞችና የተዘጋጁ ሽሮች።',
    heroCta: 'አሁን ያስሱ',
    searchPlaceholder: 'መጽሐፍት ወይም ደራሲዎችን ይፈልጉ',
    newArrivals: 'አዳዲስ መጣቾች',
    seeAll: 'ሁሉንም ይመልከቱ',
    audiobooks: 'ኦዲዮ መጽሐፍት',
    listen: 'ይስሙ',
    trending: 'ታዋቂ መጽሐፍት',
    viewAll: 'ሁሉንም ይመልከቱ',
    popularAuthors: 'ታዋቂ ደራሲዎች',
    allBooks: 'ሁሉም መጽሐፍት',
    booksTitle: 'መጽሐፍት',
    browseByCategory: 'በምድብ ይፈልጉ',
    allTitlesFree: 'ሁሉም አርእስቶች በነጻ ሊወርዱና ከመስመር ውጭ ሊነበቡ ይችላሉ።',
    picks: 'ምርጫዎች',
    pillar_fiction: 'ልቦና ስነ-ጽሁፍ',
    pillar_nonfiction: 'እውነተኛ ታሪክ',
    pillar_spiritual: 'መንፈሳዊ',
    all: 'ሁሉም',
    signOut: 'ዘግተው ይውጡ',
  },
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = useMemo(
    () =>
      (key: string) => {
        const value = translations[language]?.[key];
        if (value) return value;
        return translations.en[key] ?? key;
      },
    [language]
  );

  const toggleLanguage = () => setLanguage((prev) => (prev === 'en' ? 'am' : 'en'));

  const value = useMemo(() => ({ language, t, setLanguage, toggleLanguage }), [language, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}
