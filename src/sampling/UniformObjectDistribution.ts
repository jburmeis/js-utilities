import Sampler from './Sampler'

export class UniformObjectDistribution<ValueType> implements Sampler<ValueType> {
    private readonly valueArray: Array<ValueType>;

    constructor(...valueArray: Array<ValueType>) {
        this.valueArray = valueArray;
    }

    sample(): ValueType {
        if (this.valueArray.length === 0) {
            throw new Error("Object collection is empty");
        }

        const randomIndex = Math.floor(Math.random() * this.valueArray.length)
        return this.valueArray[randomIndex];
    }
}