import NumericSegmentHistogram, { InitOptions } from "../NumericSegmentHistogram";
import { SegmentBin } from "../NumericSegmentHistogram";

export default class NumericSegmentHistogramBuilder {

    private readonly bins: Array<SegmentBin>;
    private acceptUndefined: boolean | undefined;
    private acceptOutliers: boolean | undefined;

    constructor() {
        this.bins = [];
        this.acceptUndefined = undefined;
        this.acceptOutliers = undefined;
    }

    public withSegment(key: string, min: number | null, max: number | null): NumericSegmentHistogramBuilder {
        this.bins.push({ key: key, min: min, max: max });
        return this;
    }

    public withSegments(bins: Array<SegmentBin>): NumericSegmentHistogramBuilder {
        this.bins.push(...bins);
        return this;
    }

    public withAcceptUndefined(acceptUndefined: boolean): NumericSegmentHistogramBuilder {
        this.acceptUndefined = acceptUndefined;
        return this;
    }

    public withAcceptOutliers(acceptOutliers: boolean): NumericSegmentHistogramBuilder {
        this.acceptOutliers = acceptOutliers;
        return this;
    }

    public build(): NumericSegmentHistogram {
        const options: InitOptions = {};
        if (this.acceptUndefined !== undefined) {
            options.acceptUndefined = this.acceptUndefined;
        }
        if (this.acceptOutliers !== undefined) {
            options.acceptOutliers = this.acceptOutliers;
        }

        return new NumericSegmentHistogram(this.bins, options);
    }
}