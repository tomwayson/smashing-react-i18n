import React from 'react';
import { shallowWithIntl } from 'enzyme-react-intl';
import FormattingExample from '../FormattingExample';

test('FormattingExample should render intl components', () => {
  const wrapper = shallowWithIntl(<FormattingExample />);

  // TODO: I think there's a better way to test that these were invoked w/ the right props
  expect(wrapper.text()).toEqual('<FormattedDate /><FormattedNumber /><FormattedRelative />');
});
