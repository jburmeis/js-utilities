import { expect } from 'chai';
import { createOptionalRange } from '../../src';

describe('OptionalRange', () => {

    describe('createOptionalRange', () => {
        it('should initialize with both values set', () => {
            const range = createOptionalRange(1, 3);
            expect(range.min).to.be.eq(1);
            expect(range.max).to.be.eq(3);
        });

        it('should throw with both values set in wrong order', () => {
            expect(() => createOptionalRange(3, 1)).to.throw;
        });

        it('should initialize with only min (max undefined)', () => {
            const range = createOptionalRange(1, undefined);
            expect(range.min).to.be.eq(1);
            expect(range.max).to.be.undefined;
        });

        it('should initialize with only min (max null)', () => {
            const range = createOptionalRange(1, null);
            expect(range.min).to.be.eq(1);
            expect(range.max).to.be.undefined;
        });

        it('should initialize with only max (min undefined)', () => {
            const range = createOptionalRange(undefined, 1);
            expect(range.min).to.be.undefined;
            expect(range.max).to.be.eq(1);
        });

        it('should initialize with only max (min null)', () => {
            const range = createOptionalRange(null, 1);
            expect(range.min).to.be.undefined;
            expect(range.max).to.be.eq(1);
        });

        it('should initialize with both null or undefined', () => {
            const range = createOptionalRange(null, undefined);
            expect(range.min).to.be.undefined;
            expect(range.max).to.be.undefined;
        });

    })

})