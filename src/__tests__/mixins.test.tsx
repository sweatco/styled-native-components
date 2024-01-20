import { createStyled } from '../styled'
import { buildDynamicStyles } from '../buildDynamicStyles'

const { css } = createStyled()
const props = { theme: {} }

describe('mixins', () => {
    it('Should override styles', () => {
        let styles = css`
            flex: ${() => 1};
            flex: 2;
        `

        expect(buildDynamicStyles(props, styles)).toStrictEqual({
            flex: 2,
        })

        styles = css`
            flex: 3;
            flex: ${() => 4};
        `

        expect(buildDynamicStyles(props, styles)).toStrictEqual({
            flex: 4,
        })
    })

    it('Should override mixin', () => {
        let mixin = css`
            flex: 1;
        `
        let styles = css`
            ${mixin};
            ${css`
               color: red; 
            `};
            flex: 2;
        `

        expect(buildDynamicStyles(props, styles)).toStrictEqual({
            flex: 2,
            color: 'red',
        })

        styles = css`
            flex: ${() => 2};
            ${mixin};
        `

        expect(buildDynamicStyles(props, styles)).toStrictEqual({
            flex: 1,
        })
    })

    it('Should override depth mixins', () => {
        const mixin1 = css`
            flex: 3;
        `
        const mixin2 = css`
            flex: ${() => 1};
            ${mixin1}
        `
        const styles = css`
            flex: 2;
            ${mixin2};
        `

        expect(buildDynamicStyles(props, styles)).toStrictEqual({
            flex: 3,
        })
    })

    it('Should override dynamic mixins', () => {
        const mixin1 = css`
            flex: 3;
        `
        const styles = css`
            ${() => css`
                color: red;
                flex: 1;
            `};
            flex: 2;
            ${() => mixin1}
        `

        expect(buildDynamicStyles(props, styles)).toStrictEqual({
            color: 'red',
            flex: 3,
        })
    })

    it('Should override dynamic nested mixins', () => {
        const mixin1 = css`
            flex: ${() => 3};
        `
        const mixin2 = css`
            ${() => mixin1};
        `
        const styles = css`
            ${() => mixin2};
        `

        expect(buildDynamicStyles(props, styles)).toStrictEqual({
            flex: 3,
        })
    })
})
