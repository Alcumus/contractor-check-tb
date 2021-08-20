import { TextStyle } from 'react-native'

type Config = {
    header: {
        height: number
    }
    profileGreeting: {
        morning: string
        afternoon: string
        evening: string
    }
    theme: {
        alcBrand001: string
        alcBrand002: string
        alcSys007: string
        background: string
        textDuetoday: string
        greeting: string
        iconColor: string
        error: string
        accent: string
        textColor: string
        cardBackground: string
    }
    fontFamily: {
        bold: string
        extrabold: string
        light: string
        regular: string
        semibold: string
    }
    fontWeight: {
        bold: TextStyle['fontWeight']
        extrabold: TextStyle['fontWeight']
        light: TextStyle['fontWeight']
        regular: TextStyle['fontWeight']
        semibold: TextStyle['fontWeight']
    }
}

const Config = {
    header: {
        height: 44,
    },
    profileGreeting: {
        morning: 'Good Morning,',
        afternoon: 'Good Afternoon,',
        evening: 'Good Evening,',
    },
    theme: {
        alcBrand001: '#0A599A',
        alcBrand002: '#0081AF',
        alcSys007: '#263836',
        textDuetoday: '#D27337',
        background: '#F2F2F2',
        cardBackground: '#ffffff',
        greeting: '#FFFFFFCC',
        iconColor: '#444',
        error: '#D11',
        accent: '#D27337',
        textColor: '#333',
    },
    fontFamily: {
        bold: 'Roboto-Bold',
        extrabold: 'Roboto-Bold',
        light: 'Roboto-Light',
        regular: 'Roboto-Regular',
        semibold: 'Roboto-Medium',
    },
    fontWeight: {
        bold: 'bold',
        extrabold: '800',
        light: '300',
        regular: '400',
        semibold: '700',
    },
} as Config

export default Config
