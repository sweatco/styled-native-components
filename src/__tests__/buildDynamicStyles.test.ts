import { style, maybeDynamic, mixin, runtime } from '../parsers'
import { buildDynamicStyles, createStyled } from '../styled'


describe('buildDynamicStyles', () => {
    test('Should return primitives if no function is passed in the arguments', () => {
        const { css } = createStyled()
        const props = Object.freeze({
            isInitalProps: true,
            theme: {},
        })
        const mixin1 = css([
            style('mixin1number', 1),
            style('mixin1string', 'mixin1string'),
            style('mixin1boolean', true),
            style('mixin1array', [{ scale: 2 }]),
            style('mixin1object', { scale: 2 }),
            style('mixin1maybeDynamicNumber', maybeDynamic(([arg]) => arg, [1])),
            style('mixin1dynamic', maybeDynamic(([arg]) => arg, [(props: unknown) => props])),
            mixin(
                css([
                    style('mixin2number', 2),
                    style('mixin2string', 'mixin2string'),
                    style('mixin2boolean', true),
                    style('mixin2array', [{ scale: 3 }]),
                    style('mixin2object', { scale: 3 }),
                    style('mixin2maybeDynamicNumber', maybeDynamic(([arg]) => arg, [2])),
                    style('mixin2dynamic', maybeDynamic(([arg]) => arg, [(props: unknown) => props])),
                ]),
            ),
            mixin(css([
                    style('mixin3number', 3),
                ])
            ),
            mixin(
                maybeDynamic(
                    ([arg]) => arg,
                    [css([
                        style('mixin4number', maybeDynamic(([arg]) => arg, [4])),
                    ])]
                )
            )
        ])
        const styles = {}
        buildDynamicStyles(props, [
                style('number', 1),
                style('string', 'string'),
                style('fromProps', maybeDynamic(([arg]) => arg, [(props: unknown) => props])),
                style('object', maybeDynamic(([arg]) => arg, [() => ({})])),
                style('array', maybeDynamic(([arg]) => arg, [() => ([])])),
                style('simpleObject', {}),
                style('simpleArray', []),
                mixin(maybeDynamic(([arg]) => arg, [() => mixin1])),
                mixin(maybeDynamic(([arg]) => arg, [() => null])),
                mixin(maybeDynamic(([arg]) => arg, [() => undefined])),
                mixin(maybeDynamic(([arg]) => arg, [() => false])),
            ],
        styles
        )

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
            mixin1dynamic: props,
            mixin2number: 2,
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
        const props = Object.freeze({
            isInitalProps: true,
            theme: {},
        })
        let styles = buildDynamicStyles(props, [
            runtime('border', '2px solid white'),
        ])

        expect(styles).toStrictEqual({
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: 'white',
        })

        styles = buildDynamicStyles(props, [
            runtime('border',
                maybeDynamic((args) => `${args[0]} ${args[1]} ${args[2]}`, ['3px', 'dashed', 'yellow'])
            ),
        ])

        expect(styles).toStrictEqual({
            borderWidth: 3,
            borderStyle: 'dashed',
            borderColor: 'yellow',
        })

        styles = buildDynamicStyles(props, [
            runtime(
                'border',
                maybeDynamic((args) => `${args[0]}`, [() => '4px']),
            ),
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
            style('height', 2),
        ])

        expect(styles).toStrictEqual({
            height: 2,
        })

        const css1 = css([
            style('height', 1),
        ])
        styles = buildDynamicStyles(props, [
            mixin(css1),
            style('height', 2),
        ])
        expect(styles).toStrictEqual({
            height: 2,
        })

        styles = buildDynamicStyles(props, [
            style('height', 2),
            mixin(css1),
        ])
        expect(styles).toStrictEqual({
            height: 1,
        })

        const css2 = css([
            style('height', 4),
            mixin(css1),
        ])

        styles = buildDynamicStyles(props, [
            style('height', 20),
            mixin(css2),
        ])
        expect(styles).toStrictEqual({
            height: 1,
        })
    })
})