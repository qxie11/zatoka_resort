'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/lib/store';
import i18n from '@/lib/i18n';
import { I18nextProvider } from 'react-i18next';

export default function StoreProvider({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) {
  const storeRef = useRef<AppStore | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  // Sync i18n language on SSR and initial client load
  if (i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }

  return (
    <Provider store={storeRef.current}>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </Provider>
  );
}

