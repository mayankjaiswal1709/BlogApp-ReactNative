import 'react-native'
import React from 'react'
import Home from '../src/Home'

import renderer from 'react-test-renderer'

test('test render snapshot', ()=>{
    const snapshot =renderer.create(<Home/>).toJSON();
    expect(snapshot).toMatchSnapshot();
});