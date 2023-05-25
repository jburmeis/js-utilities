import { expect } from 'chai';
import { HistogramBinScaling, NumericSegmentHistogram } from '../../src';

    const TEST_SEGMENTS = [
        {key: "A", min: 0, max: 5},
        {key: "B", min: 4, max: 8.2},
        {key: "C", min: null, max: 0},
        {key: "D", min: 5, max: null},
    ]

    const TEST_RESULT_BINS_INIT = [
        {key: "A", extent: {min: 0, max: 5 }, size: 0, scaledSize: 0 },
        {key: "B", extent: {min: 4, max: 8.2 }, size: 0, scaledSize: 0 },
        {key: "C", extent: {min: null, max: 0 }, size: 0, scaledSize: 0 },
        {key: "D", extent: {min: 5, max: null }, size: 0, scaledSize: 0 },
    ]

    const TEST_RESULT_BINS_SCALED_BY_POINTS = [
        {key: "A", extent: {min: 0, max: 5 }, size: 11, scaledSize: 11/22 },
        {key: "B", extent: {min: 4, max: 8.2 }, size: 8, scaledSize: 8/22 },
        {key: "C", extent: {min: null, max: 0 }, size: 2, scaledSize: 2/22 },
        {key: "D", extent: {min: 5, max: null }, size: 9, scaledSize: 9/22 },
    ]

    const TEST_RESULT_BINS_DOUBLED_SCALED_BY_POINTS = [
        {key: "A", extent: {min: 0, max: 5 }, size: 22, scaledSize: 22/44 },
        {key: "B", extent: {min: 4, max: 8.2 }, size: 16, scaledSize: 16/44 },
        {key: "C", extent: {min: null, max: 0 }, size: 4, scaledSize: 4/44 },
        {key: "D", extent: {min: 5, max: null }, size: 18, scaledSize: 18/44 },
    ]

    const TEST_RESULT_BINS_SCALED_BY_BINS = [
        {key: "A", extent: {min: 0, max: 5 }, size: 11, scaledSize: 11/11 },
        {key: "B", extent: {min: 4, max: 8.2 }, size: 8, scaledSize: 8/11 },
        {key: "C", extent: {min: null, max: 0 }, size: 2, scaledSize: 2/11 },
        {key: "D", extent: {min: 5, max: null }, size: 9, scaledSize: 9/11 },
    ]

    const TEST_RESULT_BINS_SORTED_DESC_BY_SIZE = [
        {key: "A", extent: {min: 0, max: 5 }, size: 11, scaledSize: 11/22 },
        {key: "D", extent: {min: 5, max: null }, size: 9, scaledSize: 9/22 },
        {key: "B", extent: {min: 4, max: 8.2 }, size: 8, scaledSize: 8/22 },
        {key: "C", extent: {min: null, max: 0 }, size: 2, scaledSize: 2/22 },
    ]

    const TEST_INPUT_VALUES = [
        1, 4, 2, 8, 9, 9, 6, 8, -5, 4, 1, -3, 
        1.1, 1.3, 2.6, 5.4, 6.2, 1.7, 2.3, 8.1, 8.2, 2.0
    ];

describe('NumericSegmentHistogram', () => {

    it('createFromSegments', () => {
        const histogram = NumericSegmentHistogram.createFromSegments(TEST_SEGMENTS);

        expect(histogram.getNumBins()).to.be.eq(4);
        expect(histogram.getNumDataPoints()).to.be.eq(0);
        expect(histogram.getNumUndefined()).to.be.eq(0);
        expect(histogram.getNumOutliers()).to.be.eq(0);

        expect(histogram.getBins()).to.have.same.deep.members(TEST_RESULT_BINS_INIT);
    });

    it('createWithBuilder (single segments)', () => {
        const histogram = NumericSegmentHistogram.createWithBuilder()
        .withSegment(TEST_SEGMENTS[0].key, TEST_SEGMENTS[0].min, TEST_SEGMENTS[0].max)
        .withSegment(TEST_SEGMENTS[1].key, TEST_SEGMENTS[1].min, TEST_SEGMENTS[1].max)
        .withSegment(TEST_SEGMENTS[2].key, TEST_SEGMENTS[2].min, TEST_SEGMENTS[2].max)
        .withSegment(TEST_SEGMENTS[3].key, TEST_SEGMENTS[3].min, TEST_SEGMENTS[3].max)
        .build();

        expect(histogram.getNumBins()).to.be.eq(4);
        expect(histogram.getNumDataPoints()).to.be.eq(0);
        expect(histogram.getNumUndefined()).to.be.eq(0);
        expect(histogram.getNumOutliers()).to.be.eq(0);
        expect(histogram.getBins()).to.have.same.deep.members(TEST_RESULT_BINS_INIT);
    });

    it('createWithBuilder (segments list)', () => {
        const histogram = NumericSegmentHistogram.createWithBuilder()
        .withSegments(TEST_SEGMENTS)
        .build();

        expect(histogram.getNumBins()).to.be.eq(4);
        expect(histogram.getNumDataPoints()).to.be.eq(0);
        expect(histogram.getNumUndefined()).to.be.eq(0);
        expect(histogram.getNumOutliers()).to.be.eq(0);
        expect(histogram.getBins()).to.have.same.deep.members(TEST_RESULT_BINS_INIT);
    });

    it('add', () => {
        const histogram = NumericSegmentHistogram.createFromSegments(TEST_SEGMENTS);
        TEST_INPUT_VALUES.forEach(value => histogram.add(value));
        expect(histogram.getNumDataPoints()).to.be.eq(22);
        expect(histogram.getNumUndefined()).to.be.eq(0);
        expect(histogram.getRatioUndefined()).to.be.eq(0);
        expect(histogram.getNumOutliers()).to.be.eq(0);
        expect(histogram.getRatioOutliers()).to.be.eq(0);
        expect(histogram.getBins()).to.have.same.deep.members(TEST_RESULT_BINS_SCALED_BY_POINTS);
    });

    it('add (with null, undefined)', () => {
        const histogram = NumericSegmentHistogram.createFromSegments(TEST_SEGMENTS);
        histogram.add(undefined);
        TEST_INPUT_VALUES.forEach(value => histogram.add(value));
        histogram.add(null);

        expect(histogram.getNumDataPoints()).to.be.eq(22);
        expect(histogram.getNumUndefined()).to.be.eq(2);
        expect(histogram.getRatioUndefined()).to.be.eq(2 / 22);
        expect(histogram.getNumOutliers()).to.be.eq(0);
        expect(histogram.getRatioOutliers()).to.be.eq(0);
        expect(histogram.getBins()).to.have.same.deep.members(TEST_RESULT_BINS_SCALED_BY_POINTS);
    });

    it('add (with null, undefined not accepted)', () => {
        const histogram = NumericSegmentHistogram.createWithBuilder()
        .withSegments(TEST_SEGMENTS)
        .withAcceptUndefined(false)
        .build();
        
        TEST_INPUT_VALUES.forEach(value => histogram.add(value));
        expect(() => histogram.add(undefined)).to.throw();
        expect(() => histogram.add(null)).to.throw();
    });

    it('add (with outliers)', () => {
        const histogram = NumericSegmentHistogram.createWithBuilder()
        .withSegment("A", 0, 4)
        .withSegment("B", 6, 8)
        .build();

        histogram.addAll([0, 3, 2, 1, 4, 5, 7, 6]);

        expect(histogram.getNumDataPoints()).to.be.eq(6);
        expect(histogram.getNumUndefined()).to.be.eq(0);
        expect(histogram.getRatioUndefined()).to.be.eq(0);
        expect(histogram.getNumOutliers()).to.be.eq(2);
        expect(histogram.getRatioOutliers()).to.be.eq(2 / 6);
        expect(histogram.getBins()).to.have.same.deep.members([
            {key: "A", extent: {min: 0, max: 4}, size: 4, scaledSize: 4/6},
            {key: "B", extent: {min: 6, max: 8}, size: 2, scaledSize: 2/6},
        ]);
    });

    it('add (with undefined not accepted)', () => {
        const histogram = NumericSegmentHistogram.createWithBuilder()
        .withSegment("A", 0, 4)
        .withSegment("B", 6, 8)
        .withAcceptOutliers(false)
        .build();

        expect(() => histogram.add(4)).to.throw();
        expect(() => histogram.add(5)).to.throw();
    });

    it('add (with single-value bins)', () => {
        const histogram = NumericSegmentHistogram.createFromSegments([
            {key: "0", min: 0, max: 1},
            {key: "1", min: 1, max: 2},
            {key: "2", min: 2, max: 3},
            {key: "3", min: 3, max: 4},
        ]);
        [1,3,2,0,1,0,2,1].forEach(value => histogram.add(value));
        expect(histogram.getNumDataPoints()).to.be.eq(8);
        expect(histogram.getNumUndefined()).to.be.eq(0);
        expect(histogram.getRatioUndefined()).to.be.eq(0);
        expect(histogram.getNumOutliers()).to.be.eq(0);
        expect(histogram.getRatioOutliers()).to.be.eq(0);
        expect(histogram.getBins()).to.have.same.deep.members([
            {key: "0", extent: {min: 0, max: 1 }, size: 2, scaledSize: 2/8 },
            {key: "1", extent: {min: 1, max: 2 }, size: 3, scaledSize: 3/8 },
            {key: "2", extent: {min: 2, max: 3 }, size: 2, scaledSize: 2/8 },
            {key: "3", extent: {min: 3, max: 4 }, size: 1, scaledSize: 1/8 },
        ]);
    });

    it('addMultiple', () => {
        const histogram = NumericSegmentHistogram.createFromSegments(TEST_SEGMENTS);
        TEST_INPUT_VALUES.forEach(value => histogram.addMultiple(value, 2));
        histogram.addMultiple(null, 3);
        expect(histogram.getNumDataPoints()).to.be.eq(44);
        expect(histogram.getNumUndefined()).to.be.eq(3);
        expect(histogram.getRatioUndefined()).to.be.eq(3 / 44);
        expect(histogram.getNumOutliers()).to.be.eq(0);
        expect(histogram.getRatioOutliers()).to.be.eq(0);
        expect(histogram.getBins()).to.have.same.deep.members(TEST_RESULT_BINS_DOUBLED_SCALED_BY_POINTS);
    });

    it('addAll', () => {
        const histogram = NumericSegmentHistogram.createFromSegments(TEST_SEGMENTS);
        histogram.addAll(TEST_INPUT_VALUES);
        
        expect(histogram.getNumDataPoints()).to.be.eq(22);
        expect(histogram.getBins()).to.have.same.deep.members(TEST_RESULT_BINS_SCALED_BY_POINTS);
    });

    it('addFromObject', () => {
        const histogram = NumericSegmentHistogram.createFromSegments(TEST_SEGMENTS);
        TEST_INPUT_VALUES.forEach(value => histogram.addFromObject({key: value, key2: 2}, "key"));

        expect(histogram.getNumDataPoints()).to.be.eq(22);
        expect(histogram.getBins()).to.have.same.deep.members(TEST_RESULT_BINS_SCALED_BY_POINTS);
    });

    it('addAllFromObjects', () => {
        const histogram = NumericSegmentHistogram.createFromSegments(TEST_SEGMENTS);
        const inputObjects = TEST_INPUT_VALUES.map(value => ({key: value, key2: 2}));
        histogram.addAllFromObjects(inputObjects, "key");

        expect(histogram.getNumDataPoints()).to.be.eq(22);
        expect(histogram.getBins()).to.have.same.deep.members(TEST_RESULT_BINS_SCALED_BY_POINTS);
    });

    it('getBins (ByNumDatapoints)', () => {
        const histogram = NumericSegmentHistogram
            .createFromSegments(TEST_SEGMENTS)
            .addAll(TEST_INPUT_VALUES);
        
        const bins = histogram.getBins(HistogramBinScaling.ByNumDatapoints);
        expect(bins).to.have.same.deep.members(TEST_RESULT_BINS_SCALED_BY_POINTS);
    });

    it('getBins (ByMaxBinSize)', () => {
        const histogram = NumericSegmentHistogram
            .createFromSegments(TEST_SEGMENTS)
            .addAll(TEST_INPUT_VALUES);
        
        const bins = histogram.getBins(HistogramBinScaling.ByMaxBinSize);
        expect(bins).to.have.same.deep.members(TEST_RESULT_BINS_SCALED_BY_BINS);
    });

    it('getBinsSortedByBinSize (desc)', () => {
        const histogram = NumericSegmentHistogram
            .createFromSegments(TEST_SEGMENTS)
            .addAll(TEST_INPUT_VALUES);
        
        const bins = histogram.getBinsSortedByBinSize("descending");
        const expectedBins = TEST_RESULT_BINS_SORTED_DESC_BY_SIZE;
        expect(bins).to.have.same.deep.ordered.members(expectedBins);
    });

    it('getBinsSortedByBinSize (asc)', () => {
        const histogram = NumericSegmentHistogram
            .createFromSegments(TEST_SEGMENTS)
            .addAll(TEST_INPUT_VALUES);
        
        const bins = histogram.getBinsSortedByBinSize("ascending");
        const expectedBins = TEST_RESULT_BINS_SORTED_DESC_BY_SIZE.slice().reverse();
        expect(bins).to.have.same.deep.ordered.members(expectedBins);
    });

    it('getBinsSortedByKey (desc)', () => {
        const histogram = NumericSegmentHistogram
            .createFromSegments(TEST_SEGMENTS)
            .addAll(TEST_INPUT_VALUES);
        
        const bins = histogram.getBinsSortedByKey("descending").slice().reverse();
        const expectedBins = TEST_RESULT_BINS_SCALED_BY_POINTS;
        expect(bins).to.have.same.deep.ordered.members(expectedBins);
    });

    it('getBinsSortedByKey (asc)', () => {
        const histogram = NumericSegmentHistogram
            .createFromSegments(TEST_SEGMENTS)
            .addAll(TEST_INPUT_VALUES);
        
        const bins = histogram.getBinsSortedByKey("ascending");
        const expectedBins = TEST_RESULT_BINS_SCALED_BY_POINTS;
        expect(bins).to.have.same.deep.ordered.members(expectedBins);
    });

});