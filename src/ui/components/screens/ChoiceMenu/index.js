import { Pressable, StyleSheet, Text } from 'react-native'
import isEqual from 'lodash-es/isEqual'
import React, { useEffect, useState } from 'react'
import { Button, Menu } from 'react-native-paper'
import { Box } from '../../styles/BoxTheme'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

export function noop() {
    //
}

const menuStyles = StyleSheet.create({
    menu: {
        color: 'white',
    },
    menuBox: {
        backgroundColor: '#fff2',
        borderRadius: 4,
        width: '100%',
        zIndex: 20000,
    },
})

export function ChoiceMenu({
    width,
    value,
    startAdornment = null,
    endAdornment = null,
    onChange = noop,
    options,
    ...props
}) {
    let initialIndex = options.findIndex((opt) => isEqual(opt.value, value))
    let currentIndex = initialIndex < 0 ? 0 : initialIndex
    useEffect(() => {
        if (currentIndex !== initialIndex) {
            onChange(options[currentIndex].value)
        }
    }, [currentIndex, initialIndex])
    const [open, setOpen] = useState(false)
    return (
        <Menu
            style={{ paddingTop: 40, paddingLeft: 8 }}
            visible={open}
            onDismiss={() => setOpen(false)}
            anchor={
                <Box width={width}>
                    <Button {...props} style={[menuStyles.menuBox, props.boxStyle]} onPress={() => setOpen(true)}>
                        <Box alignItems="center" flexDirection="row" width="100%">
                            {startAdornment}
                            <Box mt="xs">
                                <Text style={[menuStyles.menu, props.style]}>{options[currentIndex].label}</Text>
                            </Box>
                            <Box flex={1} />
                            {endAdornment}
                            <Box ml="s" mt="xs">
                                <FontAwesomeIcon icon={faChevronDown} color={props.style?.color ?? 'white'} size={12} />
                            </Box>
                        </Box>
                    </Button>
                </Box>
            }
        >
            {options.map((option, index) => {
                return (
                    <Menu.Item
                        onPress={() => {
                            onChange(option.value)
                            setOpen(false)
                        }}
                        key={index}
                        titleStyle={index === currentIndex ? { fontWeight: '600' } : {}}
                        title={option.label}
                    />
                )
            })}
        </Menu>
    )
}
