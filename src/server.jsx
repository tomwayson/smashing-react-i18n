import express from 'express';
import React from 'react';
import ReactDom from 'react-dom/server';
import App from './components/App';
import cookieParser from 'cookie-parser';
import acceptLanguage from 'accept-language';
import { addLocaleData, IntlProvider } from 'react-intl';
import fs from 'fs';
import path from 'path';

// read in messages for all locales
import en from 'react-intl/locale-data/en';
import ru from 'react-intl/locale-data/ru';


addLocaleData([...ru, ...en]);

const messages = {};
const localeData = {};

['en', 'ru'].forEach((locale) => {
  localeData[locale] = fs.readFileSync(path.join(__dirname, `../node_modules/react-intl/locale-data/${locale}.js`)).toString();
  messages[locale] = require(`../public/assets/${locale}.json`);
});

const assetUrl = process.env.NODE_ENV !== 'production' ? 'http://localhost:8050' : '/';

function renderHTML(componentHTML, locale, initialNow) {
  return `
    <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Hello React</title>
      </head>
      <body>
        <div id="react-view">${componentHTML}</div>
        <script type="application/javascript" src="${assetUrl}/public/assets/bundle.js"></script>
        <script type="application/javascript">${localeData[locale]}</script>
        <script type="application/javascript">window.INITIAL_NOW=${JSON.stringify(initialNow)}</script>
      </body>
    </html>
  `;
}

// the languages supported by this app
// TODO: pull this from a config file?
acceptLanguage.languages(['en', 'ru']);

const app = express();

app.use(cookieParser());
app.use('/public/assets', express.static('public/assets'));

function detectLocale(req) {
  const cookieLocale = req.cookies.locale;

  // first check for a language preference that we have already set
  // otherwise try to parse from the header or default to 'en'
  return acceptLanguage.get(cookieLocale || req.headers['accept-language']) || 'en';
}

app.use((req, res) => {
  const locale = detectLocale(req);
  const initialNow = Date.now();
  const componentHTML = ReactDom.renderToString(
    <IntlProvider locale={locale} messages={messages[locale]} initialNow={initialNow}>
      <App />
    </IntlProvider>
  );

  // cache the language preference for subsequent requests
  res.cookie('locale', locale, { maxAge: (new Date() * 0.001) + (365 * 24 * 3600) });
  return res.end(renderHTML(componentHTML, locale, initialNow));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on: ${PORT}`); // eslint-disable-line no-console
});
