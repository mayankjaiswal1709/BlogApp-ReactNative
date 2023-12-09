import 'react-native'
import React from 'react'
import Signup from '../src/Signup'

import renderer from 'react-test-renderer'

test('test render snapshot', ()=>{
    const snapshot =renderer.create(<Signup/>).toJSON();
    expect(snapshot).toMatchSnapshot();
});