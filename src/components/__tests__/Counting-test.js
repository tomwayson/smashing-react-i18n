import React from 'react';
import { shallowWithIntl } from '../../../helpers/intl-enzyme-test-helper';
// NOTE: we are importing the named export, not the default
import { Counting } from '../Counting';

test('Counting text should be the _other_ locale', () => {
  // render button w/ en locale
  const wrapper = shallowWithIntl(<Counting />);

  expect(wrapper.text()).toEqual('I need to buy 1 appleI need to buy 2 applesI need to buy 5 applesI need to buy 5 apples');
});
