import { mapKeysAsArray } from '../utils/CollectionUtils'
import { maxIterator, minIterator } from '../data/StatisticsUtils';
import { createKeyValuePair, KeyValuePair, sortKeyValuePairs } from '../structs/KeyValuePair'

type CounterMapOptions<T> = {
    /**
     * Set if the map allows negative counts. If set to false, the value will be clamped to 0.
     * Default: true (negative values are allowed)
     */
    allowNegativeValues?: boolean;
    /**
     * Set if the map should automatically delete counts of 0 from the map (and not store the value 0 explicitly).
    * Default: false (values of 0 are kept)
    */
    deleteZeroValues?: boolean;
    /**
     * Set if the map should only support a limited set keys, and throw if another value is added.
     * Default: null (all keys are allowed)
     */
    restrictKeys?: Array<T>;
}

/**
 * A map to count the number of element occurrences. The occurrence value is increased via the 'increase' methods, and decreased via the 'decrease' methods.
 * All elements not in the map have an implicit occurrence value 0. Occurrence values can be set to arbitrary values, including zero and negative values.
 */
export default class CounterMap<T>{
    // Data storage
    private readonly map: Map<T, number>;

    // Behavior flags
    private readonly allowNegativeValues: boolean;
    private readonly deleteZeroValues: boolean;
    private readonly restrictKeys: Set<T> | null;

    constructor(keys?: Array<T>, options?: CounterMapOptions<T>) {
        this.map = new Map();
        this.allowNegativeValues = options?.allowNegativeValues ?? true;
        this.deleteZeroValues = options?.deleteZeroValues ?? false;
        this.restrictKeys = (options?.restrictKeys) ? new Set(options.restrictKeys) : null;

        if (keys) {
            this.increaseAll(keys);
        }
    }

    /**
     * Increase the count value of the input key by 1
     */
    increase(key: T): void {
        const currentValue = this.map.get(key) ?? 0;
        this.set(key, currentValue + 1);
    }

    /**
     * Increase the count value of the input key by an input value.
     */
    increaseBy(key: T, count: number): void {
        if (count < 0) {
            throw new Error("IncreaseBy count must not be negative");
        }
        const currentValue = this.map.get(key) ?? 0;
        this.set(key, currentValue + count);
    }

    /**
     * Increase the count value of all input keys by an input value.
     */
    increaseAll(keys: Array<T>): void {
        keys.forEach(key => this.increase(key));
    }

    /**
     * Decreases the count value of the input key by 1.
     * If allowNegativeValues is disabled (non-default), the value may be clamped at 0
     */
    decrease(key: T): void {
        const currentValue = this.map.get(key) ?? 0;
        this.set(key, currentValue - 1);
    }

    /**
     * Decrease the count value of the input key by an input value.
     * If allowNegativeValues is disabled (non-default), the value may be clamped at 0
     */
    decreaseBy(key: T, count: number): void {
        if (count < 0) {
            throw new Error("DecreaseBy count must not be negative");
        }
        const currentValue = this.map.get(key) ?? 0;
        this.set(key, currentValue - count);
    }

    /**
     * Increase the count value of all input keys by an input value.
     * If allowNegativeValues is disabled (non-default), the value may be clamped at 0
     */
    decreaseAll(keys: Array<T>): void {
        keys.forEach(key => this.decrease(key));
    }

    /**
     * Sets the count of the key to the specified value.
     * If allowNegativeValues is disabled (non-default), the value may be clamped at 0
     */
    set(key: T, counterValue: number): void {
        if(this.restrictKeys && !this.restrictKeys.has(key)){
            throw new Error(`CounterMap is configured with a restricted set of keys. Unknown input '${key}'`);
        }
        if (this.deleteZeroValues && counterValue === 0) {
            this.map.delete(key);
        }
        else if (!this.allowNegativeValues && counterValue < 0) {
            this.map.set(key, 0);
        }
        else {
            this.map.set(key, counterValue);
        }
    }

    /**
     * Sets the count of all keys to the specified value.
     * If allowNegativeValues is disabled (non-default), the value may be clamped at 0
     */
    setAll(keys: Array<T>, counterValue: number): void {
        for (const elem of keys) {
            this.set(elem, counterValue);
        }
    }

    /**
     * Sets the count of all keys in the map to the specified value. 
     * This can also be used to initialize a set of keys to 0.
     * If allowNegativeValues is disabled (non-default), the value may be clamped at 0
     */
    setAllCounters(counterValue: number): void {
        for (const key of this.map.keys()) {
            this.set(key, counterValue)
        }
    }

    /**
     * Sets the count of a key if the key does not exist with any value (including 0) in the map.
     * If allowNegativeValues is disabled (non-default), the value may be clamped at 0
     */
    setIfKeyIsUndefined(key: T, counterValue: number): void {
        if (!this.map.has(key)) {
            this.set(key, counterValue);
        }
    }

    /**
     * Sets the count of a key if the key is 0, or does not yet exist in the map.
     * If allowNegativeValues is disabled (non-default), the value may be clamped at 0
     */
    setIfCounterIsZero(key: T, counterValue: number): void {
        if (this.isCounterZero(key)) {
            this.set(key, counterValue);
        }
    }

    /**
     * Gets the count of the key. If the key is not in the map, it defaults to 0.
     */
    get(key: T): number {
        return this.map.get(key) ?? 0;
    }

    /**
     * Returns an array of all keys in the map
     */
    getKeys(): Array<T> {
        return mapKeysAsArray(this.map);
    }

    /**
     * Returns if the count of the key is zero (or does not exist in the map).
     * This is a convenience function, and equivalent to get(key) === 0
     * @param key 
     * @returns 
     */
    isCounterZero(key: T): boolean {
        return (this.get(key) === 0);
    }

    /**
     * Returns a KeyValuePair array {key, count} of all entries in this map
     */
    getEntries(sorted?: "ascending" | "descending"): Array<KeyValuePair<T>> {
        const valueList: Array<KeyValuePair<T>> = [];
        for (const [key, value] of this.map.entries()) {
            valueList.push(createKeyValuePair(key, value));
        }
        if(sorted){
            sortKeyValuePairs(valueList, sorted);
        }
        return valueList;
    }

    /**
     * Returns a KeyValuePair array {key, count} of all entries in this map
     * @param minCount inclusive threshold
     */
    getEntriesWithMinCount(minCount: number, sorted?: "ascending" | "descending"): Array<KeyValuePair<T>> {
        const valueList: Array<KeyValuePair<T>> = [];
        for (const [key, value] of this.map.entries()) {
            if (value >= minCount) {
                valueList.push(createKeyValuePair(key, value));
            }
        }
        if(sorted){
            sortKeyValuePairs(valueList, sorted);
        }
        return valueList;
    }

    /**
     * Returns a KeyValuePair array {key, count} of all entries in this map
     * @param maxCount exclusive threshold
     */
    getEntriesWithMaxCount(maxCount: number, sorted?: "ascending" | "descending"): Array<KeyValuePair<T>> {
        const valueList: Array<KeyValuePair<T>> = [];
        for (const [key, value] of this.map.entries()) {
            if (value < maxCount) {
                valueList.push(createKeyValuePair(key, value));
            }
        }
        if(sorted){
            sortKeyValuePairs(valueList, sorted);
        }
        return valueList;
    }

    /**
     * Returns a KeyValuePair array {key, count} of all entries in this map, 
     * sorted in ascending order (smallest count first).
     * This is a equivalent to getEntries("ascending")
     */
    getAscendingEntries(): Array<KeyValuePair<T>> {
        return this.getEntries("ascending");
    }

    /**
     * Returns a KeyValuePair array {key, count} of all entries in this map, 
     * sorted in descending order (largest count first)
     * This is a equivalent to getEntries("descending")
     */
    getDescendingEntries(): Array<KeyValuePair<T>> {
        return this.getEntries("descending");
    }

    /**
    * Given an input array of keys, returns the entries for all keys in the same order
    */
    getEntriesForKeys(keys: Array<T>): Array<KeyValuePair<T>> {
        const valueList: Array<KeyValuePair<T>> = [];
        for (const key of keys) {
            valueList.push(createKeyValuePair(key, this.get(key)));
        }
        return valueList;
    }

    /**
     * Returns a KeyValuePair array {key, count} of all entries in this map,
     * with values scaled into the range [0:1]
     */
    getEntriesScaledByMaxCounter(sorted?: "ascending" | "descending"): Array<KeyValuePair<T>> {
        const valueList = this.getEntries(sorted);
        const maxOccurrence = this.getMax();
        for (const entry of valueList) {
            entry.value /= maxOccurrence;
        }

        return valueList;
    }

    /**
     * Returns a KeyValuePair array {key, count} of all entries in this map,
     * with values scaled into the range [0:1]
     */
     getEntriesScaledByAllCounters(sorted?: "ascending" | "descending"): Array<KeyValuePair<T>> {
        const valueList = this.getEntries(sorted);
        const maxOccurrence = this.getSumOfAllPositiveCounters();
        for (const entry of valueList) {
            entry.value /= maxOccurrence;
        }

        return valueList;
    }

    /**
     * The sum of all counter values larger than zero
     */
    getSumOfAllPositiveCounters(): number {
        let sum = 0;
        for (const value of this.map.values()) {
            if (value > 0) {
                sum += value;
            }
        }
        return sum;
    }

    /**
     * The smallest count value in the map
     */
    getMin(): number {
        return minIterator(this.map.values());
    }

    /**
     * The largest count value in the map
     */
    getMax(): number {
        return maxIterator(this.map.values());
    }

    /**
     * Deletes a keys from the map
     */
    remove(key: T): void {
        this.map.delete(key);
    }

    /**
     * Deletes all input keys from the map
     */
    removeAll(keys: Array<T>): void {
        keys.forEach(key => this.remove(key));
    }

    /**
     * Deletes all keys from the map
     */
    clear(): void {
        this.map.clear();
    }

    /**
     * Returns if the key has a value in the map, i.e. if it has been set to any value at any time, including 0.
     * Elements that have been set to 0 will return true, elements that have have been removed or never set will return false.
     * Make sure you pick the right configuration with 'deleteZeroValues'.
     */
    has(key: T): boolean {
        return this.map.has(key);
    }

    /**
     * The number of keys in this map
     */
    size(): number {
        return this.map.size;
    }

    isEmpty(): boolean {
        return (this.map.size === 0);
    }

}