export default abstract class HistogramBinSizeStrategy {
	protected min: number;
	protected max: number;

	constructor() {
		this.min = 0;
		this.max = 0;
	}

	protected setMinMax(min: number, max: number): void {
		this.min = min;
		this.max = max;
	}

	getMin(): number {
		return this.min;
	}

	getMax(): number {
		return this.max;
	}

	/**
	 * Note: The cut points are the cut points *within* the min, max boundaries! The two boundaries are
	 * *not* cut points! The histogram thus has [cut points]  + 1 bins.
	 */
	public abstract getCutPoints(): Array<number>;

}
