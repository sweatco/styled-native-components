import { createStyled } from '../styled'
import { buildDynamicStyles } from '../buildDynamicStyles'

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
            'transform': [ { scale: 1 }, { rotate: '180deg' } ],
            'flex': 2,
            'flexDirection': '1',
            'justifyContent': '1',
            'alignItems': '1',
            'alignSelf': '1',
            'alignContent': '1',
            'width':  1,
            'height':  1,
            'marginTop':  1,
            'marginBottom':  1,
            'marginLeft':  1,
            'marginRight':  1,
            'paddingTop':  1,
            'paddingBottom': 1,
            'paddingLeft': 1,
            'paddingRight': 1,
            'paddingHorizontal':1,
            'paddingVertical': 1,
            'fontSize': 1,
            'fontWeight': '1',
            'fontStyle': '1',
            'fontFamily': '1',
            'lineHeight': 1,
            'textAlign': '1',
            'color': '1',
            'backgroundColor': '1',
            'borderColor': '1',
            'borderWidth': 1,
            'borderRadius': 1,
            'opacity': 1,
            'resizeMode': '1',
            'tintColor': '1',
            'shadowColor':  '1',
            'shadowOffset':  { width: 1, height: 1 },
            'shadowOpacity':  1,
            'shadowRadius':  1,
            'elevation':  1,
            'overflow':  '1',
            'gap':  1,
            'rowGap':  1,
            'columnGap':  1,
            'zIndex':  1,
            'position':  '1',
            'left':  1,
            'top':  1,
            'bottom':  1,
            'right':  1,
            'aspectRatio':  1,
            'direction':  '1',
            'display':  '1',
            'start':  1,
            'end':  1,
            'fill':  1,
        })
    })

    test('Should handle camel case styles', () => {
        const { css } = createStyled()
        const styles = css`
            flexDirection: ${'1'};
            justifyContent: ${'1'};
            alignItems: ${'1'};
            alignSelf: ${'1'};
            alignContent: ${'1'};
            width: ${1}px;
            height: ${1}px;
            marginTop: ${1}px;
            marginBottom: ${1}px;
            marginLeft: ${1}px;
            marginRight: ${1}px;
            paddingTop: ${1}px;
            paddingBottom: ${1}px;
            paddingLeft: ${1}px;
            paddingRight: ${1}px;
            paddingHorizontal: ${1}px;
            paddingVertical: ${1}px;
            fontSize: ${1}px;
            fontWeight: ${'1'};
            fontStyle: ${'1'};
            fontFamily: ${'1'};
            lineHeight: ${1}px;
            textAlign: ${'1'};
            color: ${'1'};
            backgroundColor: ${'1'};
            borderColor: ${'1'};
            borderWidth: ${1}px;
            borderRadius: ${1}px;
            opacity: ${1};
            resizeMode: ${'1'};
            tintColor: ${'1'};
            shadowColor: ${'1'};
            shadowOffset: ${1}px;
            shadowOpacity: ${1};
            shadowRadius: ${1}px;
            elevation: ${1};
            overflow: ${'1'};
            gap: ${1}px;
            rowGap: ${1}px;
            columnGap: ${1}px;
            zIndex: ${1};
            position: ${'1'};
            left: ${1}px;
            top: ${1}px;
            bottom: ${1}px;
            right: ${1}px;
            aspectRatio: ${1};
            direction: ${'1'};
            display: ${'1'};
            start: ${1}px;
            end: ${1}px;
            fill: ${1}px;
        `

        expect(buildDynamicStyles(props, styles)).toStrictEqual({
            'flexDirection': '1',
            'justifyContent': '1',
            'alignItems': '1',
            'alignSelf': '1',
            'alignContent': '1',
            'width':  1,
            'height':  1,
            'marginTop':  1,
            'marginBottom':  1,
            'marginLeft':  1,
            'marginRight':  1,
            'paddingTop':  1,
            'paddingBottom': 1,
            'paddingLeft': 1,
            'paddingRight': 1,
            'paddingHorizontal': 1,
            'paddingVertical': 1,
            'fontSize': 1,
            'fontWeight': '1',
            'fontStyle': '1',
            'fontFamily': '1',
            'lineHeight': 1,
            'textAlign': '1',
            'color': '1',
            'backgroundColor': '1',
            'borderColor': '1',
            'borderWidth': 1,
            'borderRadius': 1,
            'opacity': 1,
            'resizeMode': '1',
            'tintColor': '1',
            'shadowColor':  '1',
            'shadowOffset':  { width: 1, height: 1 },
            'shadowOpacity':  1,
            'shadowRadius':  1,
            'elevation':  1,
            'overflow':  '1',
            'gap':  1,
            'rowGap':  1,
            'columnGap':  1,
            'zIndex':  1,
            'position':  '1',
            'left':  1,
            'top':  1,
            'bottom':  1,
            'right':  1,
            'aspectRatio':  1,
            'direction':  '1',
            'display':  '1',
            'start':  1,
            'end':  1,
            'fill':  1,
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
            borderStyle: 'solid'
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

    test('Should parse styles properly' , () => {
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
})