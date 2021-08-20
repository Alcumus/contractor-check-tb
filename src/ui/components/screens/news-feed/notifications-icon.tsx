import React from 'react'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { FlexEnd } from '../../utils/flex'
import { Pressable } from 'react-native'

export const notificationsMenu = ({ onPress = () => {} } = {}) => null
// <FlexEnd mr={2}> // Add subscription?
//     <Pressable onPress={onPress}>
//         <FontAwesomeIcon color={'white'} size={22} icon={faBell} />
//     </Pressable>
// </FlexEnd>
