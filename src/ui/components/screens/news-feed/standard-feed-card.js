import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import format from 'date-fns/format'
import toDate from 'date-fns/toDate'
import { Card, Divider } from 'react-native-paper'
import { UserAvatar } from '../../user/UserAvatar'
import { Flex } from '../../utils/flex'
import { Image, ImageBackground, Text } from 'react-native'
import { Reactions } from './reactions'
import { StandardCardButton, StandardCardButtonContainer } from './card-components/feed-button'
import { noop } from '../ChoiceMenu'
import { Box } from '../../styles/BoxTheme'
import CachedImage from 'react-native-image-cache-wrapper'

export function StandardFeedCard({
    item,
    style = undefined,
    avatarEmail,
    title,
    description = undefined,
    hideReactions = false,
    topArea = null,
    imageTitle = '',
    image,
    children = null,
    onPressMore = noop,
    onAddReaction = noop,
    onAddNote = noop,
}) {
    const date = format(toDate(new Date(item.submittedDate)), 'MMM dd yyyy, p')
    return (
        <Card
            style={[
                {
                    marginBottom: 8,
                },
                style,
            ]}
        >
            <Card.Title
                title={title}
                subtitle={`${date}`}
                titleNumberOfLines={2}
                titleStyle={{
                    fontFamily: 'Roboto',
                    fontSize: 16,
                    lineHeight: 21,
                    marginTop: 8,
                    marginRight: 16,
                }}
                style={{ alignItems: 'flex-start', marginTop: 10 }}
                left={() => <UserAvatar email={avatarEmail} />}
                leftStyle={{ marginTop: 4, marginRight: 18 }}
            />
            {topArea}
            {!!image && (
                <Flex mt={1} mb={1.5}>
                    <CachedImage
                        style={{
                            width: '100%',
                            height: 200,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        source={image}
                    >
                        {!!description && (
                            <Box style={{ backgroundColor: '#000000a0', padding: 8, borderRadius: 4 }}>
                                <Text
                                    style={{
                                        color: 'white',
                                        fontFamily: 'Roboto',
                                        textAlign: 'center',
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {description}
                                </Text>
                            </Box>
                        )}
                    </CachedImage>
                </Flex>
            )}
            <Card.Content>{children}</Card.Content>
            {!hideReactions && (
                <Card.Content>
                    <Divider style={{ height: 1 }} />
                </Card.Content>
            )}
            {!hideReactions && (
                <Card.Content>
                    <Reactions item={item} />
                </Card.Content>
            )}
            {!hideReactions && (
                <Card.Actions>
                    <Flex mb={1} mt={0} ml={1} mr={1}>
                        <StandardCardButtonContainer>
                            <StandardCardButton onPress={() => onAddReaction(item)}>React</StandardCardButton>
                            <StandardCardButton onPress={() => onAddNote(item)}>Add Note</StandardCardButton>
                            <StandardCardButton onPress={() => onPressMore(item)}>More...</StandardCardButton>
                        </StandardCardButtonContainer>
                    </Flex>
                </Card.Actions>
            )}
        </Card>
    )
}
