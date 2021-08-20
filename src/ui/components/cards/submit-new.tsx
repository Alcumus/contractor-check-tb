import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React from 'react'
import { DeviceEventEmitter, GestureResponderEvent, Pressable, StyleSheet, Text, View } from 'react-native'
import { StdButton } from '../buttons/std-button'
import { globalStyles } from '../styles/base-styles'
import { GetScaledFactorX } from '../utils/dimensions-helper'
import {
    faTimes,
    faClipboardCheck,
    faHandPaper,
    faClipboard,
    faBaseballBall,
    faGrinBeamSweat,
    faCheck,
} from '@fortawesome/free-solid-svg-icons'
import { GoodCatch } from '../screens/good-catch'
import { Box } from '../styles/BoxTheme'
import { theme } from '../standards'
import { useClosePanel } from '../navigation/tab-navigation'
import { HighFive } from '../screens/high-five'

type SubmitType = {
    label: string
    disabled?: boolean
    icon?: IconProp
    callBack: () => void
}

type Props = {
    button: SubmitType[]
}

export const SubmitButtons: SubmitType[] = [
    {
        label: 'Action Item',
        icon: faClipboardCheck,
        callBack: (): void => DeviceEventEmitter.emit('showMenu', false),
        disabled: true,
    },
    {
        label: 'Inspection',
        icon: faClipboard,
        callBack: (): void => DeviceEventEmitter.emit('showMenu', false),
        disabled: true,
    },
    {
        label: 'High Five',
        icon: faHandPaper,
        callBack: (): void => DeviceEventEmitter.emit('showContent', <HighFive />),
    },
    {
        label: 'Good Catch',
        icon: faBaseballBall,
        callBack: (): void => DeviceEventEmitter.emit('showContent', <GoodCatch />),
    },

    {
        label: 'Incident or Near Miss',
        icon: faGrinBeamSweat,
        callBack: (): void => DeviceEventEmitter.emit('showMenu', false),
        disabled: true,
    },
]

const cardStyles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: '400',
    },
})

export const StandardCard = ({
    children,
    title,
    onSet,
    onPress,
}: {
    children: JSX.Element | JSX.Element[]
    title?: string
    onSet?: ((close: () => void) => void) | null | undefined
    onPress?: ((event: GestureResponderEvent) => void) | null | undefined
}): JSX.Element => {
    const close = useClosePanel()
    return (
        <View style={styles.panelContainer}>
            <View
                style={{
                    ...globalStyles.marginHorizontalM,
                    ...globalStyles.flexRow,
                    ...globalStyles.alignCentre,
                    ...globalStyles.marginTopL,
                    ...globalStyles.marginBottomM,
                }}
            >
                <Box mr="m">
                    <Pressable hitSlop={20} onPress={onPress}>
                        <FontAwesomeIcon color={'black'} size={GetScaledFactorX(20)} icon={faTimes} />
                    </Pressable>
                </Box>
                {!!title && (
                    <Box mr="s">
                        <Text style={cardStyles.title}>{title}</Text>
                    </Box>
                )}
                <Box flex={1} />
                {!!onSet && (
                    <Box ml="xs">
                        <Pressable hitSlop={20} onPress={() => onSet(close)}>
                            <FontAwesomeIcon color={'black'} size={GetScaledFactorX(20)} icon={faCheck} />
                        </Pressable>
                    </Box>
                )}
            </View>
            {children}
        </View>
    )
}

export const Submitcard = (props: Props): JSX.Element => {
    const { button = [] } = props

    return (
        <View style={styles.container}>
            <View
                style={{
                    ...globalStyles.marginHorizontalM,
                    ...globalStyles.marginTopM,
                    ...globalStyles.flexRow,
                    ...globalStyles.alignCentre,
                    ...globalStyles.marginTopL,
                    ...globalStyles.marginBottomM,
                }}
            >
                <Pressable hitSlop={20} onPress={() => DeviceEventEmitter.emit('showMenu', false)}>
                    <FontAwesomeIcon color={'black'} size={GetScaledFactorX(30)} icon={faTimes} />
                </Pressable>
                <Text style={styles.submitText}>submit a new ...</Text>
            </View>
            {button.map((button) => {
                return (
                    <View key={button.label} style={{ ...globalStyles.marginTopS, ...globalStyles.radiusS }}>
                        <StdButton
                            label={button.label}
                            icon={button.icon}
                            iconColor={'#7D7D7D'}
                            callBack={button.callBack}
                            disabled={button.disabled}
                        />
                    </View>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    panelContainer: {
        ...globalStyles.radiusTopL,
        backgroundColor: 'white',
        height: '100%',
    },
    container: {
        ...globalStyles.radiusTopL,
        backgroundColor: 'white',
        height: GetScaledFactorX(420),
    },
    submitText: {
        ...globalStyles.semiboldText,
        ...globalStyles.sizeMText,
        ...globalStyles.capitalize,
        ...globalStyles.marginLeftM,
    },
})
