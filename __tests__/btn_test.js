import 'react-native'
import React from 'react'
import Btn from '../src/Btn'

import renderer from 'react-test-renderer'

test('test render snapshot', ()=>{
    const snapshot =renderer.create(<Btn/>).toJSON();
    expect(snapshot).toMatchSnapshot();
});