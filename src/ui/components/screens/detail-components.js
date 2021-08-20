import React from 'react'

import { StyleSheet, Text, View } from 'react-native'
import { Chip, Divider, Subheading } from 'react-native-paper'

import { globalStyles } from '../styles/base-styles'
import { UserAvatarAndName } from '../user/UserAvatar'

export const StandardDivider = () => (
    <View style={{ marginTop: 8, marginBottom: 8 }}>
        <Divider />
    </View>
)
////{type[keyProp]}
export const StandardAvatarChipRow = ({ label, people }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
        <View style={{ alignItems: 'flex-start', justifyContent: 'center', width: 90 }}>
            <Subheading>
                <Text style={{ color: '#263836', fontSize: 13 }}>{label}</Text>
            </Subheading>
        </View>
        <View style={{ width: '100%', flexDirection: 'row', flexWrap: true, marginBottom: 8 }}>
            {people.map((type, ix) => {
                return (
                    <Chip style={styles.chip} textStyle={styles.chipText} key={ix}>
                        <Text>{JSON.stringify(type)} </Text>
                    </Chip>
                )
            })}
        </View>
    </View>
)

export const StandardAvatarRow = ({ label, email, role }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
        <View style={{ alignItems: 'flex-start', justifyContent: 'center', width: 90 }}>
            <Subheading>
                <Text style={{ color: '#263836', fontSize: 13 }}>{label}</Text>
            </Subheading>
        </View>

        <View
            style={{
                flexDirection: 'row',
                marginLeft: 50,
                alignItems: 'center',
                justifyContent: 'flex-start',
                flex: 1,
            }}
        >
            <UserAvatarAndName email={email} meta={<Text style={{ fontSize: 11, color: '#676F74' }}>{role}</Text>} />
        </View>
    </View>
)

export const ThingAndCountAndChipArray = ({ label, thingsForChipArray, keyProp = 'goodCatchType' }) => (
    <>
        <View
            style={{
                marginTop: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginBottom: 8,
                marginLeft: 4,
            }}
        >
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <Subheading>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontSize: 14,
                            color: '#263238CC',
                        }}
                    >
                        {label}
                    </Text>
                </Subheading>
                <View
                    style={{
                        marginLeft: 4,
                        width: 24,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#EBEBED99',
                        borderRadius: 4,
                        height: 20,
                        marginTop: 4,
                    }}
                >
                    <Text
                        style={{
                            ...globalStyles.sizeXXsText,
                            fontSize: 10,
                        }}
                    >
                        {thingsForChipArray.length}
                    </Text>
                </View>
            </View>
        </View>

        {thingsForChipArray && (
            <View style={{ width: '100%', flexDirection: 'row', flexWrap: true, marginBottom: 8 }}>
                {thingsForChipArray.map((type, ix) => {
                    return (
                        <Chip style={styles.chip} textStyle={styles.chipText} key={ix}>
                            <Text>{type[keyProp]}</Text>
                        </Chip>
                    )
                })}
            </View>
        )}
    </>
)

export const StandardInfoRow = ({ label, value }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ alignItems: 'flex-start', justifyContent: 'center', width: 90 }}>
            <Subheading>
                <Text style={{ color: '#263836', fontSize: 13 }}>{label}</Text>
            </Subheading>
        </View>
        <View style={{ marginLeft: 50, alignItems: 'flex-start', justifyContent: 'center', flex: 1 }}>
            <Text
                style={{
                    fontSize: 14,
                    color: '#263238CC',
                }}
            >
                {value}
            </Text>
        </View>
    </View>
)

const styles = StyleSheet.create({
    chip: {
        backgroundColor: '#EBEBED',
        borderColor: '#0002',
        marginRight: 8,
        height: 20,
        alignItems: 'center',
        marginBottom: 4,
    },
    chipText: {
        fontSize: 11,
    },
})
