import React, { useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import { globalStyles } from '../styles/base-styles'
import { GetScreenHeight, GetScreenWidth } from '../utils/dimensions-helper'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

export enum ToSide {
    TOP = 1,
    LEFT,
    BOTTOM,
    RIGHT,
}

type Props = {
    children: React.ReactNode | React.ReactNode[]
    dismissed: () => void
    showContent: boolean
    toSide: ToSide
    margin?: number
    initialPosition?: number
    moveOffset?: number
}

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

export const Slider = (props: Props): JSX.Element => {
    const { children, showContent, toSide, margin = 0, initialPosition, moveOffset = 0 } = props
    const [showBackground, setShowBackground] = useState(false)

    const startingPoint = useSharedValue(initialPosition || 0)
    const offset = useSharedValue(GetScreenHeight())
    const opacity = useSharedValue(0)
    const isVertical = (startSide: ToSide) => startSide === ToSide.TOP || startSide === ToSide.BOTTOM

    const initialRender = useRef(true)

    const setStartPoint = useCallback(
        (side: ToSide) => {
            let outValue = 0
            if (!isVertical(side)) {
                side === ToSide.RIGHT ? (outValue = -GetScreenWidth()) : (outValue = GetScreenWidth())
            } else {
                side === ToSide.TOP ? (outValue = GetScreenHeight()) : (outValue = -GetScreenHeight())
            }

            offset.value = outValue
            startingPoint.value = outValue
        },
        [offset, startingPoint]
    )

    const backGroundFalse = () => setShowBackground(false)

    useEffect(() => {
        if (!initialRender.current) {
            if (showContent) {
                setShowBackground(true)
                setStartPoint(toSide)
                offset.value = withTiming(margin)
                opacity.value = withTiming(0.5)
            } else {
                offset.value = margin
                backGroundFalse()
                offset.value = withTiming(startingPoint.value, undefined, (flag) => {})
                opacity.value = withTiming(0)
            }
        }
    }, [margin, offset, opacity, setStartPoint, showContent, startingPoint.value, toSide])

    useEffect(() => {
        if (!initialRender.current) {
            offset.value = withTiming(startingPoint.value + moveOffset)
        }
    }, [moveOffset, offset, startingPoint.value])

    useEffect(() => {
        setStartPoint(toSide)
        //This 1000 looks flaky, could something be happening inside this timeout
        //and therefore never actually happening (sliders in sliders, main app redraw etc)?
        initialRender.current = false
    }, [setStartPoint, toSide])

    const animatedStyleOpacity = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        }
    })
    const animatedStyleOffsetY = useAnimatedStyle(() => {
        return { transform: [{ translateY: offset.value }] }
    })
    const animatedStyleOffsetX = useAnimatedStyle(() => {
        return { transform: [{ translateX: offset.value }] }
    })

    return (
        <>
            {showBackground && (
                <Animated.View
                    pointerEvents={showBackground ? 'auto' : 'box-none'}
                    style={[styles.slider, animatedStyleOpacity]}
                />
            )}
            <Animated.View
                pointerEvents="box-none"
                style={[styles.container, isVertical(toSide) ? animatedStyleOffsetY : animatedStyleOffsetX]}
            >
                {[children]}
            </Animated.View>
        </>
    )
}
