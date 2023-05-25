import Sampler from './Sampler'

export class UniformNumericDistribution implements Sampler<number> {
    private readonly min: number;
    private readonly range: number;

    constructor(min: number, max: number) {
        this.min = min;
        this.range = max - min;
    }

    sample(): number {
        return this.min + (Math.random() * this.range);
    }
}