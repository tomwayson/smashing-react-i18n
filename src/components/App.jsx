import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

export default class extends Component {
  render() {
    return (
      <div className="App">
        <h1><FormattedMessage id="app.hello_world" defaultMessage="Hello World!" description="Hello world header greeting" /></h1>
      </div>
    );
  }
}
