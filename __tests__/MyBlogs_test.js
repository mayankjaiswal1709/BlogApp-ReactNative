import 'react-native'
import React from 'react'
import MyBlogs from '../src/MyBlogs'

import renderer from 'react-test-renderer'

test('test render snapshot', ()=>{
    const snapshot =renderer.create(<MyBlogs/>).toJSON();
    expect(snapshot).toMatchSnapshot();
});