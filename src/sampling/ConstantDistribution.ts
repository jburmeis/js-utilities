import Sampler from './Sampler'

export class ConstantDistribution<ValueType> implements Sampler<ValueType> {
    private readonly constantValue: ValueType;

    constructor(constantValue: ValueType) {
        this.constantValue = constantValue;
    }

    sample(): ValueType {
        return this.constantValue;
    }

}