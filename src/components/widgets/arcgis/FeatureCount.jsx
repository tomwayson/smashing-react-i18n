import React, { Component } from 'react';
import propTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

class FeatureCount extends Component {
  render() {
    return (
      <div className="feature-count"><FormattedMessage id="arcgis.featureCount.yourQueryReturnedFeatures" values={{ count: this.props.count}} /></div>
    );
  }
}

FeatureCount.propTypes = {
  count: propTypes.number
};

export default FeatureCount;
