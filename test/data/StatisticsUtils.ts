
import { expect } from 'chai';
import { correlationCoefficient, covariance, findMaxObject, findMinObject, max, maxObject, mean, median, min, minMax, minMaxObject, minObject, range, rankCorrelationCoefficient, stdDevPopulation, stdDevSample, variancePopulation, varianceSample } from '../../src';

describe('StatisticsUtils', () => {
    // Precision of floating point comparisions
    const floatingPointDelta = 0.000001;

    it('min', () => {
        expect(min([2,4,8,1,5,4,10])).to.equal(1);
        expect(min([2,4,8,0,5,4,10])).to.equal(0);
        expect(min([2,-4,8,1,-5,4,10])).to.equal(-5);
        expect(min([2])).to.equal(2);
    });

    it('max', () => {
        expect(max([2,4,8,1,5,10,4])).to.equal(10);
        expect(max([2,-4,8,1,-5,10,4])).to.equal(10);
        expect(max([2])).to.equal(2);
    });

    it('minMax', () => {
        const minMax1 = minMax([2,4,8,1,5,10,4]);
        expect(minMax1.min).to.equal(1);
        expect(minMax1.max).to.equal(10);
        
        const minMax2 = minMax([2,-4,8,1,-5,10,4]);
        expect(minMax2.min).to.equal(-5);
        expect(minMax2.max).to.equal(10);
        
        const minMax3 = minMax([2]);
        expect(minMax3.min).to.equal(2);
        expect(minMax3.max).to.equal(2);
    });

    it('range', () => {
        expect(range([2,4,8,1,5,10,4])).to.equal(9);
        expect(range([2,-4,8,1,-5,10,4])).to.equal(15);
        expect(range([2])).to.equal(0);
    });

    it('minObject', () => {
        const objArray = [
            {value: 2, other: "a"},
            {value: -4, other: 30},
            {value: 8, other: [30, -10]},
            {value: 1},
            {value: -5},
            {value: 10},
            {value: 4},
        ];

        expect(minObject(objArray, "value")).to.equal(-5);
    });

    it('findMinObject', () => {
        const objArray = [
            {value: 2, other: "a"},
            {value: -4, other: 30},
            {value: 8, other: [30, -10]},
            {value: 1},
            {value: -5, other: "c"},
            {value: 10},
            {value: 4},
        ];

        expect(findMinObject(objArray, "value")).to.equal(objArray[4]);
    });

    it('maxObject', () => {
        const objArray = [
            {value: 2, other: "a"},
            {value: -4, other: 30},
            {value: 8, other: [30, -10]},
            {value: 1},
            {value: -5},
            {value: 10},
            {value: 4},
        ];

        expect(maxObject(objArray, "value")).to.equal(10);
    });

    it('findMaxObject', () => {
        const objArray = [
            {value: 2, other: "a"},
            {value: -4, other: 30},
            {value: 8, other: [30, -10]},
            {value: 1},
            {value: -5},
            {value: 10},
            {value: 4},
        ];

        expect(findMaxObject(objArray, "value")).to.equal(objArray[5]);
    });

    it('minMaxObject', () => {
        const objArray = [
            {value: 2, other: "a"},
            {value: -4, other: 30},
            {value: 8, other: [30, -10]},
            {value: 1},
            {value: -5},
            {value: 10},
            {value: 4},
        ];

        const minMax = minMaxObject(objArray, "value");
        expect(minMax.min).to.equal(-5);
        expect(minMax.max).to.equal(10);
    });

    it('Mean', () => {
        expect(mean([1,7,3,9,5,12,5])).to.equal(6);
        expect(mean([1,7])).to.equal(4);
        expect(mean([-1,7])).to.equal(3);
        expect(mean([1])).to.equal(1);
    });

    it('Median', () => {
        expect(median([1,7,3,9,5,12,5])).to.equal(5);
        expect(median([6,7,15,36,39,40,41,42,43,47,49])).to.equal(40);
        expect(median([43,7,41,15,47,36,39,49,40,6,42])).to.equal(40);
        expect(median([7,15,36,39,40,41])).to.equal(37.5);
        expect(median([15, 40, 7, 41, 39, 36])).to.equal(37.5);
        expect(median([1,7])).to.equal(4);
        expect(median([-1,7])).to.equal(3);
        expect(mean([1])).to.equal(1);
    });

    it('VariancePopulation', () => {
        expect(variancePopulation([1,3,5])).to.equal(8/3);
        expect(variancePopulation([1,7])).to.equal(9);
        expect(variancePopulation([-1,7])).to.equal(16);
        expect(variancePopulation([1, 7, 3, 9, 5, 12, 5])).to.be.approximately(82 / 7, floatingPointDelta);
        expect(variancePopulation([6, 7, 15, 36, 39, 40, 41, 42, 43, 47, 49])).to.be.approximately(27716 / 121, floatingPointDelta);
    });

    it('VarianceSample', () => {
        expect(varianceSample([1,3,5])).to.be.equal(4);
        expect(varianceSample([1,7])).to.equal(18);
        expect(varianceSample([-1,7])).to.equal(32);
        expect(varianceSample([1, 7, 3, 9, 5, 12, 5])).to.be.approximately(41 / 3, floatingPointDelta);
        expect(varianceSample([6, 7, 15, 36, 39, 40, 41, 42, 43, 47, 49])).to.be.approximately(13858 / 55, floatingPointDelta);
    });

    it('StdDevPopulation', () => {
        expect(stdDevPopulation([1,3,5])).to.equal(2 * Math.sqrt(2 / 3));
        expect(stdDevPopulation([1,7])).to.equal(3);
        expect(stdDevPopulation([-1,7])).to.equal(4);
        expect(stdDevPopulation([1, 7, 3, 9, 5, 12, 5])).to.be.approximately(Math.sqrt(82 / 7), floatingPointDelta);
        expect(stdDevPopulation([6, 7, 15, 36, 39, 40, 41, 42, 43, 47, 49])).to.be.approximately(Math.sqrt(27716 / 121), floatingPointDelta);
    });

    it('StdDevSample', () => {
        expect(stdDevSample([1,3,5])).to.equal(2);
        expect(stdDevSample([1,7])).to.be.approximately(3 * Math.sqrt(2), floatingPointDelta);
        expect(stdDevSample([-1,7])).to.be.approximately(4 * Math.sqrt(2), floatingPointDelta);
        expect(stdDevSample([1, 7, 3, 9, 5, 12, 5])).to.be.approximately(Math.sqrt(41 / 3), floatingPointDelta);
        expect(stdDevSample([6, 7, 15, 36, 39, 40, 41, 42, 43, 47, 49])).to.be.approximately(13 * Math.sqrt(82 / 55), floatingPointDelta);
    });

    it('Covariance', () => {
        expect(covariance([1,2,3,5,6,7], [8,8,8,9,9,9])).to.equal(1.2);
        expect(covariance([0,1,2,-3], [-2,6,3,6])).to.equal(-2);
    });

    it('CorrelationCoefficient', () => {
        expect(correlationCoefficient([1, 2, 3], [1, 2, 3])).to.equal(1);
        expect(correlationCoefficient([1, 2, 3], [3, 2, 1])).to.equal(-1);
        expect(correlationCoefficient([1, 2, 3, 4, 5], [1, 6, 7, 8, 4])).to.be.approximately(0.455842, floatingPointDelta);
        expect(correlationCoefficient([4,5,7,-3,1,5], [-1,8,5,2,6,-1])).to.be.approximately(0.0860793, floatingPointDelta);
    });

    it('RankCorrelationCoefficient', () => {
        expect(rankCorrelationCoefficient([1, 2, 3], [1, 2, 3])).to.equal(1);
        expect(correlationCoefficient([1, 2, 3], [3, 2, 1])).to.equal(-1);
        expect(rankCorrelationCoefficient([1, 2, 3, 1, 2, 3], [1, 2, 3, 1, 2, 3])).to.equal(1);
        expect(rankCorrelationCoefficient(
            [106, 100, 86, 101, 99, 103, 97, 113, 112, 110],
            [7, 27, 2, 50, 28, 29, 20, 12, 6, 17]
        )).to.be.approximately(-29 / 165, floatingPointDelta);
    });

});

