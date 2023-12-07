import { buildDynamicStyles, maybeDynamic, mixin } from '../styled'


describe('buildDynamicStyles', () => {
    test('Should return primitives if no function is passed in the arguments', () => {
        const props = Object.freeze({
            isInitalProps: true,
            theme: {},
        })
        const mixin1 = mixin([
            ['mixin1number', 1],
            ['mixin1string', 'mixin1string'],
            ['mixin1boolean', true],
            ['mixin1array', [{ scale: 2 }]],
            ['mixin1object', { scale: 2 }],
            ['mixin1maybeDynamicNumber', maybeDynamic((arg) => arg, 1)],
            ['mixin1dynamic', maybeDynamic((arg) => arg, (props) => props)],
            ['mixin2', mixin([
                ['mixin2number', 2],
                ['mixin2string', 'mixin2string'],
                ['mixin2boolean', true],
                ['mixin2array', [{ scale: 3 }]],
                ['mixin2object', { scale: 3 }],
                ['mixin2maybeDynamicNumber', maybeDynamic((arg) => arg, 2)],
                ['mixin2dynamic', maybeDynamic((arg) => arg, (props) => props)],
            ])],
            ['mixin3', () => mixin([
                ['mixin3number', 3],
            ])]
        ])
        const styles = buildDynamicStyles(props, [
            ['number', () => 1],
            ['string', () => 'string'],
            ['fromProps', (props) => props],
            ['object', () => ({})],
            ['array', () => ([])],
            ['simpleObject', {}],
            ['simpleArray', []],
            ['mixin1', () => mixin1],
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
        })
    })
})