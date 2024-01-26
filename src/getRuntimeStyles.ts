import { getStylesForProperty } from 'css-to-react-native'

export const getRuntimeStyles = (key: string, value: unknown) => {
    try {
        if (typeof value === 'string' || typeof value === 'number') {
            return getStylesForProperty(key, String(value))
        }

        return { [key]: value }
    } catch (error) {
        if (__DEV__) {
            throw error
        }
    }
}
