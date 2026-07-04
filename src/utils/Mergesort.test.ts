import { describe, expect, test } from 'vitest'
import mergeSort from './MergeSort'

describe('Merge sort', () => {
    test('basic sort', () => {
        const unsorted = [5,7,1,9,4,8,6,2]
        const expected = [1,2,4,5,6,7,8,9]
        expect(mergeSort(unsorted)).toEqual(expected)
    })
    test('sort where some entries are the same', () => {
        const unsorted = [5,7,1,9,4,5,8,6,2]
        const expected = [1,2,4,5,5,6,7,8,9]
        expect(mergeSort(unsorted)).toEqual(expected)
    })
    test('sort of empty array', () => {
        expect(mergeSort([])).toEqual([])
    })
    test('sort of array with one entry', () => {
        expect(mergeSort([1])).toEqual([1])
    })
    test('custom sorting function', () => {
        const unsorted = [{a: 3}, {a: 1}, {a: 2}, {a: 1}]
        const expected = [{a: 1}, {a: 1}, {a: 2}, {a: 3}]
        const sortingFunction = (a: any, b: any) => {
            if(a.a < b.a) return 1
            else if(a.a > b.a) return -1
            else return 0
        }
        expect(mergeSort(unsorted, sortingFunction)).toEqual(expected)
    })
})
