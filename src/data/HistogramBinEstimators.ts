import { report } from "./StatisticsReport";
import { range, stdDevSample } from "./StatisticsUtils";

export type HistogramBinEstimator = (datapoints: number[]) => number;

export enum HistogramBinEstimators {
    SquareRoot = "Square Root",
    Sturges = "Sturges",
    Scott = "Scott",
    FreedmanDiaconis = "Freedman Diaconis",
}

export function getHistogramBinEstimator(estimator: HistogramBinEstimators): HistogramBinEstimator {
    switch (estimator) {
        case HistogramBinEstimators.SquareRoot:
            return histogramBinEstimatorSquareRoot;
        case HistogramBinEstimators.Sturges:
            return histogramBinEstimatorSturges;
        case HistogramBinEstimators.Scott:
            return histogramBinEstimatorScott;
        case HistogramBinEstimators.FreedmanDiaconis:
            return histogramBinEstimatorFreedmanDiaconis;
    }
}

export function histogramBinEstimatorSquareRoot(datapoints: number[]): number {
    return Math.ceil(Math.sqrt(datapoints.length));
}

export function histogramBinEstimatorSturges(datapoints: number[]): number {
    return Math.ceil(Math.log2(datapoints.length)) + 1;
}

export function histogramBinEstimatorScott(datapoints: number[]): number {
    const valueRange = range(datapoints);
    const stdDev = stdDevSample(datapoints);
    const binWidth = (3.49 * stdDev) / Math.pow(datapoints.length, (1 / 3));
    return Math.max(1, Math.round(valueRange / binWidth));
}

export function histogramBinEstimatorFreedmanDiaconis(datapoints: number[]): number {
    const statistics = report(datapoints);
    const valueRange = statistics.max - statistics.min;
    const iqr = statistics.thirdQuartile - statistics.firstQuartile;
    const binWidth = 2 * (iqr / Math.pow(datapoints.length, (1 / 3)));
    return Math.max(1, Math.round(valueRange / binWidth));
}