import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { GetScaledFactorX } from '../utils/dimensions-helper'
import { globalStyles } from '../styles/base-styles'
import { Weather } from '../utils/weather'
import { faCloudRain, faSun } from '@fortawesome/free-solid-svg-icons'
import Config from '../../../config/config'

const { theme } = Config

type Props = {
    cityId: number
}

export const WeatherInfo = (props: Props): JSX.Element => {
    const { cityId } = props
    const [result, setResult] = useState({})
    const [temperature, setTemperature] = useState({ current: 0, feelsLike: 0 })
    const [precipitation, setPrecipitation] = useState({ current: 'sunny' })

    const getIcon = () => {
        switch (result?.weather?.weather?.main?.toLowerCase()) {
            case 'clear': {
                return faSun
            }
            case 'rain': {
                return faCloudRain
            }
            default:
                return faCloudRain
        }
    }

    useEffect(() => {
        Weather(2172349).then((result) => setResult(result))
    }, [])

    useEffect(() => {
        const tempStats = result?.weather?.temp
        if (tempStats) {
            setTemperature({
                current: tempStats.temp,
                feelsLike: tempStats.feels_like,
            })
            // todo type this up
            setPrecipitation({
                current: result.weather.weather.main,
            })
        }
    }, [result])

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <FontAwesomeIcon color="yellow" size={50} icon={getIcon()} />
                <Text style={styles.tempLabel}>{`${Math.floor(temperature.current)}\u00b0C`}</Text>
                <View style={styles.feelsLikeContainer}>
                    <Text style={styles.feelsLike}>{`Feels like ${temperature.feelsLike.toFixed(1)}\u00b0C`}</Text>
                    <Text style={styles.feelsLike}>{precipitation.current}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...globalStyles.fullWidth,
        ...globalStyles.justifyCentre,
        ...globalStyles.marginBottomM,
        height: GetScaledFactorX(60),
    },
    innerContainer: {
        ...globalStyles.marginHorizontalM,
        ...globalStyles.flexRow,
        ...globalStyles.alignCentre,
    },
    tempLabel: {
        ...globalStyles.sizeXXXlText,
        ...globalStyles.boldText,
        ...globalStyles.marginLeftM,
        color: 'white',
    },
    feelsLikeContainer: {
        ...globalStyles.marginLeftS,
    },
    feelsLike: {
        ...globalStyles.sizeXsText,
        color: theme.greeting,
    },
})
