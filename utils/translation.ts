// utils/translation.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        "consultation.scheduled": "Your consultation is scheduled for {{date}}",
        "waitingRoom.position": "Your position in queue: {{position}}",
        // ... other translations
      }
    },
    es: {
      translation: {
        "consultation.scheduled": "Su consulta está programada para {{date}}",
        "waitingRoom.position": "Su posición en la cola: {{position}}",
        // ... other translations
      }
    }
    // Add more languages
  },
  lng: 'en', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export const translate = (key: string, options?: any) => {
  return i18n.t(key, options);
};

// In controller:
const message = translate('waitingRoom.position', { position: 3 });