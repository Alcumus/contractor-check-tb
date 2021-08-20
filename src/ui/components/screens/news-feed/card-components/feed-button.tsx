import React from 'react'
import { Flex } from '../../../utils/flex'

import { globalStyles } from '../../../styles/base-styles'
import { Button } from 'react-native-paper'

export const StandardCardButtonContainer = ({ children, ...props }) => (
    <Flex alignItems={'center'} justifyContent={'space-between'} flex={1}>
        {children}
    </Flex>
)

export const StandardCardButton = ({ children, ...props }) => (
    <Button
        labelStyle={[
            globalStyles.capitalize,
            globalStyles.regularText,
            {
                color: '#263836CC',
            },
        ]}
        {...props}
        mode={'contained'}
        style={{
            backgroundColor: 'white',
            height: 32,
            width: 100,
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 5,
        }}
    >
        {children}
    </Button>
)
