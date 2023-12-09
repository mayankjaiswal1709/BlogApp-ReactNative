import 'react-native'
import React from 'react'
import Login from '../src/Login'

import renderer from 'react-test-renderer'

test('test render snapshot', ()=>{
    const snapshot =renderer.create(<Login/>).toJSON();
    expect(snapshot).toMatchSnapshot();
});