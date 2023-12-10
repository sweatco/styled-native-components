const { getStylesForProperty } = require('css-to-react-native')
const { MIXIN, RUNTIME } = require('../constants')

const colorKeys = [
    'background',
    'borderColor',
    'color',
    'backgroundColor',
    'tintColor',
    'shadowColor',
    'borderTopColor',
    'borderBottomColor',
    'borderLeftColor',
    'borderRightColor',
    'textDecorationColor',
]
const stringKeys = [
    'flexDirection',
    'justifyContent',
    'alignItems',
    'alignSelf',
    'alignContent',
    'fontStyle',
    'fontFamily',
    'fontWeight',
    'textAlign',
    'resizeMode',
    'tintColor',
    'overflow',
    'position',
    'direction',
    'display',
    'textDecorationLine',
    MIXIN,
    RUNTIME,
]

const runtimeKeys = ['border', 'boxShadow']

const isSurrounded = (value, char) => value[0] === char && value[value.length - 1] === char
const stringTransform = (key, value) => {
    if (isSurrounded(value, '\'') || isSurrounded(value, '"')) {
        value = value.slice(1, -1)
    }
    return { [key]: value }
}
const runtimeTransform = (key, value) => ({ [RUNTIME]: [key, value] })

const colorTransforms = colorKeys.map((key) => [key, stringTransform])
const stringTransforms = stringKeys.map((key) => [key, stringTransform])
const runtimeTransforms = runtimeKeys.map((key) => [key, runtimeTransform])

const getNarrowedStylesForProperty = (key, value) => {
    const styles = getStylesForProperty(key, value)
    const left = `${key}Left`
    const right = `${key}Right`
    const top = `${key}Top`
    const bottom = `${key}Bottom`
    const vertical = `${key}Vertical`
    const horizontal = `${key}Horizontal`

    if (styles[left] === styles[right]) {
        styles[horizontal] = styles[left]
        delete styles[left]
        delete styles[right]
    }
    if (styles[top] === styles[bottom]) {
        styles[vertical] = styles[top]
        delete styles[top]
        delete styles[bottom]
    }
    if (styles[horizontal] != null && styles[horizontal] === styles[vertical]) {
        styles[key] = styles[horizontal]
        delete styles[horizontal]
        delete styles[vertical]
    }

    return styles
}

const customTransforms = {
    background: (_, value) => stringTransform('backgroundColor', value),
    borderWidth: (key, value) => getStylesForProperty(key, value, false),
    borderRadius: (key, value) => getStylesForProperty(key, value, false),
    padding: getNarrowedStylesForProperty,
    margin: getNarrowedStylesForProperty,
    flex: (key, value) => {
        const styles = getStylesForProperty(key, value)

        if (value.split(' ').length === 1) {
            return { flex: styles.flexGrow }
        }

        return styles
    }
}

const CustomTransformers = Object.fromEntries(
    []
    .concat(colorTransforms)
    .concat(stringTransforms)
    .concat(runtimeTransforms)
    .concat(Object.entries(customTransforms))
)


function transform(key, value) {
    let result
    try {
        const transformer = CustomTransformers[key] ?? getStylesForProperty
        result = transformer(key, value)
    } catch {
        result = runtimeTransform(key, value)
    }

    return Object.entries(result)
}

module.exports = {
    transform,
}
