import { expect } from 'chai';
import { MinMaxPair, OptionalRange, matchesRange, matchesOptionalRange, RangeMatching } from '../../src';

describe('RangeUtils', () => {

    describe('matchRange', () => {
        it('should match correctly with MaxIncluded', () => {
            const range: MinMaxPair = { min: -2, max: 12};
            
            expect(matchesRange(3, range, RangeMatching.MaxIncluded)).to.be.true;
            expect(matchesRange(-2, range, RangeMatching.MaxIncluded)).to.be.true;
            expect(matchesRange(12, range, RangeMatching.MaxIncluded)).to.be.true;

            expect(matchesRange(-3, range)).to.be.false;
            expect(matchesRange(13, range)).to.be.false;
        });

        it('should match correctly with MaxExcluded', () => {
            const range: MinMaxPair = { min: -2, max: 12};
            
            expect(matchesRange(3, range, RangeMatching.MaxExcluded)).to.be.true;
            expect(matchesRange(-2, range, RangeMatching.MaxExcluded)).to.be.true;
            expect(matchesRange(11, range, RangeMatching.MaxExcluded)).to.be.true;
            
            expect(matchesRange(-3, range)).to.be.false;
            expect(matchesRange(12, range, RangeMatching.MaxExcluded)).to.be.false;
        });
    }),

    describe('matchesOptionalRange', () => {
        it('should match correctly with both min,max specified (with MaxIncluded)', () => {
            const range: OptionalRange = { min: -2, max: 12};
            
            expect(matchesOptionalRange(3, range, RangeMatching.MaxIncluded)).to.be.true;
            expect(matchesOptionalRange(-2, range, RangeMatching.MaxIncluded)).to.be.true;
            expect(matchesOptionalRange(12, range, RangeMatching.MaxIncluded)).to.be.true;

            expect(matchesOptionalRange(-3, range, RangeMatching.MaxIncluded)).to.be.false;
            expect(matchesOptionalRange(13, range, RangeMatching.MaxIncluded)).to.be.false;
        });

        it('should match correctly with both min,max specified (with MaxExcluded)', () => {
            const range: OptionalRange = { min: -2, max: 12};
            
            expect(matchesOptionalRange(3, range, RangeMatching.MaxExcluded)).to.be.true;
            expect(matchesOptionalRange(-2, range, RangeMatching.MaxExcluded)).to.be.true;
            expect(matchesOptionalRange(11, range, RangeMatching.MaxExcluded)).to.be.true;
            
            expect(matchesOptionalRange(-3, range)).to.be.false;
            expect(matchesOptionalRange(12, range, RangeMatching.MaxExcluded)).to.be.false;
        });

        it('should match correctly with only min specified', () => {
            const range: OptionalRange = { min: -2};
            
            expect(matchesOptionalRange(3, range, RangeMatching.MaxIncluded)).to.be.true;
            expect(matchesOptionalRange(-2, range, RangeMatching.MaxIncluded)).to.be.true;
            expect(matchesOptionalRange(-3, range, RangeMatching.MaxIncluded)).to.be.false;
        });

        it('should match correctly with only max specified  (with MaxIncluded)', () => {
            const range: OptionalRange = { max: -2};
            
            expect(matchesOptionalRange(-3, range, RangeMatching.MaxIncluded)).to.be.true;
            expect(matchesOptionalRange(-2, range, RangeMatching.MaxIncluded)).to.be.true;
            expect(matchesOptionalRange(-1, range, RangeMatching.MaxIncluded)).to.be.false;
            expect(matchesOptionalRange(5, range, RangeMatching.MaxIncluded)).to.be.false;
        });

        it('should match correctly with only max specified  (with MaxExcluded)', () => {
            const range: OptionalRange = { max: -2};
            
            expect(matchesOptionalRange(-3, range, RangeMatching.MaxExcluded)).to.be.true;
            expect(matchesOptionalRange(-2, range, RangeMatching.MaxExcluded)).to.be.false;
            expect(matchesOptionalRange(-1, range, RangeMatching.MaxExcluded)).to.be.false;
            expect(matchesOptionalRange(5, range, RangeMatching.MaxExcluded)).to.be.false;
        });

        it('should match correctly with nothing specified', () => {
            const range: OptionalRange = { };
            
            expect(matchesOptionalRange(3, range)).to.be.true;
            expect(matchesOptionalRange(-2, range)).to.be.true;
            expect(matchesOptionalRange(Number.NaN, range)).to.be.false;
        });

        it('should match correctly with undefined parameter specified', () => {
            expect(matchesOptionalRange(3, null)).to.be.true;
            expect(matchesOptionalRange(-2, undefined)).to.be.true;
            expect(matchesOptionalRange(Number.NaN, undefined)).to.be.false;
        });

    })

});