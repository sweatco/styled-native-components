import { maybeDynamic } from '../maybeDynamic'
import { splitStyles, createStyled } from '../styled'

type Props = any
type ResultWithFN = { fn: (props: Props) => unknown }

describe('splitStyles', () => {
    test('Should split passed styles', () => {
        const { css } = createStyled()
        const dynamicProp = maybeDynamic((arg) => arg, () => 0)
        const { fixed, dynamic } = splitStyles([
            ['number', 0],
            ['string', 'string'],
            ['boolean', true],
            ['array', [{ scale: 1 }]],
            ['object', { scale: 1 }],
            ['maybeDynamicNumber', maybeDynamic((arg) => arg, 0)],
            ['dynamic', dynamicProp],
            ['MIXIN_', css([
                ['mixin1number', 1],
                ['mixin1string', 'mixin1string'],
                // @ts-expect-error
                ['mixin1boolean', true],
                ['mixin1array', [{ scale: 2 }]],
                ['mixin1object', { scale: 2 }],
                // @ts-expect-error
                ['mixin1maybeDynamicNumber', maybeDynamic((arg) => arg, 1)],
                // @ts-expect-error
                ['mixin1dynamic', dynamicProp],
                ['MIXIN_', css([
                    ['mixin2number', 2],
                    ['mixin2string', 'mixin2string'],
                    // @ts-expect-error
                    ['mixin2boolean', true],
                    ['mixin2array', [{ scale: 3 }]],
                    ['mixin2object', { scale: 3 }],
                    // @ts-expect-error
                    ['mixin2maybeDynamicNumber', maybeDynamic((arg) => arg, 2)],
                    // @ts-expect-error
                    ['mixin2dynamic', dynamicProp],
                ])]
            ])]
        ])

        expect(fixed).toStrictEqual({
            number: 0,
            string: 'string',
            boolean: true,
            array: [{ scale: 1 }],
            object: { scale: 1 },
            maybeDynamicNumber: 0,
            mixin1number: 1,
            mixin1string: 'mixin1string',
            mixin1boolean: true,
            mixin1array: [{ scale: 2 }],
            mixin1object: { scale: 2 },
            mixin1maybeDynamicNumber: 1,
            mixin2number: 2,
            mixin2string: 'mixin2string',
            mixin2boolean: true,
            mixin2array: [{ scale: 3 }],
            mixin2object: { scale: 3 },
            mixin2maybeDynamicNumber: 2,
        })
        expect(dynamic).toStrictEqual([
            ['dynamic', (dynamicProp as ResultWithFN).fn],
            ['mixin1dynamic', (dynamicProp as ResultWithFN).fn],
            ['mixin2dynamic', (dynamicProp as ResultWithFN).fn]
        ])
    })
})