import Sampler from './Sampler'

export class BooleanDistribution implements Sampler<boolean> {
    private readonly probability: number;

    constructor(probability: number = 0.5) {
        this.probability = probability;
    }

    sample(): boolean {
        return (Math.random() < this.probability);
    }
}