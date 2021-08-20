import { StyleSheet } from 'react-native'
import { Geometry, getGeometry } from '../styles/geometry-units'

export const MARGIN_XXS = getGeometry(Geometry.XXSmall)
export const MARGIN_XS = getGeometry(Geometry.XSmall)
export const MARGIN_S = getGeometry(Geometry.Small)
export const MARGIN_M = getGeometry(Geometry.Medium)
export const MARGIN_L = getGeometry(Geometry.Large)
export const MARGIN_XL = getGeometry(Geometry.XLarge)

const layoutStyles = StyleSheet.create({
    marginHorizontalXS: {
        marginHorizontal: MARGIN_XS,
    },
    marginHorizontalS: {
        marginHorizontal: MARGIN_S,
    },
    marginHorizontalM: {
        marginHorizontal: MARGIN_M,
    },
    marginHorizontalL: {
        marginHorizontal: MARGIN_L,
    },
    marginHorizontalXL: {
        marginHorizontal: MARGIN_XL,
    },
    marginLeftXS: {
        marginLeft: MARGIN_XS,
    },
    marginLeftS: {
        marginLeft: MARGIN_S,
    },
    marginLeftM: {
        marginLeft: MARGIN_M,
    },
    marginLeftL: {
        marginLeft: MARGIN_L,
    },
    marginleftXL: {
        marginLeft: MARGIN_XL,
    },
    marginRightS: {
        marginRight: MARGIN_S,
    },
    marginRightM: {
        marginRight: MARGIN_M,
    },
    marginRightL: {
        marginRight: MARGIN_L,
    },
    marginRightXL: {
        marginRight: MARGIN_XL,
    },
    marginBottomXS: {
        marginBottom: MARGIN_XS,
    },
    marginBottomS: {
        marginBottom: MARGIN_S,
    },
    marginBottomM: {
        marginBottom: MARGIN_M,
    },
    marginBottomL: {
        marginBottom: MARGIN_L,
    },
    marginBottomXL: {
        marginBottom: MARGIN_XL,
    },
    marginBottomXXS: {
        marginBottom: MARGIN_XXS,
    },
    marginTopXS: {
        marginTop: MARGIN_XS,
    },
    marginTopS: {
        marginTop: MARGIN_S,
    },
    marginTopM: {
        marginTop: MARGIN_M,
    },
    marginTopL: {
        marginTop: MARGIN_L,
    },
    marginTopXL: {
        marginTop: MARGIN_XL,
    },
    marginTopXXS: {
        marginTop: MARGIN_XXS,
    },
    marginRightXS: {
        marginLeft: MARGIN_XS,
    },
    marginRightS: {
        marginLeft: MARGIN_S,
    },
    marginRightM: {
        marginLeft: MARGIN_M,
    },
    marginRightL: {
        marginLeft: MARGIN_L,
    },
    marginRightXL: {
        marginLeft: MARGIN_XL,
    },
})

export default layoutStyles
