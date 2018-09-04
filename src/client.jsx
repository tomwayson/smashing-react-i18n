import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { IntlProvider } from 'react-intl';
import Cookie from 'js-cookie';

// NOTE: language preference is detected on the server
// from the accept-languages header and cached in a cookie
// TODO: if no cookie - get from navigator languages
// otherwise default to 'en'
const locale = Cookie.get('locale') || 'en';

ReactDOM.render(
  <IntlProvider locale={locale}>
    <App />
  </IntlProvider>,
  document.getElementById('react-view')
);
