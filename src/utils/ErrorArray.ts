import mergeSort from "./MergeSort"

class ErrorArray<T> extends Array<T> {
    static from<T, U>(input: ArrayLike<T> | Iterable<T>, mapfn?: (v: T, k: number) => U, thisArg?: any): ErrorArray<T> {
        let parsedArray: T[] = []
        if(Array.isArray(input)) {
            parsedArray = input
        } else if(Symbol.iterator in input && (typeof input[Symbol.iterator] === "function")) {
            for( let value of input) {
                parsedArray.push(value)
            }
        } else {
            throw new Error("Argument for ErrorArray.from has to be iterable!")
        }
        return new ErrorArray(...parsedArray);
    }
    error?: string
    constructor(...items: T[]) {
        //console.log(items)
        if(items.length === 1) {
            super(items[0])
        } else if (items.length === 0) {
            super(0)
        } else {
            super(...items)
        }
        this.error = ""
    }
    private newErrorArray<T, >(array: T[]) {
        const newErrorArray = new ErrorArray(...array)
        newErrorArray.error = this.error
        return newErrorArray
    }
    toArray(): T[] {
        const test = new Array()
        return [...this];
    }
    setError(error: string): this {
        this.error = error
        return this
    }
    
    map<S>(callbackfn: (value: T, index: number, array: T[]) => S, thisArg?: any): ErrorArray<S> {
        return this.newErrorArray(super.map(callbackfn, thisArg))
    }

    filter<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): ErrorArray<S>
    filter(predicate: (value: T, index: number, array: T[]) => boolean, thisArg?: any): ErrorArray<T>
    filter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): ErrorArray<T> {
        return this.newErrorArray(super.filter(predicate, thisArg))
    }

    concat(...items: ConcatArray<T>[]): ErrorArray<T>
    concat(...items: (T | ConcatArray<T>)[]): ErrorArray<T>
    concat(...items: (T | ConcatArray<T>)[]): ErrorArray<T> {
        return this.newErrorArray(super.concat(...items))
    }

    toReversed(): ErrorArray<T> {
        return this.newErrorArray(super.reverse())
    }
    reverse(): this {
        super.reverse()
        return this
    }
    
    slice(start?: number, end?: number): ErrorArray<T> {
        return this.newErrorArray(super.slice(start, end))
    }

    toSorted(compareFn?: (a: T, b: T) => 0 | 1 | -1): ErrorArray<T> {
        const sorted = mergeSort([...this], compareFn)
        return this.newErrorArray(sorted)
    }
    sort(compareFn?: (a: T, b: T) => 0 | 1 | -1): this {
        super.sort(compareFn)
        return this
    }

    splice(start: number, deleteCount?: number): T[]
    splice(start: number, deleteCount: number, ...items: T[]): T[]
    splice(start: number, deleteCount: number, ...items: T[]): T[] {
        const returnVar = super.splice(start, deleteCount, ...items)
        return [...returnVar]
    }
    /*
    reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U
    reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T
    reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue?: T): T {
        return super.reduce(callbackfn, initialValue)
    }

    reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: ErrorArray<T>) => T): T
    reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: ErrorArray<T>) => T, initialValue: T): T
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: ErrorArray<T>) => U, initialValue: U): U
    */

}

export default ErrorArray