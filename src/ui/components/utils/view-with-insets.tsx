import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Platform, View, ViewProps, ViewStyle } from 'react-native'
import Orientation, { OrientationType } from 'react-native-orientation-locker'
import { useSafeArea } from 'react-native-safe-area-context'
import { isTablet } from './dimensions-helper'

type Props = ViewProps & {
    useInsetsFor?: {
        top: boolean
        right: boolean
        bottom: boolean
        left: boolean
    }
    children: JSX.Element | JSX.Element[]
    useMargin?: boolean
    style: ViewStyle | ViewStyle[]
}

export const ViewWithInsets = (props: Props): JSX.Element => {
    const {
        children,
        useInsetsFor = {
            top: true,
            left: true,
            bottom: false,
            right: true,
        },
        useMargin = false,
        style,
        ...others
    } = props
    const insets = useSafeArea()

    const currentOrientation = useRef<OrientationType>('PORTRAIT')
    const [viewInsets, setViewInsets] = useState(() => {
        return insets
    })

    const setEdgeInsets = useCallback(
        (orientation: OrientationType) => {
            if (Platform.OS === 'ios' && isTablet === false) {
                switch (orientation) {
                    case 'PORTRAIT':
                    case 'PORTRAIT-UPSIDEDOWN': {
                        if (insets.top !== 0 && insets.bottom !== 0) {
                            setViewInsets({
                                top: useInsetsFor.top ? insets.top : 0,
                                bottom: useInsetsFor.bottom ? insets.bottom : 0,
                                left: useInsetsFor.left ? insets.left : 0,
                                right: useInsetsFor.right ? insets.right : 0,
                            })
                        }
                        break
                    }
                    case 'LANDSCAPE-RIGHT':
                    case 'LANDSCAPE-LEFT': {
                        if (insets.left !== 0 && insets.right !== 0 && insets.bottom !== 0) {
                            setViewInsets({
                                top: useInsetsFor.top ? insets.top : 0,
                                bottom: useInsetsFor.bottom ? insets.bottom : 0,
                                left: useInsetsFor.top ? insets.left : 0,
                                right: useInsetsFor.right ? insets.right : 0,
                            })
                        }
                        break
                    }
                }
            }
        },
        [
            insets.bottom,
            insets.left,
            insets.right,
            insets.top,
            useInsetsFor.bottom,
            useInsetsFor.left,
            useInsetsFor.right,
            useInsetsFor.top,
        ]
    )

    useEffect(() => {
        setEdgeInsets(currentOrientation.current)
    }, [insets, setEdgeInsets])

    useEffect(() => {
        const listener = (orientation: OrientationType) => {
            currentOrientation.current = orientation
        }

        if (!isTablet) {
            setEdgeInsets('PORTRAIT')
            Orientation.addOrientationListener(listener)
        }

        return () => {
            if (!isTablet) {
                Orientation.removeOrientationListener(listener)
            }
        }
    }, [setEdgeInsets])

    // Todo seems the android margings need to be / by the pixel density
    if (Platform.OS === 'android') {
        return (
            <View style={[style, { marginTop: viewInsets.top / 2 }]} {...others}>
                {[children]}
            </View>
        )
    }

    return (
        <View
            style={[
                style,
                {
                    ...(!useMargin
                        ? {
                              paddingTop: viewInsets.top,
                              paddingBottom: viewInsets.bottom,
                              paddingLeft: viewInsets.left,
                              paddingRight: viewInsets.right,
                          }
                        : {
                              marginTop: viewInsets.top,
                              marginBottom: viewInsets.bottom,
                              marginLeft: viewInsets.left,
                              marginRight: viewInsets.right,
                          }),
                },
            ]}
            {...others}
        >
            {[children]}
        </View>
    )
}
