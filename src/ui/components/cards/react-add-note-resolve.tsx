import React, { useEffect, useRef, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native'

import { globalStyles } from '../styles/base-styles'

import { StdButton } from '../buttons/std-button'
import { GetScaledFactorX, GetScreenHeight } from '../utils/dimensions-helper'
import Animated, {
    Transition,
    Transitioning,
    TransitioningView,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type ButtonStates = {
    addNoteButtonState: boolean
    reactButtonState: boolean
    resolveButtonState: boolean
}

type Props = {
    buttonStateCallback: (buttonStates: ButtonStates) => void
    toggle?: boolean
    done?: boolean
}

export const ReactAddNoteResolve = (props: Props): JSX.Element => {
    const { toggle, done, buttonStateCallback } = props
    const ref = useRef<TransitioningView | null>()

    const [showButtons, setShowButtons] = useState(false)

    const [buttonStates, setButtonStates] = useState<ButtonStates>({
        reactButtonState: false,
        addNoteButtonState: false,
        resolveButtonState: false,
    })

    const safeInsets = useSafeAreaInsets()

    useEffect(() => {
        if (buttonStateCallback) {
            if (buttonStates.addNoteButtonState || buttonStates.reactButtonState || buttonStates.resolveButtonState) {
                buttonStateCallback(buttonStates)
            }
        }
        if (!toggle) {
            if (buttonStates.addNoteButtonState || buttonStates.reactButtonState || buttonStates.resolveButtonState) {
                setTimeout(() => {
                    setButtonStates({
                        reactButtonState: false,
                        addNoteButtonState: false,
                        resolveButtonState: false,
                    })
                }, 75)
            }
        }
    }, [buttonStates, toggle])

    const transition = (
        <Transition.Together>
            <Transition.In type="fade" delayMs={300} durationMs={300} />
            <Transition.Out type="fade" delayMs={300} durationMs={300} />
        </Transition.Together>
    )

    useEffect(() => {
        if (ref.current) {
            ref.current.animateNextTransition()
        }
        setShowButtons(true)
    }, [])

    return (
        <KeyboardAvoidingView
            behavior="padding"
            style={[styles.container, { top: GetScreenHeight() - safeInsets.bottom - GetScaledFactorX(60) }]}
        >
            <Transitioning.View
                ref={(node) => (ref.current = node)}
                transition={transition}
                style={{ height: GetScaledFactorX(60) }}
            >
                {showButtons && (
                    <View style={styles.buttonRow}>
                        <StdButton
                            backgroundStyle={[
                                styles.button,
                                { backgroundColor: buttonStates.reactButtonState ? '#0A599A' : '#DDDDDD' },
                            ]}
                            labelColor={buttonStates.reactButtonState ? 'white' : '#151C1B'}
                            label={'React'}
                            callBack={() => {
                                if (ref.current) {
                                    ref.current.animateNextTransition()
                                }

                                setButtonStates({
                                    reactButtonState: true,
                                    addNoteButtonState: false,
                                    resolveButtonState: false,
                                })
                            }}
                            labelStyle={styles.labelStyle}
                        />
                        <StdButton
                            backgroundStyle={[
                                styles.button,
                                { backgroundColor: buttonStates.addNoteButtonState ? '#0A599A' : '#DDDDDD' },
                            ]}
                            labelColor={buttonStates.addNoteButtonState ? 'white' : '#151C1B'}
                            label={'Add Note'}
                            callBack={() =>
                                setButtonStates({
                                    reactButtonState: false,
                                    addNoteButtonState: true,
                                    resolveButtonState: false,
                                })
                            }
                            labelStyle={styles.labelStyle}
                        />
                        {!done && (
                            <StdButton
                                backgroundStyle={[
                                    styles.button,
                                    { backgroundColor: buttonStates.resolveButtonState ? '#0A599A' : '#268BD1' },
                                ]}
                                labelColor={buttonStates.resolveButtonState ? 'white' : 'white'}
                                label={'Resolve'}
                                callBack={() =>
                                    setButtonStates({
                                        reactButtonState: false,
                                        addNoteButtonState: false,
                                        resolveButtonState: true,
                                    })
                                }
                                labelStyle={[styles.labelStyle]}
                            />
                        )}
                    </View>
                )}
            </Transitioning.View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        ...globalStyles.fullWidth,
        ...globalStyles.radiusTopM,
        height: GetScaledFactorX(100),
        backgroundColor: 'white',
        position: 'absolute',
    },
    buttonRow: {
        ...globalStyles.fullHeight,
        ...globalStyles.flexRow,
        ...globalStyles.paddingVerticalS,
        ...globalStyles.marginHorizontalM,
        ...globalStyles.justifySpaceBetween,
    },
    button: {
        ...globalStyles.flexCenter,
        ...globalStyles.clearMarginsPaddings,
        height: '100%',
        width: GetScaledFactorX(110),
    },
    labelStyle: {
        ...globalStyles.semiboldText,
        ...globalStyles.textCenter,
        ...globalStyles.clearMarginsPaddings,
    },
})
