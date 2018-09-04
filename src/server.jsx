import express from 'express';
import React from 'react';
import ReactDom from 'react-dom/server';
import App from './components/App';
import cookieParser from 'cookie-parser';
import acceptLanguage from 'accept-language';
import { IntlProvider } from 'react-intl';

const assetUrl = process.env.NODE_ENV !== 'production' ? 'http://localhost:8050' : '/';

function renderHTML(componentHTML) {
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
      </body>
    </html>
  `;
}

// the languages supported by this app
// TODO: pull this from a config file?
acceptLanguage.languages(['en', 'ru']);

const app = express();

app.use(cookieParser());

function detectLocale(req) {
  const cookieLocale = req.cookies.locale;

  // first check for a language preference that we have already set
  // otherwise try to parse from the header or default to 'en'
  return acceptLanguage.get(cookieLocale || req.headers['accept-language']) || 'en';
}

app.use((req, res) => {
  const locale = detectLocale(req);
  const componentHTML = ReactDom.renderToString(
    <IntlProvider locale={locale}>
      <App />
    </IntlProvider>
  );

  // cache the language preference for subsequent requests
  res.cookie('locale', locale, { maxAge: (new Date() * 0.001) + (365 * 24 * 3600) });
  return res.end(renderHTML(componentHTML));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on: ${PORT}`); // eslint-disable-line no-console
});
