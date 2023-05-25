import Sampler from './Sampler'

export class UniformIntegerDistribution implements Sampler<number> {
    private readonly min: number;
    private readonly range: number;

    constructor(min: number, max: number) {
        this.min = min;
        this.range = max - min;
    }

    sample(): number {
        return Math.floor(this.min + (Math.random() * this.range));
    }
}