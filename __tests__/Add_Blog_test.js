import 'react-native'
import React from 'react'
import ADDBLOG from '../src/AddBlog'

import renderer from 'react-test-renderer'

test('test render snapshot', ()=>{
    const snapshot =renderer.create(<ADDBLOG/>).toJSON();
    expect(snapshot).toMatchSnapshot();
});