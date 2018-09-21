import React, { Component } from 'react';
import Counting from '../../Counting';

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
    return <div>
      <FormattedMessage id="TestWidget.thisIsATestWidget" defaultMessage="This is a test widget" />
      <Counting />
    </div>;
  }
}

TestWidget.propTypes = propTypes;

export default TestWidget;
