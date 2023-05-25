import { expect } from 'chai';
import { CategoricalHistogram, HistogramBinScaling } from '../../src';

const TEST_INPUT_VALUES = [
    "Category A", "Category B", "Category A",
    "Category C", "Category C", "Category A",
];

const TEST_INPUT_VALUES_WITH_UNDEFINED = [
    "Category A", "Category B", "Category A", null,
    "Category C", "Category C", "Category A", undefined,
];

const TEST_RESULT_BINS_INIT = [
    {key: "Category A", size: 0, scaledSize: 0 },
    {key: "Category B", size: 0, scaledSize: 0 },
    {key: "Category C", size: 0, scaledSize: 0 },
]

const TEST_RESULT_BINS_SCALED_BY_POINTS = [
    {key: "Category A", size: 3, scaledSize: 3 / 6 },
    {key: "Category B", size: 1, scaledSize: 1 / 6 },
    {key: "Category C", size: 2, scaledSize: 2 / 6 },
]

const TEST_RESULT_BINS_SCALED_BY_BINS = [
    {key: "Category A", size: 3, scaledSize: 3 / 3 },
    {key: "Category B", size: 1, scaledSize: 1 / 3 },
    {key: "Category C", size: 2, scaledSize: 2 / 3 },
]

const TEST_RESULT_BINS_SORTED_BY_POINTS = [
    {key: "Category A", size: 3, scaledSize: 3 / 6 },
    {key: "Category C", size: 2, scaledSize: 2 / 6 },
    {key: "Category B", size: 1, scaledSize: 1 / 6 },
]

const TEST_RESULT_BINS_SCALED_BY_BINS_SORTED_BY_POINTS = [
    {key: "Category A", size: 3, scaledSize: 3 / 3 },
    {key: "Category C", size: 2, scaledSize: 2 / 3 },
    {key: "Category B", size: 1, scaledSize: 1 / 3 },
]

describe('CategoricalHistogram', () => {

    it('constructor (createEmpty)', () => {
        const histogram = CategoricalHistogram.createEmpty();

        expect(histogram.getNumBins()).to.be.eq(0);
        expect(histogram.getNumDataPoints()).to.be.eq(0);
        expect(histogram.getNumUndefined()).to.be.eq(0);
        expect(histogram.getValue("Undefined")).to.be.eq(0);
        expect(histogram.getBins()).to.be.empty;
    });

    it('constructor (createWithPredefinedBins)', () => {
        const histogram = CategoricalHistogram.createWithPredefinedBins(["Category A", "Category B", "Category C"]);

        expect(histogram.getNumBins()).to.be.eq(3);
        expect(histogram.getNumDataPoints()).to.be.eq(0);
        expect(histogram.getNumUndefined()).to.be.eq(0);
        expect(histogram.getValue("Category A")).to.be.eq(0);
        expect(histogram.getValue("Category B")).to.be.eq(0);
        expect(histogram.getValue("Category C")).to.be.eq(0);
        expect(histogram.getBins()).to.have.same.deep.members(TEST_RESULT_BINS_INIT);
    });

    it('constructor (createWithPredefinedLockedBins)', () => {
        const histogram = CategoricalHistogram.createWithPredefinedLockedBins(["Category A", "Category B", "Category C"]);

        expect(histogram.getNumBins()).to.be.eq(3);
        expect(histogram.getNumDataPoints()).to.be.eq(0);
        expect(histogram.getNumUndefined()).to.be.eq(0);
        expect(histogram.getValue("Category A")).to.be.eq(0);
        expect(histogram.getValue("Category B")).to.be.eq(0);
        expect(histogram.getValue("Category C")).to.be.eq(0);
        expect(histogram.getBins()).to.have.same.deep.members(TEST_RESULT_BINS_INIT);

        histogram.add("Category A");
        histogram.addAll(["Category A", "Category B"]);
        histogram.addMultiple("Category C", 3);

        expect(histogram.getValue("Category A")).to.be.eq(2);
        expect(histogram.getValue("Category B")).to.be.eq(1);
        expect(histogram.getValue("Category C")).to.be.eq(3);

        expect(() => histogram.add("Category D")).to.throw();
    });

    it('constructor (createFromData)', () => {
        const histogram = CategoricalHistogram.createFromData(TEST_INPUT_VALUES);

        expect(histogram.getNumBins()).to.be.eq(3);
        expect(histogram.getNumDataPoints()).to.be.eq(6);
        expect(histogram.getNumUndefined()).to.be.eq(0);
        expect(histogram.getValue("Category A")).to.be.eq(3);
        expect(histogram.getValue("Category B")).to.be.eq(1);
        expect(histogram.getValue("Category C")).to.be.eq(2);
        expect(histogram.getBins()).to.have.same.deep.members(TEST_RESULT_BINS_SCALED_BY_POINTS);
    });

    it('constructor (createFromData, with undefined)', () => {
        const histogram = CategoricalHistogram.createFromData(TEST_INPUT_VALUES_WITH_UNDEFINED);

        expect(histogram.getNumBins()).to.be.eq(3);
        expect(histogram.getNumDataPoints()).to.be.eq(6);
        expect(histogram.getNumUndefined()).to.be.eq(2);
        expect(histogram.getValue("Category A")).to.be.eq(3);
        expect(histogram.getValue("Category B")).to.be.eq(1);
        expect(histogram.getValue("Category C")).to.be.eq(2);
        expect(histogram.getBins()).to.have.same.deep.members(TEST_RESULT_BINS_SCALED_BY_POINTS);
    });

    it('constructor (without acceptUndefined)', () => {
        const histogram = CategoricalHistogram.createEmpty({acceptUndefined: false});
        expect(() => histogram.add(undefined)).to.throw();
    });

    it('add', () => {
        const histogram = CategoricalHistogram.createEmpty();
        TEST_INPUT_VALUES.forEach(input => histogram.add(input));

        expect(histogram.getNumBins()).to.be.eq(3);
        expect(histogram.getNumDataPoints()).to.be.eq(6);
        expect(histogram.getRatioUndefined()).to.be.eq(0);
        expect(histogram.getValue("Category A")).to.be.eq(3);
        expect(histogram.getValue("Category B")).to.be.eq(1);
        expect(histogram.getValue("Category C")).to.be.eq(2);
        expect(histogram.getBins()).to.have.same.deep.members(TEST_RESULT_BINS_SCALED_BY_POINTS);
    });

    it('add (with null and undefined)', () => {
        const histogram = CategoricalHistogram.createEmpty();
        histogram.add(undefined);
        TEST_INPUT_VALUES.forEach(input => histogram.add(input));
        histogram.add(null);

        expect(histogram.getNumBins()).to.be.eq(3);
        expect(histogram.getNumDataPoints()).to.be.eq(6);
        expect(histogram.getNumUndefined()).to.be.eq(2);
        expect(histogram.getRatioUndefined()).to.be.eq(2 / 6);
        expect(histogram.getValue("Category A")).to.be.eq(3);
        expect(histogram.getValue("Category B")).to.be.eq(1);
        expect(histogram.getValue("Category C")).to.be.eq(2);
        expect(histogram.getBins()).to.have.same.deep.members(TEST_RESULT_BINS_SCALED_BY_POINTS);
    });

    it('add (with null and undefined not accepted)', () => {
        const histogram = CategoricalHistogram.createEmpty({ acceptUndefined: false });
        TEST_INPUT_VALUES.forEach(input => histogram.add(input));
        expect(() => histogram.add(undefined)).to.throw();
        expect(() => histogram.add(null)).to.throw();
    });

    it('addAll', () => {
        const histogram = CategoricalHistogram.createEmpty();
        histogram.addAll(TEST_INPUT_VALUES)

        expect(histogram.getNumBins()).to.be.eq(3);
        expect(histogram.getNumDataPoints()).to.be.eq(6);
        expect(histogram.getValue("Category A")).to.be.eq(3);
        expect(histogram.getValue("Category B")).to.be.eq(1);
        expect(histogram.getValue("Category C")).to.be.eq(2);
        expect(histogram.getBins()).to.have.same.deep.members(TEST_RESULT_BINS_SCALED_BY_POINTS);
    });

    it('addAll (with undefined)', () => {
        const histogram = CategoricalHistogram.createEmpty();
        histogram.addAll(TEST_INPUT_VALUES_WITH_UNDEFINED)

        expect(histogram.getNumBins()).to.be.eq(3);
        expect(histogram.getNumDataPoints()).to.be.eq(6);
        expect(histogram.getNumUndefined()).to.be.eq(2);
        expect(histogram.getValue("Category A")).to.be.eq(3);
        expect(histogram.getValue("Category B")).to.be.eq(1);
        expect(histogram.getValue("Category C")).to.be.eq(2);
        expect(histogram.getBins()).to.have.same.deep.members(TEST_RESULT_BINS_SCALED_BY_POINTS);
    });

    it('addMultiple', () => {
        const histogram = CategoricalHistogram.createEmpty();
        histogram.addMultiple("Category A", 3);
        histogram.addMultiple("Category B", 1);
        histogram.addMultiple("Category C", 2);

        expect(histogram.getNumBins()).to.be.eq(3);
        expect(histogram.getNumDataPoints()).to.be.eq(6);
        expect(histogram.getValue("Category A")).to.be.eq(3);
        expect(histogram.getValue("Category B")).to.be.eq(1);
        expect(histogram.getValue("Category C")).to.be.eq(2);
        expect(histogram.getBins()).to.have.same.deep.members(TEST_RESULT_BINS_SCALED_BY_POINTS);
    });

    it('addFromObject', () => {
        const histogram = CategoricalHistogram.createEmpty();
        TEST_INPUT_VALUES.forEach(value => histogram.addFromObject({property0: value, propertyX: "Value A"}, "property0"));

        expect(histogram.getNumBins()).to.be.eq(3);
        expect(histogram.getNumDataPoints()).to.be.eq(6);
        expect(histogram.getValue("Category A")).to.be.eq(3);
        expect(histogram.getValue("Category B")).to.be.eq(1);
        expect(histogram.getValue("Category C")).to.be.eq(2);
        expect(histogram.getValue("Value A")).to.be.eq(0);
        expect(histogram.getBins()).to.have.same.deep.members(TEST_RESULT_BINS_SCALED_BY_POINTS);
    });

    it('addMultipleFromObject', () => {
        const histogram = CategoricalHistogram.createEmpty();
        histogram.addMultipleFromObject({property0: "Category A", propertyX: "Value A"}, "property0", 3);
        histogram.addMultipleFromObject({property1: "Category B", propertyX: "Value A"}, "property1", 1);
        histogram.addMultipleFromObject({property2: "Category C", propertyX: "Value A"}, "property2", 2);

        expect(histogram.getNumBins()).to.be.eq(3);
        expect(histogram.getNumDataPoints()).to.be.eq(6);
        expect(histogram.getValue("Category A")).to.be.eq(3);
        expect(histogram.getValue("Category B")).to.be.eq(1);
        expect(histogram.getValue("Category C")).to.be.eq(2);
        expect(histogram.getValue("Value A")).to.be.eq(0);
        expect(histogram.getBins()).to.have.same.deep.members(TEST_RESULT_BINS_SCALED_BY_POINTS);
    });

    it('addAllFromObjects', () => {
        const histogram = CategoricalHistogram.createEmpty();
        const inputObjects = TEST_INPUT_VALUES.map(value => ({property: value, propertyX: "Value A"}));
        histogram.addAllFromObjects(inputObjects, "property");

        expect(histogram.getNumBins()).to.be.eq(3);
        expect(histogram.getNumDataPoints()).to.be.eq(6);
        expect(histogram.getValue("Category A")).to.be.eq(3);
        expect(histogram.getValue("Category B")).to.be.eq(1);
        expect(histogram.getValue("Category C")).to.be.eq(2);
        expect(histogram.getValue("Value A")).to.be.eq(0);
        expect(histogram.getBins()).to.have.same.deep.members(TEST_RESULT_BINS_SCALED_BY_POINTS);
    });

    it('getBins (ByNumDatapoints)', () => {
        const histogram = CategoricalHistogram.createFromData(TEST_INPUT_VALUES);
        expect(histogram.getBins(HistogramBinScaling.ByNumDatapoints)).to.have.same.deep.members(TEST_RESULT_BINS_SCALED_BY_POINTS);
    });

    it('getBins (ByMaxBinSize)', () => {
        const histogram = CategoricalHistogram.createFromData(TEST_INPUT_VALUES);
        expect(histogram.getBins(HistogramBinScaling.ByMaxBinSize)).to.have.same.deep.members(TEST_RESULT_BINS_SCALED_BY_BINS);
    });

    it('getBinsForKeys (ByNumDatapoints)', () => {
        const histogram = CategoricalHistogram.createFromData(TEST_INPUT_VALUES);
        expect(histogram.getBinsForKeys(["Category C", "Category A", "Category X"], HistogramBinScaling.ByNumDatapoints)).to.have.same.deep.ordered.members([
            { key: "Category C", size: 2, scaledSize: 2 / 6 },
            { key: "Category A", size: 3, scaledSize: 3 / 6 },
            { key: "Category X", size: 0, scaledSize: 0 },
        ]);
    });

    it('getBins (ByMaxBinSize)', () => {
        const histogram = CategoricalHistogram.createFromData(TEST_INPUT_VALUES);
        expect(histogram.getBinsForKeys(["Category C", "Category A", "Category X"], HistogramBinScaling.ByMaxBinSize)).to.have.same.deep.ordered.members([
            { key: "Category C", size: 2, scaledSize: 2 / 3 },
            { key: "Category A", size: 3, scaledSize: 3 / 3 },
            { key: "Category X", size: 0, scaledSize: 0 },
        ]);
    });

    it('getBins (ByMaxBinSize)', () => {
        const histogram = CategoricalHistogram.createFromData(TEST_INPUT_VALUES);
        expect(histogram.getBins(HistogramBinScaling.ByMaxBinSize)).to.have.same.deep.members([
            {key: "Category A", size: 3, scaledSize: 3 / 3},
            {key: "Category B", size: 1, scaledSize: 1 / 3},
            {key: "Category C", size: 2, scaledSize: 2 / 3},
        ]);
    });

    it('getBinsSortedByKey (ascending)', () => {
        const histogram = CategoricalHistogram.createFromData(TEST_INPUT_VALUES);
        const bins = histogram.getBinsSortedByKey("ascending");
        const expectedBins = TEST_RESULT_BINS_SCALED_BY_POINTS;
        expect(bins).to.have.same.deep.ordered.members(expectedBins);
    });

    it('getBinsSortedByKey (ascending, ByMaxBinSize)', () => {
        const histogram = CategoricalHistogram.createFromData(TEST_INPUT_VALUES);
        const bins = histogram.getBinsSortedByKey("ascending", HistogramBinScaling.ByMaxBinSize);
        const expectedBins = TEST_RESULT_BINS_SCALED_BY_BINS;
        expect(bins).to.have.same.deep.members(expectedBins);
    });

    it('getBinsSortedByKey (descending)', () => {
        const histogram = CategoricalHistogram.createFromData(TEST_INPUT_VALUES);
        const bins = histogram.getBinsSortedByKey("descending");
        const expectedBins = TEST_RESULT_BINS_SCALED_BY_POINTS.slice().reverse();
        expect(bins).to.have.same.deep.ordered.members(expectedBins);
    });

    it('getBinsSortedByBinSize (ascending)', () => {
        const histogram = CategoricalHistogram.createFromData(TEST_INPUT_VALUES);
        const bins = histogram.getBinsSortedByBinSize("ascending");
        const expectedBins = TEST_RESULT_BINS_SORTED_BY_POINTS.slice().reverse();
        expect(bins).to.have.same.deep.ordered.members(expectedBins);
    });

    it('getBinsSortedByBinSize (ascending, ByMaxBinSize)', () => {
        const histogram = CategoricalHistogram.createFromData(TEST_INPUT_VALUES);
        const bins = histogram.getBinsSortedByBinSize("ascending", HistogramBinScaling.ByMaxBinSize);
        const expectedBins = TEST_RESULT_BINS_SCALED_BY_BINS_SORTED_BY_POINTS.slice().reverse();
        expect(bins).to.have.same.deep.ordered.members(expectedBins);
    });

    it('getBinsSortedByBinSize (descending)', () => {
        const histogram = CategoricalHistogram.createFromData(TEST_INPUT_VALUES);
        const bins = histogram.getBinsSortedByBinSize("descending");
        const expectedBins = TEST_RESULT_BINS_SORTED_BY_POINTS;
        expect(bins).to.have.same.deep.ordered.members(expectedBins);
    });


});