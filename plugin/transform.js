const { getStylesForProperty } = require('css-to-react-native')

const colorKeys = ['background', 'borderColor', 'color', 'backgroundColor', 'tintColor', 'shadowColor']
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
]

const runtimeKeys = ['border']

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
    const transformer = CustomTransformers[key] ?? getStylesForProperty

    return Object.entries(transformer(key, value))
}

module.exports = {
    transform,
}
