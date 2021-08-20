import { StyleSheet } from 'react-native'
import { Geometry, getGeometry } from '../styles/geometry-units'

export const PADDING_XXS = getGeometry(Geometry.XXSmall)
export const PADDING_XS = getGeometry(Geometry.XSmall)
export const PADDING_S = getGeometry(Geometry.Small)
export const PADDING_M = getGeometry(Geometry.Medium)
export const PADDING_L = getGeometry(Geometry.Large)
export const PADDING_XL = getGeometry(Geometry.XLarge)

const layoutStyles = StyleSheet.create({
    paddingHorizontalXS: {
        paddingHorizontal: PADDING_XS,
    },
    paddingHorizontalS: {
        paddingHorizontal: PADDING_S,
    },
    paddingHorizontalM: {
        paddingHorizontal: PADDING_M,
    },
    paddingHorizontalL: {
        paddingHorizontal: PADDING_L,
    },
    paddingHorizontalXL: {
        paddingHorizontal: PADDING_XL,
    },
    paddingLeftXS: {
        paddingLeft: PADDING_XS,
    },
    paddingLeftS: {
        paddingLeft: PADDING_S,
    },
    paddingLeftM: {
        paddingLeft: PADDING_M,
    },
    paddingLeftL: {
        paddingLeft: PADDING_L,
    },
    paddingleftXL: {
        paddingLeft: PADDING_XL,
    },
    paddingRightS: {
        paddingRight: PADDING_S,
    },
    paddingRightM: {
        paddingRight: PADDING_M,
    },
    paddingRightL: {
        paddingRight: PADDING_L,
    },
    paddingRightXL: {
        paddingRight: PADDING_XL,
    },
    paddingBottomXS: {
        paddingBottom: PADDING_XS,
    },
    paddingBottomS: {
        paddingBottom: PADDING_S,
    },
    paddingBottomM: {
        paddingBottom: PADDING_M,
    },
    paddingBottomL: {
        paddingBottom: PADDING_L,
    },
    paddingBottomXL: {
        paddingBottom: PADDING_XL,
    },
    paddingBottomXXS: {
        paddingBottom: PADDING_XXS,
    },
    paddingTopXS: {
        paddingTop: PADDING_XS,
    },
    paddingTopS: {
        paddingTop: PADDING_S,
    },
    paddingTopM: {
        paddingTop: PADDING_M,
    },
    paddingTopL: {
        paddingTop: PADDING_L,
    },
    paddingTopXL: {
        paddingTop: PADDING_XL,
    },
    paddingTopXXS: {
        paddingTop: PADDING_XXS,
    },
    paddingVerticalXS: {
        paddingVertical: PADDING_XS,
    },
    paddingVerticalS: {
        paddingVertical: PADDING_S,
    },
    paddingVerticalM: {
        paddingVertical: PADDING_M,
    },
    paddingVerticalL: {
        paddingVertical: PADDING_L,
    },
    paddingVerticalXL: {
        paddingVertical: PADDING_XL,
    },
    paddingVerticalXXS: {
        paddingVertical: PADDING_XXS,
    },
})

export default layoutStyles
