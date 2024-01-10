# styled-native-components

Enjoy the beauty of the `styled-components` API with the performance of `StyleSheet`. The aim of this project is to use the API of the `styled-components` library while shifting work from runtime to compile time.

## Setup
1. Add `styled-native-components/babel-plugin` to your Babel configuration.
```diff
module.exports = {
    presets: ['module:metro-react-native-babel-preset',
     
    ],
+   plugins: ['styled-native-components/babel-plugin'],
 }
```

2. Wrap the root component in `ThemeProvider`.

3. Write components

```ts
import styled from 'styled-native-components'

const Title = styled.View`
  flex: 1;
  padding: 5px;
`
```


## Under the Hood

1. The first step is to transpile string templates.


> The library utilizes (postcss)[https://github.com/postcss/postcss] (css-to-react-native)[https://github.com/styled-components/css-to-react-native#readme] to parse string templates and build style pairs.


### Examples:

### simple 
before:
```typescript
const Component = styled.View`
    height: 1px;
    padding: 1px;
`
```

after:
```typescript
const Component = styled.View({
    height: 1,
    padding: 1,
})
```
-----
### dynamic styles
before:
```typescript
const Box = styled.View<{ size: number }>`
    height: ${(props) => props.size}px;
    width: ${(props) => props.size}px;
`
```

after:
```typescript
const Box = styled.View({
    height: styled.maybeDynamic((props) => props.size),
    width: styled.maybeDynamic((props) => props.size),
})
```

-----
### mixin

before:
```typescript
const shared = css`
    background: white;
    width: ${(props) => props.size}px;
`

const Component = styled.View`
    ${shared}
    height: 1px;
`
```

after:
```typescript
const shared = {
    backgroundColor: 'white',
    width: styled.maybeDynamic((props) => props.size),
}

const Component = styled.View({
    ...shared,
    height: 1,
})
```

2. During the rendering phase, `dynamic` styles are called with props passed to the component. They are then combined with `fixed` styles and applied to the component's styles.
