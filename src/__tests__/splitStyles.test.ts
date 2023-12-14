import { style, maybeDynamic, mixin } from '../parsers'
import { splitStyles, createStyled } from '../styled'

describe('splitStyles', () => {
    test('Should split passed styles', () => {
        const { css } = createStyled()

        const { styles, dynamic } = splitStyles([
            style('number', 0),
            style('string', 'string'),
            style('boolean', true),
            style('array', [{ scale: 1 }]),
            style('object', { scale: 1 }),
            style('maybeDynamicNumber', maybeDynamic(([arg]) => arg, [0])),
            style('dynamic', maybeDynamic(([arg]) => arg, [() => 0])), // dynamic
            mixin(css([
                style('mixin1number', 1),
                style('mixin1string', 'mixin1string'),
                style('mixin1boolean', true),
                style('mixin1array', [{ scale: 2 }]),
                style('mixin1object', { scale: 2 }),
                style('mixin1maybeDynamicNumber', maybeDynamic(([arg]) => arg, [1])),
                style('mixin1dynamic', maybeDynamic(([arg]) => arg, [() => 0])),  // dynamic
                mixin(css([
                    style('mixin2number', 2),
                    style('mixin2string', 'mixin2string'),
                    style('mixin2boolean', true),
                    style('mixin2array', [{ scale: 3 }]),
                    style('mixin2object', { scale: 3 }),
                    style('mixin2maybeDynamicNumber', maybeDynamic(([arg]) => arg, [2])),
                    style('mixin2dynamic', maybeDynamic(([arg]) => arg, [() => 0])),  // dynamic
                    mixin(null),
                ])),
            ])),
            mixin(null),
        ])

        expect(styles).toStrictEqual({
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



        expect(dynamic.length).toBe(3)
    })
})
