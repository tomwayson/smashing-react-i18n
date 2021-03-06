import React, { Component } from 'react';
import { fetchJson } from 'util';
import {
  intlShape,
  injectIntl,
  IntlProvider
} from 'react-intl';
import PropTypes from 'prop-types';

const propTypes = {
  // base URL for the widget
  uri: PropTypes.string.isRequired,
  // NOTE: we inject intl to get the current locale of the app
  // so we can only load the widget's messages for that locale
  intl: intlShape.isRequired,
  loadedDependencies: PropTypes.array.isRequired,
  onManifestLoaded: PropTypes.func
};

class WidgetWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isWidgetLoaded: false,
      dependency: null
    };
  }

  loadWidget(uri) {
    const intl = this.props.intl;
    // first fetch the manifest
    fetchJson(`${uri}/manifest.json`)
    .then(manifest => {
      if (this.props.onManifestLoaded) {
        this.props.onManifestLoaded(manifest);
      }
      if (manifest.dependency) {
        // ensure that the widget is not rendered until the dependency is loaded
        this.setState({ dependency: manifest.dependency });
      }
      // set up requests for the files required by the widget
      const requests = [];
      // first, load the widget class
      // NOTE: this demo uses an old version of webpack, so we can't just:
      // requests.push(import(/* webpackChunkName: "Widget" */ `${uri}/Widget`));
      // either way, this should be ~= to how ExB loads widgets w/ SystemJS:
      requests.push(new Promise(resolve => {
        require.ensure([], require => resolve(require(`.${uri}/Widget`)));
      }));
      if (manifest.defaultLocale) {
        // fetch messages for the widget's default locale
        requests.push(fetchJson(`.${uri}/messages/${manifest.defaultLocale}.json`))
        if (manifest.supportedLocales) {
          // fetch messages for the current locale, if the widget supports it
          const locale = intl.locale;
          if (manifest.supportedLocales.includes(locale)) {
            requests.push(fetchJson(`.${uri}/messages/${locale}.json`));
          }
        }  
      }
      // load all the widget files
      Promise.all(requests)
      .then(([module, defaultLocaleMessages, localeMessages]) => {
        this.WidgetClass = module.default;
        // merge the widget's messages for the current locale w/ the widget's defaults
        this.widgetMessages = {...defaultLocaleMessages,  ...localeMessages};
        // re-render the widget
        this.setState({ isWidgetLoaded: true });
      });
    });
  }

  componentDidMount() {
    if (!this.state.isWidgetLoaded) {
      this.loadWidget(this.props.uri);
    }
  }

  render() {
    if (!this.state.isWidgetLoaded) {
      // NOTE: currently this widget will never render on the server,
      // b/c isWidgetLoaded is only true after componentDidMount() calls loadWidget()
      // TODO: make this work more like ExB which, I assume,
      // renders local widgets (i.e. those not remotely hosted) on the server
      return null;
    }
    const dependency = this.state.dependency;
    if (dependency && !this.props.loadedDependencies.includes(dependency)) {
      // wait for the dependency to load before rendering
      return null;
    }
    // merge app messages with widget default and current locale messages
    const messages = {...this.props.intl.messages, ...this.widgetMessages};
    // render the widget wrapped in <IntlProvider />
    return <IntlProvider locale={this.props.intl.locale} messages={messages} initialNow={parseInt(window.INITIAL_NOW, 10)}>
      {/* NOTE: we are passing intl as a prop so that widget authors don't have to injectIntl() */}
      <this.WidgetClass intl={this.props.intl} />
    </IntlProvider>;
  }
}

WidgetWrapper.propTypes = propTypes;

export default injectIntl(WidgetWrapper);
