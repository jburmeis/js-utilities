import Sampler from './Sampler'
import { sampleNormalDistribution } from './SamplingFunctions';

export default class NormalDistribution implements Sampler<number> {
	private readonly mean: number;
	private readonly sigma: number;

	constructor(mean: number = 0, sigma: number = 1) {
		this.mean = mean;
		this.sigma = sigma;
	}

	sample(): number {
		return sampleNormalDistribution(this.mean, this.sigma);
	}
}