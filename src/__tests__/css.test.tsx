import { createStyled } from '../styled'
import { buildDynamicStyles } from '../buildDynamicStyles'
import { UnknownProps } from '../types'

const props = { theme: {} }

describe('styled props', () => {
  test('Should parse all styled props', () => {
    const { css } = createStyled()
    const styles = css`
      //comment
      transform: rotate(${'android' === 'android' ? 180 : 0}deg) scale(${1});
      flex: ${2}; // iniline comment
      flex-direction: ${'1'};
      justify-content: ${'1'};
      align-items: ${'1'};
      align-self: ${'1'};
      align-content: ${'1'};
      width: ${1}px;
      height: ${1}px;
      margin-top: ${1}px;
      margin-bottom: ${1}px;
      margin-left: ${1}px;
      margin-right: ${1}px;
      padding-top: ${1}px;
      padding-bottom: ${1}px;
      padding-left: ${1}px;
      padding-right: ${1}px;
      padding-horizontal: ${1}px;
      padding-vertical: ${1}px;
      font-size: ${1}px;
      font-weight: ${'1'};
      font-style: ${'1'};
      font-family: ${'1'};
      line-height: ${1}px;
      text-align: ${'1'};
      color: ${'1'};
      background-color: ${'1'};
      border-color: ${'1'};
      border-width: ${1}px;
      border-radius: ${1}px;
      opacity: ${1};
      resize-mode: ${'1'};
      tint-color: ${'1'};
      shadow-color: ${'1'};
      shadow-offset: ${1}px;
      shadow-opacity: ${1};
      shadow-radius: ${1}px;
      elevation: ${1};
      overflow: ${'1'};
      gap: ${1}px;
      row-gap: ${1}px;
      column-gap: ${1}px;
      z-index: ${1};
      position: ${'1'};
      left: ${1}px;
      top: ${1}px;
      bottom: ${1}px;
      right: ${1}px;
      aspect-ratio: ${1};
      direction: ${'1'};
      display: ${'1'};
      start: ${1}px;
      end: ${1}px;
      fill: ${1}px;
    `

    expect(buildDynamicStyles(props, styles)).toStrictEqual({
      transform: [{ scale: 1 }, { rotate: '180deg' }],
      flex: 2,
      flexDirection: '1',
      justifyContent: '1',
      alignItems: '1',
      alignSelf: '1',
      alignContent: '1',
      width: 1,
      height: 1,
      marginTop: 1,
      marginBottom: 1,
      marginLeft: 1,
      marginRight: 1,
      paddingTop: 1,
      paddingBottom: 1,
      paddingLeft: 1,
      paddingRight: 1,
      paddingHorizontal: 1,
      paddingVertical: 1,
      fontSize: 1,
      fontWeight: '1',
      fontStyle: '1',
      fontFamily: '1',
      lineHeight: 1,
      textAlign: '1',
      color: '1',
      backgroundColor: '1',
      borderColor: '1',
      borderWidth: 1,
      borderRadius: 1,
      opacity: 1,
      resizeMode: '1',
      tintColor: '1',
      shadowColor: '1',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 1,
      elevation: 1,
      overflow: '1',
      gap: 1,
      rowGap: 1,
      columnGap: 1,
      zIndex: 1,
      position: '1',
      left: 1,
      top: 1,
      bottom: 1,
      right: 1,
      aspectRatio: 1,
      direction: '1',
      display: '1',
      start: 1,
      end: 1,
      fill: 1,
    })
  })

  test('Should handle camel case styles', () => {
    const { css } = createStyled()
    const styles = css`
      flexdirection: ${'1'};
      justifycontent: ${'1'};
      alignitems: ${'1'};
      alignself: ${'1'};
      aligncontent: ${'1'};
      width: ${1}px;
      height: ${1}px;
      margintop: ${1}px;
      marginbottom: ${1}px;
      marginleft: ${1}px;
      marginright: ${1}px;
      paddingtop: ${1}px;
      paddingbottom: ${1}px;
      paddingleft: ${1}px;
      paddingright: ${1}px;
      paddinghorizontal: ${1}px;
      paddingvertical: ${1}px;
      fontsize: ${1}px;
      fontweight: ${'1'};
      fontstyle: ${'1'};
      fontfamily: ${'1'};
      lineheight: ${1}px;
      textalign: ${'1'};
      color: ${'1'};
      backgroundcolor: ${'1'};
      bordercolor: ${'1'};
      borderwidth: ${1}px;
      borderradius: ${1}px;
      opacity: ${1};
      resizemode: ${'1'};
      tintcolor: ${'1'};
      shadowcolor: ${'1'};
      shadowoffset: ${1}px;
      shadowopacity: ${1};
      shadowradius: ${1}px;
      elevation: ${1};
      overflow: ${'1'};
      gap: ${1}px;
      rowgap: ${1}px;
      columngap: ${1}px;
      zindex: ${1};
      position: ${'1'};
      left: ${1}px;
      top: ${1}px;
      bottom: ${1}px;
      right: ${1}px;
      aspectratio: ${1};
      direction: ${'1'};
      display: ${'1'};
      start: ${1}px;
      end: ${1}px;
      fill: ${1}px;
    `

    expect(buildDynamicStyles(props, styles)).toStrictEqual({
      flexDirection: '1',
      justifyContent: '1',
      alignItems: '1',
      alignSelf: '1',
      alignContent: '1',
      width: 1,
      height: 1,
      marginTop: 1,
      marginBottom: 1,
      marginLeft: 1,
      marginRight: 1,
      paddingTop: 1,
      paddingBottom: 1,
      paddingLeft: 1,
      paddingRight: 1,
      paddingHorizontal: 1,
      paddingVertical: 1,
      fontSize: 1,
      fontWeight: '1',
      fontStyle: '1',
      fontFamily: '1',
      lineHeight: 1,
      textAlign: '1',
      color: '1',
      backgroundColor: '1',
      borderColor: '1',
      borderWidth: 1,
      borderRadius: 1,
      opacity: 1,
      resizeMode: '1',
      tintColor: '1',
      shadowColor: '1',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 1,
      elevation: 1,
      overflow: '1',
      gap: 1,
      rowGap: 1,
      columnGap: 1,
      zIndex: 1,
      position: '1',
      left: 1,
      top: 1,
      bottom: 1,
      right: 1,
      aspectRatio: 1,
      direction: '1',
      display: '1',
      start: 1,
      end: 1,
      fill: 1,
    })
  })

  test('Should handle shorten values', () => {
    const { css } = createStyled()
    let styles = css`
      padding: ${1}px;
      margin: ${1}px;
      background: white;
      flex: 1;
      border: 1px solid white;
    `

    expect(buildDynamicStyles(props, styles)).toStrictEqual({
      padding: 1,
      margin: 1,
      backgroundColor: 'white',
      flex: 1,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'white',
    })

    styles = css`
      flex: 1 0 auto;
      border: ${1}px solid ${'white'};
    `

    expect(buildDynamicStyles(props, styles)).toStrictEqual({
      flexGrow: 1,
      flexShrink: 0,
      flexBasis: 'auto',
      borderWidth: 1,
      borderColor: 'white',
      borderStyle: 'solid',
    })

    styles = css`
      padding: 1px 2px;
      margin: 1px 2px;
    `

    expect(buildDynamicStyles(props, styles)).toStrictEqual({
      marginHorizontal: 2,
      marginVertical: 1,
      paddingHorizontal: 2,
      paddingVertical: 1,
    })
  })

  test('Should handle negative values', () => {
    const { css } = createStyled()
    const styles = css`
      margin-top: -${1}px;
      transform: scaleX(${-1});
    `

    expect(buildDynamicStyles(props, styles)).toStrictEqual({
      marginTop: -1,
      transform: [{ scaleX: -1 }],
    })
  })

  test('Should parse styles properly', () => {
    const { css } = createStyled()
    const styles = css`
      border: ${1}px solid rgba(90, 234, 178, 0.6);
      transform: ${[{ translateY: 36 }]};
      transform: ${'rotate(180deg)'};
      font-family: ${'RobotoMono-Regular'};
      font-family: 'Inter-Bold';
      font-family: RobotoMono-Regular;
      font-family: 'RobotoMono-Regular';
      ${css`
        height: 1px;
      `};
      background: green;
      background: 'yellow';
    `

    expect(buildDynamicStyles(props, styles)).toStrictEqual({
      borderColor: 'rgba(90, 234, 178, 0.6)',
      borderStyle: 'solid',
      borderWidth: 1,
      transform: [{ rotate: '180deg' }],
      fontFamily: 'RobotoMono-Regular',
      height: 1,
      backgroundColor: 'yellow',
    })
  })

  test('Should handle nested functions', () => {
    const cfs = (value: number) => (_props: UnknownProps) => value
    const props = { scale: 2 }
    const { css } = createStyled()
    const styles = css<typeof props>`
      font-size: ${({ scale }) => cfs(2 * scale)}px;
    `

    expect(buildDynamicStyles(props, styles)).toStrictEqual({
      fontSize: 4,
    })
  })

  test('Should handle border-radius', () => {
    const { css } = createStyled()
    const styles = css`
      border-top-start-radius: ${16}px;
      border-top-end-radius: ${16}px;
    `

    expect(buildDynamicStyles(props, styles)).toStrictEqual({
      borderTopStartRadius: 16,
      borderTopEndRadius: 16,
    })
  })

  test('Should handle zero values', () => {
    const { css } = createStyled()
    let styles = css`
      padding: 0;
      width: 0;
      height: ${() => 0};
    `

    expect(buildDynamicStyles(props, styles)).toStrictEqual({
      padding: 0,
      width: 0,
      height: 0,
    })

    styles = css`
      padding: 0 ${22}px ${22}px;
    `

    expect(buildDynamicStyles(props, styles)).toStrictEqual({
      paddingBottom: 22,
      paddingHorizontal: 22,
      paddingTop: 0,
    })
  })

  test('Should handle dynamic values without postfix', () => {
    const { css } = createStyled()
    const styles = css`
      width: ${() => 100};
      height: 100;
      padding: ${() => '10px 10px 10px 10px'};
    `

    expect(buildDynamicStyles(props, styles)).toStrictEqual({
      width: 100,
      height: 100,
      paddingBottom: 10,
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 10,
    })
  })
})
