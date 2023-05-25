import { expect } from 'chai';
import { IntegerHistogram } from '../../src';

const TEST_INPUT_VALUES = [
    1, 3, 5, 2,
    2, 1, 2, 6,
];

const TEST_INPUT_VALUES_WITH_UNDEFINED = [
    1, 3, 5, 2, undefined,
    2, 1, 2, 6, null,
];

const TEST_RESULT_BINS = [
    {key: "1", intKey: 1, size: 2, scaledSize: 2 / 8 },
    {key: "2", intKey: 2, size: 3, scaledSize: 3 / 8 },
    {key: "3", intKey: 3, size: 1, scaledSize: 1 / 8 },
    {key: "5", intKey: 5, size: 1, scaledSize: 1 / 8 },
    {key: "6", intKey: 6, size: 1, scaledSize: 1 / 8 },
]

describe('IntegerHistogram', () => {

    describe('constructor (createEmpty)', () => {
        it('should initialize everything empty', () => {
            const histogram = IntegerHistogram.createEmpty();

            expect(histogram.getNumBins()).to.be.eq(0);
            expect(histogram.getNumDataPoints()).to.be.eq(0);
            expect(histogram.getNumUndefined()).to.be.eq(0);
            expect(histogram.getValue(0)).to.be.eq(0);
            expect(histogram.getBins()).to.be.empty;
        });

        it('should throw if accepted range is defined', () => {
            const histogram = IntegerHistogram.createEmpty({acceptedRange: {min: 1, max: 3}});

            expect(() => histogram.add(0)).to.throw();
            expect(() => histogram.add(4)).to.throw();
            expect(() => histogram.add(1)).to.not.throw();
            expect(() => histogram.add(3)).to.not.throw();
        });

        it('should throw on null or undefined if defined', () => {
            const histogram = IntegerHistogram.createEmpty({acceptUndefined: false});

            expect(() => histogram.add(0)).to.not.throw();
            expect(() => histogram.add(null)).to.throw();
            expect(() => histogram.add(undefined)).to.throw();
        });

    })

    describe('constructor (createFromData)', () => {
        it('should initialize everything correctly', () => {
            const histogram = IntegerHistogram.createFromData(TEST_INPUT_VALUES);

            expect(histogram.getNumBins()).to.be.eq(5);
            expect(histogram.getNumDataPoints()).to.be.eq(8);
            expect(histogram.getNumUndefined()).to.be.eq(0);
            expect(histogram.getBins()).to.have.same.deep.members(TEST_RESULT_BINS);
        });
    })

    describe('constructor (createWithPredefinedRange)', () => {
        it('should initialize everything empty', () => {
            const histogram = IntegerHistogram.createWithPredefinedRange({min: 0, max: 3});

            expect(histogram.getNumBins()).to.be.eq(0);
            expect(histogram.getNumDataPoints()).to.be.eq(0);
            expect(histogram.getNumUndefined()).to.be.eq(0);
        });
    })

    describe('constructor (createWithPredefinedLockedRange)', () => {
        it('should initialize everything empty', () => {
            const histogram = IntegerHistogram.createWithPredefinedLockedRange({min: 0, max: 3});

            expect(histogram.getNumBins()).to.be.eq(0);
            expect(histogram.getNumDataPoints()).to.be.eq(0);
            expect(histogram.getNumUndefined()).to.be.eq(0);
        });

        it('should throw out of range', () => {
            const histogram = IntegerHistogram.createWithPredefinedLockedRange({min: 1, max: 3});

            expect(() => histogram.add(0)).to.throw();
            expect(() => histogram.add(4)).to.throw();
            expect(() => histogram.add(1)).to.not.throw();
            expect(() => histogram.add(3)).to.not.throw();
        });
    })

    describe('add', () => {
        it('should work with non-undefined values', () => {
            const histogram = IntegerHistogram.createEmpty();
            TEST_INPUT_VALUES.forEach(input => histogram.add(input));

            expect(histogram.getNumBins()).to.be.eq(5);
            expect(histogram.getNumDataPoints()).to.be.eq(8);
            expect(histogram.getNumUndefined()).to.be.eq(0);
            expect(histogram.getRatioUndefined()).to.be.eq(0);
            expect(histogram.getBins()).to.have.same.deep.members(TEST_RESULT_BINS);
        });

        it('should work with null and undefined values', () => {
            const histogram = IntegerHistogram.createEmpty();
            TEST_INPUT_VALUES_WITH_UNDEFINED.forEach(input => histogram.add(input));

            expect(histogram.getNumBins()).to.be.eq(5);
            expect(histogram.getNumDataPoints()).to.be.eq(8);
            expect(histogram.getNumUndefined()).to.be.eq(2);
            expect(histogram.getRatioUndefined()).to.be.eq(2 / 8);
            expect(histogram.getBins()).to.have.same.deep.members(TEST_RESULT_BINS);
        });

        it('should throw with null and undefined values not accepted', () => {
            const histogram = IntegerHistogram.createEmpty({acceptUndefined: false});

            expect(() => histogram.add(3)).to.not.throw();
            expect(() => histogram.add(null)).to.throw();
            expect(() => histogram.add(undefined)).to.throw();
            expect(() => histogram.add(2)).to.not.throw();
        });
    })

})
