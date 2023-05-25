/**
 * Provides functions to handle common operations with arrays.
 */

    /**
     * Adds all elements from the source array to the target array 
     */
    export function addAll<T>(target: Array<T>, source: Array<T>): void {
        target.push(...source);
    }

    /**
     * Remove the element at a specific index from the array
     */
    export function removeIndex<T>(array: Array<T>, index: number): void {
        array.splice(index, 1);
    }

    /**
     * Remove the first occurrence of a specific value from the array
     */
    export function removeValue<T>(array: Array<T>, value: T): boolean {
        const index = array.indexOf(value);
        if (index >= 0) {
            removeIndex(array, index);
            return true;
        }

        return false;
    }

    /**
     * Adds a specific value if it does not exist in the array (and return true),
     * or removes the value if it currently exists (and return false).
     */
    export function toggleValueInclusion<T>(array: Array<T>, value: T): boolean {
        const index = array.indexOf(value);
        if (index >= 0) {
            removeIndex(array, index);
            return false;
        } else {
            array.push(value);
            return true;
        }
    }

    /**
     * Swap the elements at two index positions within the array
     */
    export function swap<T>(array: Array<T>, index1: number, index2: number): void {
        if (index1 < 0 || index1 >= array.length || index2 < 0 || index2 >= array.length) {
            throw new Error("Array index out of bounds");
        }

        const value1 = array[index1];
        array[index1] = array[index2];
        array[index2] = value1;
    }

    /**
     * Create a shallow copy of the array
     */
    export function createShallowClone<T>(array: Array<T>): Array<T> {
        return array.slice(0);
    }

    /**
     * Returns if this array is empty
     */
    export function isEmpty(array: Array<any>): boolean {
        return (array.length === 0);
    }

    /**
     * Returns if this array has at least one element
     */
    export function isNotEmpty(array: Array<any>): boolean {
        return (array.length !== 0);
    }

    /**
     * Returns if this array has at least one element that matches the acceptFunction
     */
    export function includesByFunction<T>(array: Array<T>, acceptFunction: (element: T) => boolean): boolean {
        return (array.find(acceptFunction) !== undefined);
    }

    /**
     * Returns the first element of the array
     */
    export function getFirst<T>(array: Array<T>): T {
        if (array.length === 0) {
            throw new Error("Array is empty");
        }
        return array[0];
    }

    /**
     * Returns the last element of the array
     */
    export function getLast<T>(array: Array<T>): T {
        if (array.length === 0) {
            throw new Error("Array is empty");
        }
        return array[array.length - 1];
    }

    /**
     * Returns the first and last element of the array
     */
    export function getFirstAndLast<T>(array: Array<T>): { first: T, last: T } {
        if (array.length === 0) {
            throw new Error("Array is empty");
        }
        return {
            first: array[0],
            last: array[array.length - 1],
        }
    }

    /**
     * Creates a new array of a specific length, either filled with a 
     * defined value, or null
     */
    export function createArrayWithLength<T>(numElements: number, fillElement?: T): Array<T> {
        let array = new Array(numElements);
        array.fill((fillElement === undefined) ? null : fillElement);
        return array;
    }

    /**
     * Creates an array with the integers in a specified range. Examples:
     * (2,5) => [2,3,4,5]
     * (5,2) => [5,4,3,2]
     * (5,5) => [5]
     */
    export function createIntRange(startInclusive: number, endInclusive: number): Array<number> {
        if (startInclusive === endInclusive) {
            return [startInclusive];
        }
        if (startInclusive < endInclusive) {
            return Array(endInclusive - startInclusive + 1).fill(0).map((_: any, idx: number) => startInclusive + idx);
        } else {
            return Array(startInclusive + 1 - endInclusive).fill(0).map((_: any, idx: number) => startInclusive - idx);
        }
    }

    /**
     * Shuffles an array inplace. The return value is the original array (shuffled), not a copy.
     * Use {@link newShuffled} to get a new array with shuffled values.
     */
    export function shuffle<T>(array: Array<T>): Array<T> {
        const lastIdx = array.length - 1;
        if (lastIdx < 0) {
            return array;
        }

        for (let i = lastIdx; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    /**
     * Creates a new array with the shuffled elements of the input array.
     * Use {@link shuffle} to shuffle an array inplace.
     */
    export function newShuffled<T>(array: Array<T>): Array<T> {
        return shuffle(array.slice(0));
    }

    /**
     * Splits the elements of an array according to a condition function
     */
    export function split<T>(array: Array<T>, conditionFunc: (value: T) => boolean): { true: Array<T>, false: Array<T> } {
        const result = { true: [] as Array<T>, false: [] as Array<T> };

        for (const value of array) {
            if (conditionFunc(value)) {
                result.true.push(value);
            } else {
                result.false.push(value);
            }
        }

        return result;
    }
