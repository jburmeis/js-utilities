
import { expect } from 'chai';
import { quartiles, report } from '../../src';

describe('StatisticsReport:report', () => {
    // Precision of floating point comparisions
    const floatingPointDelta = 0.000001;

    // Test arrays
    const array0 = [1, 7, 3, 9, 5, 12, 5];
    const array1 = [6, 7, 15, 36, 39, 40, 41, 42, 43, 47, 49];
    const array2 = [7, 15, 36, 39, 40, 41];
    const array1_unordered = [39, 7, 42, 49, 36, 40, 15, 41, 43, 6, 47];
    const array2_unordered = [39, 36, 41, 15, 7, 40];

    // Results to test
    const result0 = report(array0);
    const result1 = report(array1);
    const result2 = report(array2);
    const result1_unordered = report(array1_unordered);
    const result2_unordered = report(array2_unordered);

    it('Min', () => {
        expect(result0.min).to.equal(1);
        expect(result1.min).to.equal(6);
        expect(result2.min).to.equal(7);
        expect(result1_unordered.min).to.equal(6);
        expect(result2_unordered.min).to.equal(7);
    });

    it('Max', () => {
        expect(result0.max).to.equal(12);
        expect(result1.max).to.equal(49);
        expect(result2.max).to.equal(41);
        expect(result1_unordered.max).to.equal(49);
        expect(result2_unordered.max).to.equal(41);
    });

    it('Mean', () => {
        expect(result0.mean).to.equal(6);
        expect(result1.mean).to.equal(365/11);
        expect(result2.mean).to.equal(89/3);
        expect(result1_unordered.mean).to.equal(365/11);
        expect(result2_unordered.mean).to.equal(89/3);
    });

    it('Median', () => {
        expect(result0.median).to.equal(5);
        expect(result1.median).to.equal(40);
        expect(result2.median).to.equal(37.5);
        expect(result1_unordered.median).to.equal(40);
        expect(result2_unordered.median).to.equal(37.5);
    });

    it('StdDev Population', () => {
        expect(result0.stdDevPopulation).to.be.approximately(Math.sqrt(82 / 7), floatingPointDelta);
        expect(result1.stdDevPopulation).to.be.approximately((26 * Math.sqrt(41)) / 11, floatingPointDelta);
        expect(result2.stdDevPopulation).to.be.approximately(Math.sqrt(1637) / 3, floatingPointDelta);
        expect(result1_unordered.stdDevPopulation).to.be.approximately((26 * Math.sqrt(41)) / 11, floatingPointDelta);
        expect(result2_unordered.stdDevPopulation).to.be.approximately(Math.sqrt(1637) / 3, floatingPointDelta);
    });

    it('StdDev Sample', () => {
        expect(result0.stdDevSample).to.be.approximately(Math.sqrt(41 / 3), floatingPointDelta);
        expect(result1.stdDevSample).to.be.approximately(13 * Math.sqrt(82 / 55), floatingPointDelta);
        expect(result2.stdDevSample).to.be.approximately(Math.sqrt(3274 / 15), floatingPointDelta);
        expect(result1_unordered.stdDevSample).to.be.approximately(13 * Math.sqrt(82 / 55), floatingPointDelta);
        expect(result2_unordered.stdDevSample).to.be.approximately(Math.sqrt(3274 / 15), floatingPointDelta);
    });

    it('FirstQuartile', () => {
        expect(result0.firstQuartile).to.equal(3);
        expect(result1.firstQuartile).to.equal(15);
        expect(result2.firstQuartile).to.equal(15);
        expect(result1_unordered.firstQuartile).to.equal(15);
        expect(result2_unordered.firstQuartile).to.equal(15);
    });

    it('ThirdQuartile', () => {
        expect(result0.thirdQuartile).to.equal(9);
        expect(result1.thirdQuartile).to.equal(43);
        expect(result2.thirdQuartile).to.equal(40);
        expect(result1_unordered.thirdQuartile).to.equal(43);
        expect(result2_unordered.thirdQuartile).to.equal(40);
    });

    it('Size', () => {
        expect(result0.size).to.equal(7);
        expect(result1.size).to.equal(11);
        expect(result2.size).to.equal(6);
        expect(result1_unordered.size).to.equal(11);
        expect(result2_unordered.size).to.equal(6);
    });

});

describe('StatisticsReport:quartiles', () => {
    // Precision of floating point comparisions
    const floatingPointDelta = 0.000001;

    // Test arrays
    const array0 = [1, 7, 3, 9, 5, 12, 5];
    const array1 = [6, 7, 15, 36, 39, 40, 41, 42, 43, 47, 49];
    const array2 = [7, 15, 36, 39, 40, 41];
    const array1_unordered = [39, 7, 42, 49, 36, 40, 15, 41, 43, 6, 47];
    const array2_unordered = [39, 36, 41, 15, 7, 40];

    // Results to test
    const result0 = quartiles(array0);
    const result1 = quartiles(array1);
    const result2 = quartiles(array2);
    const result1_unordered = quartiles(array1_unordered);
    const result2_unordered = quartiles(array2_unordered);

    it('Min', () => {
        expect(result0.min).to.equal(1);
        expect(result1.min).to.equal(6);
        expect(result2.min).to.equal(7);
        expect(result1_unordered.min).to.equal(6);
        expect(result2_unordered.min).to.equal(7);
    });

    it('Max', () => {
        expect(result0.max).to.equal(12);
        expect(result1.max).to.equal(49);
        expect(result2.max).to.equal(41);
        expect(result1_unordered.max).to.equal(49);
        expect(result2_unordered.max).to.equal(41);
    });

    it('Mean', () => {
        expect(result0.mean).to.equal(6);
        expect(result1.mean).to.equal(365/11);
        expect(result2.mean).to.equal(89/3);
        expect(result1_unordered.mean).to.equal(365/11);
        expect(result2_unordered.mean).to.equal(89/3);
    });

    it('Median', () => {
        expect(result0.median).to.equal(5);
        expect(result1.median).to.equal(40);
        expect(result2.median).to.equal(37.5);
        expect(result1_unordered.median).to.equal(40);
        expect(result2_unordered.median).to.equal(37.5);
    });


    it('FirstQuartile', () => {
        expect(result0.firstQuartile).to.equal(3);
        expect(result1.firstQuartile).to.equal(15);
        expect(result2.firstQuartile).to.equal(15);
        expect(result1_unordered.firstQuartile).to.equal(15);
        expect(result2_unordered.firstQuartile).to.equal(15);
    });

    it('ThirdQuartile', () => {
        expect(result0.thirdQuartile).to.equal(9);
        expect(result1.thirdQuartile).to.equal(43);
        expect(result2.thirdQuartile).to.equal(40);
        expect(result1_unordered.thirdQuartile).to.equal(43);
        expect(result2_unordered.thirdQuartile).to.equal(40);
    });
    
});

