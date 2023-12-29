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
})
