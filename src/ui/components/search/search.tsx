import { useState, useEffect } from 'react'

type Props<T> = {
    content: T[]
    filter: string
    keyString: string
    fn?: (content: T[], keyString: string, filter: string) => T[]
    render: (filteredContent: T[]) => JSX.Element
}

export const Search = <T extends Record<string, unknown>>(props: Props<T>): JSX.Element => {
    const { keyString, content, filter = '', render, fn } = props
    const [filteredContent, setFilteredContent] = useState<T[]>([])

    // todo pass in a filter to use
    useEffect(() => {
        const lowerCase = filter.toLocaleLowerCase().trim()
        const searchTerms = lowerCase.split(' ')

        if (fn) {
            const fd = fn(content, keyString, filter)
            setFilteredContent(fd)
        } else {
            const fd = content.reduce((acc: T[], item: T): T[] => {
                const searchFilter = (term: string) => {
                    if (
                        item[keyString] &&
                        typeof item[keyString] === 'string' &&
                        (item[keyString] as string).toLowerCase().indexOf(term) > -1
                    ) {
                        acc.push(item)
                    }
                }
                searchTerms.forEach((term: string) => searchFilter(term))
                return acc
            }, [])
            setFilteredContent(fd)
        }
    }, [content, filter, fn, keyString])

    return render(filteredContent)
}
