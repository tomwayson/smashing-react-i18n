import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { addLocaleData, IntlProvider } from 'react-intl';
import Cookie from 'js-cookie';
import fetch from 'isomorphic-fetch';

// NOTE: language preference is detected on the server
// from the accept-languages header and cached in a cookie
// TODO: if no cookie - get from navigator languages
// otherwise default to 'en'
const locale = Cookie.get('locale') || 'en';

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
