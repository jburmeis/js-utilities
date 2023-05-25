/**
 * A map that stores a set of values for each key. 
 * The value sets for each key are duplicate-free but without any guaranteed order.
 */
export default class MultiSet<KeyType, ValueType> {
    private readonly map: Map<KeyType, Set<ValueType>> = new Map();

    /**
     * Add a value to the value set of the key
     */
    add(key: KeyType, value: ValueType): void {
        const valueMap = this.map.get(key);
        if (valueMap) {
            valueMap.add(value);
        } else {
            const newSet = new Set<ValueType>();
            newSet.add(value);
            this.map.set(key, newSet);
        }
    }

    /**
     * Add an array of values to the value set of the key
     */
    addAll(key: KeyType, values: Array<ValueType>): void {
        const valueMap = this.map.get(key);
        if (valueMap) {
            values.forEach(value => valueMap.add(value));
        } else {
            const newSet = new Set<ValueType>(values);
            this.map.set(key, newSet);
        }
    }

    /**
     * Gets the values for a key. Returns an empty array if the key does not exist.
     */
    get(key: KeyType): Array<ValueType> {
        const valueSet = this.map.get(key);
        return valueSet ? Array.from(valueSet) : [];
    }

    /**
     * The number of keys in this map
     */
    size(): number {
        return this.map.size;
    }

    /**
     * Returns an array of the keys in this map
     */
    keys(): Array<KeyType> {
        return Array.from(this.map.keys());
    }

    /**
     * Returns an array of objects {key: <key>, values: [<value>]}
     */
    entries(): Array<{ key: KeyType, values: Array<ValueType> }> {
        let entriesArray = [];
        for (const [key, values] of this.map.entries()) {
            entriesArray.push({ key: key, values: Array.from(values) });
        }
        return entriesArray;
    }

    /**
     * Returns an array of objects {key: <key>, values: [<value>]} for all keys that have at least a minimum
     * amount of associated values.
     */
    entriesWithMinNumberOfValues(minNumberOfValues: number): Array<{ key: KeyType, values: Array<ValueType> }> {
        let entriesArray = [];
        for (const [key, values] of this.map.entries()) {
            if (values.size >= minNumberOfValues) {
                entriesArray.push({ key: key, values: Array.from(values) });
            }
        }
        return entriesArray;
    }

    /**
     * Returns an array of objects {key: <key>, values: [<value>]} for all keys that have less than a maximum
     * amount of associated values.
     */
    entriesWithMaxNumberOfValues(maxNumberOfValues: number): Array<{ key: KeyType, values: Array<ValueType> }> {
        let entriesArray = [];
        for (const [key, values] of this.map.entries()) {
            if (values.size < maxNumberOfValues) {
                entriesArray.push({ key: key, values: Array.from(values) });
            }
        }
        return entriesArray;
    }

}