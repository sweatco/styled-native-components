import { MIXIN, RUNTIME } from '../../constants'
import { maybeDynamic } from '../maybeDynamic'
import { buildDynamicStyles, createStyled } from '../styled'


describe('buildDynamicStyles', () => {
    test('Should return primitives if no function is passed in the arguments', () => {
        const { css } = createStyled()
        const props = Object.freeze({
            isInitalProps: true,
            theme: {},
        })
        const mixin1 = css([
            ['mixin1number', 1],
            ['mixin1string', 'mixin1string'],
            // @ts-expect-error
            ['mixin1boolean', true],
            ['mixin1array', [{ scale: 2 }]],
            ['mixin1object', { scale: 2 }],
            // @ts-expect-error
            ['mixin1maybeDynamicNumber', maybeDynamic((arg) => arg, 1)],
            // @ts-expect-error
            ['mixin1dynamic', maybeDynamic((arg) => arg, (props) => props)],
            [MIXIN, css([
                ['mixin2number', 2],
                ['mixin2string', 'mixin2string'],
                // @ts-expect-error
                ['mixin2boolean', true],
                ['mixin2array', [{ scale: 3 }]],
                ['mixin2object', { scale: 3 }],
                // @ts-expect-error
                ['mixin2maybeDynamicNumber', maybeDynamic((arg) => arg, 2)],
                // @ts-expect-error
                ['mixin2dynamic', maybeDynamic((arg) => arg, (props) => props)],
            ])],
            [MIXIN, () => css([
                ['mixin3number', 3],
            ])],
            // @ts-expect-error
            [MIXIN, css.maybeDynamic(
                (arg) => arg,
                css([
                    // @ts-expect-error
                    ['mixin4number', maybeDynamic((arg) => arg, 4)],
                ])
            )]
        ])
        const styles = buildDynamicStyles(props, [
            ['number', () => 1],
            ['string', () => 'string'],
            ['fromProps', (props) => props],
            ['object', () => ({})],
            ['array', () => ([])],
            ['simpleObject', {}],
            ['simpleArray', []],
            [MIXIN, () => mixin1],
            [MIXIN, () => null],
            [MIXIN, () => undefined],
            [MIXIN, () => false],
        ])

        expect(styles).toStrictEqual({
            number: 1,
            string: 'string',
            fromProps: props,
            object: {},
            array: [],
            simpleObject: {},
            simpleArray: [],
            mixin1number: 1,
            mixin1string: 'mixin1string',
            mixin1boolean: true,
            mixin1array: [{ scale: 2 }],
            mixin1object: { scale: 2 },
            mixin1maybeDynamicNumber: 1,
            mixin2number: 2,
            mixin1dynamic: props,
            mixin2string: 'mixin2string',
            mixin2boolean: true,
            mixin2array: [{ scale: 3 }],
            mixin2object: { scale: 3 },
            mixin2maybeDynamicNumber: 2,
            mixin2dynamic: props,
            mixin3number: 3,
            mixin4number: 4,
        })
    })

    test('Should parse runtime styles', () => {
        const { css } = createStyled()
        const props = Object.freeze({
            isInitalProps: true,
            theme: {},
        })
        let styles = buildDynamicStyles(props, [
            [RUNTIME, ['border', '2px solid white']],
        ])

        expect(styles).toStrictEqual({
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: 'white',
        })

        styles = buildDynamicStyles(props, [
            [RUNTIME, maybeDynamic((...args) => ['border', `${args[0]} ${args[1]} ${args[2]}`], '3px', 'dashed', 'yellow')],
        ])

        expect(styles).toStrictEqual({
            borderWidth: 3,
            borderStyle: 'dashed',
            borderColor: 'yellow',
        })

        styles = buildDynamicStyles(props, [
            [RUNTIME, maybeDynamic((...args) => ['border', `${args[0]}`], () => '4px')],
        ])

        expect(styles).toStrictEqual({
            borderWidth: 4,
            borderStyle: 'solid',
            borderColor: 'black',
        })
    })

    test('Should override styles', () => {
        const { css } = createStyled()
        const props = {
            theme: {},
        }
        let styles = buildDynamicStyles(props, [
            ['height', 2],
        ])

        expect(styles).toStrictEqual({
            height: 2,
        })

        const css1 = css([
            ['height', 1],
        ])
        styles = buildDynamicStyles(props, [
            [MIXIN, css1],
            ['height', 2],
        ])
        expect(styles).toStrictEqual({
            height: 2,
        })

        styles = buildDynamicStyles(props, [
            ['height', 2],
            [MIXIN, css1],
        ])
        expect(styles).toStrictEqual({
            height: 1,
        })

        const css2 = css([
            ['height', 4],
            [MIXIN, css1],
        ])

        styles = buildDynamicStyles(props, [
            ['height', 20],
            [MIXIN, css2],
        ])
        expect(styles).toStrictEqual({
            height: 1,
        })
    })
})