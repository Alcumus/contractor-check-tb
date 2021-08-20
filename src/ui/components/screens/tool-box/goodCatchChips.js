import { Chip } from 'react-native-paper'
import { Box, Text } from '../../styles/BoxTheme'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheck, faExclamationCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import Sugar from 'sugar'
import React from 'react'
import { StyleSheet } from 'react-native'

const chipStyles = StyleSheet.create({
    chip: {
        backgroundColor: 'transparent',
        borderColor: '#0002',
        marginRight: 8,
        height: 20,
        alignItems: 'center',
        marginBottom: 4,
    },
    resolvedChip: {},
    resolvedChipText: {
        fontSize: 11,
        color: '#444',
    },
})
const levels = {
    low: {
        backgroundColor: `#00f2`,
        borderWidth: 0,
    },
    moderate: {
        backgroundColor: '#ff02',
        borderWidth: 0,
    },
    serious: {
        backgroundColor: '#f802',
        borderWidth: 0,
    },
    critical: {
        backgroundColor: '#f222',
        borderWidth: 0,
    },
}

export function GoodCatchChips({ item }) {
    const chips = []
    if (item._state === 'Done') {
        chips.push(
            <Chip style={[chipStyles.chip, chipStyles.resolvedChip]} key="resolved">
                <Box flexDirection="row" alignItems="center" pt="s" pb="xs">
                    <Box mr="xs">
                        <FontAwesomeIcon icon={faCheck} color="green" size={12} />
                    </Box>
                    <Text style={chipStyles.resolvedChipText}>Resolved</Text>
                </Box>
            </Chip>
        )
    } else {
        if (item.actionRequired) {
            chips.push(
                <Chip style={[chipStyles.chip, chipStyles.resolvedChip]} key="action">
                    <Box flexDirection="row" alignItems="center" pt="s" pb="xs">
                        <Box mr="xs">
                            <FontAwesomeIcon icon={faExclamationCircle} color="red" size={12} />
                        </Box>
                        <Text style={chipStyles.resolvedChipText}>Action Required</Text>
                    </Box>
                </Chip>
            )
        } else {
            chips.push(
                <Chip style={[chipStyles.chip, chipStyles.resolvedChip]} key="action">
                    <Box flexDirection="row" alignItems="center" pt="s" pb="xs">
                        <Box mr="xs">
                            <FontAwesomeIcon icon={faInfoCircle} color="#555" size={12} />
                        </Box>
                        <Text style={chipStyles.resolvedChipText}>No action required</Text>
                    </Box>
                </Chip>
            )
        }
    }
    if (item.severityLevel) {
        chips.push(
            <Chip style={[chipStyles.chip, levels[item.severityLevel.toLowerCase()]]} key="severity">
                <Box flexDirection="row" alignItems="center" pt="s" pb="xs">
                    <Text style={chipStyles.resolvedChipText}>{Sugar.String.titleize(item.severityLevel)}</Text>
                </Box>
            </Chip>
        )
    }
    return chips.length ? (
        <Box mt="s" flexDirection="row">
            {chips}
        </Box>
    ) : null
}
