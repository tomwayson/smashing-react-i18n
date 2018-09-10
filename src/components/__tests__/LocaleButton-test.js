import React from 'react';
import {shallow} from 'enzyme';
import LocaleButton from '../LocaleButton';

test('LocaleButton text should be the _other_ locale', () => {
  // render button w/ en locale
  const button = shallow(<LocaleButton locale="en" />);

  expect(button.text()).toEqual('Russian');
});
