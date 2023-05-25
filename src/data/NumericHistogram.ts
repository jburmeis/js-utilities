import Histogram, { HistogramBin, HistogramBinScaling } from './Histogram';
import { createArrayWithLength } from '../utils/ArrayUtils';
import { max } from './StatisticsUtils';
import { MinMaxPair } from '../structs/MinMaxPair';
import HistogramBinSizeStrategy from './binStrategies/HistogramBinSizeStrategy';
import NumericHistogramFromDataBuilder from './builders/NumericHistogramFromDataBuilder';
import NumericHistogramFromRangeBuilder from './builders/NumericHistogramFromRangeBuilder';

type InputValue = number | undefined | null;

export interface NumericHistogramBin extends HistogramBin {
    extent: MinMaxPair;
}

export type InitOptions = {
	acceptUndefined?: boolean;
}

const DefaultInitOptions = {
	acceptUndefined: true,
}

export default class NumericHistogram extends Histogram {
    // Fix configuration
    private readonly min: number;
    private readonly max: number;
    private readonly cutPoints: Array<number>;
    private readonly numBins: number;

    // Behavior flags
    private readonly acceptUndefined: boolean;

    // Data storage
    private numDataPoints: number;
    private numUndefined: number;
    private readonly bins: Array<number>;

    /********************************************************************************
     * 							Constructors
    /********************************************************************************/
    
    constructor(min: number, max: number, cutPoints: Array<number>, initOptions?: InitOptions) {
        const { acceptUndefined } = {...DefaultInitOptions, ...initOptions};

        super();

        // Validate arguments
        if (min > max) {
            throw new Error("Invalid configuration: max must be greater than min");
        }
        if(cutPoints.length > 0){
            if (cutPoints[0] <= min || cutPoints[0] >= max) {
                throw new Error("Invalid configuration: cutPoint out of range");
            }
            for (let i = 1; i < cutPoints.length; i++) {
                if (cutPoints[i] <= min || cutPoints[i] >= max) {
                    throw new Error("Invalid configuration: cutPoint out of range");
                }
                if (cutPoints[i] <= cutPoints[i - 1]) {
                    throw new Error("Invalid configuration: two cutPoints are equal or not sorted");
                }
            }
        }

        this.min = min;
        this.max = max;
        this.cutPoints = cutPoints;
        this.numBins = cutPoints.length + 1;
        this.acceptUndefined = acceptUndefined;

        this.numDataPoints = 0;
        this.numUndefined = 0;

        this.bins = createArrayWithLength(this.numBins, 0);
    }

    static createFromData(datapoints: Array<InputValue>): NumericHistogramFromDataBuilder {
        return new NumericHistogramFromDataBuilder(datapoints);
    }

    static createFromRange(min: number, max: number): NumericHistogramFromRangeBuilder {
        return new NumericHistogramFromRangeBuilder(min, max);
    }

    static createFromRangePair(minMaxPair: MinMaxPair): NumericHistogramFromRangeBuilder {
        return new NumericHistogramFromRangeBuilder(minMaxPair.min, minMaxPair.max);
    }

    static createFromPredefinedBins(min: number, max: number, cutPoints: Array<number>, options?: InitOptions): NumericHistogram {
        return new NumericHistogram(min, max, cutPoints, options);
    }

    static createFromBinSizeStrategy(binSizeStrategy: HistogramBinSizeStrategy, options?: InitOptions): NumericHistogram {
        return new NumericHistogram(
            binSizeStrategy.getMin(),
            binSizeStrategy.getMax(),
            binSizeStrategy.getCutPoints().slice(0),
            options);
    }

    /********************************************************************************
     * 							Data Insert
    /********************************************************************************/
    
    add(dataPoint: InputValue): NumericHistogram {
        if(dataPoint == null){
            this.increaseUndefined();
            return this;
        }
        if (dataPoint < this.min)
            throw new Error("Data point is below histogram minimum boundary");

        if (dataPoint > this.max)
            throw new Error("Data point is above histogram minimum boundary");

        // Find bin
        const binIndex = this.findBinIndex(dataPoint);

        // Insert point
        this.bins[binIndex]++;
        this.numDataPoints++;

        return this;
    }

    addAll(dataPoints: Array<InputValue>): NumericHistogram {
        for (const value of dataPoints) {
            this.add(value);
        }
        return this;
    }

    addFromObject(dataObject: Object, property: string): NumericHistogram {
        this.add((dataObject as any)[property]);
        return this;
    }

    addAllFromObjects(dataObjects: Array<Object>, property: string): NumericHistogram {
        for (const dataObject of dataObjects) {
            this.add((dataObject as any)[property]);
        }
        return this;
    }

    private increaseUndefined(){
		if(!this.acceptUndefined){
			throw new Error("Histogram is set not to accept undefined values");
		} else {
			this.numUndefined++;
		}
	}

    private findBinIndex(dataPoint: number): number {
        for (let i = 0; i < this.cutPoints.length; i++) {
            if (dataPoint < this.cutPoints[i]) {
                return i;
            }
        }
        return this.numBins - 1;
    }

    /********************************************************************************
     * 							Setup Descriptions
    /********************************************************************************/

    getMin(): number {
        return this.min;
    }

    getMax(): number {
        return this.max;
    }

    getNumBins(): number {
        return this.numBins;
    }

    getNumDataPoints(): number {
        return this.numDataPoints;
    }

    getNumUndefined(): number {
		return this.numUndefined;
	}

	getRatioUndefined(): number {
		return this.numUndefined / this.getNumDataPoints();
	}

    getBinName(bin: number): string {
        const binExtends = this.getBinExtents(bin);
        return `${binExtends.min} - ${binExtends.max}`;
    }

    getBinExtents(bin: number): { min: number, max: number } {
        if (bin > this.numBins - 1)
            throw new Error("Bin index out of range");

        if (bin === 0) {
            if (this.numBins === 1) {
                return { min: this.min, max: this.max };
            } else {
                return { min: this.min, max: this.cutPoints[0] };
            }
        }

        if (bin === this.numBins - 1) {
            return { min: this.cutPoints[this.cutPoints.length - 1], max: this.max };
        }

        return { min: this.cutPoints[bin - 1], max: this.cutPoints[bin] };
    }

    /********************************************************************************
     * 							Data Retrieve
    /********************************************************************************/

    getBinArray(): Array<number> {
        return this.bins;
    }

    getBinArrayScaled(scaling: HistogramBinScaling): Array<number> {
        const scaleFactor = this.getBinScaleFactor(scaling);

        const scaledBins = createArrayWithLength<number>(this.numBins);
        for (let i = 0; i < this.numBins; i++) {
            scaledBins[i] = scaleFactor * this.bins[i];
        }

        return scaledBins;
    }

    getBins(scaling: HistogramBinScaling = HistogramBinScaling.ByNumDatapoints): Array<NumericHistogramBin> {
        let scaledBins = this.getBinArrayScaled(scaling);
        return this.computeOutputBinFormatArray(scaledBins);
    }

    getBinsSortedByBinSize(sortDirection: "ascending" | "descending" = "descending", scaling?: HistogramBinScaling): Array<NumericHistogramBin> {
        return super.getBinsSortedByBinSize(sortDirection, scaling) as Array<NumericHistogramBin>;
    }

    getBinsSortedByKey(sortDirection: "ascending" | "descending" = "descending", scaling?: HistogramBinScaling): Array<NumericHistogramBin> {
        return super.getBinsSortedByKey(sortDirection, scaling) as Array<NumericHistogramBin>;
    }

    private getBinScaleFactor(scaling: HistogramBinScaling): number {
        switch (scaling) {
            case HistogramBinScaling.ByNumDatapoints:
                return (this.numDataPoints === 0) ? 0 : 1.0 / this.numDataPoints;
            case HistogramBinScaling.ByMaxBinSize:
                const maxValue = max(this.bins);
                return (maxValue === 0) ? 0 : 1.0 / maxValue;
        }
    }

    private computeOutputBinFormatArray(scaledBinArray: Array<number>): Array<NumericHistogramBin> {
        let resultList = new Array<NumericHistogramBin>();
        for (let i = 0; i < this.numBins; i++) {
            resultList.push({
                key: this.getBinName(i),
                size: this.bins[i],
                scaledSize: scaledBinArray[i],
                extent: this.getBinExtents(i),
            }
            );
        }

        return resultList;
    }

}