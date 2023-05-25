/**
 * Provides functions to handle immutable arrays and objects.
 * To preserve immutability, every operation returns a new (shallow) copy of the original structure,
 * with the respective changes applied.
 */

    /**
     * Returns a shallow copy of the input array with a new element added at the end.
     */
    export function addElementToImmutableArray<T>(array: Array<T>, element: T): Array<T> {
        return [...array, element];
    }

    /**
     * Returns a shallow copy of the input array with the new elements added at the end.
     */
     export function addElementsToImmutableArray<T>(array: Array<T>, elements: Array<T>): Array<T> {
        return [...array, ...elements];
    }

    /**
     * Returns a shallow copy of the input array with a new element inserted at a specific position.
     */
     export function insertElementToImmutableArray<T>(array: Array<T>, index: number, element: T): Array<T> {
        return [
            ...array.slice(0, index),
            element,
            ...array.slice(index)
        ];
    }

    /**
     * Returns a shallow copy of the input array without the element at a specific index position.
     */
     export function removeIndexFromImmutableArray<T>(array: Array<T>, index: number): Array<T> {
        return [
            ...array.slice(0, index),
            ...array.slice(index + 1)
        ];
    }

    /**
     * Returns a shallow copy of the input array without the elements at the specific index positions.
     */
     export function removeIndicesFromImmutableArray<T>(array: Array<T>, indices: Array<number>): Array<T> {
        const resultArray = array.slice(0);
        const sortedIndices = indices.sort((a, b) => b - a);

        for (let i = 0; i < sortedIndices.length; i++) {
            resultArray.splice(sortedIndices[i], 1);
        }

        return resultArray;
    }

    /**
     * Returns a shallow copy of the input array without the first occurrence of a specific value.
     * If no matching value is found, the original array is returned.
     */
     export function removeValueFromImmutableArray<T>(array: Array<T>, value: T): Array<T> {
        const index = array.indexOf(value);
        if (index >= 0) {
            return removeIndexFromImmutableArray(array, index);
        }

        return array;
    }

    /**
     * Returns a shallow copy of the input array without the first occurrences of the specific values.
     * If no matching values are found, the original array is returned.
     */
     export function removeValuesFromImmutableArray<T>(array: Array<T>, values: Array<T>): Array<T> {
        const indices = [];
        for (const value of values) {
            const index = array.indexOf(value);
            if (index >= 0) {
                indices.push(index);
            }
        }

        if(indices.length > 0){
            return removeIndicesFromImmutableArray(array, indices);
        } {
            return array;
        }
    }

    /**
    * Returns a shallow copy of the input array without the values that match the input function.
    * If no matching values are found, the original array is returned.
    */
    export function removeAllMatchesFromImmutableArray<T>(array: Array<T>, matchFunction: (input: T) => boolean): Array<T> {
        const matchResults = array.map(matchFunction);
        if(matchResults.includes(true)) {
            return array.filter((_, idx) => !matchResults[idx]);
        } else {
            return array;
        }
    }    

    /**
     * Returns a shallow copy of the input array with an element replaced at a specific index position.
     */
     export function updateIndexFromImmutableArray<T>(array: Array<T>, index: number, element: T): Array<T> {
        return [
            ...array.slice(0, index),
            element,
            ...array.slice(index + 1)
        ];
    }

    /**
    * Returns a shallow copy of the input array with the first element replaced that matches the match function.
    * If no matching value is found, the original array is returned.
    */
     export function updateFirstMatchFromImmutableArray<T>(array: Array<T>, matchFunction: (input: T) => boolean, element: T): Array<T> {
        for (let i = 0; i < array.length; i++) {
            if (matchFunction(array[i])) {
                return updateIndexFromImmutableArray(array, i, element);
            }
        }
        return array;
    }

    /**
    * Returns a shallow copy of the input array with the first element replaced that matches the match function.
    * If no matching value is found, the new element is added to the array.
    */
    export function upsertFirstMatchFromImmutableArray<T>(array: Array<T>, matchFunction: (input: T) => boolean, element: T): Array<T> {
        for (let i = 0; i < array.length; i++) {
            if (matchFunction(array[i])) {
                return updateIndexFromImmutableArray(array, i, element);
            }
        }
        return [...array, element];
    }

    /**
     * Returns a shallow copy of the input array with two elements at specific index positions swapped.
     */
     export function swapIndicesFromImmutableArray<T>(array: Array<T>, index1: number, index2: number): Array<T> {
        let resultArray = array.slice(0);
        resultArray[index1] = array[index2];
        resultArray[index2] = array[index1];

        return resultArray;
    }

    /**
     * Returns a shallow copy of the input array. Adds the value to the array if it is not yet included,
     * or removes it if it is currently present.
     */
     export function toggleValueInclusionFromImmutableArray<T>(array: Array<T>, value: T): Array<T> {
        const index = array.indexOf(value);
        if (index >= 0) {
            return removeIndexFromImmutableArray(array, index);
        } else {
            return addElementToImmutableArray(array, value);
        }
    }

    /**
     * Returns a shallow copy of the input object, with a specific property updated.
     */
     export function updatePropertyFromImmutableObject(object: { [property: string]: any }, propertyIdentifier: string, value: any): { [property: string]: any } {
        return Object.assign({}, object, { [propertyIdentifier]: value });
    }

    /**
     * Returns a shallow copy of the input object, with a specific property removed.
     */
     export function deletePropertyFromImmutableObject(object: { [property: string]: any }, propertyIdentifier: string): { [property: string]: any } {
        let copy = Object.assign({}, object);
        delete copy[propertyIdentifier];
        return copy;
    }

    /**
     * Returns a shallow copy of the input set with a new value element.
     * If the element is already in the set, the original will be returned.
     */
    export function addElementToImmutableSet<T>(set: Set<T>, element: T): Set<T> {
        if (set.has(element)) {
            return set;
        } else {
            const newSet = new Set<T>(set);
            newSet.add(element);
            return newSet;
        }
    }

    /**
     * Returns a shallow copy of the input set with the new elements added.
     * If all elements are already in the set, the original will be returned.
     */
    export function addElementsToImmutableSet<T>(set: Set<T>, elements: Array<T>): Set<T> {
        if(elements.find(value => !set.has(value)) === undefined){
            return set;
        } else {
            const newSet = new Set<T>(set);
            elements.forEach(value => newSet.add(value))
            return newSet;
        }
    }

    /**
     * Returns a shallow copy of the input set without the specific element.
     * If the element is not in the set, the original set is returned.
     */
        export function removeElementFromImmutableSet<T>(set: Set<T>, element: T): Set<T> {
            if(!set.has(element)){
                return set;
            } else {
                const newSet = new Set<T>(set);
                newSet.delete(element);
                return newSet;
            }
        }

    /**
     * Returns a shallow copy of the input set without the specific elements.
    * If none of the elements is in the set, the original set is returned.
    */
    export function removeElementsFromImmutableSet<T>(set: Set<T>, elements: Array<T>): Set<T> {
        if (elements.find(element => set.has(element)) === undefined) {
            return set;
        } else {
            const newSet = new Set<T>(set);
            elements.forEach(value => newSet.delete(value))
            return newSet;
        }
    }

    /**
    * Returns a shallow copy of the input set. Adds the element to the set if it is not yet included,
    * or removes it if it is currently present.
    */
    export function toggleElementInclusionFromImmutableSet<T>(set: Set<T>, element: T): Set<T> {
        if (set.has(element)) {
            return removeElementFromImmutableSet(set, element);
        } else {
            return addElementToImmutableSet(set, element);
        }
    }
