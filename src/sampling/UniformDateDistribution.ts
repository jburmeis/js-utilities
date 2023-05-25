import Sampler from './Sampler'

export class UniformDateDistribution implements Sampler<Date> {
    private readonly min: number;
    private readonly range: number;

    constructor(min: Date, max: Date) {
        this.min = min.getTime();
        this.range = max.getTime() - this.min;
    }

    sample(): Date {
        return new Date(this.min + (Math.random() * this.range));
    }
}