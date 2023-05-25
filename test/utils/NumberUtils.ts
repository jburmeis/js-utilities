
import { expect } from 'chai';
import { almostEqual, clamp, createNiceRange, toInt, toIntAndClamp, toIntAndClampMax, toIntAndClampMin } from '../../src';

describe('NumberUtils', () => {

    it('createNiceRange: positive values (without ticks)', () => {
        const range = createNiceRange(1, 9);

        expect(range.min).to.be.lessThanOrEqual(1);
        expect(range.max).to.be.greaterThanOrEqual(9);
        expect(range.numTicks).to.be.greaterThan(1);
        expect(range.numTicks).to.be.lessThan(10);
        expect(range.tickSpacing).to.be.greaterThan(0);
        expect(range.tickSpacing).to.be.lessThan(5);
    });

    it('createNiceRange: positive values (with ticks)', () => {
        const range = createNiceRange(1, 9, 3);

        expect(range.min).to.be.lessThanOrEqual(1);
        expect(range.max).to.be.greaterThanOrEqual(9);
        expect(range.numTicks).to.be.greaterThan(1);
        expect(range.numTicks).to.be.lessThan(5);
        expect(range.tickSpacing).to.be.greaterThan(1);
        expect(range.tickSpacing).to.be.lessThan(6);
    });
    
    it('createNiceRange: negative values (with ticks)', () => {
        const range = createNiceRange(-9, -1, 3);

        expect(range.min).to.be.lessThanOrEqual(-9);
        expect(range.max).to.be.greaterThanOrEqual(-1);
        expect(range.numTicks).to.be.greaterThan(1);
        expect(range.numTicks).to.be.lessThan(5);
        expect(range.tickSpacing).to.be.greaterThan(1);
        expect(range.tickSpacing).to.be.lessThan(6);
    });

    it('clamp', () => {
        expect(clamp(0.3, 0, 1)).to.equal(0.3);
        expect(clamp(-0.1, 0, 1)).to.equal(0);
        expect(clamp(1.3, 0, 1)).to.equal(1);
        expect(clamp(0.3, -1, 1)).to.equal(0.3);
        expect(clamp(-0.3, -1, 1)).to.equal(-0.3);
        expect(clamp(-1.3, -1, 1)).to.equal(-1);
        expect(clamp(1.3, -1, 1)).to.equal(1);
    });

    it('toInt', () => {
        expect(toInt(2.3)).to.equal(2);
        expect(toInt(2.8)).to.equal(2);
        expect(toInt(1)).to.equal(1);
        expect(toInt(-2.3)).to.equal(-2);
        expect(toInt(-2.9)).to.equal(-2);
    });

    it('toIntAndClamp', () => {
        expect(toIntAndClamp(2.3, 0, 10)).to.equal(2);
        expect(toIntAndClamp(2.8, 0, 10)).to.equal(2);
        expect(toIntAndClamp(2.8, -10, 10)).to.equal(2);
        expect(toIntAndClamp(-2.8, -10, 10)).to.equal(-2);
        expect(toIntAndClamp(1, 0, 10)).to.equal(1);
        expect(toIntAndClamp(-2.3, 0, 10)).to.equal(0);
        expect(toIntAndClamp(12.9, 0, 10)).to.equal(10);
    });

    it('toIntAndClampMin', () => {
        expect(toIntAndClampMin(2.3, 0)).to.equal(2);
        expect(toIntAndClampMin(2.8, 0)).to.equal(2);
        expect(toIntAndClampMin(2.8, -10)).to.equal(2);
        expect(toIntAndClampMin(-2.8, -10)).to.equal(-2);
        expect(toIntAndClampMin(1, 0)).to.equal(1);
        expect(toIntAndClampMin(-2.3, 0)).to.equal(0);
        expect(toIntAndClampMin(12.9, 0)).to.equal(12);
    });

    it('toIntAndClampMax', () => {
        expect(toIntAndClampMax(2.3, 10)).to.equal(2);
        expect(toIntAndClampMax(2.8, 10)).to.equal(2);
        expect(toIntAndClampMax(-2.8, 10)).to.equal(-2);
        expect(toIntAndClampMax(-2.8, -10)).to.equal(-10);
        expect(toIntAndClampMax(1, 10)).to.equal(1);
        expect(toIntAndClampMax(12.9, 10)).to.equal(10);
    });

    it('almostEqual', () => {
        expect(almostEqual(2.3, 2.3)).to.be.true;
        expect(almostEqual(2.3, 2.300000001)).to.be.false;
        expect(almostEqual(2.3 - 2.3, 0)).to.be.true;

        let value = 2.3;
        for(let i = 0; i < 1000; i++){
            value *= 0.1;
            value /= 0.1;
        }
        expect(almostEqual(2.3, value)).to.be.true;
        expect(almostEqual(2.3 - value, 0)).to.be.true;
    });


});

