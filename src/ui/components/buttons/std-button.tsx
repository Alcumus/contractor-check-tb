import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React from 'react'
import { TextStyle } from 'react-native'
import { Pressable, PressableProps, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { globalStyles } from '../styles/base-styles'
import { GetScaledFactorX } from '../utils/dimensions-helper'

type Props = PressableProps & {
    backgroundStyle?: ViewStyle
    icon?: IconProp
    iconSize?: number
    iconColor?: string
    label: React.ReactNode
    labelColor?: string
    disabled?: boolean
    labelStyle?: TextStyle
    callBack: () => void
}

export const StdButton = (props: Props): JSX.Element => {
    const {
        backgroundStyle = {},
        disabled = false,
        icon,
        callBack,
        iconColor,
        label,
        labelColor = '#263836',
        iconSize = GetScaledFactorX(20),
        labelStyle = {},
        ...rest
    } = props

    const flatLabelStyle = StyleSheet.flatten([styles.label, labelStyle, disabled ? styles.disabled : {}])
    const background = StyleSheet.flatten([styles.container, backgroundStyle])

    return (
        <Pressable onPress={callBack} {...rest} disabled={disabled} style={background}>
            {icon && (
                <View style={{ ...globalStyles.marginLeftM, ...globalStyles.justifyCentre }}>
                    <FontAwesomeIcon color={iconColor || 'white'} size={iconSize} icon={icon} />
                </View>
            )}
            <Text style={[flatLabelStyle, { color: labelColor }]}>{label}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        ...globalStyles.marginHorizontalM,
        ...globalStyles.flexRow,
        ...globalStyles.radiusM,
        height: GetScaledFactorX(48),
    },
    disabled: {
        opacity: 0.25,
    },
    label: {
        ...globalStyles.sizeSText,
        ...globalStyles.marginLeftS,
        alignSelf: 'center',
    },
})
