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
  intl: intlShape.isRequired
};

class WidgetWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {isWidgetLoaded: false};
  }

  loadWidget(uri) {
    const intl = this.props.intl;
    // first fetch the manifest
    fetchJson(`${uri}/manifest.json`)
    .then(manifest => {
      // set up requests for the files required by the widget
      const requests = [];
      // first, load the widget class
      // NOTE: this demo uses an old version of webpack, so we can't just:
      // requests.push(import(/* webpackChunkName: "Widget" */ `${uri}/Widget`));
      // either way, this should be ~= to how ExB loads widgets w/ SystemJS:
      requests.push(new Promise(resolve => {
        require.ensure([], require => resolve(require(`.${uri}/Widget`)));
      }));
      if (manifest.supportedLocales) {
        // fetch messages for the current locale, if the widget supports it
        const locale = intl.locale;
        if (manifest.supportedLocales.includes(locale)) {
          requests.push(fetchJson(`.${uri}/messages/${locale}.json`));
        }
      }
      // load all the widget files
      Promise.all(requests)
      .then(([module, localeMessages]) => {
        this.WidgetClass = module.default;
        this.messages = intl.messages;
        if (localeMessages) {
          this.messages = {...this.messages, ...localeMessages};
        }
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
    // render the widget wrapped in <IntlProvider />
    // NOTE: currently this widget will never render on the server,
    // b/c isWidgetLoaded is only true after componentDidMount() calls loadWidget()
    // TODO: make this work more like ExB which, I assume,
    // renders local widgets (i.e. those not remotely hosted) on the server
    return this.state.isWidgetLoaded && (
      <IntlProvider locale={this.props.intl.locale} messages={this.messages} initialNow={parseInt(window.INITIAL_NOW, 10)}>
        {/* NOTE: we are passing intl as a prop so that widget authors don't have to injectIntl() */}
        <this.WidgetClass intl={this.props.intl} />
      </IntlProvider>
    );
  }
}

WidgetWrapper.propTypes = propTypes;

export default injectIntl(WidgetWrapper);
