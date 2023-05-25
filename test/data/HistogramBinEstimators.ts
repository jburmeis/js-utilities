
import { expect } from 'chai';
import { getHistogramBinEstimator, HistogramBinEstimators } from '../../src';

describe('HistogramBinEstimators', () => {
    
    const TEST_INPUT_VALUES = [
        1, 4, 2, 8, 9, 9, 6, 8, 4, 1, 
    ];

    it('SquareRoot', () => {
        const estimator = getHistogramBinEstimator(HistogramBinEstimators.SquareRoot);
        expect(estimator(TEST_INPUT_VALUES)).to.equal(4);
    });

    it('Sturges', () => {
        const estimator = getHistogramBinEstimator(HistogramBinEstimators.Sturges);
        expect(estimator(TEST_INPUT_VALUES)).to.equal(5);
    });

    it('Scott', () => {
        const estimator = getHistogramBinEstimator(HistogramBinEstimators.Scott);
        expect(estimator(TEST_INPUT_VALUES)).to.equal(2);
    });

    it('FreedmanDiaconis', () => {
        const estimator = getHistogramBinEstimator(HistogramBinEstimators.FreedmanDiaconis);
        expect(estimator(TEST_INPUT_VALUES)).to.equal(1);
    });

});

