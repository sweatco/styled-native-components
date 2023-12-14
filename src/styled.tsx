import React, { PropsWithChildren, createElement, useContext } from 'react'
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
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  VirtualizedList,
} from 'react-native'
import {
  AnyComponent,
  AnyTheme,
  BaseObject,
  InnerAttrs,
  Interpolation,
  Styled,
  Styles,
  Themed,
  UnknownProps,
  AsComponentProps,
  Css,
  UnknownStyles,
} from './types'
import { buildPropsFromAttrs } from './buildPropsFromAttrs'
import { Parser, maybeDynamic, runtime, style, mixin, Queue } from './parsers'
import { createTheme } from './theme'

export function splitStyles(parsers: Parser[]) {
  const styles: UnknownStyles = {}
  const dynamic: Queue = []

  for (const parser of parsers) {
    parser(styles, dynamic, {})
  }

  return { styles, dynamic }
}

export function buildDynamicStyles(
  props: Themed<UnknownProps, AnyTheme>,
  queue: Queue,
  styles: UnknownStyles = {}
) {
  const initial: Queue = []
  queue = initial.concat(queue)
  for (const parser of queue) {
    parser(styles, queue, props)
  }
  return styles
}

interface AnyStyleProps {
  style?: UnknownStyles
}

const methods = {
  style,
  maybeDynamic,
  runtime,
  mixin,
}

export function createStyled<Theme extends AnyTheme>() {
  const { ThemeContext, ThemeProvider } = createTheme<Theme>()

  function styled<C extends AnyComponent>(Component: C): Styled<C, Theme> {
    function innerStyled(parsers: Parser[], attrs: InnerAttrs[] = []) {
      if (process.env.NODE_ENV !== 'production') {
        if (!Array.isArray(parsers)) {
          throw new Error('It seems you forgot to add babel plugin.')
        }
      }
      const { styles: fixedStyle, dynamic } = splitStyles(parsers)

      // Component
      const StyledComponent = React.forwardRef((props: PropsWithChildren<UnknownProps & AnyStyleProps & AsComponentProps>, ref) => {
        const theme = useContext(ThemeContext)
        let propsWithTheme: Themed<UnknownProps, Theme> = Object.assign({}, props, { theme })
        propsWithTheme = buildPropsFromAttrs(propsWithTheme, attrs)
        let style: StyleProp<UnknownStyles> = fixedStyle
        if (dynamic.length > 0) {
          style = Object.assign({}, style)
          style = buildDynamicStyles(propsWithTheme, dynamic, style)
        }
        if (props.style) {
          style = [style, props.style]
        }
        const parsedProps = Object.assign(propsWithTheme, { theme: props.theme, ref, style })
        const CastedComponent = (props.as ?? Component) as AnyComponent
        return createElement(CastedComponent, parsedProps)
      })

      StyledComponent.displayName = 'StyledComponent'

      return StyledComponent
    }
    const attrs = (styled: typeof innerStyled) => (attrsOrAttrsFn: UnknownProps | ((props: Themed<UnknownProps, AnyTheme>) => UnknownProps)) => {
      const attrsFn = typeof attrsOrAttrsFn !== 'function' ? () => attrsOrAttrsFn : attrsOrAttrsFn
      const styledWithAttrs = (styles: Parser[], attrs: InnerAttrs[] = []) => styled(styles, [attrsFn].concat(attrs))
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

  // It is expected that _styles and _interpolations are transformed to an Array<Array> type during Babel transpilation.
  function css<Props extends object = BaseObject>(
    _styles: Styles<Themed<Props, Theme>> | Parser[],
    ..._interpolations: Array<Interpolation<Themed<Props, Theme>>>
  ) {
    // eslint-disable-next-line prefer-rest-params
    return new Css(arguments[0])
  }

  for (const key of Object.keys(methods)) {
    styled[key] = methods[key]
    css[key] = methods[key]
  }

  return { styled, ThemeProvider, ThemeContext, css }
}
