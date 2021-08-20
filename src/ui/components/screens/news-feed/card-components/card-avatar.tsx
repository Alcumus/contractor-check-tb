import React from 'react'
import { Avatar } from 'react-native-paper'

export const CardAvatar = (props) => (
    <Avatar.Image
        style={{ marginTop: 14 }}
        {...props}
        size={48}
        source={require('../../../../../assets/images/andy.jpg')}
    />
)
