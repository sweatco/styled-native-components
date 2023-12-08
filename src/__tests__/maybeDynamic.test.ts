import { isDynamic, maybeDynamic } from '../maybeDynamic'

type Props = any
type ResultWithFN = { fn: (props: Props) => unknown }

describe('maybeDynamic', () => {
    test('Should return primitives if no function is passed in the arguments', () => {
        const object =  { method: jest.fn() }
        const array = [object, object]
        const args = [1, 'string', true, {}, object, array]
        const fn = jest.fn(((...props: Props) => props))
        const result = maybeDynamic(fn, ...args)
        
        expect(isDynamic(result)).toBe(false)
        expect(result).toStrictEqual(args)
    })

    test('Should return primitives if function is passed in the arguments', () => {
        const object =  { method: jest.fn() }
        const array = [object, object]
        const fnAsArgResult = 'fnAsArgResult'
        const props = { object }
        const fnAsArg = jest.fn(() => fnAsArgResult)
        const args = [1, 'string', true, {}, object, array, fnAsArg]
        const fn = jest.fn(((...props: Props) => props))
        const result = maybeDynamic(fn, ...args)
        
        expect(isDynamic(result)).toBe(true)
        const fnResult = (result as ResultWithFN).fn(props)
        expect(fnResult).toStrictEqual([1, 'string', true, {}, object, array, fnAsArgResult])
        expect(fnAsArg).toHaveBeenCalledWith(props)
    })
})