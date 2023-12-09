import React from 'react';
import {TextInput} from 'react-native';


const Field = (props) => {
    return (
        <TextInput {...props} 
        style={{borderRadius:70 ,paddingHorizontal:35, paddingVertical:20,width:'70%' , height:60,backgroundColor:'#000',marginVertical:10,color:"white"}} 
        placeholderTextColor='white'
        >
            
        </TextInput>
    );
}

export default Field;
