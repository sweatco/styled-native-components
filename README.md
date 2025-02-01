# @sweatco/styled

Enjoy the beauty of the `styled-components` combined with the efficiency of `StyleSheet`. This project's objective is to leverage the styled-components library's API, shifting work from runtime to compile time.

## Setup
1. Add `@sweatco/styled/babel-plugin` to your Babel configuration.
```diff
module.exports = {
    presets: ['module:metro-react-native-babel-preset',
     
    ],
+   plugins: ['@sweatco/styled/babel-plugin'],
 }
```

2. Encapsulate the root component with the `ThemeProvider` wrapper. This will enable theme-based styling throughout your application.

## Example

```ts
import React from 'react'

import styled from '@sweatco/styled'

const Title = styled.Text<{ color: string }>`
  font-size: 15px;
  text-align: center;
  color: ${({ color }) => color};
`

const Container = styled.View`
  padding: 4px;
  background: wite;
`

const Screen = () => (
    <Container>
      <Title color="black">Hello World, this is my first styled native component!</Title>
    </Container>
  )
```

## Refs

When using the ref prop, it will refer to the component you are styling rather than the styled component.

```ts
const RedView = styled.View`
  background: red;
`

const Component = () => {
    const ref = useRef<View>()

    return <RedView ref={ref} />
}
```


## Under the Hood

1. The first step is to transpile template literals.


> The library utilizes (postcss)[https://github.com/postcss/postcss] (css-to-react-native)[https://github.com/styled-components/css-to-react-native#readme] to parse string templates and build style pairs.


#### Fixed styles

All fixed styles are converted to object properies without any changes

before:
```typescript
const Component = styled.View`
    background: white;
    height: 1px;
`
```

after:
```typescript
const Component = styled.View({
    backgroundColor: 'white',
    height: 1,
})
```

#### substitute styles
For styles utilizing the `$` command, we employ the [substitute](src/parsers.ts#L9) helper. This helper checks whether a style is dynamic or fixed. If the style depends on properties, `substitute` returns a function designed to be called during render time.

before:
```typescript
const Component = styled.Text`
    color: ${'white'};
    font-family: ${'Roboto'}-${'Bold'};
    height: ${(props) => props.size}px;
`
```

after:
```ts
const Component = styled.View({
    color: styled.substitute((args) => args[0], ['white']),
    fontFamily: styled.substitute(
        (args) => `${args[0]}-${args[1]}`,
        ['Roboto', 'Bold'],
    ),
    height: styled.substitute(
        (args) => args[0],
        [(props) => props.size],
    ),
})

// ->

const Component = styled.View({
    color: 'white',
    fontFamily: 'Roboto-Bold',
    height: (props) => props.size,
})
```

#### runtime styles

If styles cannot be parsed during compile time, they are wrapped with the [runtime](src/parsers.ts#L71) helper.

> runtime helper calls `css-to-react-native` for passed `key` and `value`

before:
```typescript
const Component = styled.Text`
    border: ${'white'};
    transform: ${I18nManager.isRTL ? 'rotate(180deg)' : 'rotate(0deg)'}
`
```

after:
```typescript
const Component = styled.View({
    ...styled.runtime(
        'border',
        styled.substitute((args) => args[0], ['white'])
    ),
    ...styled.runtime(
        'transform',
        styled.substitute((args) => args[0], [I18nManager.isRTL ? 'rotate(180deg)' : 'rotate(0deg)'])
    ),
})

// ->

const Component = styled.View({
    borderWidth: 1,
    borderColor: 'white',
    borderStyle: 'solid',
    transform: [{ rotate: '180deg' }],
})
```

#### mixins

All injected constructions, such as `${() => {...}};` or `${css``}`, are wrapped with the [mixin](src/parsers.ts#L81) helper.

before:
```typescript
const shared = css`
    color: white;
    width: ${(props) => props.size}px;
`

const Component = styled.Text`
    ${shared};
    height: 1px;
`
```

after:
```typescript
const shared = {
    color: 'white',
    width: styled.substitute((args) => args[0], [(props) => props.size]),
}

const Component = styled.Text({
    ...shared,
    height: 1,
})
```
