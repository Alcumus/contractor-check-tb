import React, { FunctionComponent } from 'react'
import { StyleSheet, Text, ViewStyle } from 'react-native'
import Config from '../../../config/config'
import { GetScaledFactorX } from '../utils/dimensions-helper'
import { ViewWithInsets } from '../utils/view-with-insets'
import { globalStyles } from '../styles/base-styles'
import { Flex, FlexEnd, FlexRow, FlexStart } from '../utils/flex'
// todo do we what to ative and use thing like Vibrancy views for ios and material for android,
// we wont wrap this in a inset view so that in goes under knotch displays

const { header, theme } = Config

type Props = {
    label: string
    startAdornment?: () => void
    endAdornment?: () => void
    opacity?: number
    style?: ViewStyle | undefined
}
const shouldRender = (Decorate: JSX.Element | FunctionComponent | undefined) =>
    Decorate ? typeof Decorate === 'function' ? <Decorate /> : Decorate : null

export const Header = (props: Props): JSX.Element => {
    const { label, startAdornment, endAdornment, style = {} } = props

    const renderLeft = shouldRender(startAdornment)
    const renderRight = shouldRender(endAdornment)

    return (
        <ViewWithInsets
            useInsetsFor={{ top: true, right: false, left: false, bottom: false }}
            style={[
                {
                    backgroundColor: theme.alcBrand001,
                },
                style && { ...style },
            ]}
        >
            <FlexRow style={styles.container}>
                <FlexStart flex={1}>{renderLeft}</FlexStart>
                <Flex>
                    <Text style={styles.label}>{label}</Text>
                </Flex>
                <FlexEnd flex={1}>{renderRight}</FlexEnd>
            </FlexRow>
        </ViewWithInsets>
    )
}

const styles = StyleSheet.create({
    container: {
        ...globalStyles.fullWidth,
        ...globalStyles.flexCenter,
        ...globalStyles.marginBottomM,
        height: GetScaledFactorX(header.height),
    },
    label: {
        ...globalStyles.sizeLText,
        ...globalStyles.regularText,
        color: 'white',
    },
})
