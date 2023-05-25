/**
 * Returns an array of all elements of the input set
 */
export function createArrayFromSet<T>(set: Set<T>): Array<T> {
    return Array.from(set);
}

/**
 * Returns a set of all elements of the input array
 */
export function createSetFromArray<T>(array: Array<T>): Set<T> {
    const set = new Set<T>();
    for (const item of array) {
        set.add(item);
    }

    return set;
}

/**
 * Returns an array of all unique elements of the input array.
 * This function does not preserve the original order of the input array.
 */
export function createArrayOfUniques<T>(array: Array<T>): Array<T> {
    const setValues = createSetFromArray(array);
    return createArrayFromSet(setValues);
}

/**
 * Returns an array of all keys of the input map
 */
export function mapKeysAsArray<K, V>(map: Map<K, V>): Array<K> {
    return Array.from(map.keys());
}

/**
 * Returns an array of all values of the input map
 */
export function mapValuesAsArray<K, V>(map: Map<K, V>): Array<V> {
    return Array.from(map.values());
}

/**
 * Returns an array of objects {key: <key>, values: [<value>]}
 */
export function mapEntriesAsArray<K, V>(map: Map<K, V>): Array<{ key: K, value: V }> {
    let entriesArray = [];
    for (const [key, value] of map.entries()) {
        entriesArray.push({ key: key, value: value });
    }
    return entriesArray;
}

export function createInverseMap<K, V>(map: Map<K, V>): Map<V, K> {
    let inverseMap = new Map();
    for (const [key, value] of map.entries()) {
        inverseMap.set(value, key);
    }
    return inverseMap;
}
