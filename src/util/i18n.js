/**
* Pull the language from the browser.
* Somewhat convoluted because "browsers"
*/
export function getBrowserLanguage (navigator) {
  if (!navigator) {
    return;
  }
  const browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'];
  let i;
  let language;

  // support for HTML 5.1 "navigator.languages"
  if (Array.isArray(navigator.languages) && navigator.languages.length > 0) {
    language = navigator.languages[0];
    if (language && language.length) {
      return language;
    }
  }

  // support for other well known properties in browsers
  for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
    language = navigator[browserLanguagePropertyKeys[i]];
    if (language && language.length) {
      return language;
    }
  }

  return null;
}

/**
 * Use the browser to determine the locale to use
 */
export function getSupportedLocale (locale, supportedLocales) {
  if (!locale) {
    return;
  }
  const lowerLocale = locale.toLowerCase();
  if (supportedLocales.indexOf(lowerLocale) > -1) {
    // use the full locale
    return lowerLocale;
  } else {
    // check the root
    const parts = lowerLocale.split('-');

    // did we get a root and is that in our list of supported locales?
    if (parts.length > 1 && supportedLocales.indexOf(parts[0]) > -1) {
      // ok, use the root
      return parts[0];
    }
  }
};
