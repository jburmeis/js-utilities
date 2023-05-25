import CounterMap from '../collections/CounterMap';
import { MinMaxPair } from '../structs/MinMaxPair';
import { OptionalRange } from '../structs/OptionalRange';
import { matchesOptionalRange, RangeMatching } from '../utils';
import Histogram, { HistogramBin, HistogramBinScaling } from './Histogram';

type InputValue = number | undefined | null;

export interface IntegerHistogramBin extends HistogramBin {
    intKey: number;
}

export type InitOptions = {
	/** Accepted range (inclusive min and max) */
	acceptedRange?: OptionalRange;
	acceptUndefined?: boolean;
}

const DefaultInitOptions = {
	acceptedRange: undefined,
	acceptUndefined: true,
}

export default class IntegerHistogram extends Histogram {
	// Data storage
	private bins: CounterMap<number>;
	private numUndefined: number;

	// Histogram current value range
	// This can also be set from the user as predefined range
	private currentValueRange: { min: number, max: number } | null = null;

	// Behavior flags
	private acceptedRange: MinMaxPair;
	private acceptUndefined: boolean;

	/********************************************************************************
	 * 							Construction
	/********************************************************************************/

	private constructor(values: Array<InputValue> | undefined, initOptions?: InitOptions) {
		const { acceptedRange, acceptUndefined } = { ...DefaultInitOptions, ...initOptions };
		
		super();
		this.bins = new CounterMap<number>();
		this.numUndefined = 0;
		this.acceptedRange = {
			min: acceptedRange?.min ?? Number.NEGATIVE_INFINITY,
			max: acceptedRange?.max ?? Number.POSITIVE_INFINITY
		};
		this.acceptUndefined = acceptUndefined;

		if (values !== undefined) {
			this.addAll(values);
		}
	}

	/**
	 * Creates an new, empty histogram, without any predefined bins.
	 */
	static createEmpty(options?: InitOptions): IntegerHistogram {
		return new IntegerHistogram(undefined, options);
	}

	/**
	 * Creates an new, empty histogram with a list of predefined bins (initialized to 0)
	 */
	static createWithPredefinedRange(valueRange: MinMaxPair, options?: InitOptions): IntegerHistogram {
		const histogram = new IntegerHistogram(undefined, options);
		histogram.currentValueRange = valueRange;
		return histogram;
	}

	/**
	 * Creates an new, empty histogram with a list of predefined, locked bins (initialized to 0)
	 * The value range is inclusive for min and max.
	 */
	static createWithPredefinedLockedRange(valueRange: MinMaxPair, options?: { acceptUndefined?: boolean}): IntegerHistogram {
		const histogram = new IntegerHistogram(undefined, options);
		histogram.acceptedRange = valueRange;
		histogram.currentValueRange = valueRange;
		return histogram;
	}	

	/**
	 * Creates an new histogram from a list of input values.
	 * This is equivalent to calling createEmpty() and addAll()
	 */
	static createFromData(values: Array<InputValue>, options?: InitOptions): IntegerHistogram {
		return new IntegerHistogram(values, options);
	}


	/********************************************************************************
	 * 							Data Insert
	/********************************************************************************/

	private validateInput(value: InputValue) {
		if (value == null) {
			if (!this.acceptUndefined) {
				throw new Error("Histogram is set not to accept undefined values");
			} else {
				return;
			}
		}

		if (!Number.isInteger(value)) {
			throw new Error(`Input is not an integer: ${value}`);
		}

		if(!matchesOptionalRange(value, this.acceptedRange, RangeMatching.MaxIncluded)){
			throw new Error(`Input out of accepted range: ${value}`);
		}
	}

	add(dataPoint: InputValue): IntegerHistogram {
		this.validateInput(dataPoint);

		if(dataPoint == null){
			this.increaseUndefined();
		} else {
			this.bins.increase(dataPoint);
			this.extendValueRange(dataPoint);
		}
		return this;
	}

	addMultiple(dataPoint: InputValue, numTimes: number): IntegerHistogram {
		this.validateInput(dataPoint);

		if(dataPoint == null){
			this.increaseUndefined(numTimes);
		} else {
			this.bins.increaseBy(dataPoint, numTimes);
			this.extendValueRange(dataPoint);
		}
		return this;
	}

	addAll(dataPoints: Array<InputValue>): IntegerHistogram {
		dataPoints.forEach(point => this.add(point));
		return this;
	}

	addFromObject(dataObject: Object, property: string): IntegerHistogram {
		this.add((dataObject as any)[property]);
		return this;
	}

	addAllFromObjects(dataObjects: Array<Object>, property: string): IntegerHistogram {
		for (const dataObject of dataObjects) {
			this.add((dataObject as any)[property]);
		}
		return this;
	}

	addMultipleFromObject(dataObject: Object, property: string, numTimes: number): IntegerHistogram {
		this.addMultiple((dataObject as any)[property], numTimes);
		return this;
	}

	private increaseUndefined(numTimes: number = 1){
		this.numUndefined += numTimes;
	}

	private extendValueRange(dataPoint: number) {
		if(!this.currentValueRange) { 
			this.currentValueRange = { min: dataPoint, max: dataPoint };
		} else {
			if(this.currentValueRange.min > dataPoint) {
				this.currentValueRange.min = dataPoint;
			}
			if(this.currentValueRange.max < dataPoint) {
				this.currentValueRange.max = dataPoint;
			}
		}
	}

	/********************************************************************************
	 * 							Data Retrieve
	/********************************************************************************/

	getNumBins(): number {
		return this.bins.size();
	}

	getNumDataPoints(): number {
		return this.bins.getSumOfAllPositiveCounters();
	}

	getValueRange(): MinMaxPair | null {
		return this.currentValueRange;
	}

	getValue(key: number): number {
		return this.bins.get(key);
	}

	getNumUndefined(): number {
		return this.numUndefined;
	}

	getRatioUndefined(): number {
		return this.numUndefined / this.getNumDataPoints();
	}

	getBins(scaling: HistogramBinScaling = HistogramBinScaling.ByNumDatapoints): Array<IntegerHistogramBin> {
		const scaleFactor = this.getBinScaleFactor(scaling);
		return this.bins.getEntries().map(pair => ({
			key: pair.key.toString(),
			intKey: pair.key,
			size: pair.value,
			scaledSize: pair.value * scaleFactor,
		}))
	}

	getBinsForKeys(keys: number[], scaling: HistogramBinScaling = HistogramBinScaling.ByNumDatapoints): Array<IntegerHistogramBin> {
		const scaleFactor = this.getBinScaleFactor(scaling);
		return keys.map(key => {
			const value = this.bins.get(key);
			return {
				key: key.toString(),
				intKey: key,
				size: value,
				scaledSize: value * scaleFactor,
			}
		})
	}

	/**
	 * Get bins for each integer in the given range (min, max inclusive)
	 */
	getBinsForFullRange(valueRange?: MinMaxPair, scaling: HistogramBinScaling = HistogramBinScaling.ByNumDatapoints): Array<IntegerHistogramBin> {
		const scaleFactor = this.getBinScaleFactor(scaling);
		if (!this.currentValueRange) {
			return [];
		}
		const { min, max } = valueRange ?? this.currentValueRange;

		const bins: Array<IntegerHistogramBin> = [];
		for (let i = min; i <= max; i++) {
			const value = this.bins.get(i);
			bins.push({
				key: i.toString(),
				intKey: i,
				size: value,
				scaledSize: value * scaleFactor,
			})
		}
		return bins;
	}

	private getBinScaleFactor(scaling: HistogramBinScaling): number {
		switch (scaling) {
			case HistogramBinScaling.ByNumDatapoints:
				const numDataPoints = this.getNumDataPoints();
				return (numDataPoints === 0) ? 0 : 1.0 / this.getNumDataPoints();
			case HistogramBinScaling.ByMaxBinSize:
				const maxValue = this.bins.getMax();
				return (maxValue === 0) ? 0 : 1.0 / this.bins.getMax();
		}
	}

}