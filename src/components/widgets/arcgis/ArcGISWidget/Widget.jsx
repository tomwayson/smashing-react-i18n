import React, { Component } from 'react';
import FeatureCount from '../FeatureCount';

import {
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
      <FeatureCount count={0} />
      <FeatureCount count={1} />
      <FeatureCount count={2} />
      <FeatureCount count={1000} />
    </div>;
  }
}

TestWidget.propTypes = propTypes;

export default TestWidget;
