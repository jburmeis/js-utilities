import Histogram, { HistogramBin, HistogramBinScaling } from './Histogram';
import { createArrayWithLength } from '../utils/ArrayUtils';
import { max } from './StatisticsUtils';
import NumericSegmentHistogramBuilder from './builders/NumericSegmentHistogramBuilder';

type InputValue = number | undefined | null;

export interface NumericSegmentHistogramBin extends HistogramBin {
    extent: { min: number | null; max: number | null };
}

export type SegmentBin = {
    key: string;
    /** Inclusive lower bound */
    min: number | null;
    /** Exclusive upper bound */
    max: number | null;
}

export type InitOptions = {
	acceptUndefined?: boolean;
    acceptOutliers?: boolean;
}

const DefaultInitOptions = {
	acceptUndefined: true,
    acceptOutliers: true,
}

export default class NumericSegmentHistogram extends Histogram {
    // Fix configuration
    private readonly bins: Array<SegmentBin>;
    private readonly numBins: number;

    // Behavior flags
    private readonly acceptUndefined: boolean;
    private readonly acceptOutliers: boolean;

    // Data storage
    private numDataPoints: number;
    private numUndefined: number;
    private numOutliers: number;
    private readonly binCounters: Array<number>;

    /********************************************************************************
     * 							Constructors
    /********************************************************************************/
    
    constructor(bins: Array<SegmentBin>, initOptions?: InitOptions) {
        const { acceptUndefined, acceptOutliers } = {...DefaultInitOptions, ...initOptions};

        super();

        // Validate arguments
        for(const bin of bins){
            const { min, max } = bin;
            if(min !== null && max !== null && min > max) {
                throw new Error("Invalid configuration: max must be greater than min");
            }
        }

        this.bins = bins;
        this.numBins = bins.length;
        this.acceptUndefined = acceptUndefined;
        this.acceptOutliers = acceptOutliers;

        this.numDataPoints = 0;
        this.numUndefined = 0;
        this.numOutliers = 0;
        this.binCounters = createArrayWithLength(this.numBins, 0);
    }

    static createWithBuilder(): NumericSegmentHistogramBuilder {
        return new NumericSegmentHistogramBuilder();
    }

    static createFromSegments(bins: Array<SegmentBin>, initOptions?: InitOptions): NumericSegmentHistogram {
        return new NumericSegmentHistogram(bins, initOptions);
    }


    /********************************************************************************
     * 							Data Insert
    /********************************************************************************/
    
    add(dataPoint: InputValue): NumericSegmentHistogram {
        if(dataPoint == null){
            this.increaseUndefined();
            return this;
        }

        // Find bins & insert points
        const matchingBinIndices = this.findBinIndices(dataPoint);
        matchingBinIndices.forEach(idx => this.binCounters[idx]++);
        
        const matchesAtLeastOne = (matchingBinIndices.length > 0);
        if(matchesAtLeastOne) {
            this.numDataPoints++;
        } else {
            this.increaseNonMatching();
        }

        return this;
    }

    addMultiple(dataPoint: InputValue, numTimes: number): NumericSegmentHistogram {
        if (dataPoint == null) {
            this.increaseUndefined(numTimes);
            return this;
        }

        // Find bins & insert points
        const matchingBinIndices = this.findBinIndices(dataPoint);
        matchingBinIndices.forEach(idx => this.binCounters[idx] += numTimes);

        const matchesAtLeastOne = (matchingBinIndices.length > 0);
        if (matchesAtLeastOne) {
            this.numDataPoints += numTimes;
        } else {
            this.increaseNonMatching(numTimes);
        }

        return this;
    }

    addAll(dataPoints: Array<InputValue>): NumericSegmentHistogram {
        for (const value of dataPoints) {
            this.add(value);
        }
        return this;
    }

    addFromObject(dataObject: Object, property: string): NumericSegmentHistogram {
        this.add((dataObject as any)[property]);
        return this;
    }

    addAllFromObjects(dataObjects: Array<Object>, property: string): NumericSegmentHistogram {
        for (const dataObject of dataObjects) {
            this.add((dataObject as any)[property]);
        }
        return this;
    }

    private findBinIndices(dataPoint: number): number[] {
        let matchinBinIndices: number[] = [];
        for(let i = 0; i < this.numBins; i++) {
            if(this.matchesBin(dataPoint, this.bins[i])) {
                matchinBinIndices.push(i);
            }
        }
        return matchinBinIndices;
    }

    private matchesBin(value: number, bin: SegmentBin) {
        // Check lower bound
        if((bin.min !== null) && value < bin.min) {
            return false;
        }
        // Check upper bound
        if((bin.max !== null) && value >= bin.max) {
            return false;
        }
        return true;
    }

    private increaseUndefined(numTimes: number = 1){
		if(!this.acceptUndefined){
			throw new Error("Histogram is set not to accept undefined values" );
		} else {
			this.numUndefined += numTimes;
		}
	}

    private increaseNonMatching(numTimes: number = 1){
		if(!this.acceptOutliers){
			throw new Error("Histogram is set not to accept values not matching any segment bin");
		} else {
			this.numOutliers += numTimes;
		}
	}

    /********************************************************************************
     * 							Setup Descriptions
    /********************************************************************************/

    getNumBins(): number {
        return this.numBins;
    }

    getNumDataPoints(): number {
        return this.numDataPoints;
    }

    getNumUndefined(): number {
		return this.numUndefined;
	}

    getNumOutliers(): number {
		return this.numOutliers;
	}

	getRatioUndefined(): number {
		return this.numUndefined / this.getNumDataPoints();
	}

    getRatioOutliers(): number {
		return this.numOutliers / this.getNumDataPoints();
	}

    /********************************************************************************
     * 							Data Retrieve
    /********************************************************************************/

    getBins(scaling: HistogramBinScaling = HistogramBinScaling.ByNumDatapoints): Array<NumericSegmentHistogramBin> {
        let scaledBins = this.getBinArrayScaled(scaling);
        return this.computeOutputBinFormatArray(scaledBins);
    }

    getBinsSortedByBinSize(sortDirection: "ascending" | "descending" = "descending", scaling?: HistogramBinScaling): Array<NumericSegmentHistogramBin> {
        return super.getBinsSortedByBinSize(sortDirection, scaling) as Array<NumericSegmentHistogramBin>;
    }

    getBinsSortedByKey(sortDirection: "ascending" | "descending" = "descending", scaling?: HistogramBinScaling): Array<NumericSegmentHistogramBin> {
        return super.getBinsSortedByKey(sortDirection, scaling) as Array<NumericSegmentHistogramBin>;
    }

    private getBinArrayScaled(scaling: HistogramBinScaling): Array<number> {
        const scaleFactor = this.getBinScaleFactor(scaling);

        const scaledBins = createArrayWithLength<number>(this.numBins);
        for (let i = 0; i < this.numBins; i++) {
            scaledBins[i] = scaleFactor * this.binCounters[i];
        }

        return scaledBins;
    }

    private getBinScaleFactor(scaling: HistogramBinScaling): number {
        switch (scaling) {
            case HistogramBinScaling.ByNumDatapoints:
                return (this.numDataPoints === 0) ? 0 : 1.0 / this.numDataPoints;
            case HistogramBinScaling.ByMaxBinSize:
                const maxValue = max(this.binCounters);
                return (maxValue === 0) ? 0 : 1.0 / maxValue;
        }
    }

    private computeOutputBinFormatArray(scaledBinArray: Array<number>): Array<NumericSegmentHistogramBin> {
        let resultList = new Array<NumericSegmentHistogramBin>();
        for (let i = 0; i < this.numBins; i++) {
            const bin = this.bins[i];
            resultList.push({
                key: bin.key,
                extent: { min: bin.min, max: bin.max },
                size: this.binCounters[i],
                scaledSize: scaledBinArray[i],
            }
            );
        }
        return resultList;
    }

}