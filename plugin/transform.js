const { getStylesForProperty } = require('css-to-react-native')

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
]

const runtimeKeys = ['border', 'boxShadow']

const withoutTransform = (key, value) => ({ [key]: value })
const runtimeTransform = (key, value) => ({ 'RUNTIME_': [key, value] })

const colorTransforms = colorKeys.map((key) => [key, withoutTransform])
const stringTransforms = stringKeys.map((key) => [key, withoutTransform])
const runtimeTransforms = runtimeKeys.map((key) => [key, runtimeTransform])

const CustomTransformers = Object.fromEntries(
    []
    .concat(colorTransforms)
    .concat(stringTransforms)
    .concat(runtimeTransforms)
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
