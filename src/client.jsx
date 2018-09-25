import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { addLocaleData, IntlProvider } from 'react-intl';
import Cookie from 'js-cookie';
import { getBrowserLanguage, getSupportedLocale } from 'util/i18n';
import { fetchJson } from './util';
// include default messages in the bundle
const defaultMessages = require('../public/assets/en.json');

// NOTE: this needs to be the same as what is required for defaultMessages
// and therefore cannot be dynamically read from an app's config
const defaultLocale = 'en';

// NOTE: language preference is detected on the server
// from the accept-languages header and cached in a cookie
let locale = Cookie.get('locale') || defaultLocale;

if (!locale) {
  // if no locale cookie - get a supported locale from navigator languages
  // otherwise use the default locale

  // list of the locale's we support
  // TODO: get these from a config file shared by client and server
  let supportedLocales = ['en', 'ru'];

  // NOTE: this is the list we use in the Hub 
  // let supportedLocales = ['cs', 'bs', 'da', 'de', 'en-us', 'es', 'et', 'el', 'fi', 'fr', 'hr', 'id', 'it',
  //   'ja', 'ko', 'lt', 'lv', 'nb', 'nl', 'pl', 'pt-br', 'pt', 'pt-pt', 'ro', 'ru', 'sl', 'sr',
  //   'sv', 'th', 'tr', 'vi', 'zh', 'zh-cn', 'zh-tw', 'zh-hk'
  // ];
  locale = getSupportedLocale(getBrowserLanguage(window && window.navigator), supportedLocales) || defaultLocale;
  // cache this locale for the next visit
  Cookie.set('locale', locale);
}

function loadLocaleMessages(locale, defaultLocale, defaultMessages) {
  if (locale !== defaultLocale) {
    return fetchJson(`/public/assets/${locale}.json`)
    .then(localeMessages => {
      // each message should fallback to the default if not available for current locale
      return { ...defaultMessages, ...localeMessages }
    });
  } else {
    return Promise.resolve(defaultMessages);
  }
}

loadLocaleMessages(locale, defaultLocale, defaultMessages)
  .then(messages => {
    // NOTE: the locales are added to window.ReactIntlLocaleData in a script embedded on the server
    addLocaleData(window.ReactIntlLocaleData[defaultLocale]);
    if (locale !== defaultLocale) {
      addLocaleData(window.ReactIntlLocaleData[locale]);
    }
        
    ReactDOM.render(
      <IntlProvider locale={locale} messages={messages} initialNow={parseInt(window.INITIAL_NOW, 10)}>
        <App />
      </IntlProvider>,
      document.getElementById('react-view')
    );
  }).catch(err => {
    console.error(err);
  });
