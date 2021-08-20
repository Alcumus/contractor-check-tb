import { ViewStyle } from 'react-native'

export const transformYStyle = (animatedValue: any, inputA: number, inputB: number): ViewStyle => {
    let inputValues = [inputA, inputB]

    if (inputA > inputB) {
        inputValues = [0, 0]
    }

    return {
        translateY: animatedValue.y.interpolate({
            inputRange: inputValues,
            outputRange: inputValues,
            extrapolate: 'clamp',
        }),
    }
}
