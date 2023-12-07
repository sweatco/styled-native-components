import { buildPropsFromAttrs} from '../styled'

describe('buildPropsFromAttrs', () => {
    test('Should combine passed props', () => {
        const outProps = {
            out: true,
            overriddenNumber: 0,
            theme: {},
        }
        const prop1 = {
            number: 1,
            props1: true,
            overriddenNumber: 1,
        }
        const props2 = (props) => ({
            number: props.number + 1,
            overriddenNumber: props.overriddenNumber + 1,
            props2: true,
        })
        const attrs = [prop1, props2]
        const props = buildPropsFromAttrs(outProps, attrs)

        expect(props).toStrictEqual({
            props1: true,
            props2: true,
            number: 2,
            out: true,
            overriddenNumber: 0,
            theme: {},
        })
    })

    test('Should not mutated passed props', () => {
        const excpectedProps = Object.freeze({
            number: 0,
            theme: {},
        })
        const outProps = excpectedProps
        const prop1 = {
            number: 1,
        }
        const props2 = () => ({
            number: 2,
        })
         buildPropsFromAttrs(outProps, [prop1, props2])

        expect(outProps).toStrictEqual(excpectedProps)
    })
})