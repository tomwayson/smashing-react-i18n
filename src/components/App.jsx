import React, { Component } from 'react';
import LocaleButton from './LocaleButton';
import {
  FormattedDate,
  FormattedRelative,
  FormattedNumber,
  FormattedMessage,
  intlShape,
  injectIntl,
  defineMessages,
} from 'react-intl';

const propTypes = {
  intl: intlShape.isRequired,
};

const messages = defineMessages({
  counting: {
    id: 'app.counting',
    defaultMessage: 'I need to buy {count, number} {count, plural, one {apple} other {apples}}'
  },
  helloWorld2: {
    id: 'app.hello_world2',
    defaultMessage: 'Hello World 2!',
  },
});

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1><FormattedMessage id="app.hello_world" defaultMessage="Hello World!" description="Hello world header greeting" /></h1>
        <h1>{this.props.intl.formatMessage(messages.helloWorld2)}</h1>
        <h1><LocaleButton locale={this.props.intl.locale} /></h1>
        <div>{this.props.intl.formatMessage(messages.counting, { count: 1 })}</div>
        <div>{this.props.intl.formatMessage(messages.counting, { count: 2 })}</div>
        <div>{this.props.intl.formatMessage(messages.counting, { count: 5 })}</div>
        <div>{this.props.intl.formatMessage(messages.counting, { count: 5 })}</div>
        {/* NOTE: The following will _always_ use the 'en' locale on the server, why? */}
        <div><FormattedDate value={Date.now()} /></div>
        <div><FormattedNumber value="1000" currency="USD" currencyDisplay="symbol" style="currency" /></div>
        <div><FormattedRelative value={1536104584358} /></div>
      </div>
    );
  }
}

App.propTypes = propTypes;

export default injectIntl(App);
