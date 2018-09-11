import React from 'react';
import { mountWithIntl, loadTranslation } from 'enzyme-react-intl';
import Counting from '../Counting';

// load in the desired react-intl translation file
// NOTE: this is optional, you could just test against the default strings
loadTranslation('../../../public/assets/en.json');

test('Counting text should match for 1, 2, and 5', () => {
  const wrapper = mountWithIntl(<Counting />);

  expect(wrapper.text()).toEqual('I need to buy 1 appleI need to buy 2 applesI need to buy 5 apples');
});
