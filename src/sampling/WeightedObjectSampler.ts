import Sampler from './Sampler'

export type WeightedObject = {
    weight: number;
}

export class WeightedObjectSampler<T extends WeightedObject> implements Sampler<T> {
    private pdf: Array<number>;
    private weightedObjects: Array<T>;

    constructor(weightedObjects: Array<T>) {
        this.weightedObjects = weightedObjects;
        this.pdf = this.computePDF(weightedObjects);
    }

    public sample(): T {
        return this.weightedObjects[this.sampleIndex()];
    }

    public sampleIndex(): number {
        return this.samplePDF(this.pdf);
    }

    private computePDF(weightedObjects: Array<T>): Array<number> {
        // Compute sum of all weights
        const pdfSum = weightedObjects.reduce((prev, current) => prev + current.weight, 0);

        // Compute normalized PDF
        const pdfSum_inv = 1.0 / pdfSum;
        const pdf = weightedObjects.map(object => object.weight * pdfSum_inv);

        return pdf;
    }

    private samplePDF(pdf: Array<number>): number {
        let r = Math.random();

        for (let i = 0; i < pdf.length; i++) {
            if (r < pdf[i]) {
                return i;
            }
            r -= pdf[i];
        }

        // Default option, should not happen since pdf sums to 1
        // but may occur in very rare cases if is not *exactly* 1 (floating point error in normalizePDF() division)
        // In those rare cases choose the most improbable index
        return pdf.length - 1;
    }

}