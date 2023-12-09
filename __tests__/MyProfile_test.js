import 'react-native'
import React from 'react'
import MyProfile from '../src/MyProfile'

import renderer from 'react-test-renderer'

test('test render snapshot', ()=>{
    const snapshot =renderer.create(<MyProfile/>).toJSON();
    expect(snapshot).toMatchSnapshot();
});