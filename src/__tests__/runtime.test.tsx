import { buildDynamicStyles, createStyled } from '../styled'

const { css } = createStyled()
const props = { theme: {} }

describe('runtime parser', () => {
    test('Should parse the transform property', () => {
        const styles = css`
            transform: ${() => 'rotate(180deg)'};
        `

        expect(buildDynamicStyles(props, styles)).toStrictEqual({
            transform: [ { rotate: '180deg' } ],
        })
    })

    test('Should paese the border property', () => {
        let styles = css`
            border: ${'dashed'};
        `

        expect(buildDynamicStyles(props, styles)).toStrictEqual({
            borderColor: 'black',
            borderStyle: 'dashed',
            borderWidth: 1,
        })
        styles = css`
            border: ${10}px;
        `

        expect(buildDynamicStyles(props, styles)).toStrictEqual({
            borderColor: 'black',
            borderStyle: 'solid',
            borderWidth: 10,
        })
    })
})
