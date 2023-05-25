import { createNiceRange } from '../../utils/NumberUtils';
import { almostEqual } from '../../utils/NumberUtils';
import { minMax } from '../StatisticsUtils';
import HistogramBinSizeStrategy from './HistogramBinSizeStrategy';

export default class EqualNiceWidthHistogramBinSizeStrategy extends HistogramBinSizeStrategy {
    private cutPoints: Array<number>;

    constructor(numBins: number, min: number, max: number) {
        super();
        this.cutPoints = new Array<number>();
        this.setMinMax(min, max);
        this.initBins(numBins);
    }

    static newFromData(numBins: number, dataPoints: Array<number>): EqualNiceWidthHistogramBinSizeStrategy {
        const {min, max} = minMax(dataPoints);

        return new EqualNiceWidthHistogramBinSizeStrategy(numBins, min, max);
    }

    private initBins(numBins: number): void {
        // Check data range
        if(almostEqual(this.min, this.max, 0.00001)){
            // Create a single bin
            return;
        }

        // Compute nice range & ticks
        const range = createNiceRange(this.min, this.max, numBins);

        // Define new nice range
        this.min = range.min;
        this.max = range.max;

        // Define bins
        const binSize = range.tickSpacing;
        for (let i = 1; i < range.numTicks; i++) {
            this.cutPoints.push(this.min + i * binSize);
        }
    }

    getCutPoints(): Array<number> {
        return this.cutPoints;
    }

}
