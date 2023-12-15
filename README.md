# styled-native-components

Enjoy the beauty of the `styled-components` API with the performance of `StyleSheet`. The aim of this project is to use the API of the `styled-components` library while shifting work from runtime to compile time and launch time.

## Usage
1. Add `styled-native-components/plugin` to your Babel configuration.
2. Create a `styled` instance with your custom theme:
```typescript

interface CustomTheme {
    colors: {
        // ....
    },
}

const { styled, css, ThemeProvider, ThemeContext } = createStyled<CustomTheme>()
```
3. Wrap your root component in `ThemeProvider`.

4. Write your components using the `styled` instance.


## Under the Hood

1. The first step is to transpile string templates into small functions.


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
const Component = styled.View([
    styled.style('height', 1),
    styled.style('padding', 1),
])
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
const Box = styled.View([
    styled.style('height', styled.maybeDynamic((args) => args[0], [(props) => props.size])),
    styled.style('width', styled.maybeDynamic((args) => args[0], [(props) => props.size])),
])
```

-----
### mixin

before:
```typescript
const shared = css`
    background: white;
`

const Component = styled.View`
    ${shared}
    height: 1px;
`
```

after:
```typescript
const shared = css([
    css.style('background', 'white'),
])

const Component = styled.View([
    styled.mixin(shared),
    styled.style('height', 1),
])
```

2. During the import of a component, all style pairs are processed and split into `fixed` and `dynamic` styles.

3. During the rendering phase, `dynamic` styles are called with props passed to the component. They are then combined with `fixed` styles and applied to the component's styles.
