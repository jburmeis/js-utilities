export interface IdProvider<KeyType> {
    generateId(key: KeyType): string;
}

/**
 * Maintains a simple consecutive numeric counter for each key group, that is increased
 * with each request. Guarantees to always return a new unique ID.
 * This is explicitly not suitable for concurrent environments.
 * Example:
 *    provider.getNext("groupA") -> 0 
 *    provider.getNext("groupA") -> 1 
 *    provider.getNext("groupB") -> 0 
 */
export class SequenceIdProvider<KeyType> implements IdProvider<KeyType> {
    private nextIds = new Map<KeyType, number>();

    public generateId(key: KeyType): string {
        let currentId = this.nextIds.get(key);
        if (currentId === undefined) {
            currentId = 0;
        }
        this.nextIds.set(key, currentId + 1);

        return currentId.toString();
    }
}