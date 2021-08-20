import React from 'react'
import { View } from 'react-native'

import { MATERIAL_STANDARD } from '../styles/geometry-units'

export const FlexRow = ({ children, style = {}, ...props }) => (
    <View style={{ flexDirection: 'row', ...style }} {...props}>
        {children}
    </View>
)
export const FlexColumn = ({ children, style = {}, ...props }) => (
    <View style={{ flexDirection: 'column', ...style }} {...props}>
        {children}
    </View>
)

// Rough Box-a-like
export const Flex = ({
    children,
    style = {},
    mt = 0,
    mb = 0,
    ml = 0,
    mr = 0,
    pt = 0,
    pb = 0,
    pl = 0,
    pr = 0,
    flexDirection = 'row',
    flex = 0,
    alignItems = 'center',
    justifyContent = 'center',
    baseMargin = MATERIAL_STANDARD, // 8
    ...props
}) => (
    <View
        style={{
            marginTop: mt * baseMargin,
            marginBottom: mb * baseMargin,
            marginLeft: ml * baseMargin,
            marginRight: mr * baseMargin,
            paddingLeft: pl * baseMargin,
            paddingRight: pr * baseMargin,
            paddingTop: pt * baseMargin,
            paddingBottom: pb * baseMargin,
            flex,
            flexDirection,
            alignItems,
            justifyContent,
            ...style,
        }}
        {...props}
    >
        {children}
    </View>
)

export const FlexStart = ({ children, ...props }) => (
    <Flex justifyContent={'flex-start'} {...props}>
        {children}
    </Flex>
)
export const FlexEnd = ({ children, ...props }) => (
    <Flex justifyContent={'flex-end'} {...props}>
        {children}
    </Flex>
)
