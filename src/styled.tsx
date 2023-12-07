import React, { PropsWithChildren, useContext } from 'react'
import {
  Button,
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  SectionList,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  VirtualizedList,
} from 'react-native'
import {
  Mixin,
  AnyComponent,
  AnyTheme,
  BaseObject,
  InnerAttrs,
  Interpolation,
  StylePair,
  Styled,
  Styles,
  Themed,
  UnknownProps,
  AsComponentProps,
} from './types'

/**
 * Combines passed props and props from attrs
 * @param props passed props
 * @param attrs array of props
 * 
 * Example:
 * props - { overriddenNumber: 0 }
 * attrs - [
 *  { number: 1, overriddenNumber: 1}, // props as an object
 *  (props) => { number: props.number + 1, overriddenNumber: props.overriddenNumber + 1 } // props a function
 * ]
 * result - { overriddenNumber: 0, number: 2 }
 */
export function buildPropsFromAttrs<Theme extends BaseObject = AnyTheme>(props: Themed<UnknownProps, Theme>, attrs: InnerAttrs[]): Themed<UnknownProps, Theme> {
  if (attrs.length === 0) {
    return props
  }
  attrs = attrs.concat(props)
  return attrs.reduce<Themed<UnknownProps, Theme>>((acc, recordOrFn) => {
    if (typeof recordOrFn === 'function') {
      recordOrFn = recordOrFn(acc)
    }
    return Object.assign(acc, recordOrFn)
  }, { ...props })
}

type DynamicStyleFn = (props: Themed<UnknownProps, AnyTheme>) => unknown

const DynamicSymbol = Symbol('dynamic')
export const dynamic = (fn: DynamicStyleFn) => ({ type: DynamicSymbol, fn })
export const isDynamic = (obj: any): obj is ReturnType<typeof dynamic> => obj?.type === DynamicSymbol

export const mixin = (styles: StylePair[]) => new Mixin(styles)
const isMixin = (obj: any): obj is ReturnType<typeof mixin> => obj instanceof Mixin

interface SplitStylesResult {
  fixed: UnknownProps
  dynamic: Array<[string, DynamicStyleFn | StylePair]>
}

export function splitStyles(styles: StylePair[], result: SplitStylesResult = { fixed: {}, dynamic: [] }) {
  const { fixed, dynamic } = result
  for (const [key, style] of styles) {
    if (isDynamic(style)) {
      dynamic.push([key, style.fn])
    } else if (isMixin(style)) {
      splitStyles(style.styles, result)
    } else {
      fixed[key] = style
    }
  }

  return result
}

export function buildDynamicStyles(
  props: Themed<UnknownProps, AnyTheme>,
  dynamic: Array<[string, DynamicStyleFn | StylePair[] | Mixin | unknown]>,
  acc: UnknownProps = {}
) {
  for (const [key, fnOrResult] of dynamic) {
    const result = typeof fnOrResult === 'function' ? fnOrResult(props) : fnOrResult
    if (isMixin(result)) {
      buildDynamicStyles(props, result.styles, acc)
    } else if (isDynamic(result)) {
      acc[key] = result.fn(props)
    } else {
      acc[key] = result
    }
  }
  return acc
}

/**
 *  fixed props:
 *  left: ${1}
 *  -> left: styled.maybeDynamic((...args) => args[0], 1) (after babel transpilation)
 *  -> left: 0 (in runtime)
 *  
 *  dynamic props:
 *  left: ${(props) => props.left}
 *  -> left: styled.maybeDynamic((...args) => args[0], (props) => props.left) (after babel transpilation)
 *  -> left: dynamic(fn) (in runtime)
 */
export function maybeDynamic(fn: (...fnArgs: unknown[]) => unknown, ...args: unknown[]): DynamicStyleFn | unknown {
  const isDynamic = args.some((arg) => typeof arg === 'function')
  if (isDynamic) {
    return dynamic((props: UnknownProps): unknown => {
      const fnArgs = args.map((arg) => {
        if (typeof arg === 'function') {
          return arg(props)
        }

        return arg
      })
      return fn(...fnArgs)
    })
  }
  return fn(...args)
}

interface AnyStyleProps {
  style: any
}

export function createStyled<Theme extends AnyTheme>() {
  const ThemeContext = React.createContext<Theme>({} as Theme)

  function styled<C extends AnyComponent>(Component: C): Styled<C, Theme> {
    const attrs: InnerAttrs[] = []
    const innderStyled = (styles: StylePair[]) => {
      if (process.env.NODE_ENV !== 'production') {
        if (!Array.isArray(styles)) {
          throw new Error('It seems you forgot to add babel plugin.')
        }
        if (styles.length && !Array.isArray(styles[0])) {
          throw new Error('It seems you forgot to add babel plugin.')
        }
      }
      const { fixed, dynamic } = splitStyles(styles)
      const fixedStyle = StyleSheet.create({ fixed }).fixed

      // Component
      const StyledComponent = React.forwardRef((props: UnknownProps & AnyStyleProps & AsComponentProps, ref) => {
        const theme = useContext(ThemeContext)
        let propsWithTheme: Themed<UnknownProps, Theme> = { ...props, theme }
        propsWithTheme = buildPropsFromAttrs(propsWithTheme, attrs)
        let style: StyleProp<UnknownProps> = fixedStyle
        if (dynamic.length > 0) {
          const dynamicStyle = buildDynamicStyles(propsWithTheme, dynamic)
          style = StyleSheet.compose(style, dynamicStyle)
        }
        style = StyleSheet.compose(style, props.style)
        const CastedComponent = (props.as ?? Component) as AnyComponent
        return <CastedComponent {...propsWithTheme} theme={props.theme} style={style} ref={ref} />
      })

      StyledComponent.displayName = 'StyledComponent'

      return StyledComponent
    }
    innderStyled.attrs = (attrsOrAttrsFn: InnerAttrs) => {
      attrs.push(attrsOrAttrsFn)
    }
    // We use as unknown as Type constraction here becasue
    // it is expected that argument so the styled function is transformed to an Array<Array> type during Babel transpilation.
    return innderStyled as unknown as Styled<C, Theme>
  }

  styled.Button = styled(Button)
  styled.FlatList = styled(FlatList)
  styled.Image = styled(Image)
  styled.KeyboardAvoidingView = styled(KeyboardAvoidingView)
  styled.Modal = styled(Modal)
  styled.Pressable = styled(Pressable)
  styled.RefreshControl = styled(RefreshControl)
  styled.SafeAreaView = styled(SafeAreaView)
  styled.ScrollView = styled(ScrollView)
  styled.SectionList = styled(SectionList)
  styled.Text = styled(Text)
  styled.TextInput = styled(TextInput)
  styled.TouchableHighlight = styled(TouchableHighlight)
  styled.TouchableOpacity = styled(TouchableOpacity)
  styled.VirtualizedList = styled(VirtualizedList)
  styled.View = styled(View)
  styled.TouchableWithoutFeedback = styled(TouchableWithoutFeedback)
  styled.ImageBackground = styled(ImageBackground)

  styled.maybeDynamic = maybeDynamic

  // It is expected that _styles and _interpolations are transformed to an Array<Array> type during Babel transpilation.
  function css<Props extends object = BaseObject>(
    _styles: Styles<Themed<Props, Theme>>,
    ..._interpolations: Array<Interpolation<Themed<Props, Theme>>>
  ) {
    // eslint-disable-next-line prefer-rest-params
    return mixin(arguments[0])
  }

  css.maybeDynamic = maybeDynamic

  const ThemeProvider = ({ theme, children }: PropsWithChildren<{ theme: Theme }>) => (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  )

  return { styled, ThemeProvider, ThemeContext, css }
}
