import { apolloClient } from '../../../../App'
import { useState } from 'react'
import { useQuery } from '@apollo/client'

export function useGraphQuery(query, options) {
    options.client = options.client || apolloClient
    const [state, setState] = useState(options.default || null)
    const result = useQuery(query, { ...options, onCompleted: complete, onError: error })
    return [state, result]

    function complete(data) {
        if (options.map) {
            data = options.map(data, options)
        }
        if (options.onCompleted) {
            options.onCompleted(data, options)
        }
        setState(data)
    }

    function error(...params) {
        if (options.onError) {
            options.onError(...params)
        }
        console.error('GraphQL Error', ...params, 'for', query)
    }
}
