import React, { Component } from 'react';
import {
  intlShape,
  injectIntl,
  defineMessages,
} from 'react-intl';

const propTypes = {
  intl: intlShape.isRequired,
};

const messages = defineMessages({
  iNeedToBuyApples: {
    id: 'counting.iNeedToBuyApples',
    defaultMessage: 'I need to buy {count, number} {count, plural, one {apple} other {apples}}'
  }
});

class Counting extends Component {
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

Counting.propTypes = propTypes;

export default injectIntl(Counting);
