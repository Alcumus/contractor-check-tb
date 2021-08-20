import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useNavigation } from '@react-navigation/core'
import { Pressable } from 'react-native'
import { Box } from '../../styles/BoxTheme'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React from 'react'

export function GoBackButton({ icon = faArrowLeft, color = 'white', size = 24, ...props }) {
    const navigation = useNavigation()
    return (
        <Pressable onPress={() => navigation.goBack()}>
            <Box pl="m" pr="m">
                <FontAwesomeIcon icon={icon} color={color} size={size} {...props} />
            </Box>
        </Pressable>
    )
}
