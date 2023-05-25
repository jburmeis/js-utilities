export type KeyValuePair<T> = {
    key: T;
    value: number;
}

export function createKeyValuePair<T>(key: T, value: number) {
    return {
        key: key,
        value: value,
    }
}

export function sortKeyValuePairs<T>(keyValuePairs: Array<KeyValuePair<T>>, direction: "ascending" | "descending") {
    if (direction === "ascending") {
        keyValuePairs.sort((pair1, pair2) => (pair1.value - pair2.value));
    } else {
        keyValuePairs.sort((pair1, pair2) => (pair2.value - pair1.value));
    }
}

