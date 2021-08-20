import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import Config from '../../../config/config'
import { globalStyles } from '../styles/base-styles'
import { GetScaledFactorX } from '../utils/dimensions-helper'

const { theme } = Config

type Props = {
    active: number
    label: React.ReactNode
    idx: number
    onPress: () => void
    disabled: boolean
    style?: any
    underlineColor?: any
}

export const TabButton = (props: Props) => {
    const { active, idx, disabled, onPress, label, style, underlineColor = theme.alcBrand001 } = props
    const activeOpactity = active === idx ? 1 : 0.3
    const borderBottomColor = active === idx ? underlineColor : 'transparent'

    const textStyle = StyleSheet.flatten([styles.buttonText, style])
    const pressableStyle = StyleSheet.flatten([
        styles.buttonContainer,
        { borderBottomColor },
        { opacity: activeOpactity },
    ])
    return (
        <Pressable onPress={onPress} disabled={disabled} style={pressableStyle}>
            {typeof label === 'string' ? (
                <Text style={textStyle}>{label}</Text>
            ) : typeof label === 'function' ? (
                <>{label()}</>
            ) : (
                <>{label}</>
            )}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        ...globalStyles.flex,
        ...globalStyles.flexCenter,
        borderBottomWidth: GetScaledFactorX(3),
    },
    buttonText: {
        ...globalStyles.semiboldText,
        ...globalStyles.sizeSText,
        ...globalStyles.capitalize,
    },
})
