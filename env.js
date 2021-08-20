export const tokens = [
    'd7abeed9a548bd1ee605bcc59bd6aeb77043798e6b62c883cb2cb767562d918b',
    'fa55b78190fb43321c30c2f8bc5752b16bc1901e702466bab8a6116d64aabcd8',
    '6c6463f1d3d5fae50004b9cf9171780b4166eb5298462cb6723a3c06e81d48c8',
    '1619de0cb9f39bc572dd6caa9e130bda6e43e3a59daf9e6ff6e08bf7a98e9c6d',
]

export const currentEnv = global.process.env.NODE_ENV

export const isDev = currentEnv === 'development'

export const appURL = isDev
    ? 'http://127.0.0.1:3001/api/wfgraphql'
    : 'https://phoenix.theatworknetwork.com/api/wfgraphql'

export const subscriptionURL = isDev
    ? 'ws://127.0.0.1:4000/wfgraphql'
    : 'ws://phoenix.theatworknetwork.com:4000/wfgraphql'

export const useToken = 3

export function getToken() {
    return tokens[useToken]
}
