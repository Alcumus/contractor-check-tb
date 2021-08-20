import { Dimensions, PixelRatio, PixelRatioStatic } from 'react-native'
import DeviceInfo from 'react-native-device-info'

// Apple device pixel and uint resolutions
// https://developer.apple.com/library/archive/documentation/DeviceInformation/Reference/iOSDeviceCompatibility/Displays/Displays.html

// Using IPhoneX unit size 375 x 812
let BASE_WIDTH = 375
let BASE_HEIGHT = 812

// Using IPad 10.5 unit size 1112 x 834
if (DeviceInfo.isTablet()) {
    // scaling in the app is X based for phone,  so flip values for tablet so we get the same mech
    BASE_WIDTH = 834 // 1112
    BASE_HEIGHT = 1112 // 834
}

// Todo :- Add the scaling types that will be needed, this is just bare min

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const stringForValue = (value: number, pixelValue: number) => `${(100 / value) * pixelValue}%`

export const GetPercentValueForPixelX = (pixelValue: number, base?: number): string => {
    const value = base !== undefined ? base : BASE_WIDTH
    return stringForValue(value, pixelValue)
}

export const GetPercentValueForPixelY = (pixelValue: number, base?: number): string => {
    const value = base !== undefined ? base : BASE_HEIGHT
    return stringForValue(value, pixelValue)
}

export const GetWindowWidth = (): number => Dimensions.get('window').width
export const GetWindowHeight = (): number => Dimensions.get('window').height

export const GetScreenWidth = (): number => Dimensions.get('screen').width
export const GetScreenHeight = (): number => Dimensions.get('screen').height

export const GetPixelRatio = (): PixelRatioStatic => PixelRatio

export const GetScaledFactorX = (value: number, clamp?: boolean): number => {
    const sWidth = width > height ? height : width
    const pixelScaleValue = PixelRatio.roundToNearestPixel(value * (sWidth / BASE_WIDTH))
    if (clamp && pixelScaleValue > value) {
        return value
    }
    return pixelScaleValue
}

export const GetScaledFactorY = (value: number, clamp?: boolean): number => {
    const sHeight = height > width ? height : width
    const pixelScaleValue = PixelRatio.roundToNearestPixel(value * (sHeight / BASE_HEIGHT))
    if (clamp && pixelScaleValue > value) {
        return value
    }
    return pixelScaleValue
}

export const isTablet = DeviceInfo.isTablet()
