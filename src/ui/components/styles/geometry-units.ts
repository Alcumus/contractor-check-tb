import { GetScaledFactorX, GetScaledFactorY } from '../utils/dimensions-helper'

export enum Geometry {
    XXSmall = 2,
    XSmall = 4,
    Small = 8,
    Medium = 16,
    Large = 24,
    XLarge = 32,
}

export const getGeometry = (type) => (Platform.OS === 'android' ? GetScaledFactorY(type) : GetScaledFactorX(type))
export const MATERIAL_STANDARD = getGeometry(Geometry.Small)
