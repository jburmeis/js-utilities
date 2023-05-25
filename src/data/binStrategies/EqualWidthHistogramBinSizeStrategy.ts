import { almostEqual } from '../../utils/NumberUtils';
import { minMax } from '../StatisticsUtils';
import HistogramBinSizeStrategy from './HistogramBinSizeStrategy';

export default class EqualWidthHistogramBinSizeStrategy extends HistogramBinSizeStrategy {
    private cutPoints: Array<number>;

    constructor(numBins: number, min: number, max: number) {
        super();
        this.cutPoints = new Array<number>();
        this.setMinMax(min, max);
        this.initBins(numBins);
    }

    static newFromData(numBins: number, dataPoints: Array<number>): EqualWidthHistogramBinSizeStrategy {
        const { min, max } = minMax(dataPoints);

        return new EqualWidthHistogramBinSizeStrategy(numBins, min, max);
    }

    private initBins(numBins: number): void {
        // Check data range
        if(almostEqual(this.min, this.max, 0.00001)){
            // Create a single bin
            return;
        }

        // Define bins
        const binSize = (this.max - this.min) / numBins;

        let currentBinStart = this.min;
        for (let i = 0; i < numBins - 1; i++) {
            this.cutPoints.push(currentBinStart += binSize);
        }
    }

    getCutPoints(): Array<number> {
        return this.cutPoints;
    }

}
