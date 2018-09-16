import React, { Component } from 'react';
import LocaleButton from './LocaleButton';
import Counting from './Counting';
import FormattingExample from './FormattingExample';
import {
  FormattedMessage,
  intlShape,
  injectIntl,
  defineMessages,
} from 'react-intl';
import WidgetWrapper from './WidgetWrapper';

const propTypes = {
  intl: intlShape.isRequired,
};

const messages = defineMessages({
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
        <Counting />
        <FormattingExample />
        <WidgetWrapper uri="/widgets/TestWidget" />
      </div>
    );
  }
}

App.propTypes = propTypes;

export default injectIntl(App);
