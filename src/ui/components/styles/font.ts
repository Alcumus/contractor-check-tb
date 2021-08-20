import { Platform, StyleSheet } from 'react-native'
import Config from '../../../config/config'
import { GetScaledFactorX, GetScaledFactorY } from '../utils/dimensions-helper'

const { fontFamily, fontWeight } = Config

// Todo this needs a font scale factor do thingy, thou here we are portrait only so not so much as a care
// so many fontsizes in the XD
const FONT_SIZE_XXXL = Platform.OS === 'android' ? GetScaledFactorY(40) : GetScaledFactorX(40)
const FONT_SIZE_XXL = Platform.OS === 'android' ? GetScaledFactorY(32) : GetScaledFactorX(32)
const FONT_SIZE_XL = Platform.OS === 'android' ? GetScaledFactorY(26) : GetScaledFactorX(26)
const FONT_SIZE_L = Platform.OS === 'android' ? GetScaledFactorY(21) : GetScaledFactorX(21)
const FONT_SIZE_M = Platform.OS === 'android' ? GetScaledFactorY(18) : GetScaledFactorX(18)
const FONT_SIZE_S = Platform.OS === 'android' ? GetScaledFactorY(16) : GetScaledFactorX(16)
const FONT_SIZE_XS = Platform.OS === 'android' ? GetScaledFactorY(14) : GetScaledFactorX(14)
const FONT_SIZE_XXS = Platform.OS === 'android' ? GetScaledFactorY(10) : GetScaledFactorX(10)

const fontStyles = StyleSheet.create({
    boldText: {
        fontFamily: fontFamily.bold,
        fontWeight: fontWeight.bold,
    },
    capitalize: {
        textTransform: 'capitalize',
    },
    extraboldText: {
        fontFamily: fontFamily.extrabold,
        fontWeight: fontWeight.extrabold,
    },
    fontLight: {
        fontFamily: fontFamily.light,
        fontWeight: fontWeight.light,
    },
    lowercase: {
        textTransform: 'lowercase',
    },
    regularText: {
        fontFamily: fontFamily.regular,
        fontWeight: fontWeight.regular,
    },
    semiboldText: {
        fontFamily: fontFamily.semibold,
        fontWeight: '500',
    },
    sizeXXsText: {
        fontSize: FONT_SIZE_XXS,
    },
    sizeXsText: {
        fontSize: FONT_SIZE_XS,
    },
    sizeLText: {
        fontSize: FONT_SIZE_L,
    },
    sizeMText: {
        fontSize: FONT_SIZE_M,
    },
    sizeSText: {
        fontSize: FONT_SIZE_S,
    },
    sizeXlText: {
        fontSize: FONT_SIZE_XL,
    },
    sizeXXlText: {
        fontSize: FONT_SIZE_XXL,
    },
    sizeXXXlText: {
        fontSize: FONT_SIZE_XXXL,
    },
    textCenter: {
        textAlign: 'center',
    },
    textLeft: {
        textAlign: 'left',
    },
    textRight: {
        textAlign: 'right',
    },
    uppercase: {
        textTransform: 'uppercase',
    },
})

export default fontStyles
