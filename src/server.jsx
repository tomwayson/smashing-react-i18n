import express from 'express';
import React from 'react';
import ReactDom from 'react-dom/server';
import App from './components/App';
import cookieParser from 'cookie-parser';
import acceptLanguage from 'accept-language';
import { addLocaleData, IntlProvider } from 'react-intl';
import fs from 'fs';
import path from 'path';

// read in data for all locales
import en from 'react-intl/locale-data/en';
import ru from 'react-intl/locale-data/ru';
// TODO: there's probably a better way to dynamically require() data for each locale
// and build up the array to pass to addLocaleData() while looping through locales below

// configure react-intl to use those locales when rendering on the server
addLocaleData([...ru, ...en]);

// now read the same locale data as strings to inject in the client
// and also read all messages as JSON for server side rendering
const allLocaleData = {};
const allLocaleMessages = {};
['en', 'ru'].forEach((locale) => {
  allLocaleData[locale] = fs.readFileSync(path.join(__dirname, `../node_modules/react-intl/locale-data/${locale}.js`)).toString();
  allLocaleMessages[locale] = require(`../public/assets/${locale}.json`);
});

const assetUrl = process.env.NODE_ENV !== 'production' ? 'http://localhost:8050' : '/';

function renderHTML(componentHTML, localeDataJs, initialNow) {
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
        <script type="application/javascript">${localeDataJs}</script>
        <script type="application/javascript">window.INITIAL_NOW=${JSON.stringify(initialNow)}</script>
        <script type="application/javascript" src="${assetUrl}/public/assets/bundle.js"></script>
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
app.use('/widgets', express.static('src/components/widgets'));

function detectLocale(req, defaultLocale) {
  const cookieLocale = req.cookies.locale;

  // first check for a language preference that we have already set
  // otherwise try to parse from the header or default to 'en'
  return acceptLanguage.get(cookieLocale || req.headers['accept-language']) || defaultLocale;
}

app.use((req, res) => {
  // NOTE: defaultLocale has to be the same on the client
  const defaultLocale = 'en';
  const locale = detectLocale(req, defaultLocale);
  let messages, localeDataJs;
  if (locale === defaultLocale) {
    // we only need default locale messages and data to render the app
    messages = allLocaleMessages[defaultLocale];
    localeDataJs = allLocaleData[defaultLocale];
  } else {
    // we also need the messages and data for the current locale
    // each message should fallback to the default if not available for current locale
    messages = { ...allLocaleMessages[defaultLocale], ...allLocaleMessages[locale] };
    localeDataJs = allLocaleData[defaultLocale] + allLocaleData[locale];
  }
  const initialNow = Date.now();
  const componentHTML = ReactDom.renderToString(
    <IntlProvider locale={locale} messages={messages} initialNow={initialNow}>
      <App />
    </IntlProvider>
  );

  // cache the language preference for subsequent requests
  res.cookie('locale', locale, { maxAge: (new Date() * 0.001) + (365 * 24 * 3600) });
  return res.end(renderHTML(componentHTML, localeDataJs, initialNow));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on: ${PORT}`); // eslint-disable-line no-console
});
