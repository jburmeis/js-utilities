
import { expect } from 'chai';
import { sampleBoolean, sampleNumber, sampleInteger, sampleDate, sampleObjects, sampleNormalDistribution } from '../../src/sampling/SamplingFunctions';

describe('SamplingFunctions', () => {

    const NUM_TESTS = 100;

    describe('sampleBoolean', () => {
        it('should be always true for propability = 1', () => {
            for(let i = 0; i < NUM_TESTS; i++){
                expect(sampleBoolean(1.0)).to.be.true;
            }
        });
        it('should be always false for propability = 0', () => {
            for(let i = 0; i < NUM_TESTS; i++){
                expect(sampleBoolean(0)).to.be.false;
            }
        });
    })

    describe('sampleNumber', () => {
        it('should always be in range', () => {
            for(let i = 0; i < NUM_TESTS; i++){
                const value = sampleNumber(-10, 10);
                expect(value).to.be.below(10).and.to.be.greaterThanOrEqual(-10);
            }
        });
    })

    describe('sampleInteger', () => {
        it('should always be in range', () => {
            for(let i = 0; i < NUM_TESTS; i++){
                const value = sampleInteger(-10, 10);
                expect(value).to.be.below(10).and.to.be.greaterThanOrEqual(-10);
            }
        });
        it('should always be integer', () => {
            for(let i = 0; i < NUM_TESTS; i++){
                const value = sampleInteger(-10, 10);
                expect(Number.isInteger(value)).to.be.true;
            }
        });
    })

    describe('sampleNormalDistribution', () => {
        // TODO: Not clear how to write meaningful, but also deterministic tests here
        it('should always be finite numbers', () => {
            for(let i = 0; i < NUM_TESTS; i++){
                const value = sampleNormalDistribution();
                expect(Number.isFinite(value)).to.be.true;
            }
        });
    })

    describe('sampleDate', () => {
        it('should always be in range', () => {
            for(let i = 0; i < NUM_TESTS; i++){
                const min = new Date(2020, 0,1);
                const max = new Date(2022, 0,1);
                const value = sampleDate(min, max);
                expect(value.getTime()).to.be.below(max.getTime()).and.to.be.greaterThanOrEqual(min.getTime());
            }
        });
    })

    describe('sampleObjects', () => {
        it('should always be in range', () => {
            const values = ["A", "B", "C", "D", "E", "F"];
            for (let i = 0; i < NUM_TESTS; i++) {
                expect(values.includes(sampleObjects(...values))).to.be.true;
            }
        });
        it('should throw for empty input', () => {
            expect(() => sampleObjects()).to.throw();
        });
    })

});

