import React, { useEffect } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { GetScreenHeight } from '../utils/dimensions-helper'
import { StyleSheet } from 'react-native'
import { globalStyles } from '../styles/base-styles'

const styles = StyleSheet.create({
    container: {
        ...globalStyles.full100,
        ...globalStyles.positionAbsolute,
        zIndex: 9999,
    },
    slider: {
        ...globalStyles.full100,
        ...globalStyles.positionAbsolute,
        backgroundColor: 'black',
        zIndex: 9999,
    },
})

export function SimpleSlider({
    height,
    visible,
    children,
}: {
    height: number
    visible: boolean
    children: React.ReactNode | React.ReactNode[]
}) {
    const offset = useSharedValue(GetScreenHeight())
    const opacity = useSharedValue(0)
    const positionStyle = useAnimatedStyle(() => {
        return { transform: [{ translateY: offset.value }] }
    })
    const opacityStyle = useAnimatedStyle(() => {
        return { opacity: opacity.value }
    })
    useEffect(() => {
        if (visible) {
            opacity.value = withTiming(0.5)
            offset.value = withTiming(GetScreenHeight() - height)
        } else {
            opacity.value = withTiming(0)
            offset.value = withTiming(GetScreenHeight())
        }
    }, [visible])
    return (
        <>
            <Animated.View style={[styles.slider, opacityStyle]} pointerEvents={visible ? 'auto' : 'box-none'} />
            <Animated.View pointerEvents="box-none" style={[styles.container, positionStyle]}>
                {[children]}
            </Animated.View>
        </>
    )
}
