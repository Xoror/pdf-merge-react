import { describe, expect, test } from 'vitest'
import ErrorArray from './ErrorArray'

describe('ErrorArray', () => {

    test('initializing an ErrorArray', () => {
        const errorArray = new ErrorArray(1,2,3,4).setError("test error")
        const testArray = [1,2,3,4]
        expect(errorArray[1]).toBe(testArray[1])
        expect(Array.from(errorArray)).toEqual(testArray)
        expect(errorArray.error).toBe("test error")
    })

    test('does setting the error keep the reference', () => {
        const errorArray = new ErrorArray(1,2,3,4).setError("test error")
        const newArray = errorArray.setError("test error 2")
        expect(errorArray.error).toBe("test error 2")
        expect(errorArray).toBe(newArray)
    })

    test('does map work and create new array and keep error', () => {
        const errorArray = new ErrorArray(1,2,3,4).setError("test error")
        const newArray = errorArray.map(entry => entry*2)
        const expected = new ErrorArray(2,4,6,8).setError("test error")
        expect(newArray).toEqual(expected)
        expect(newArray).not.toBe(errorArray)
        expect(errorArray.error).toBe(newArray.error)
    })

    test('does filter work and create new array and keep error', () => {
        const errorArray = new ErrorArray(1,2,3,4).setError("test error")
        const newArray = errorArray.filter(entry => entry%2 === 0)
        const expected = new ErrorArray(2,4).setError("test error")
        expect(newArray).toEqual(expected)
        expect(newArray).not.toBe(errorArray)
        expect(errorArray.error).toBe(newArray.error)
    })

    test('does reverse reverse the array in place',() => {
        const errorArray = new ErrorArray(1,3,4,5).setError("test error")
        const test = errorArray.reverse()
        console.log(test)
        const expected = new ErrorArray(5,4,3,1).setError("test error")
        expect(errorArray).toEqual(expected)
        expect(errorArray).toBe(test)
        expect(errorArray.error).toBe(expected.error)
    })
    test('does toReversed work and create new array and keep error', () => {
        const errorArray = new ErrorArray(1,2,3,4).setError("test error")
        const newArray = errorArray.toReversed()
        const expected = new ErrorArray(4,3,2,1).setError("test error")
        expect(newArray).toEqual(expected)
        expect(newArray).not.toBe(errorArray)
        expect(errorArray.error).toBe(newArray.error)
    })

    test('does slice work and create new array and keep error', () => {
        const errorArray = new ErrorArray(1,2,3,4,5).setError("test error")
        const newArray = errorArray.slice(2)
        const newArray2 = errorArray.slice(1,3)
        const expected = new ErrorArray(3,4,5).setError("test error")
        const expected2 = new ErrorArray(2,3).setError("test error")
        expect(newArray).toEqual(expected)
        expect(newArray2).toEqual(expected2)
        expect(newArray).not.toBe(errorArray)
        expect(errorArray.error).toBe(newArray.error)
    })

    test('does sort work and sort in place', () => {
        const errorArray = new ErrorArray(2,1,5,1,4).setError("test error")
        const newArray = errorArray.sort()
        const expected = new ErrorArray(1,1,2,4,5).setError("test error")
        expect(errorArray).toEqual(expected)
        expect(newArray).toBe(errorArray)
        expect(errorArray.error).toBe(newArray.error)
    })
    test('does toSorted work and create new array and keep error', () => {
        const errorArray = new ErrorArray(2,1,5,1,4).setError("test error")
        const newArray = errorArray.toSorted()
        const expected = new ErrorArray(1,1,2,4,5).setError("test error")
        expect(newArray).toEqual(expected)
        expect(newArray).not.toBe(errorArray)
        expect(errorArray.error).toBe(newArray.error)
    })

    test('does splice work and create new array and keep error', () => {
        const errorArray = new ErrorArray(1,3,4,5).setError("test error")
        errorArray.splice(1,0,2)
        //const expected = new ErrorArray(1,2,3,4,5).setError("test error")

        const errorArray2 = new ErrorArray(1,6,3,4,5).setError("test error")
        const testReturn = errorArray2.splice(1,1,2)
        const expected2 = new ErrorArray(1,2,3,4,5).setError("test error")
        expect(errorArray2).toEqual(expected2)
        expect(testReturn).toEqual([6])
    })

    test('does concat work and create new array and keep error', () => {
        const errorArray = new ErrorArray(1,2).setError("test error")
        const errorArray2 = new ErrorArray(3,4).setError("test error")
        const newArray = errorArray.concat(errorArray2)
        const expected = new ErrorArray(1,2,3,4).setError("test error")
        expect(newArray).toEqual(expected)
        expect(errorArray).not.toBe(newArray)
        expect(newArray.error).toBe(expected.error)
    })
    
})
