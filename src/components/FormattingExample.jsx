import React, { Component } from 'react';
import {
  FormattedDate,
  FormattedRelative,
  FormattedNumber,
} from 'react-intl';

// NOTE: have to use a named export here as well as the default below for testing
export default class FormattingExample extends Component {
  render() {
    return (
      <div className="formatting-examples">
        {/* NOTE: The following will _always_ use the 'en' locale on the server, why? */}
        <div><FormattedDate value={Date.now()} /></div>
        <div><FormattedNumber value="1000" currency="USD" currencyDisplay="symbol" style="currency" /></div>
        <div><FormattedRelative value={1536104584358} /></div>
      </div>
    );
  }
}
