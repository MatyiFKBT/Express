import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { store } from '../utils/useStorage';

// the translations
// (tip move them in a JSON file and import them)
import {langs} from "./data";
import dayjs from "dayjs";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: langs,
    lng: "en-GB",
    fallbackLng: "en-GB",
    defaultNS: "main",
    nsSeparator: "__",

    // keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

i18n.on("languageChanged", (lang) => {
  store.then(s => s.set("LANG", lang));
  dayjs.locale(lang === "test" ? "x-pseudo" : lang.toLowerCase());
})

store.then(s => s.get("LANG").then((r) => {
  if (r === "en-US") {
    i18n.changeLanguage("en");
    s.set("LANG", "en");
  } else if (r) {
    i18n.changeLanguage(r);
  } else {
    dayjs.locale("en-gb");
  }
}));

export const LANGS = [
  ["cs", "Čeština"],
  ["da", "Dansk"],
  ["de", "Deutsch"],
  ["en-GB", "English (UK)"],
  ["en", "English (US)"],
  ["fi", "Suomi"],
  ["fr", "Français (CA)"],
  ["hu", "Magyar"],
  ["nl", "Nederlands"],
  ["test", "Emojis"],
];

export default i18n;