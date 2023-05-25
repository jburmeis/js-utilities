import { medianFromSortedList } from "./StatisticsUtils";

export type StatisticsReport = {
    min: number;
    max: number;
    mean: number;
    median: number;
    firstQuartile: number;
    thirdQuartile: number;
    stdDevSample: number;
    stdDevPopulation: number;
    size: number;
};

export type Quartiles = {
    min: number;
    max: number;
    mean: number;
    median: number;
    firstQuartile: number;
    thirdQuartile: number;
};

/**
 * Computes a set of common descriptive statistics. 
 * This is more efficient than calling all the individual functions on their own.
 */
export function report(dataPoints: Array<number>): StatisticsReport {
    const numValues = dataPoints.length;
    if (numValues < 2) {
        throw new Error(`Input list must contain at least 2 elements: ${numValues}`)
    }

    // Quartiles
    const quartilesStatistics = quartiles(dataPoints);
    const mean = quartilesStatistics.mean;

    // Variance
    let sumOfSquaredMeanDistances = 0;
    for (const value of dataPoints) {
        sumOfSquaredMeanDistances += (value - mean) * (value - mean);
    }
    const variancePopulation = sumOfSquaredMeanDistances / numValues;
    const varianceSample = sumOfSquaredMeanDistances / (numValues - 1);

    // StdDev
    let stdDevPopulation = Math.sqrt(variancePopulation);
    let stdDevSample = Math.sqrt(varianceSample);

    return {
        ...quartilesStatistics,
        stdDevPopulation: stdDevPopulation,
        stdDevSample: stdDevSample,
        size: numValues,
    }
}

/**
 * Computes the quartiles statistics. 
 */
export function quartiles(dataPoints: Array<number>): Quartiles {
    const numValues = dataPoints.length;
    if (numValues < 2) {
        throw new Error(`Input list must contain at least 2 elements: ${numValues}`)
    }

    // Create sorted array for median computation
    const sortedDataPoints = dataPoints.slice().sort((v1, v2) => v1 - v2);

    // Min, max
    const min = sortedDataPoints[0];
    const max = sortedDataPoints[numValues - 1];

    // Median
    const median = medianFromSortedList(sortedDataPoints);

    // Mean
    let mean = 0;
    for (const value of dataPoints) {
        mean += value;
    }
    mean /= numValues;

    // Quartiles
    let firstQuartile = 0;
    let thirdQuartile = 0;
    if (numValues % 2 === 0) {
        // If the number of data points is even, the median is the mean of the two middle elements
        const idxMedian = Math.floor(numValues / 2);

        // The median cuts the list in two equal sized halves.
        // The quartiles are the medians of the lower and upper half
        // 1 2 3 4 5 6 ==> (1 2 3)   (4 5 6)
        firstQuartile = medianFromSortedList(sortedDataPoints.slice(0, idxMedian));
        thirdQuartile = medianFromSortedList(sortedDataPoints.slice(idxMedian, numValues));
    } else {
        // If the number of data points is odd, the median is the middle element
        const idxMedian = Math.floor(numValues / 2);

        // The median cuts the list in two equal sized halves - ignore the median itself.
        // The quartiles are the medians of the lower and upper half.
        // 1 2 3 4 5 ==> (1 2)  (4 5)
        firstQuartile = medianFromSortedList(sortedDataPoints.slice(0, idxMedian));
        thirdQuartile = medianFromSortedList(sortedDataPoints.slice(idxMedian + 1, numValues));
    }

    return {
        min: min,
        max: max,
        mean: mean,
        median: median,
        firstQuartile: firstQuartile,
        thirdQuartile: thirdQuartile,
    }
}