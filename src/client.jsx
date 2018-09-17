import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { addLocaleData, IntlProvider } from 'react-intl';
import Cookie from 'js-cookie';
import fetch from 'isomorphic-fetch';
import { getBrowserLanguage, getSupportedLocale } from 'util/i18n';

// NOTE: language preference is detected on the server
// from the accept-languages header and cached in a cookie
let locale = Cookie.get('locale') || 'en';

if (!locale) {
  // if no locale cookie - get a supported locale from navigator languages
  // otherwise default to 'en'

  // list of the locale's we support
  // TODO: get these from a config file shared by client and server
  let supportedLocales = ['en', 'ru'];
  // NOTE: this is the list we use in the Hub 
  // let supportedLocales = ['cs', 'bs', 'da', 'de', 'en-us', 'es', 'et', 'el', 'fi', 'fr', 'hr', 'id', 'it',
  //   'ja', 'ko', 'lt', 'lv', 'nb', 'nl', 'pl', 'pt-br', 'pt', 'pt-pt', 'ro', 'ru', 'sl', 'sr',
  //   'sv', 'th', 'tr', 'vi', 'zh', 'zh-cn', 'zh-tw', 'zh-hk'
  // ];
  locale = getSupportedLocale(getBrowserLanguage(window && window.navigator), supportedLocales) || 'en';
  // cache this locale for the next visit
  Cookie.set('locale', locale);
}

fetch(`/public/assets/${locale}.json`)
  .then((res) => {
    if (res.status >= 400) {
      throw new Error('Bad response from server');
    }

    return res.json();
  })
  .then((localeData) => {
    // TODO: how does this work?
    addLocaleData(window.ReactIntlLocaleData[locale]);

        
    ReactDOM.render(
      <IntlProvider locale={locale} messages={localeData} initialNow={parseInt(window.INITIAL_NOW, 10)}>
        <App />
      </IntlProvider>,
      document.getElementById('react-view')
    );
  }).catch(err => {
    console.error(err);
  });
