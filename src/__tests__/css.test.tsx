import { createStyled } from '../styled'
import { Css } from '../types'

describe('styled props', () => {
    test('Should parse all styled props', () => {
        const { css } = createStyled()
        const styled = css`
            //comment
            transform: rotate(${'android' === 'android' ? 180 : 0}deg) scale(${1});
            flex: ${1}; // iniline comment
            flex-direction: ${'1'};
            flexDirection: ${'1'};
            justify-content: ${'1'};
            justifyContent: ${'1'};
            align-items: ${'1'};
            alignItems: ${'1'};
            align-self: ${'1'};
            alignSelf: ${'1'};
            align-content: ${'1'};
            alignContent: ${'1'};
            width: ${1}px;
            height: ${1}px;
            margin: ${1}px;
            margin-top: ${1}px;
            marginTop: ${1}px;
            margin-bottom: ${1}px;
            marginBottom: ${1}px;
            margin-left: ${1}px;
            marginLeft: ${1}px;
            margin-right: ${1}px;
            marginRight: ${1}px;
            padding: ${1}px;
            padding-top: ${1}px;
            paddingTop: ${1}px;
            padding-bottom: ${1}px;
            paddingBottom: ${1}px;
            padding-left: ${1}px;
            paddingLeft: ${1}px;
            padding-right: ${1}px;
            paddingRight: ${1}px;
            padding-horizontal: ${1}px;
            paddingHorizontal: ${1}px;
            padding-vertical: ${1}px;
            paddingVertical: ${1}px;
            font-size: ${1}px;
            fontSize: ${1}px;
            font-weight: ${'1'};
            fontWeight: ${'1'};
            font-style: ${'1'};
            fontStyle: ${'1'};
            font-family: ${'1'};
            fontFamily: ${'1'};
            line-height: ${1}px;
            lineHeight: ${1}px;
            text-align: ${'1'};
            textAlign: ${'1'};
            color: ${'1'};
            background: ${'1'};
            background-color: ${'1'};
            backgroundColor: ${'1'};
            border-color: ${'1'};
            borderColor: ${'1'};
            border-width: ${1}px;
            borderWidth: ${1}px;
            border-radius: ${1}px;
            borderRadius: ${1}px;
            opacity: ${1};
            resize-mode: ${'1'};
            resizeMode: ${'1'};
            tint-color: ${'1'};
            tintColor: ${'1'};
            shadow-color: ${'1'};
            shadowColor: ${'1'};
            shadow-offset: ${1}px;
            shadowOffset: ${1}px;
            shadow-opacity: ${1};
            shadowOpacity: ${1};
            shadow-radius: ${1}px;
            shadowRadius: ${1}px;
            elevation: ${1};
            overflow: ${'1'};
            gap: ${1}px;
            row-gap: ${1}px;
            rowGap: ${1}px;
            column-gap: ${1}px;
            columnGap: ${1}px;
            z-index: ${1};
            zIndex: ${1};
            position: ${'1'};
            left: ${1}px;
            top: ${1}px;
            bottom: ${1}px;
            right: ${1}px;
            aspect-ratio: ${1};
            aspectRatio: ${1};
            direction: ${'1'};
            display: ${'1'};
            start: ${1}px;
            end: ${1}px;
            fill: ${1}px;
            border: ${'dashed'} ${'white'} ${3}px;
        `

        expect(styled.styles).toStrictEqual([
            [ 'transform', [ { scale: 1 }, { rotate: '180deg' } ] ],
            [ 'flexGrow', 1 ],
            [ 'flexShrink', 1 ],
            [ 'flexBasis', 0 ],
            [ 'flexDirection', '1' ],
            [ 'flexDirection', '1' ],
            [ 'justifyContent', '1' ],
            [ 'justifyContent', '1' ],
            [ 'alignItems', '1' ],
            [ 'alignItems', '1' ],
            [ 'alignSelf', '1' ],
            [ 'alignSelf', '1' ],
            [ 'alignContent', '1' ],
            [ 'alignContent', '1' ],
            [ 'width', 1 ],
            [ 'height', 1 ],
            [ 'marginTop', 1 ],
            [ 'marginRight', 1 ],
            [ 'marginBottom', 1 ],
            [ 'marginLeft', 1 ],
            [ 'marginTop', 1 ],
            [ 'marginTop', 1 ],
            [ 'marginBottom', 1 ],
            [ 'marginBottom', 1 ],
            [ 'marginLeft', 1 ],
            [ 'marginLeft', 1 ],
            [ 'marginRight', 1 ],
            [ 'marginRight', 1 ],
            [ 'paddingTop', 1 ],
            [ 'paddingRight', 1 ],
            [ 'paddingBottom', 1 ],
            [ 'paddingLeft', 1 ],
            [ 'paddingTop', 1 ],
            [ 'paddingTop', 1 ],
            [ 'paddingBottom', 1 ],
            [ 'paddingBottom', 1 ],
            [ 'paddingLeft', 1 ],
            [ 'paddingLeft', 1 ],
            [ 'paddingRight', 1 ],
            [ 'paddingRight', 1 ],
            [ 'paddingHorizontal', 1 ],
            [ 'paddingHorizontal', 1 ],
            [ 'paddingVertical', 1 ],
            [ 'paddingVertical', 1 ],
            [ 'fontSize', 1 ],
            [ 'fontSize', 1 ],
            [ 'fontWeight', '1' ],
            [ 'fontWeight', '1' ],
            [ 'fontStyle', '1' ],
            [ 'fontStyle', '1' ],
            [ 'fontFamily', '1' ],
            [ 'fontFamily', '1' ],
            [ 'lineHeight', 1 ],
            [ 'lineHeight', 1 ],
            [ 'textAlign', '1' ],
            [ 'textAlign', '1' ],
            [ 'color', '1' ],
            [ 'background', '1' ],
            [ 'backgroundColor', '1' ],
            [ 'backgroundColor', '1' ],
            [ 'borderColor', '1' ],
            [ 'borderColor', '1' ],
            [ 'borderTopWidth', 1 ],
            [ 'borderRightWidth', 1 ],
            [ 'borderBottomWidth', 1 ],
            [ 'borderLeftWidth', 1 ],
            [ 'borderTopWidth', 1 ],
            [ 'borderRightWidth', 1 ],
            [ 'borderBottomWidth', 1 ],
            [ 'borderLeftWidth', 1 ],
            [ 'borderTopLeftRadius', 1 ],
            [ 'borderTopRightRadius', 1 ],
            [ 'borderBottomRightRadius', 1 ],
            [ 'borderBottomLeftRadius', 1 ],
            [ 'borderTopLeftRadius', 1 ],
            [ 'borderTopRightRadius', 1 ],
            [ 'borderBottomRightRadius', 1 ],
            [ 'borderBottomLeftRadius', 1 ],
            [ 'opacity', 1 ],
            [ 'resizeMode', '1' ],
            [ 'resizeMode', '1' ],
            [ 'tintColor', '1' ],
            [ 'tintColor', '1' ],
            [ 'shadowColor', '1' ],
            [ 'shadowColor', '1' ],
            [ 'shadowOffset', { width: 1, height: 1 } ],
            [ 'shadowOffset', { width: 1, height: 1 } ],
            [ 'shadowOpacity', 1 ],
            [ 'shadowOpacity', 1 ],
            [ 'shadowRadius', 1 ],
            [ 'shadowRadius', 1 ],
            [ 'elevation', 1 ],
            [ 'overflow', '1' ],
            [ 'gap', 1 ],
            [ 'rowGap', 1 ],
            [ 'rowGap', 1 ],
            [ 'columnGap', 1 ],
            [ 'columnGap', 1 ],
            [ 'zIndex', 1 ],
            [ 'zIndex', 1 ],
            [ 'position', '1' ],
            [ 'left', 1 ],
            [ 'top', 1 ],
            [ 'bottom', 1 ],
            [ 'right', 1 ],
            [ 'aspectRatio', 1 ],
            [ 'aspectRatio', 1 ],
            [ 'direction', '1' ],
            [ 'display', '1' ],
            [ 'start', 1 ],
            [ 'end', 1 ],
            [ 'fill', 1 ],
            [ 'RUNTIME_', ['border', 'dashed white 3px']],
        ])
    })

    test('Should handle negative values', () => {
        const { css } = createStyled()
        const styled = css`
            margin-top: -${1}px;
            transform: scaleX(${-1});
        `

        expect(styled.styles).toStrictEqual([
            [ 'marginTop', -1 ],
            [ 'transform', [{ scaleX: -1 }] ],
        ])
    })

    test('Should parse properly' , () => {
        const { css } = createStyled()
        const styled = css`
            border: ${1}px solid rgba(90, 234, 178, 0.6);
            transform: ${[{ translateY: 36 }]};
            transform: ${'rotate(180deg)'};
            font-family: ${'RobotoMono-Regular'};
            font-family: 'Inter-Bold';
            font-family: RobotoMono-Regular;
            font-family: 'RobotoMono-Regular';
            ${css`
                height: 1px;
            `}
        `

        expect(styled.styles).toStrictEqual([
            ['RUNTIME_',[ 'border', '1px solid rgba(90, 234, 178, 0.6)' ]],
            ['RUNTIME_', [ 'transform', [{ translateY: 36 }]] ],
            ['RUNTIME_', [ 'transform', 'rotate(180deg)' ]],
            ['fontFamily', 'RobotoMono-Regular'],
            ['fontFamily', 'Inter-Bold' ],
            ['fontFamily', 'RobotoMono-Regular'],
            ['fontFamily', 'RobotoMono-Regular'],
            ['MIXIN_', new Css([['height', 1]])]
        ])
    })
})