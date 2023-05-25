import EqualNiceWidthHistogramBinSizeStrategy from "../binStrategies/EqualNiceWidthHistogramBinSizeStrategy";
import EqualWidthHistogramBinSizeStrategy from "../binStrategies/EqualWidthHistogramBinSizeStrategy";
import NumericHistogram, { InitOptions } from "../NumericHistogram";

export default class NumericHistogramFromRangeBuilder {

    private readonly min: number;
    private readonly max: number;
    private niceRanges: boolean;
    private numBins: number;
    private acceptUndefined: boolean | undefined;

    constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
        this.niceRanges = false;
        this.numBins = 6;
        this.acceptUndefined = undefined;
    }

    public withNiceRanges(state: boolean = true): NumericHistogramFromRangeBuilder {
        this.niceRanges = state;
        return this;
    }

    public withNumBins(numBins: number): NumericHistogramFromRangeBuilder {
        if (numBins <= 0) {
            throw new Error("Number of bins must not be larger than 0");
        }
        this.numBins = numBins;
        return this;
    }

    public withAcceptUndefined(acceptUndefined: boolean): NumericHistogramFromRangeBuilder {
        this.acceptUndefined = acceptUndefined;
        return this;
    }

    public build(): NumericHistogram {
        const { min, max } = this;

        const strategy = (this.niceRanges) ? new EqualNiceWidthHistogramBinSizeStrategy(this.numBins, min, max)
            : new EqualWidthHistogramBinSizeStrategy(this.numBins, min, max);

        const options: InitOptions = { };
        if (this.acceptUndefined !== undefined) {
            options.acceptUndefined = this.acceptUndefined; 
        }

        const histogram = NumericHistogram.createFromBinSizeStrategy(strategy, options);
        return histogram;
    }
}