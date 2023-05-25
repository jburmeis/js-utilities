import CounterMap from '../collections/CounterMap';
import Histogram, { HistogramBin, HistogramBinScaling } from './Histogram';

type InputValue = string | undefined | null;

export type InitOptions = {
	elementRange?: Array<string>;
	lockedBins?: boolean;
	acceptUndefined?: boolean;
}

const DefaultInitOptions = {
	elementRange: undefined,
	lockedBins: false,
	acceptUndefined: true,
}

export default class CategoricalHistogram extends Histogram {
	// Data storage
	private bins: CounterMap<string>;
	private numUndefined: number;

	// Behavior flags
	private acceptUndefined: boolean;

	/********************************************************************************
	 * 							Construction
	/********************************************************************************/

	private constructor(values: Array<InputValue> | undefined, initOptions?: InitOptions) {
		const { elementRange, lockedBins, acceptUndefined } = { ...DefaultInitOptions, ...initOptions };
		
		super();
		this.bins = new CounterMap<string>([], { restrictKeys: lockedBins ? elementRange : undefined });
		this.numUndefined = 0;
		this.acceptUndefined = acceptUndefined;

		if (elementRange) {
			this.bins.setAll(elementRange, 0);
		}
		if (values !== undefined) {
			this.addAll(values);
		}
	}

	/**
	 * Creates an new, empty histogram, without any predefined bins.
	 */
	static createEmpty(options?: InitOptions): CategoricalHistogram {
		return new CategoricalHistogram(undefined, options);
	}

	/**
	 * Creates an new, empty histogram with a list of predefined bins (initialized to 0)
	 */
	static createWithPredefinedBins(elementRange: Array<string>, options?: { acceptUndefined?: boolean }): CategoricalHistogram {
		return new CategoricalHistogram(undefined, { elementRange: elementRange, ...options });
	}

	/**
	 * Creates an new, empty histogram with a list of predefined, locked bins (initialized to 0)
	 */
	static createWithPredefinedLockedBins(elementRange: Array<string>, options?: { acceptUndefined?: boolean }): CategoricalHistogram {
		return new CategoricalHistogram(undefined, { elementRange: elementRange, lockedBins: true, ...options });
	}	

	/**
	 * Creates an new histogram from a list of input values.
	 * This is equivalent to calling createEmpty() and addAll()
	 */
	static createFromData(values: Array<InputValue>, options?: { acceptUndefined?: boolean }): CategoricalHistogram {
		return new CategoricalHistogram(values, options);
	}


	/********************************************************************************
	 * 							Data Insert
	/********************************************************************************/

	add(dataPoint: InputValue): CategoricalHistogram {
		if(dataPoint == null){
			this.increaseUndefined();
		} else {
			this.bins.increase(dataPoint);
		}
		return this;
	}

	addMultiple(dataPoint: InputValue, numTimes: number): CategoricalHistogram {
		if(dataPoint == null){
			this.increaseUndefined(numTimes);
		} else {
			this.bins.increaseBy(dataPoint, numTimes);
		}
		return this;
	}

	addAll(dataPoints: Array<InputValue>): CategoricalHistogram {
		dataPoints.forEach(point => this.add(point));
		return this;
	}

	addFromObject(dataObject: Object, property: string): CategoricalHistogram {
		this.add((dataObject as any)[property]);
		return this;
	}

	addAllFromObjects(dataObjects: Array<Object>, property: string): CategoricalHistogram {
		for (const dataObject of dataObjects) {
			this.add((dataObject as any)[property]);
		}
		return this;
	}

	addMultipleFromObject(dataObject: Object, property: string, numTimes: number): CategoricalHistogram {
		this.addMultiple((dataObject as any)[property], numTimes);
		return this;
	}

	private increaseUndefined(numTimes: number = 1){
		if(!this.acceptUndefined){
			throw new Error("Histogram is set not to accept undefined values");
		} else {
			this.numUndefined += numTimes;
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

	getValue(key: string): number {
		return this.bins.get(key);
	}

	getNumUndefined(): number {
		return this.numUndefined;
	}

	getRatioUndefined(): number {
		return this.numUndefined / this.getNumDataPoints();
	}

	getBins(scaling: HistogramBinScaling = HistogramBinScaling.ByNumDatapoints): Array<HistogramBin> {
		const scaleFactor = this.getBinScaleFactor(scaling);
		return this.bins.getEntries().map(pair => ({
			key: pair.key,
			size: pair.value,
			scaledSize: pair.value * scaleFactor,
		}))
	}

	getBinsForKeys(keys: string[], scaling: HistogramBinScaling = HistogramBinScaling.ByNumDatapoints): Array<HistogramBin> {
		const scaleFactor = this.getBinScaleFactor(scaling);
		return keys.map(key => {
			const value = this.bins.get(key);
			return {
				key: key,
				size: value,
				scaledSize: value * scaleFactor,
			}
		})
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