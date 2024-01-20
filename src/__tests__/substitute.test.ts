import { substitute } from '../parsers'

describe('substitute', () => {
    test('Should return primitives if no function is passed in the arguments', () => {
        const object =  { method: jest.fn() }
        const array = [object, object]
        const args = [1, 'string', true, {}, object, array]
        const fn = jest.fn(() => true)

        const result = substitute(fn, args)
        expect(fn).toHaveBeenCalledWith(args)
        expect(result).toBe(true)
    })

    test('Should return wrapper if function is passed in the arguments', () => {
        const object =  { method: jest.fn() }
        const array = [object, object]
        const fnAsArgResult = 'fnAsArgResult'
        const props = { object, theme: {} }
        const fnAsArg = jest.fn(() => fnAsArgResult)
        const args = [1, 'string', true, {}, object, array, fnAsArg]
        const fn = jest.fn(((props: unknown) => props))

        // @ts-expect-error
        const fnResult = substitute(fn, args)(props)

        expect(fnResult).toStrictEqual([1, 'string', true, {}, object, array, fnAsArgResult])
        expect(fnAsArg).toHaveBeenCalledWith(props)
    })
})