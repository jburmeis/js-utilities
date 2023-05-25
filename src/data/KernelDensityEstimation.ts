import { Point } from "../structs/Point";
import { createArrayWithLength } from "../utils/ArrayUtils";
import { getKernel, KernelFunction, KernelFunctions } from "./KernelFunctions";
import { stdDevPopulation } from "./StatisticsUtils";

export default class KernelDensityEstimation {
    private readonly dataPoints: Array<number>;
    private readonly flagSetupValid: boolean;

    private kernelBandwidth: number = 0;
    private invKernelBandwidth: number = 0;
    private invNormalizationFactor: number = 0;
    private kernelFunction: KernelFunction = getKernel(KernelFunctions.Gaussian);

    constructor(dataPoints: Array<number>, kernelBandwidth?: number, kernelFunction?: KernelFunction) {
        this.dataPoints = dataPoints;

        if (this.dataPoints.length > 1) {
            this.setup(dataPoints, kernelBandwidth, kernelFunction);
            this.flagSetupValid = true;
        } else {
            this.flagSetupValid = false;
        }
    }

    private setup(dataPoints: Array<number>, kernelBandwidth?: number, kernelFunction?: KernelFunction) {
        // Setup kernel bandwidth
        this.kernelBandwidth = kernelBandwidth ?? this.estimateBandwidth(dataPoints);
        this.invKernelBandwidth = 1.0 / this.kernelBandwidth;
        this.invNormalizationFactor = 1.0 / (this.kernelBandwidth * dataPoints.length);

        // Replace default kernel if set
        if (kernelFunction !== undefined) {
            this.kernelFunction = kernelFunction;
        }
    }

    private estimateBandwidth(dataPoints: Array<number>) {
        const numDataPoints = dataPoints.length;
        return 1.06 * stdDevPopulation(dataPoints) * Math.pow(numDataPoints, -0.2);
    }

    evaluateArray(startX: number, endX: number, numSamples: number): number[] {
        if (numSamples == 0)
            return [0];

        if (!this.flagSetupValid) {
            return createArrayWithLength(numSamples, 0);
        }

        if (this.kernelBandwidth < 0.0001) {
            return createArrayWithLength(numSamples, 0);
        }

        const values = createArrayWithLength(numSamples, 0);
        const stepSize = Math.abs(endX - startX) / numSamples;

        for (const sample of this.dataPoints) {
            for (let i = 0; i < numSamples; i++) {
                const x = startX + i * stepSize;
                values[i] += this.kernelFunction((x - sample) * this.invKernelBandwidth);
            }
        }

        for (let i = 0; i < numSamples; i++) {
            values[i] *= this.invNormalizationFactor;
        }

        return values;
    }

    evaluateArrayAsPoints(startX: number, endX: number, numSamples: number): Point[] {
        const arrayValues = this.evaluateArray(startX, endX, numSamples);
        const stepSize = Math.abs(endX - startX) / numSamples;
        return arrayValues.map((value, i) => ({ x: startX + i * stepSize, y: value }));
    }

}