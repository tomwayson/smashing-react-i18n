import React, { Component } from 'react';
import {
  intlShape,
  injectIntl,
  defineMessages,
} from 'react-intl';

const messages = defineMessages({
  iNeedToBuyApples: {
    id: 'counting.iNeedToBuyApples',
    defaultMessage: 'I need to buy {count, number} {count, plural, one {apple} other {apples}}'
  }
});

// NOTE: have to use a named export here as well as the default below for testing
export class Counting extends Component {
  render() {
    return (
      <div className="counting">
        <div>{this.props.intl.formatMessage(messages.iNeedToBuyApples, { count: 1 })}</div>
        <div>{this.props.intl.formatMessage(messages.iNeedToBuyApples, { count: 2 })}</div>
        <div>{this.props.intl.formatMessage(messages.iNeedToBuyApples, { count: 5 })}</div>
        <div>{this.props.intl.formatMessage(messages.iNeedToBuyApples, { count: 5 })}</div>
      </div>
    );
  }
}

// TODO: why does this cause the following console error in tests?
// Warning: Failed prop type: The prop `intl` is marked as required in `Counting`, but its value is `undefined`.
//           in Counting
Counting.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(Counting);
