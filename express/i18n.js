const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const middleware = require("i18next-http-middleware");

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "ru",
    debug: false,
    backend: {
      loadPath: "./locales/{{lng}}.json",
    },
    detection: {
      order: ["querystring", "cookie"],
      caches: ["cookie"],
    },
    interpolation: {
      escapeValue: false, // not needed for express
    },
  });

module.exports = i18next;
