import React, { useEffect, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent, StyleSheet, Text, View } from 'react-native'
import { globalStyles } from '../styles/base-styles'
import { GetScaledFactorX } from '../utils/dimensions-helper'

import Config from '../../../config/config'

const { theme } = Config

type Props = {
    total: number
    completed: number
    displayCount?: boolean
}

export const ProgressBar = (props: Props) => {
    const { total, completed, displayCount = true } = props

    const [normalized, setNormalized] = useState(0)
    const animatedRef = useRef(new Animated.Value(0))
    const [width, setWidth] = useState(0)

    const onLayout = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout
        setWidth(width)
    }

    const translateX = animatedRef.current.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, 0],
    })

    useEffect(() => {
        if (total) {
            setNormalized(completed / total)
        }
    }, [completed, total])

    useEffect(() => {
        Animated.timing(animatedRef.current, {
            toValue: normalized,
            duration: 250,
            useNativeDriver: true,
        }).start()
    }, [normalized])

    return (
        <View style={styles.progressContainer}>
            <View style={{ ...globalStyles.flexRow, marginEnd: GetScaledFactorX(48), ...globalStyles.alignCentre }}>
                <View style={styles.progressBar} onLayout={onLayout}>
                    <View style={[StyleSheet.absoluteFill, { width, backgroundColor: '#e9ebec' }]} />
                    <Animated.View
                        style={[
                            StyleSheet.absoluteFill,
                            {
                                borderRadius: 3,
                                backgroundColor: theme.alcBrand002,
                                transform: [{ translateX }],
                            },
                        ]}
                    />
                </View>
                {displayCount && <Text style={styles.countText}>{`${completed}/${total}`}</Text>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    countText: {
        ...globalStyles.sizeSText,
        ...globalStyles.marginLeftM,
    },
    progressBar: {
        ...globalStyles.fullWidth,
        ...globalStyles.radiusM,
        ...globalStyles.overFlowHidden,
        height: GetScaledFactorX(6),
    },
    progressContainer: {
        ...globalStyles.flex0,
    },
})
