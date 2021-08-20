import { StyleSheet } from 'react-native'
import { GetScaledFactorX } from '../utils/dimensions-helper'

const RADIUS_XXL = GetScaledFactorX(64)
const RADIUS_XL = GetScaledFactorX(32)
const RADIUS_L = GetScaledFactorX(16)
const RADIUS_M = GetScaledFactorX(8)
const RADIUS_S = GetScaledFactorX(4)
const RADIUS_XS = GetScaledFactorX(2)

const layoutStyles = StyleSheet.create({
    radiusXS: {
        borderRadius: RADIUS_XS,
    },
    radiusS: {
        borderRadius: RADIUS_S,
    },
    radiusM: {
        borderRadius: RADIUS_M,
    },
    radiusL: {
        borderRadius: RADIUS_L,
    },
    radiusXL: {
        borderRadius: RADIUS_XL,
    },
    radiusTopXS: {
        borderTopLeftRadius: RADIUS_XS,
        borderTopRightRadius: RADIUS_XS,
    },
    radiusTopS: {
        borderTopLeftRadius: RADIUS_S,
        borderTopRightRadius: RADIUS_S,
    },
    radiusTopM: {
        borderTopLeftRadius: RADIUS_M,
        borderTopRightRadius: RADIUS_M,
    },
    radiusTopL: {
        borderTopLeftRadius: RADIUS_L,
        borderTopRightRadius: RADIUS_L,
    },
    radiusTopXL: {
        borderTopLeftRadius: RADIUS_XL,
        borderTopRightRadius: RADIUS_XL,
    },
})

export default layoutStyles
