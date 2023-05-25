import { expect } from 'chai';
import { 
    createMinMaxPair, 
    HistogramBinScaling, 
    HistogramBinEstimators, 
    NumericHistogram, 
} from '../../src';

describe('NumericHistogram', () => {
    // Precision of floating point comparisions
    const floatingPointDelta = 0.000001;

    // (0-2) 5
    // (2-4) 4
    // (4-6) 3
    // (6-8) 2
    // (8-10) 6

    // (1 - 2.6) 8
    // (2.6 - 4.2) 3
    // (4.2 - 5.8) 1
    // (5.8 - 7.4) 2
    // (7.4 - 9) 6
    const TEST_INPUT_VALUES = [
        1, 4, 2, 8, 9, 9, 6, 8, 4, 1, 
        1.1, 1.3, 2.6, 5.4, 6.2, 1.7, 2.3, 8.1, 8.2, 2.0
    ];

    const TEST_INPUT_VALUES_WITH_UNDEFINED = [
        1, 4, 2, 8, 9, 9, 6, 8, 4, 1, null,
        1.1, 1.3, 2.6, 5.4, 6.2, 1.7, 2.3, 8.1, 8.2, 2.0, undefined
    ];

    it('createFromRange (normal ints)', () => {
        const histogram = NumericHistogram.createFromRange(-2, 2).withNumBins(2).withNiceRanges(false).build();

        expect(histogram.getNumBins()).to.be.eq(2);
        expect(histogram.getNumDataPoints()).to.be.eq(0);
        expect(histogram.getMin()).to.be.eq(-2);
        expect(histogram.getMax()).to.be.eq(2);
        expect(histogram.getBinExtents(0)).to.be.eql({min: -2, max: 0});
        expect(histogram.getBinExtents(1)).to.be.eql({min: 0, max: 2});
    });

    it('createFromRange (normal float)', () => {
        const histogram = NumericHistogram.createFromRange(1.1, 12.3).withNumBins(4).withNiceRanges(false).build();

        expect(histogram.getNumBins()).to.be.eq(4);
        expect(histogram.getNumDataPoints()).to.be.eq(0);
        expect(histogram.getMin()).to.be.eq(1.1);
        expect(histogram.getMax()).to.be.eq(12.3);
    });

    it('createFromRange (normal zero range)', () => {
        const histogram = NumericHistogram.createFromRange(1, 1).withNumBins(3).withNiceRanges(false).build();
        histogram.add(1);
        histogram.add(1);

        expect(histogram.getNumBins()).to.be.eq(1);
        expect(histogram.getNumDataPoints()).to.be.eq(2);
        expect(histogram.getMin()).to.be.eq(1);
        expect(histogram.getMax()).to.be.eq(1);
        expect(histogram.getBinExtents(0)).to.be.eql({min: 1, max: 1});
    });

    it('createFromRange (nice ints)', () => {
        const histogram = NumericHistogram.createFromRange(-2, 2).withNumBins(3).withNiceRanges().build();

        expect(histogram.getNumBins()).to.be.greaterThan(1);
        expect(histogram.getNumBins()).to.be.lessThanOrEqual(4);
        expect(histogram.getNumDataPoints()).to.be.eq(0);
        expect(histogram.getMin()).to.be.eq(-2);
        expect(histogram.getMax()).to.be.eq(2);
    });

    it('createFromRange (nice floats)', () => {
        const histogram = NumericHistogram.createFromRange(1.1, 12.3).withNumBins(4).withNiceRanges().build();

        expect(histogram.getNumBins()).to.be.greaterThan(2);
        expect(histogram.getNumBins()).to.be.lessThanOrEqual(5);
        expect(histogram.getNumDataPoints()).to.be.eq(0);
        expect(histogram.getMin()).to.be.lessThanOrEqual(1.1);
        expect(histogram.getMax()).to.be.greaterThanOrEqual(12.3);
    });

    it('createFromRange (nice zero range)', () => {
        const histogram = NumericHistogram.createFromRange(1, 1).withNumBins(3).withNiceRanges().build();
        histogram.add(1);
        histogram.add(1);

        expect(histogram.getNumBins()).to.be.eq(1);
        expect(histogram.getNumDataPoints()).to.be.eq(2);
        expect(histogram.getMin()).to.be.eq(1);
        expect(histogram.getMax()).to.be.eq(1);
    });

    it('createFromData (normal)', () => {
        const histogram = NumericHistogram.createFromData(TEST_INPUT_VALUES).withNumBins(3).withNiceRanges(false).build();

        expect(histogram.getNumBins()).to.be.eq(3);
        expect(histogram.getNumDataPoints()).to.be.eq(20);
        expect(histogram.getMin()).to.be.eq(1);
        expect(histogram.getMax()).to.be.eq(9);
    });

    it('createFromData (normal, with estimator)', () => {
        const histogram = NumericHistogram.createFromData(TEST_INPUT_VALUES).withBinEstimator(HistogramBinEstimators.SquareRoot).withNiceRanges(false).build();

        expect(histogram.getNumBins()).to.be.eq(5);
        expect(histogram.getNumDataPoints()).to.be.eq(20);
        expect(histogram.getMin()).to.be.eq(1);
        expect(histogram.getMax()).to.be.eq(9);
    });

    it('createFromData (nice)', () => {
        const histogram = NumericHistogram.createFromData(TEST_INPUT_VALUES).withNumBins(3).withNiceRanges(true).build();

        expect(histogram.getNumBins()).to.be.greaterThanOrEqual(2);        
        expect(histogram.getNumBins()).to.be.lessThan(5);
        expect(histogram.getNumDataPoints()).to.be.eq(20);
        expect(histogram.getMin()).to.be.lessThanOrEqual(1)
        expect(histogram.getMax()).to.be.greaterThanOrEqual(9);
    });

    it('createFromData (normal, with estimator)', () => {
        const histogram = NumericHistogram.createFromData(TEST_INPUT_VALUES).withBinEstimator(HistogramBinEstimators.SquareRoot).withNiceRanges(true).build();

        expect(histogram.getNumBins()).to.be.greaterThanOrEqual(3);        
        expect(histogram.getNumBins()).to.be.lessThan(6);
        expect(histogram.getNumDataPoints()).to.be.eq(20);
        expect(histogram.getMin()).to.be.lessThanOrEqual(1)
        expect(histogram.getMax()).to.be.greaterThanOrEqual(9);
    });

    it('createFromData (normal, with undefined)', () => {
        const histogram = NumericHistogram.createFromData(TEST_INPUT_VALUES_WITH_UNDEFINED).withNumBins(3).withNiceRanges(false).build();

        expect(histogram.getNumBins()).to.be.eq(3);
        expect(histogram.getNumDataPoints()).to.be.eq(20);
        expect(histogram.getNumUndefined()).to.be.eq(2);
        expect(histogram.getMin()).to.be.eq(1);
        expect(histogram.getMax()).to.be.eq(9);
    });

    it('createFromData (normal, comparison with undefined, based on bug)', () => {
        const TEST_INPUT = [1,2,3,4,5,6,7,8,9];
        const TEST_INPUT_UNDEFINED = [1,2,3,4,5,6,7,8,9, undefined];

        const histogram1= NumericHistogram.createFromData(TEST_INPUT).build();
        const histogram2 = NumericHistogram.createFromData(TEST_INPUT_UNDEFINED).build();

        expect(histogram1.getNumBins()).to.be.eq(histogram2.getNumBins());
        expect(histogram1.getNumDataPoints()).to.be.eq(histogram2.getNumDataPoints());
        expect(histogram1.getMin()).to.be.eq(histogram2.getMin());
        expect(histogram1.getMax()).to.be.eq(histogram2.getMax());
    });

    it('createFromRangePair', () => {
        const histogram = NumericHistogram.createFromRange(-2, 2).withNumBins(2).withNiceRanges(false).build();
        const histogram2 = NumericHistogram.createFromRangePair(createMinMaxPair(-2, 2)).withNumBins(2).withNiceRanges(false).build();

        expect(histogram.getNumBins()).to.be.eq(histogram2.getNumBins());
        expect(histogram.getMin()).to.be.eq(histogram2.getMin());
        expect(histogram.getMax()).to.be.eq(histogram2.getMax());
    });

    it('createFromPredefinedBins', () => {
        const histogram = NumericHistogram.createFromPredefinedBins(0, 10, [4,8]);

        expect(histogram.getNumBins()).to.be.eq(3);        
        expect(histogram.getNumDataPoints()).to.be.eq(0);
        expect(histogram.getBinExtents(0)).to.be.eql({min: 0, max: 4});
        expect(histogram.getBinExtents(1)).to.be.eql({min: 4, max: 8});
        expect(histogram.getBinExtents(2)).to.be.eql({min: 8, max: 10});
        expect(histogram.getMin()).to.be.eq(0)
        expect(histogram.getMax()).to.be.eq(10);
    });

    it('createFromPredefinedBins (invalid min, max)', () => {
        expect(() => NumericHistogram.createFromPredefinedBins(10, 0, [4,8])).to.throw();
    });

    it('createFromPredefinedBins (invalid bin value, too large)', () => {
        expect(() => NumericHistogram.createFromPredefinedBins(0, 10, [4,12])).to.throw();
    });

    it('createFromPredefinedBins (invalid bin value, too small)', () => {
        expect(() => NumericHistogram.createFromPredefinedBins(5, 10, [4,8])).to.throw();
    });

    it('createFromPredefinedBins (invalid bin value order)', () => {
        expect(() => NumericHistogram.createFromPredefinedBins(0, 10, [2, 6, 4])).to.throw();
    });

    it('add', () => {
        const histogram = NumericHistogram.createFromRange(0, 10).withNumBins(5).withNiceRanges(false).build();
        TEST_INPUT_VALUES.forEach(value => histogram.add(value));
        expect(histogram.getNumDataPoints()).to.be.eq(20);
        expect(histogram.getNumUndefined()).to.be.eq(0);
        expect(histogram.getRatioUndefined()).to.be.eq(0);
        expect(histogram.getBinArray()).to.have.same.ordered.members([5, 4, 3, 2, 6])
    });

    it('add (with null, undefined)', () => {
        const histogram = NumericHistogram.createFromRange(0, 10).withNumBins(5).withNiceRanges(false).build();
        histogram.add(undefined);
        TEST_INPUT_VALUES.forEach(value => histogram.add(value));
        histogram.add(null);

        expect(histogram.getNumDataPoints()).to.be.eq(20);
        expect(histogram.getNumUndefined()).to.be.eq(2);
        expect(histogram.getRatioUndefined()).to.be.eq(2 / 20);
        expect(histogram.getBinArray()).to.have.same.ordered.members([5, 4, 3, 2, 6])
    });

    it('add (with null, undefined not accepted)', () => {
        const histogram = NumericHistogram.createFromRange(0, 10).withNumBins(5).withNiceRanges(false).withAcceptUndefined(false).build();
        TEST_INPUT_VALUES.forEach(value => histogram.add(value));
        
        expect(() => histogram.add(undefined)).to.throw();
        expect(() => histogram.add(null)).to.throw();
    });

    it('addAll', () => {
        const histogram = NumericHistogram.createFromRange(0, 10).withNumBins(5).withNiceRanges(false).build();
        histogram.addAll(TEST_INPUT_VALUES);

        expect(histogram.getNumDataPoints()).to.be.eq(20);
        expect(histogram.getBinArray()).to.have.same.ordered.members([5, 4, 3, 2, 6])
    });

    it('addAll (with undefined)', () => {
        const histogram = NumericHistogram.createFromRange(0, 10).withNumBins(5).withNiceRanges(false).build();
        histogram.addAll(TEST_INPUT_VALUES_WITH_UNDEFINED);

        expect(histogram.getNumDataPoints()).to.be.eq(20);
        expect(histogram.getNumUndefined()).to.be.eq(2);
        expect(histogram.getRatioUndefined()).to.be.eq(2 / 20);
        expect(histogram.getBinArray()).to.have.same.ordered.members([5, 4, 3, 2, 6])
    });

    it('add from constructor', () => {
        const histogram = NumericHistogram.createFromData(TEST_INPUT_VALUES).withNumBins(5).withNiceRanges(false).build();

        expect(histogram.getNumDataPoints()).to.be.eq(20);
        expect(histogram.getBinArray()).to.have.same.ordered.members([8, 3, 1, 2, 6])
    });

    it('addFromObject', () => {
        const histogram = NumericHistogram.createFromRange(0, 10).withNumBins(5).withNiceRanges(false).build();
        TEST_INPUT_VALUES.forEach(value => histogram.addFromObject({key: value, key2: 2}, "key"));

        expect(histogram.getNumDataPoints()).to.be.eq(20);
        expect(histogram.getBinArray()).to.have.same.ordered.members([5, 4, 3, 2, 6])
    });

    it('addAllFromObjects', () => {
        const histogram = NumericHistogram.createFromRange(0, 10).withNumBins(5).withNiceRanges(false).build();
        const inputObjects = TEST_INPUT_VALUES.map(value => ({key: value, key2: 2}));
        histogram.addAllFromObjects(inputObjects, "key");

        expect(histogram.getNumDataPoints()).to.be.eq(20);
        expect(histogram.getBinArray()).to.have.same.ordered.members([5, 4, 3, 2, 6])
    });

    it('getBinExtents (equal size)', () => {
        const histogram = NumericHistogram.createFromRange(0, 10).withNumBins(5).build();

        expect(histogram.getNumBins()).to.be.eq(5);
        expect(histogram.getBinExtents(0)).to.be.eql({min: 0, max: 2});
        expect(histogram.getBinExtents(1)).to.be.eql({min: 2, max: 4});
        expect(histogram.getBinExtents(2)).to.be.eql({min: 4, max: 6});
        expect(histogram.getBinExtents(3)).to.be.eql({min: 6, max: 8});
        expect(histogram.getBinExtents(4)).to.be.eql({min: 8, max: 10});
    });

    it('getBinName (equal size)', () => {
        const histogram = NumericHistogram.createFromRange(0, 10).withNumBins(5).build();

        expect(histogram.getBinName(0)).to.be.eql("0 - 2");
        expect(histogram.getBinName(1)).to.be.eql("2 - 4");
        expect(histogram.getBinName(2)).to.be.eql("4 - 6");
        expect(histogram.getBinName(3)).to.be.eql("6 - 8");
        expect(histogram.getBinName(4)).to.be.eql("8 - 10");
    });

    it('getBinArray', () => {
        const histogram = NumericHistogram.createFromRange(0, 10).withNumBins(5).withNiceRanges(false).build();
        histogram.addAll(TEST_INPUT_VALUES);

        expect(histogram.getBinArray()).to.have.same.ordered.members([5, 4, 3, 2, 6])
    });

    it('getBinArray (empty)', () => {
        const histogram = NumericHistogram.createFromRange(0, 10).withNumBins(5).withNiceRanges(false).build();
        expect(histogram.getBinArray()).to.have.same.ordered.members([0, 0, 0, 0, 0])
    });

    it('getBinArrayScaled (ByNumDatapoints)', () => {
        const histogram = NumericHistogram.createFromRange(0, 10).withNumBins(5).withNiceRanges(false).build();
        histogram.addAll(TEST_INPUT_VALUES);

        const binArray = histogram.getBinArrayScaled(HistogramBinScaling.ByNumDatapoints);
        expect(binArray[0]).to.be.approximately(5 / 20, floatingPointDelta);
        expect(binArray[1]).to.be.approximately(4 / 20, floatingPointDelta);
        expect(binArray[2]).to.be.approximately(3 / 20, floatingPointDelta);
        expect(binArray[3]).to.be.approximately(2 / 20, floatingPointDelta);
        expect(binArray[4]).to.be.approximately(6 / 20, floatingPointDelta);
    });

    it('getBinArrayScaled (ByNumDatapoints, empty)', () => {
        const histogram = NumericHistogram.createFromRange(0, 10).withNumBins(5).withNiceRanges(false).build();
        const binArray = histogram.getBinArrayScaled(HistogramBinScaling.ByNumDatapoints);
        expect(binArray).to.have.same.ordered.members([0, 0, 0, 0, 0])
    });

    it('getBinArrayScaled (ByMaxBinSize)', () => {
        const histogram = NumericHistogram.createFromRange(0, 10).withNumBins(5).withNiceRanges(false).build();
        histogram.addAll(TEST_INPUT_VALUES);

        const binArray = histogram.getBinArrayScaled(HistogramBinScaling.ByMaxBinSize);
        expect(binArray[0]).to.be.approximately(5 / 6, floatingPointDelta);
        expect(binArray[1]).to.be.approximately(4 / 6, floatingPointDelta);
        expect(binArray[2]).to.be.approximately(3 / 6, floatingPointDelta);
        expect(binArray[3]).to.be.approximately(2 / 6, floatingPointDelta);
        expect(binArray[4]).to.be.approximately(6 / 6, floatingPointDelta);
    });

    it('getBinArrayScaled (ByMaxBinSize, empty)', () => {
        const histogram = NumericHistogram.createFromRange(0, 10).withNumBins(5).withNiceRanges(false).build();
        const binArray = histogram.getBinArrayScaled(HistogramBinScaling.ByMaxBinSize);
        expect(binArray).to.have.same.ordered.members([0, 0, 0, 0, 0])
    });


    it('getBins (ByNumDatapoints)', () => {
        const histogram = NumericHistogram.createFromRange(0, 10).withNumBins(5).withNiceRanges(false).build();
        histogram.addAll(TEST_INPUT_VALUES);

        const expectedBinSizes = [5, 4, 3, 2, 6];
        
        const bins = histogram.getBins(HistogramBinScaling.ByNumDatapoints);
        for (let i = 0; i < 5; i++) {
            expect(bins[i].key).to.be.eq(`${i * 2} - ${(i + 1) * 2}`);
            expect(bins[i].size).to.be.eq(expectedBinSizes[i]);
            expect(bins[i].scaledSize).to.be.approximately(expectedBinSizes[i] / 20, floatingPointDelta);
            expect(bins[i].extent).to.be.deep.eq({ min: i * 2, max: (i + 1) * 2 });
        }
    });

    it('getBins (ByMaxBinSize)', () => {
        const histogram = NumericHistogram.createFromRange(0, 10).withNumBins(5).withNiceRanges(false).build();
        histogram.addAll(TEST_INPUT_VALUES);

        const expectedBinSizes = [5, 4, 3, 2, 6];
        
        const bins = histogram.getBins(HistogramBinScaling.ByMaxBinSize);
        for (let i = 0; i < 5; i++) {
            expect(bins[i].key).to.be.eq(`${i * 2} - ${(i + 1) * 2}`);
            expect(bins[i].size).to.be.eq(expectedBinSizes[i]);
            expect(bins[i].scaledSize).to.be.approximately(expectedBinSizes[i] / 6, floatingPointDelta);
            expect(bins[i].extent).to.be.deep.eq({ min: i * 2, max: (i + 1) * 2 });
        }
    });

});