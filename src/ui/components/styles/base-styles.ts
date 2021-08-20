/* eslint-disable react-native/no-color-literals */
import { StyleSheet } from 'react-native'
import colourStyles from './colour'
import fontStyles from './font'
import layoutStyles from './layout'
import margins from './margins'
import padding from './padding'
import radius from './radius'

// Todo Add more style files

export const globalStyles = StyleSheet.create({
    ...colourStyles,
    ...layoutStyles,
    ...fontStyles,
    ...margins,
    ...padding,
    ...radius,
    disabled: {
        opacity: 0.5,
    },
})
