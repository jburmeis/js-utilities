import { createMinMaxPair, MinMaxPair } from "../structs/MinMaxPair";

export function min(values: Array<number>): number {
    checkArrayArgument(values);

    let min = values[0];
    for (let i = 1; i < values.length; i++) {
        if (values[i] < min) {
            min = values[i];
        }
    }
    return min;
}

export function max(values: Array<number>): number {
    checkArrayArgument(values);

    let max = values[0];
    for (let i = 1; i < values.length; i++) {
        if (values[i] > max) {
            max = values[i];
        }
    }
    return max;
}

export function minMax(values: Array<number>): MinMaxPair {
    checkArrayArgument(values);

    let min = values[0];
    let max = values[0];
    for (let i = 1; i < values.length; i++) {
        if (values[i] < min) {
            min = values[i];
        }
        if (values[i] > max) {
            max = values[i];
        }
    }
    return createMinMaxPair(min, max);
}


export function range(values: Array<number>): number {
    const { min, max } = minMax(values);
    return max - min;
}

export function minSet(values: Set<number>): number {
    return minIterator(values.values());
}

export function maxSet(values: Set<number>): number {
    return maxIterator(values.values());
}

export function minIterator(iterator: IterableIterator<number>): number {
    let min: number = Number.NaN;
    for (const value of iterator) {
        if (Number.isNaN(min)) {
            min = value;
        }
        if (value < min) {
            min = value;
        }
    }

    if (Number.isNaN(min)) {
        throw new Error("Input iterator is empty");
    }
    return min;
}

export function maxIterator(iterator: IterableIterator<number>): number {
    let max: number = Number.NaN;
    for (const value of iterator) {
        if (Number.isNaN(max)) {
            max = value;
        }
        if (value > max) {
            max = value;
        }
    }

    if (Number.isNaN(max)) {
        throw new Error("Input iterator is empty");
    }
    return max;
}

export function minMaxIterator(iterator: IterableIterator<number>): MinMaxPair {
    let min: number = Number.NaN;
    let max: number = Number.NaN;
    for (const value of iterator) {
        if (Number.isNaN(min)) {
            min = value;
        }
        if (value < min) {
            min = value;
        }
        if (Number.isNaN(max)) {
            max = value;
        }
        if (value > max) {
            max = value;
        }
    }

    if (Number.isNaN(min) || Number.isNaN(max)) {
        throw new Error("Input iterator is empty");
    }
    return createMinMaxPair(min, max);
}


/**
 * Requires that the property exists and is numeric for all objects
 */
export function minObject<T extends Record<string, any>>(values: Array<T>, property: keyof T): number {
    return findMinObject(values, property)[property];
}

/**
 * Requires that the property exists and is numeric for all objects
 */
export function findMinObject<T extends Record<string, any>>(values: Array<T>, property: keyof T): T {
    checkArrayArgument(values);

    let min = (values[0])[property];
    let minObject = values[0];
    for (let i = 1; i < values.length; i++) {
        const value = values[i][property];
        if (value < min) {
            min = value;
            minObject = values[i];
        }
    }
    return minObject;
}

/**
 * Requires that the property exists and is numeric for all objects
 */
export function maxObject<T extends Record<string, any>>(values: Array<T>, property: keyof T): number {
    return findMaxObject(values, property)[property];
}

/**
 * Requires that the property exists and is numeric for all objects
 */
export function findMaxObject<T extends Record<string, any>>(values: Array<T>, property: keyof T): T {
    checkArrayArgument(values);

    let max = (values[0])[property];
    let maxObject = values[0];
    for (let i = 1; i < values.length; i++) {
        const value = values[i][property];
        if (value > max) {
            max = value;
            maxObject = values[i];
        }
    }
    return maxObject;
}

/**
 * Requires that the property exists and is numeric for all objects
 */
export function minMaxObject<T extends Record<string, any>>(values: Array<T>, property: keyof T): MinMaxPair {
    checkArrayArgument(values);

    let min = (values[0] as any)[property];
    let max = (values[0] as any)[property];
    for (let i = 1; i < values.length; i++) {
        const value = (values[i] as any)[property];
        if (value < min) {
            min = value;
        }
        if (value > max) {
            max = value;
        }
    }
    return createMinMaxPair(min, max);
}

function checkArrayArgument(values: Array<any>): void {
    if (values.length === 0) {
        throw new Error("Input array is empty");
    }
}

export function mean(dataPoints: Array<number>): number {
    const numValues = dataPoints.length;
    if (numValues === 0) {
        throw new Error(`Input list must contain at least 1 element: ${numValues}`)
    }

    let valueSum = 0;
    for (const value of dataPoints) {
        valueSum += value;
    }

    return (valueSum / numValues);
}

export function median(dataPoints: Array<number>): number {
    const numValues = dataPoints.length;
    if (numValues === 0) {
        throw new Error(`Input list must contain at least 1 element: ${numValues}`)
    }

    // Create a sorted copy of this array to preserve the input array
    const sortedDataPoints = dataPoints.slice().sort((v1, v2) => v1 - v2);
    return medianFromSortedList(sortedDataPoints);
}

export function medianFromSortedList(sortedDataPoints: Array<number>): number {
    const numValues = sortedDataPoints.length;
    if (numValues === 0) {
        throw new Error(`Input list must contain at least 1 element: ${numValues}`)
    }

    const idx = Math.floor(numValues / 2);
    if (numValues % 2 === 0) {
        return 0.5 * (sortedDataPoints[idx - 1] + sortedDataPoints[idx]);
    } else {
        return sortedDataPoints[idx];
    }
}

export function variancePopulation(dataPoints: Array<number>): number {
    return computeSquaredMeanDistance(dataPoints) / (dataPoints.length);
}

export function varianceSample(dataPoints: Array<number>): number {
    return computeSquaredMeanDistance(dataPoints) / (dataPoints.length - 1);
}

function computeSquaredMeanDistance(dataPoints: Array<number>): number {
    const numValues = dataPoints.length;
    if (numValues < 2) {
        throw new Error(`Input list must contain at least 2 elements: ${numValues}`)
    }

    // Compute mean
    const dataMean = mean(dataPoints);

    // Sum of squared distances from mean
    let squaredDeviationSum = 0;
    for (const value of dataPoints) {
        squaredDeviationSum += (value - dataMean) * (value - dataMean);
    }

    return squaredDeviationSum;
}

export function stdDevPopulation(dataPoints: Array<number>): number {
    return Math.sqrt(variancePopulation(dataPoints));
}

export function stdDevSample(dataPoints: Array<number>): number {
    return Math.sqrt(varianceSample(dataPoints));
}

export function covariance(dataPoints1: Array<number>, dataPoints2: Array<number>): number {
    // Check input lists
    checkListsForSameAndMinSize(dataPoints1, dataPoints2, 2);

    const numValues = dataPoints1.length;

    // Compute mean
    const mean1 = mean(dataPoints1);
    const mean2 = mean(dataPoints2);

    // Compute Covariance
    let covariance = 0;
    for (let i = 0; i < numValues; i++) {
        covariance += (dataPoints1[i] - mean1) * (dataPoints2[i] - mean2);
    }
    covariance /= (numValues - 1);

    return covariance;
}

/**
 * Pearson's correlation coefficient
 */
export function correlationCoefficient(dataPoints1: Array<number>, dataPoints2: Array<number>): number {
    // Check input lists
    checkListsForSameAndMinSize(dataPoints1, dataPoints2, 2);

    const numValues = dataPoints1.length;

    // Compute mean
    const mean1 = mean(dataPoints1);
    const mean2 = mean(dataPoints2);

    // Compute upper fraction
    let upperFraction = 0;
    for (let i = 0; i < numValues; i++) {
        upperFraction += (dataPoints1[i] - mean1) * (dataPoints2[i] - mean2);
    }

    // Sum of squared distances
    let squaredDeviationSum1 = 0;
    let squaredDeviationSum2 = 0;
    for (const value of dataPoints1) {
        squaredDeviationSum1 += (value - mean1) * (value - mean1);
    }
    for (const value of dataPoints2) {
        squaredDeviationSum2 += (value - mean2) * (value - mean2);
    }

    // Compute correlation
    return upperFraction / Math.sqrt(squaredDeviationSum1 * squaredDeviationSum2);
}

/**
 * Spearman's rank correlation coefficient
 */
export function rankCorrelationCoefficient(dataPoints1: Array<number>, dataPoints2: Array<number>): number {
    // Check input lists
    checkListsForSameAndMinSize(dataPoints1, dataPoints2, 2);

    const numValues = dataPoints1.length;

    // Assemble structures
    const valuePairs: { ranks: number[], data: number[] }[] = [];
    for (let i = 0; i < numValues; i++) {
        valuePairs.push({
            ranks: [0, 0],
            data: [dataPoints1[i], dataPoints2[i]],
        })
    }

    // Set rank information in both dimensions
    computeRanks(valuePairs, 0);
    computeRanks(valuePairs, 1);

    const values1 = valuePairs.map(entry => entry.ranks[0]);
    const values2 = valuePairs.map(entry => entry.ranks[1]);

    return correlationCoefficient(values1, values2);
}

function computeRanks(valuePairs: Array<{ ranks: number[], data: number[] }>, dimension: number) {
    // Sort, and set rank
    valuePairs.sort((v1, v2) => v1.data[dimension] - v2.data[dimension]).forEach((entry, idx) => entry.ranks[dimension] = idx + 1);

    // Fix ties (duplicate values) by setting them to to average rank
    let lastValue = valuePairs[0].data[dimension];
    let lastIndex = 0;
    const numValues = valuePairs.length;
    for (let i = 1; i < numValues; i++) {
        const value = valuePairs[i].data[dimension];
        if (value !== lastValue) {
            if (lastIndex < (i - 1)) {
                const avgRank = valuePairs[lastIndex].ranks[dimension] + (valuePairs[i - 1].ranks[dimension] - valuePairs[lastIndex].ranks[dimension]) / 2;
                for (let j = lastIndex; j < i; j++) {
                    valuePairs[j].ranks[dimension] = avgRank;
                }
            }
            lastValue = value;
            lastIndex = i;
        }
    }
    if (lastIndex < (numValues - 1)) {
        const avgRank = valuePairs[lastIndex].ranks[dimension] + (valuePairs[numValues - 1].ranks[dimension] - valuePairs[lastIndex].ranks[dimension]) / 2;
        for (let j = lastIndex; j < numValues; j++) {
            valuePairs[j].ranks[dimension] = avgRank;
        }
    }
}

/**
 * Checks if the two input arrays have a) the same size, and b) a given minimum size
 */
function checkListsForSameAndMinSize(dataPoints1: Array<number>, dataPoints2: Array<number>, minSize?: number) {
    const numValues1 = dataPoints1.length;
    const numValues2 = dataPoints2.length;

    if (numValues1 !== numValues2) {
        throw new Error(`Input lists must be of the same size: ${numValues1} vs ${numValues2}`)
    }
    if (minSize !== undefined) {
        if (numValues1 < minSize) {
            throw new Error(`Input list 1 must contain at least ${minSize} elements: ${numValues1}`)
        }
        if (numValues2 < minSize) {
            throw new Error(`Input list 2 must contain at least ${minSize} elements: ${numValues2}`)
        }
    }
}