const URL = 'https://api.openweathermap.org/data/2.5/group'
const END_POINT = '?id='
// DONT USE MY PRIVATE KEY
const API_KEY = '&units=metric&appid=7573f687ba453332222f50a8fc87be93'

const CITY_CARDIFF = [2172349]

export const Weather = (cityId: number): Promise<any> => {
    const todaysWeatherForCity = async (cityId: number) => {
        const BUILT_URL = `${URL}${END_POINT}${[cityId]}${API_KEY}`
        const response = await fetch(BUILT_URL)
        const json = await response.json()
        const { list } = json
        const { weather, main } = list[0]
        if (main !== undefined) {
            return { weather: weather[0], temp: main }
        }
        return undefined
    }
    return new Promise((resolve, reject) => {
        todaysWeatherForCity(cityId).then((weather: unknown) => resolve({ weather }))
    })
}
