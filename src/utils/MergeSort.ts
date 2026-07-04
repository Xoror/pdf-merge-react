
const merge = <T,>(leftArray: T[], rightArray: T[], sortFn: (entryA: T, entryB: T) => -1 | 0 | 1): T[] => {
    const result = []
    let leftIndex = 0
    let rightIndex = 0
    
    if( [0,1].includes(sortFn(leftArray[leftArray.length - 1] , rightArray[0])) ) {
        return leftArray.concat(rightArray)
    } else if ( [0,1].includes(sortFn(rightArray[rightArray.length - 1], leftArray[0])) ) {
        return rightArray.concat(leftArray)
    }
    
    while(leftIndex < leftArray.length && rightIndex < rightArray.length) {
        const leftEntry = leftArray[leftIndex]
        const rightEntry = rightArray[rightIndex]
        if(sortFn(leftEntry, rightEntry) === 1) {
            result.push(leftEntry)
            leftIndex++
        } else if(sortFn(leftEntry, rightEntry) === -1) {
            result.push(rightEntry)
            rightIndex++
        } else if(sortFn(leftEntry, rightEntry) === 0) {
            result.push(rightEntry)
            result.push(leftEntry)
            leftIndex++
            rightIndex++
        }
    }
    return result.concat(leftArray.slice(leftIndex), rightArray.slice(rightIndex))
}

type SortFnType<T> = (entryA: T, entryB: T) => -1 | 0 | 1

const mergeSort = <T, >(array: Array<T>, sortFn?: SortFnType<T>): T[] => {
    const defaultSortFn = (a: T, b: T) => {
        if(a < b) return 1
        else if (b < a) return -1
        else return 0
    }
    const internalSortFn = sortFn ?? defaultSortFn
    if(array.length <= 1) return array

    const middleIndex = Math.floor(array.length/2)
    const leftArray = array.slice(0, middleIndex)
    const rightArray = array.slice(middleIndex)

    return merge(mergeSort(leftArray, sortFn), mergeSort(rightArray, sortFn), internalSortFn)
}
export default mergeSort
