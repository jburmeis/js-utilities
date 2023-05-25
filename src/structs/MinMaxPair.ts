export type MinMaxPair = {
    min: number;
    max: number;
}

export function createMinMaxPair(min: number, max: number) {
    if(min > max){
        throw new Error("max must be greater than min");
    }
    return {
        min: min,
        max: max,
    }
}

export function mergeMinMaxPairs(...minMaxPairs: MinMaxPair[]): MinMaxPair {
    // Handle special cases (empty or single-element array)
    if (minMaxPairs.length === 0) {
        throw new Error("MinMaxPair.merge: Empty argument list");
    }
    if (minMaxPairs.length === 1) {
        return minMaxPairs[0];
    }

    // Handle generic case (array with 2+ elements)
    let min = minMaxPairs[0].min;
    let max = minMaxPairs[0].max;
    for (let i = 1; i < minMaxPairs.length; i++) {
        if (minMaxPairs[i].min < min) {
            min = minMaxPairs[i].min;
        }
        if (minMaxPairs[i].max > max) {
            max = minMaxPairs[i].max;
        }
    }

    return createMinMaxPair(min, max);
}