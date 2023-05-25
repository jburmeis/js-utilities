import { MinMaxPair } from "../../structs/MinMaxPair";
import EqualNiceWidthHistogramBinSizeStrategy from "../binStrategies/EqualNiceWidthHistogramBinSizeStrategy";
import EqualWidthHistogramBinSizeStrategy from "../binStrategies/EqualWidthHistogramBinSizeStrategy";
import { getHistogramBinEstimator, HistogramBinEstimators } from "../HistogramBinEstimators";
import NumericHistogram, { InitOptions } from "../NumericHistogram";
import { minMax } from "../StatisticsUtils";

type InputValue = number | undefined | null;

export default class NumericHistogramFromDataBuilder {

    private readonly dataPoints: Array<InputValue>;
    private readonly dataPointsRange: MinMaxPair;
    private niceRanges: boolean;
    private numBins: number | null;
    private binEstimator: HistogramBinEstimators | null;
    private acceptUndefined: boolean | undefined;

    constructor(dataPoints: Array<InputValue>) {
        this.dataPoints = dataPoints;
        this.dataPointsRange = minMax(this.getDataPointsWithoutUndefined(dataPoints));
        this.niceRanges = false;
        this.numBins = null;
        this.binEstimator = HistogramBinEstimators.SquareRoot;
        this.acceptUndefined = undefined;
    }

    // Note: This adds computational overhead, but the convenience to support undefines in inputs weights out here.
    private getDataPointsWithoutUndefined(dataPoints: Array<InputValue>): number[] {
        return (dataPoints.includes(undefined) ? dataPoints.filter(point => point != null) : dataPoints) as number[];
    }

    public withNiceRanges(state: boolean = true): NumericHistogramFromDataBuilder {
        this.niceRanges = state;
        return this;
    }

    public withNumBins(numBins: number): NumericHistogramFromDataBuilder {
        if (numBins <= 0) {
            throw new Error("Number of bins must not be larger than 0");
        }
        this.numBins = numBins;
        this.binEstimator = null;
        return this;
    }

    public withBinEstimator(estimator: HistogramBinEstimators): NumericHistogramFromDataBuilder {
        this.numBins = null;
        this.binEstimator = estimator;
        return this;
    }

    public withAcceptUndefined(acceptUndefined: boolean): NumericHistogramFromDataBuilder {
        this.acceptUndefined = acceptUndefined;
        return this;
    }

    public build(): NumericHistogram {
        const { min, max } = this.dataPointsRange;

        const numBins = this.numBins ?? getHistogramBinEstimator(this.binEstimator!)(this.getDataPointsWithoutUndefined(this.dataPoints));

        const strategy = (this.niceRanges) ? new EqualNiceWidthHistogramBinSizeStrategy(numBins, min, max)
            : new EqualWidthHistogramBinSizeStrategy(numBins, min, max);

        const options: InitOptions = {};
        if (this.acceptUndefined !== undefined) {
            options.acceptUndefined = this.acceptUndefined;
        }
    
        const histogram = NumericHistogram.createFromBinSizeStrategy(strategy, options);
        histogram.addAll(this.dataPoints);
        return histogram;
    }
}