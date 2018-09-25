import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { addLocaleData, IntlProvider } from 'react-intl';
import Cookie from 'js-cookie';
import { getBrowserLanguage, getSupportedLocale } from 'util/i18n';
import { fetchJson } from './util';

const defaultLocale = 'en'

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

const messageRequests = [];
// TODO: this should be included, and not fetched!
messageRequests.push(fetchJson(`/public/assets/${defaultLocale}.json`));
if (locale !== defaultLocale) {
  messageRequests.push(fetchJson(`/public/assets/${locale}.json`));
}
Promise.all(messageRequests)
  .then(([defaultMessages, localeMessages]) => {
    // each message should fallback to the default if not available for current locale
    const messages = localeMessages ? { ...defaultMessages, ...localeMessages } : defaultMessages;
    // TODO: how does this work?
    addLocaleData(window.ReactIntlLocaleData[locale]);
    // TODO: do we need to add the locale data for the default locale too if it's not the same?

        
    ReactDOM.render(
      <IntlProvider locale={locale} messages={messages} initialNow={parseInt(window.INITIAL_NOW, 10)}>
        <App />
      </IntlProvider>,
      document.getElementById('react-view')
    );
  }).catch(err => {
    console.error(err);
  });
