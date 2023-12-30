import { mixin } from '../parsers'
import { buildDynamicStyles, createStyled } from '../styled'

const { css } = createStyled()

describe('runtime parser', () => {
    test('Should parse the transform property', () => {
        const styled = css`
            transform: ${() => 'rotate(180deg)'};
        `

        const styles = {}
        buildDynamicStyles({ theme: {} }, [mixin(styled)], styles)

        expect(styles).toStrictEqual({
            transform: [ { rotate: '180deg' } ],
        })
    })

    test('Should paese the border property', () => {
        let border: string | number = 'dashed'
        let styled = css`
            border: ${border};
        `

        let styles = {}
        buildDynamicStyles({ theme: {} }, [mixin(styled)], styles)

        expect(styles).toStrictEqual({
            borderColor: 'black',
            borderStyle: 'dashed',
            borderWidth: 1,
        })

        border = 10
        styled = css`
            border: ${border}px;
        `

        styles = {}
        buildDynamicStyles({ theme: {} }, [mixin(styled)], styles)

        expect(styles).toStrictEqual({
            borderColor: 'black',
            borderStyle: 'solid',
            borderWidth: 10,
        })
    })
})
