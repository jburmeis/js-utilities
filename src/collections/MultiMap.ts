import { addAll } from "../utils/ArrayUtils";

/**
 * A map that stores an array of values for each key. 
 * The value arrays are not duplicate-free, and preserve the order in which values have been added to the map.
 */
export default class MultiMap<KeyType, ValueType>{
    private readonly map: Map<KeyType, Array<ValueType>> = new Map();

    /**
     * Add a value to the value array of the key
     */
    add(key: KeyType, value: ValueType): void {
        const valueArray = this.map.get(key);
        if (valueArray) {
            valueArray.push(value);
        } else {
            this.map.set(key, [value]);
        }
    }

    /**
     * Add an array of values to the value array of the key
     */
    addAll(key: KeyType, values: Array<ValueType>): void {
        const valueArray = this.map.get(key);
        if (valueArray) {
            addAll(valueArray, values);
        } else {
            this.map.set(key, values.slice());
        }
    }

    /**
     * Gets the values for a key. Returns an empty array if the key does not exist.
     */
    get(key: KeyType): Array<ValueType> {
        return this.map.get(key) ?? [];
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
        const entriesArray = [];
        for (const [key, values] of this.map.entries()) {
            entriesArray.push({ key: key, values: values });
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
            if (values.length >= minNumberOfValues) {
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
            if (values.length < maxNumberOfValues) {
                entriesArray.push({ key: key, values: Array.from(values) });
            }
        }
        return entriesArray;
    }

    /**
     * Creates an inverse multimap, where each value from the value arrays becomes a key
     */
    createInverseMultiMap(): MultiMap<ValueType, KeyType> {
        const inverseMap = new MultiMap<ValueType, KeyType>();
        for (const [key, values] of this.map.entries()) {
            for (const value of values) {
                if (!inverseMap.get(value).includes(key)) {
                    inverseMap.add(value, key);
                }
            }
        }
        return inverseMap;
    }

    /**
     * Creates an inverse map, where each value from the value arrays becomes the key
     * 
     * Note: If a value is targeted from multiple keys, the inverse map cannot be created.
     * The function throws an error in such cases.
     */
    createInverseMap(): Map<ValueType, KeyType> {
        const inverseMap = new Map();
        for (const [key, values] of this.map.entries()) {
            for (const value of values) {
                if (!(inverseMap.has(value) && inverseMap.get(value) !== key)) {
                    inverseMap.set(value, key);
                } else {
                    throw new Error(`Multimap cannot be inversed. Value ${value} is referenced from multiple keys`);
                }
            }
        }
        return inverseMap;
    }

}