import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FlexStart } from '../utils/flex'
import { Pressable } from 'react-native'

export const burgerMenu = ({ onPress = () => {} } = {}) => {
    return (
        <FlexStart ml={2}>
            <Pressable onPress={onPress}>
                <FontAwesomeIcon color={'white'} size={30} icon={faBars} />
            </Pressable>
        </FlexStart>
    )
}
