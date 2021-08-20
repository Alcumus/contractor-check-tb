import Sugar from 'sugar'
import 'react-native-gesture-handler'
import { Alert, AppRegistry } from "react-native"
import App from './App'
import { name as appName } from './app.json'


AppRegistry.registerComponent(appName, () => App)

Sugar.Array.extend()
export { useGraphQuery } from './src/ui/components/lib/useGraphQuery'


