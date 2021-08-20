import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { FlexEnd } from '../utils/flex'
import { Pressable } from 'react-native'

export const EditButton = ({ onPress = () => {} } = {}) => {
    return (
        <FlexEnd mr={2}>
            <Pressable onPress={onPress}>
                <FontAwesomeIcon color={'white'} size={24} icon={faPen} />
            </Pressable>
        </FlexEnd>
    )
}
