"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translate = void 0;
// utils/translation.ts
var i18next_1 = require("i18next");
var react_i18next_1 = require("react-i18next");
i18next_1.default.use(react_i18next_1.initReactI18next).init({
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
var translate = function (key, options) {
    return i18next_1.default.t(key, options);
};
exports.translate = translate;
// In controller:
var message = (0, exports.translate)('waitingRoom.position', { position: 3 });
