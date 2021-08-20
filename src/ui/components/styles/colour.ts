/* eslint-disable react-native/no-color-literals */
import { StyleSheet } from 'react-native'

// Todo get a config

const colourStyles = StyleSheet.create({
    background: {
        backgroundColor: 'white', // would be the config
    },
    backgroundWhite: {
        backgroundColor: 'white',
    },
    darkText: {
        color: '#575A68',
    },
    lightText: {
        color: '#ffffff',
    },
    opacity10: {
        backgroundColor: 'rgba(0,0,0,0.10)',
    },
    opacity15: {
        backgroundColor: 'rgba(0,0,0,0.15)',
    },
    opacity25: {
        backgroundColor: 'rgba(0,0,0,0.25)',
    },
    opacity50: {
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    opacity60: {
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    opacity70: {
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    opacity80: {
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    primaryText: {
        color: 'black', // for now
    },
    whiteText: {
        color: 'white',
    },
})

export const colorNames = {
    background: 'white', // would be the config
    backgroundWhite:  'white',
    darkText:  '#575A68',
    lightText:  '#ffffff',
    opacity10:  'rgba(0,0,0,0.10)',
    opacity15: 'rgba(0,0,0,0.15)',
    opacity25:  'rgba(0,0,0,0.25)',
    opacity50:  'rgba(0,0,0,0.5)',
    opacity60:  'rgba(0,0,0,0.6)',
    opacity70:  'rgba(0,0,0,0.7)',
    opacity80:  'rgba(0,0,0,0.8)',
    primaryText:  'black', // for now
    whiteText: 'white',
}

export default colourStyles
