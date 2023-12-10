import React, { PropsWithChildren, createElement, useContext, useMemo } from 'react'
import {
  Button,
  Falsy,
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
import { getStylesForProperty } from 'css-to-react-native'
import {
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
  DynamicStyleFn,
  Css,
} from './types'
import { isDynamic, maybeDynamic } from './maybeDynamic'
import { getResult } from './getResult'
import { buildPropsFromAttrs } from './buildPropsFromAttrs'
import { MIXIN, RUNTIME } from '../constants'

function runtimeParse(acc: UnknownProps, style: unknown) {
  const [key, value] = style as [string, string]
  const styles = getStylesForProperty(key, value)
  const keys = Object.keys(styles)

  for (const key of keys) {
    acc[key] = styles[key]
  }
}

const isCss = (obj: any): obj is Css => obj instanceof Css
const isMixinKey = (key: string) => key === MIXIN
const isRuntimeKey = (key: string) => key === RUNTIME

interface SplitStylesResult {
  fixed: UnknownProps
  dynamic: Array<[string, DynamicStyleFn | StylePair]>
}

export function splitStyles(styles: StylePair[] | Css | Falsy | unknown, result: SplitStylesResult = { fixed: {}, dynamic: [] }) {
  const { fixed, dynamic } = result
  if (isCss(styles)) {
    return splitStyles(styles.styles, result)
  }
  if (!Array.isArray(styles)) {
    return result
  }
  for (const [key, style] of styles) {
    if (isDynamic(style)) {
      dynamic.push([key, style.fn])
    } else if (isMixinKey(key)) {
      splitStyles(style, result)
    } else if (isCss(style)) {
      splitStyles(style.styles, result)
    } else if (isRuntimeKey(key)) {
      runtimeParse(fixed, style)
    } else {
      fixed[key] = style
    }
  }

  return result
}

export function buildDynamicStyles(
  props: Themed<UnknownProps, AnyTheme>,
  dynamic: Array<[string, DynamicStyleFn | StylePair[]]> | Css | Falsy | StylePair[],
  acc: UnknownProps = {}
) {
  if (!dynamic) {
    return acc
  }
  if (isCss(dynamic)) {
    return buildDynamicStyles(props, dynamic.styles, acc)
  }
  for (const [key, fnOrResult] of dynamic) {
    let result = getResult(props, fnOrResult)
    if (isMixinKey(key)) {
      if (isCss(result)) {
        const mixinResult = result.styles
        mixinResult && buildDynamicStyles(props, mixinResult, acc)
      } else {
        buildDynamicStyles(props, result, acc)
      }
    } else {
      result = isDynamic(result) ? result.fn(props) : result
    
      if (isRuntimeKey(key)) {
        runtimeParse(acc, result)
      } else {
        acc[key] = result
      }
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
    function innerStyled(styles: StylePair[], attrs: InnerAttrs[] = []) {
      if (process.env.NODE_ENV !== 'production') {
        if (!Array.isArray(styles)) {
          throw new Error('It seems you forgot to add babel plugin.')
        }
        if (styles.length && !Array.isArray(styles[0])) {
          throw new Error('It seems you forgot to add babel plugin.')
        }
      }
      const { fixed: fixedStyle, dynamic } = splitStyles(styles)

      // Component
      const StyledComponent = React.forwardRef((props: PropsWithChildren<UnknownProps & AnyStyleProps & AsComponentProps>, ref) => {
        const theme = useContext(ThemeContext)
        let propsWithTheme: Themed<UnknownProps, Theme> = Object.assign({}, props, { theme })
        propsWithTheme = buildPropsFromAttrs(propsWithTheme, attrs)
        let style: StyleProp<UnknownProps> = fixedStyle
        if (dynamic.length > 0) {
          const dynamicStyle = buildDynamicStyles(propsWithTheme, dynamic)
          style = StyleSheet.compose(style, dynamicStyle)
        }
        style = StyleSheet.compose(style, props.style)
        const parsedProps = Object.assign(propsWithTheme, { theme: props.theme, ref, style })
        const CastedComponent = (props.as ?? Component) as AnyComponent
        return createElement(CastedComponent, parsedProps)
      })

      StyledComponent.displayName = 'StyledComponent'

      return StyledComponent
    }
    const attrs = (styled: typeof innerStyled) => (attrsOrAttrsFn: InnerAttrs) => {
      const styledWithAttrs = (styles: StylePair[], attrs: InnerAttrs[] = []) => styled(styles, [attrsOrAttrsFn].concat(attrs))
      styledWithAttrs.attrs = attrs(styledWithAttrs)

      return styledWithAttrs
    }
    innerStyled.attrs = attrs(innerStyled)
    // We use as unknown as Type constraction here becasue
    // it is expected that argument so the styled function is transformed to an Array<Array> type during Babel transpilation.
    return innerStyled as unknown as Styled<C, Theme>
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
    return new Css(arguments[0])
  }

  css.maybeDynamic = maybeDynamic

  const ThemeProvider = ({ theme, children }: PropsWithChildren<{ theme: Theme }>) => {
    const parentTheme = useContext(ThemeContext)
    const combinedTheme = useMemo(() => ({ ...parentTheme, ...theme }), [parentTheme, theme])
    return <ThemeContext.Provider value={combinedTheme}>{children}</ThemeContext.Provider>
  }

  return { styled, ThemeProvider, ThemeContext, css }
}
