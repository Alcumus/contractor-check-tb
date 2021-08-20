import React, { ReactNode } from 'react'
import { Dimensions, ImageStyle, TextStyle, ViewStyle } from 'react-native'
import { createBox, createText, ThemeProvider as ReStyleThemeProvider, useTheme as useReTheme } from '@shopify/restyle'
import { colorNames } from './colour'
import Config from '../../../config/config'

const { width } = Dimensions.get('window')

export const aspectRatio = width / 375

const theme = {
    colors: { ...colorNames, ...Config.theme },
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 40,
        input: 12,
    },
    borderRadii: {
        xs: 2,
        s: 4,
        m: 10,
        l: 25,
        xl: 75,
    },
    textVariants: {
        body: {
            fontSize: 16,
            color: 'darkText',
        },
    },
    breakpoints: {
        phone: 0,
        tablet: 768,
    },
}

export const BoxThemeProvider = ({ children }: { children: ReactNode }) => (
    <ReStyleThemeProvider {...{ theme }} children={children} />
)

export type Theme = typeof theme
export const Box = createBox<Theme>()
export function ListItemBox({ children, ...props }) {
    return (
        <Box alignItems="center" flexDirection="row" width="100%" {...props}>
            {children}
        </Box>
    )
}
export const Text = createText<Theme>()
export const useTheme = () => useReTheme<Theme>()
type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle }

export const makeStyles = <T extends NamedStyles<T>>(styles: (theme: Theme) => T) => () => {
    const currentTheme = useTheme()
    return styles(currentTheme)
}
