import React, { Component } from 'react';
import {
  FormattedMessage,
  intlShape
} from 'react-intl';

const propTypes = {
  intl: intlShape.isRequired,
};

class TestWidget extends Component {
  constructor() {
    super();
  }

  render() {
    return <div><FormattedMessage id="TestWidget.thisIsATestWidget" defaultMessage="This is a test widget" /></div>;
  }
}

TestWidget.propTypes = propTypes;

export default TestWidget;
