import { expect } from 'chai';
import { createMinMaxPair, mergeMinMaxPairs } from '../../src';

describe('MinMaxPair', () => {

    describe('createMinMaxPair', () => {
        it('should initialize values correctly', () => {
            const pair = createMinMaxPair(1, 3);
            expect(pair.min).to.be.eq(1);
            expect(pair.max).to.be.eq(3);

            const pair2 = createMinMaxPair(-1, 3);
            expect(pair2.min).to.be.eq(-1);
            expect(pair2.max).to.be.eq(3);

            const pair3 = createMinMaxPair(-3, -1);
            expect(pair3.min).to.be.eq(-3);
            expect(pair3.max).to.be.eq(-1);
        });

        it('should trow if parameters have wrong order (min > max)', () => {
            expect(() => createMinMaxPair(3, 1)).to.throw;
            expect(() => createMinMaxPair(-1, -3)).to.throw;
        });
    })

    describe('mergeMinMaxPairs', () => {
        it('should set values correctly for a single input object', () => {
            const pair = createMinMaxPair(-1, 3);

            const result = mergeMinMaxPairs(pair);
            expect(result.min).to.be.eq(-1);
            expect(result.max).to.be.eq(3);
        });

        it('should set values correctly for multiple input objects', () => {
            const pairs = [
                createMinMaxPair(0, 3),
                createMinMaxPair(1, 4),
                createMinMaxPair(-2, 1),
            ]

            const result = mergeMinMaxPairs(...pairs);
            expect(result.min).to.be.eq(-2);
            expect(result.max).to.be.eq(4);
        });
    })
})