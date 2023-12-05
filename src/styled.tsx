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
import { AnyComponent, AnyTheme, BaseObject, Interpolation, Styled, Styles, Themed } from './types'

type UnknownProps = Record<string, unknown>
type InnerAttrs = UnknownProps | ((props: Themed<UnknownProps, AnyTheme>) => UnknownProps)

function buildPropsFromAttrs(props: Themed<UnknownProps, AnyTheme>, attrs: InnerAttrs[]) {
  if (attrs.length === 0) {
    return
  }
  if (attrs.length === 1) {
    let [recordOrFn] = attrs
    if (typeof recordOrFn === 'function') {
      recordOrFn = recordOrFn(props)
    }

    return recordOrFn
  }
  return attrs.reduce<UnknownProps>((acc, recordOrFn) => {
    if (typeof recordOrFn === 'function') {
      recordOrFn = recordOrFn(props)
    }
    return Object.assign(acc, recordOrFn)
  }, {})
}

type StylePair = [string, unknown]
type DynamicStyleFn = (props: UnknownProps, theme: AnyTheme) => UnknownProps

const DynamicSymbol = Symbol('dynamic')
const dynamic = (fn: DynamicStyleFn) => ({ type: DynamicSymbol, fn })
const isDynamic = (obj: any): obj is ReturnType<typeof dynamic> => obj?.type === DynamicSymbol

const MixinSymbol = Symbol('mixin')
const mixin = (styles: StylePair[]) => ({ type: MixinSymbol, styles })
type MixinEntry = ReturnType<typeof mixin>
const isMixin = (obj: any): obj is ReturnType<typeof mixin> => obj?.type === MixinSymbol

interface BuildStylesResult {
  fixed: UnknownProps
  dynamic: Array<[string, DynamicStyleFn | StylePair]>
}

function buildStyles(styles: StylePair[], result: BuildStylesResult = { fixed: {}, dynamic: [] }) {
  const { fixed, dynamic } = result
  for (const [key, style] of styles) {
    if (isDynamic(style)) {
      dynamic.push([key, style.fn])
    } else if (isMixin(style)) {
      buildStyles(style.styles, result)
    } else {
      fixed[key] = style
    }
  }

  return result
}

function buildDynamicStyles(
  props: Themed<UnknownProps, AnyTheme>,
  dynamic: Array<[string, DynamicStyleFn | StylePair[] | MixinEntry | unknown]>,
  acc: UnknownProps = {}
) {
  for (const [key, fnOrResult] of dynamic) {
    const result = typeof fnOrResult === 'function' ? fnOrResult(props) : fnOrResult
    if (isMixin(result)) {
      buildDynamicStyles(props, result.styles, acc)
    } else {
      acc[key] = result
    }
  }
  return acc
}

interface AnyStyleProps {
  style: any
}

export function createStyled<Theme extends AnyTheme>() {
  const ThemeContext = React.createContext<Theme>({} as Theme)

  function styled<C extends AnyComponent>(Component: C): Styled<C, Theme> {
    const attrs: InnerAttrs[] = []
    const styledFn = (styles: StylePair[]) => {
      const { fixed, dynamic } = buildStyles(styles)
      const fixedStyle = StyleSheet.create({ fixed }).fixed
      const StyledComponent = React.forwardRef((props: UnknownProps & AnyStyleProps, ref) => {
        const theme = useContext(ThemeContext)
        const propsWithTheme = { ...props, theme }
        const propsFromAttrs = buildPropsFromAttrs(propsWithTheme, attrs)
        let style: StyleProp<UnknownProps> = fixedStyle
        if (dynamic.length > 0) {
          const dynamicStyle = buildDynamicStyles(propsWithTheme, dynamic)
          style = StyleSheet.compose(style, dynamicStyle)
        }
        style = StyleSheet.compose(style, props.style)
        const CastedComponent = Component as AnyComponent
        return <CastedComponent {...propsFromAttrs} {...props} style={style} ref={ref} />
      })
      StyledComponent.displayName = 'StyledComponent'

      return StyledComponent
    }
    styledFn.attrs = (attrsOrAttrsFn: InnerAttrs) => {
      attrs.push(attrsOrAttrsFn)
    }
    return styledFn as unknown as Styled<C, Theme>
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

  styled.wrapper = (fn: (...args: unknown[]) => UnknownProps, ...args: unknown[]): DynamicStyleFn | unknown => {
    const isDynamic = args.some((arg) => typeof arg === 'function')
    if (isDynamic) {
      return dynamic((props: UnknownProps): UnknownProps => {
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

  function css<Props extends object = BaseObject>(
    _styles: Styles<Themed<Props, Theme>>,
    ..._interpolations: Array<Interpolation<Themed<Props, Theme>>>
  ) {
    // eslint-disable-next-line prefer-rest-params
    return mixin(arguments[0]) as unknown as Array<Interpolation<Props>>
  }

  const ThemeProvider = ({ theme, children }: PropsWithChildren<{ theme: Theme }>) => (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  )

  return { styled, ThemeProvider, ThemeContext, css }
}
