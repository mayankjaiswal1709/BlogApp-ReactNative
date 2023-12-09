import 'react-native'
import React from 'react'
import Field from '../src/Field'

import renderer from 'react-test-renderer'

test('test render snapshot', ()=>{
    const snapshot =renderer.create(<Field/>).toJSON();
    expect(snapshot).toMatchSnapshot();
});