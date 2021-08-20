import { StyleSheet } from 'react-native'
import { StandardFilterBar, theme } from '../../standards'
import React, { useEffect, useMemo, useState } from 'react'
import { Box, Text } from '../../styles/BoxTheme'
import { Button, IconButton } from 'react-native-paper'
import { ChoiceMenu, noop } from '../ChoiceMenu'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSortAmountDown, faSortAmountUp } from '@fortawesome/free-solid-svg-icons'
import { showPanel, useClosePanel } from '../../navigation/tab-navigation'
import { FilterPeopleCard } from '../../cards/people-filter'
import { FilterGoodCatchTypesCard } from '../../cards/good-catch-types-filter'
import { Selector, styles as selectorStyles } from '../../cards/selector'

const styles = StyleSheet.create({
    filter: {
        borderWidth: 1,
        borderColor: '#0002',
    },
    filterText: {
        color: 'black',
    },
    selected: {
        backgroundColor: theme.alcBrand001,
        color: 'white',
        borderColor: theme.alcBrand001,
        borderWidth: 2,
    },
    unselectedIconButton: {},
})

export function GoodCatchFilterBar({ settings, onChange = noop }) {
    const [sort, setSort] = useState(settings.sort)
    const [filter, setFilter] = useState(settings.filter)
    useEffect(() => {
        onChange({ filter, sort })
    }, [filter, sort])
    let hasFilter = !!Object.values(filter)
        .filter((f) => f !== undefined)
        .filter((f) => !Array.isArray(f) || !!f.length).length
    console.log(filter)
    return (
        <StandardFilterBar>
            <Box>
                <IconButton
                    onPress={showFilter}
                    icon="filter"
                    color={hasFilter ? 'white' : theme.alcBrand001}
                    style={hasFilter ? styles.selected : styles.unselectedIconButton}
                />
            </Box>
            <Box mr="l" width="60%">
                <ChoiceMenu
                    boxStyle={styles.filter}
                    startAdornment={
                        <Box mr="s">
                            <FontAwesomeIcon icon={sort === 'dueDate' ? faSortAmountUp : faSortAmountDown} size={16} />
                        </Box>
                    }
                    style={styles.filterText}
                    value={sort}
                    onChange={setSort}
                    options={[
                        {
                            label: 'Submitted Date',
                            value: 'submittedDate',
                        },
                        {
                            label: 'Due Date',
                            value: 'dueDate',
                        },
                    ]}
                />
            </Box>
        </StandardFilterBar>
    )

    function showFilter() {
        let updatedFilter = filter
        showPanel(<GoodCatchFilterPanel value={filter} onChange={(update) => (updatedFilter = update)} />, {
            title: 'Filters',
            onSet: (close) => {
                close()
                setFilter(
                    Object.fromEntries(
                        Object.entries(updatedFilter).filter(([key, value]) => {
                            return !!key && value !== undefined && (!Array.isArray(value) || value.length)
                        })
                    )
                )
            },
        })
    }
}

function GoodCatchFilterPanel({ value, onChange }) {
    const [people, setPeople] = useState(value?.submittedBy || [])
    const [assigned, setAssigned] = useState(value?.assignedTo || [])
    const [hazards, setHazards] = useState(value?.goodCatchTypes || [])
    const [critical, setCritical] = useState(value?.critical !== false)
    const [high, setHigh] = useState(value?.high !== false)
    const [moderate, setModerate] = useState(value?.moderate !== false)
    const [low, setLow] = useState(value?.low !== false)
    const [resolved, setResolved] = useState(value?.resolved !== false)
    const [unresolved, setUnresolved] = useState(value?.unresolved !== false)
    useMemo(() => {
        onChange({
            submittedBy: people,
            goodCatchTypes: hazards,
            assignedTo: assigned,
            resolved: resolved ? undefined : false,
            unresolved: unresolved ? undefined : false,
            critical: critical ? undefined : false,
            moderate: moderate ? undefined : false,
            high: high ? undefined : false,
            low: low ? undefined : false,
        })
    }, [people, hazards, assigned, unresolved, resolved, critical, moderate, high, low])
    const close = useClosePanel()
    const personCard = (
        <FilterPeopleCard
            label={null}
            value={people}
            accept={(people) => {
                setPeople(people)
                close()
            }}
            dismissed={() => {
                close()
            }}
        />
    )
    const assignedCard = (
        <FilterPeopleCard
            label={null}
            value={assigned}
            accept={(people) => {
                setAssigned(people)
                close()
            }}
            dismissed={() => {
                close()
            }}
        />
    )
    const hazardCard = (
        <FilterGoodCatchTypesCard
            values={hazards}
            accept={(hazard) => {
                setHazards(hazard)
                close()
            }}
            dismissed={() => {
                setHazards([])
                close()
            }}
        />
    )

    return (
        <Box>
            <Selector
                defaultLabel="All"
                label="Submitted By"
                chips={people.map((p) => `${p.firstName} ${p.lastName}`)}
                callbackOpenFilter={(flag) => {
                    showPanel(personCard, { wrap: false })
                }}
            />
            <Selector
                defaultLabel="All"
                label="Hazard Type"
                chips={hazards.map((p) => `${p.goodCatchType}`)}
                callbackOpenFilter={(flag) => {
                    showPanel(hazardCard, { wrap: false })
                }}
            />
            <Selector
                defaultLabel="All"
                label="Assigned To"
                chips={assigned.map((p) => `${p.firstName} ${p.lastName}`)}
                callbackOpenFilter={(flag) => {
                    showPanel(assignedCard, { wrap: false })
                }}
            />
            <Selector
                label={'Severity'}
                defaultLabel={'All'}
                chips={getSeverity()}
                callbackOpenFilter={() => {
                    let currentProps
                    showPanel(
                        <SeverityEditor
                            {...{ high, critical, low, moderate }}
                            onChange={(props) => (currentProps = props)}
                        />,
                        {
                            height: 0.5,
                            onSet(close) {
                                close()
                                if (currentProps) {
                                    setHigh(currentProps.high)
                                    setCritical(currentProps.critical)
                                    setLow(currentProps.low)
                                    setModerate(currentProps.moderate)
                                }
                            },
                        }
                    )
                }}
            />
            <Selector
                label={'Status'}
                defaultLabel={'All'}
                chips={getStatus()}
                callbackOpenFilter={() => {
                    let currentProps
                    showPanel(
                        <StatusEditor {...{ resolved, unresolved }} onChange={(props) => (currentProps = props)} />,
                        {
                            height: 0.5,
                            onSet(close) {
                                close()
                                if (currentProps) {
                                    setResolved(currentProps.resolved)
                                    setUnresolved(currentProps.unresolved)
                                }
                            },
                        }
                    )
                }}
            />

            <Box mt="xl" pl="m" pr="m">
                <Button onPress={reset} mode="contained" color={theme.accent} dark={true}>
                    Reset Filters
                </Button>
            </Box>
        </Box>
    )

    function getStatus() {
        const output = []
        if (resolved) output.push('Resolved')
        if (unresolved) output.push('Unresolved')
        return output.length === 2 ? [] : output
    }

    function getSeverity() {
        const output = []
        if (critical) output.push('Critical')
        if (high) output.push('Serious')
        if (moderate) output.push('Moderate')
        if (low) output.push('Low')
        return output.length === 4 ? [] : output
    }

    function reset() {
        setPeople([])
        setAssigned([])
        setHazards([])
        setResolved(true)
        setUnresolved(true)
        setCritical(true)
        setHigh(true)
        setModerate(true)
        setLow(true)
    }
}

function SeverityEditor({ high, low, critical, moderate, onChange = noop }) {
    const [isHigh, setHigh] = useState(high)
    const [isLow, setLow] = useState(low)
    const [isModerate, setModerate] = useState(moderate)
    const [isCritical, setCritical] = useState(critical)
    useMemo(() => {
        onChange({ high: isHigh, low: isLow, moderate: isModerate, critical: isCritical })
    }, [isHigh, isLow, isModerate, isCritical])
    return (
        <>
            <Box ml="m" mt="l" mb="s">
                <Text style={selectorStyles.whLabel}>Severity</Text>
            </Box>
            <Box flexDirection="row" width="100%" pl="s" pr="s">
                <Box m="s" flex={1}>
                    <Button
                        onPress={toggleCritical}
                        style={isCritical ? styles.selected : styles.unselected}
                        mode="outlined"
                    >
                        <Text style={isCritical ? styles.selected : styles.unselected}>Critical</Text>
                    </Button>
                </Box>
                <Box m="s" flex={1}>
                    <Button onPress={toggleHigh} style={isHigh ? styles.selected : styles.unselected} mode="outlined">
                        <Text style={isHigh ? styles.selected : styles.unselected}>Serious</Text>
                    </Button>
                </Box>
            </Box>
            <Box flexDirection="row" width="100%" pl="s" pr="s">
                <Box m="s" flex={1}>
                    <Button
                        onPress={toggleModerate}
                        style={isModerate ? styles.selected : styles.unselected}
                        mode="outlined"
                    >
                        <Text style={isModerate ? styles.selected : styles.unselected}>Moderate</Text>
                    </Button>
                </Box>
                <Box m="s" flex={1}>
                    <Button onPress={toggleLow} style={isLow ? styles.selected : styles.unselected} mode="outlined">
                        <Text style={isLow ? styles.selected : styles.unselected}>Low</Text>
                    </Button>
                </Box>
            </Box>
        </>
    )

    function toggleCritical() {
        setCritical((v) => !v)
    }

    function toggleHigh() {
        setHigh((v) => !v)
    }

    function toggleModerate() {
        setModerate((v) => !v)
    }

    function toggleLow() {
        setLow((v) => !v)
    }
}

function StatusEditor({ resolved, unresolved, onChange = noop }) {
    const [isResolved, setResolved] = useState(resolved)
    const [isUnresolved, setUnresolved] = useState(unresolved)

    useMemo(() => {
        onChange({ resolved: isResolved, unresolved: isUnresolved })
    }, [isResolved, isUnresolved])
    return (
        <>
            <Box ml="m" mt="l" mb="s">
                <Text style={selectorStyles.whLabel}>Severity</Text>
            </Box>
            <Box flexDirection="row" width="100%" pl="s" pr="s">
                <Box m="s" flex={1}>
                    <Button
                        onPress={toggleResolved}
                        style={isResolved ? styles.selected : styles.unselected}
                        mode="outlined"
                    >
                        <Text style={isResolved ? styles.selected : styles.unselected}>Resolved</Text>
                    </Button>
                </Box>
                <Box m="s" flex={1}>
                    <Button
                        onPress={toggleUnresolved}
                        style={isUnresolved ? styles.selected : styles.unselected}
                        mode="outlined"
                    >
                        <Text style={isUnresolved ? styles.selected : styles.unselected}>Unresolved</Text>
                    </Button>
                </Box>
            </Box>
        </>
    )

    function toggleResolved() {
        setResolved((v) => !v)
    }

    function toggleUnresolved() {
        setUnresolved((v) => !v)
    }
}
