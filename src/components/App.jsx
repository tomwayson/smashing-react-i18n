import React, { Component } from 'react';
import LocaleButton from './LocaleButton';
import Counting from './Counting';
import FormattingExample from './FormattingExample';
import {
  FormattedMessage,
  intlShape,
  injectIntl
} from 'react-intl';
import WidgetWrapper from './WidgetWrapper';
import { loadLocaleMessages } from '../util/i18n';

const propTypes = {
  intl: intlShape.isRequired,
};

class App extends Component {
  constructor(props) {
    super(props);
    // NOTE: using app state as an approximation of a redux store
    this.state = {
      // keep track of dependencies that have been loaded
      // NOTE: this is a very naive implementation
      loadedDependencies: []
    };
  }

  onManifestLoaded = (manifest) => {
    // first, check for a dependency
    const dependency = manifest.dependency;
    if (dependency) {
      // NOTE: we're emulating loading lazy loading a dependency like jimu-arcgis
      // but all that really matters for this demo is the locale messages
      const loadedDependencies = this.state.loadedDependencies;
      if (!loadedDependencies.includes(dependency)) {
        // get the current and default locales and load all the messages for this dependency
        const intl = this.props.intl;
        loadLocaleMessages(`/public/assets/${dependency}`, intl.locale, intl.defaultLocale)
        .then(dependencyMessages => {
          // NOTE: here we are mutating the intl instance directly
          intl.messages = {...intl.messages, ...dependencyMessages};
          // this works b/c we setState() below, which triggers a re-render of the whole app
          // maybe instead we should track messages as part of the app state (store)
          // and below render everything rendered in <IntlProvider messages={this.state.messages} ...>
          this.setState({
            // signal to the widgets that the dependency has been loaded
            loadedDependencies: [...loadedDependencies, dependency]
          });
        });
      }
    }
  }

  render() {
    return (
      <div className="App">
        <h1><FormattedMessage id="app.hello_world" /></h1>
        <p><FormattedMessage id="app.enOnly" /></p>
        <h1><LocaleButton locale={this.props.intl.locale} /></h1>
        <Counting />
        <FormattingExample />
        <WidgetWrapper uri="/widgets/TestWidget" loadedDependencies={this.state.loadedDependencies} onManifestLoaded={this.onManifestLoaded} />
        <WidgetWrapper uri="/widgets/arcgis/ArcGISWidget" loadedDependencies={this.state.loadedDependencies} onManifestLoaded={this.onManifestLoaded} />
      </div>
    );
  }
}

App.propTypes = propTypes;

export default injectIntl(App);
