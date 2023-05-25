
import { expect } from 'chai';
import { addAll, createIntRange, getFirst, getLast, isEmpty, isNotEmpty, createArrayWithLength, removeIndex, removeValue, createShallowClone, swap, toggleValueInclusion, shuffle, newShuffled, split, includesByFunction, getFirstAndLast } from '../../src';

describe('ArrayUtils', () => {

    it('addAll', () => {
        const target: number[] = [1, 2, 3, 4, 5];
        const source: number[] = [6, 7, 8, 9, 10];
        addAll(target, source);

        expect(source).to.have.same.ordered.members([6, 7, 8, 9, 10]);
        expect(target).to.have.same.ordered.members([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it('addAll (empty source)', () => {
        const target: number[] = [1, 2, 3, 4, 5];
        const source: number[] = [];
        addAll(target, source);

        expect(source).to.have.same.ordered.members([]);
        expect(target).to.have.same.ordered.members([1, 2, 3, 4, 5]);
    });

    it('addAll (empty target)', () => {
        const target: number[] = [];
        const source: number[] = [1, 2, 3, 4, 5];
        addAll(target, source);

        expect(source).to.have.same.ordered.members([1, 2, 3, 4, 5]);
        expect(target).to.have.same.ordered.members([1, 2, 3, 4, 5]);
    });

    it('removeIndex (middle index)', () => {
        const values: number[] = [1, 2, 3, 4, 5];
        removeIndex(values, 2);
        expect(values).to.have.same.ordered.members([1, 2, 4, 5]);
    });

    it('removeIndex (first index)', () => {
        const values: number[] = [1, 2, 3, 4, 5];
        removeIndex(values, 0);
        expect(values).to.have.same.ordered.members([2, 3, 4, 5]);
    });

    it('removeIndex (last index)', () => {
        const values: number[] = [1, 2, 3, 4, 5];
        removeIndex(values, 4);
        expect(values).to.have.same.ordered.members([1, 2, 3, 4]);
    });

    it('removeValue', () => {
        const values: number[] = [1, 2, 3, 4, 5];
        removeValue(values, 2);
        expect(values).to.have.same.ordered.members([1, 3, 4, 5]);
    });

    it('removeValue (non existing value)', () => {
        const values: number[] = [1, 2, 3, 4, 5];
        removeValue(values, 7);
        expect(values).to.have.same.ordered.members([1, 2, 3, 4, 5]);
    });

    it('toggleValueInclusion (included)', () => {
        const values: number[] = [1, 2, 3, 4, 5];
        toggleValueInclusion(values, 2);
        expect(values).to.have.same.ordered.members([1, 3, 4, 5]);
    });

    it('toggleValueInclusion (not included)', () => {
        const values: number[] = [1, 3, 4, 5];
        toggleValueInclusion(values, 2);
        expect(values).to.have.same.ordered.members([1, 3, 4, 5, 2]);
    });

    it('swap', () => {
        const values: number[] = [1, 2, 3, 4, 5];
        swap(values, 0, 3);
        expect(values).to.have.same.ordered.members([4, 2, 3, 1, 5]);
    });

    it('createShallowClone', () => {
        const values: number[] = [1, 2, 3, 4, 5];
        const copy = createShallowClone(values);
        expect(copy).to.have.same.ordered.members([1, 2, 3, 4, 5]);
        expect(copy).to.be.not.eq(values);
    });

    it('isEmpty', () => {
        expect(isEmpty([1, 2, 3, 4, 5])).to.be.false;
        expect(isEmpty([1])).to.be.false;
        expect(isEmpty([])).to.be.true;
    });

    it('isNotEmpty', () => {
        expect(isNotEmpty([1, 2, 3, 4, 5])).to.be.true;
        expect(isNotEmpty([1])).to.be.true;
        expect(isNotEmpty([])).to.be.false;
    });

    describe('includesByFunction', () => {
        it('should match for primitives array', () => {
            const array = [1, 3, 2, 1, 2];
            expect(includesByFunction(array, (element => element === 3))).to.be.true;
        });
        it('should match for object array', () => {
            const array = [{ key: "A" }, { key: "D" }, { key: "C" }, { key: "B" }];
            expect(includesByFunction(array, (element => element.key === "C"))).to.be.true;
        });
        it('should not match for object array if not included', () => {
            const array = [{ key: "A" }, { key: "D" }, { key: "C" }, { key: "B" }];
            expect(includesByFunction(array, (element => element.key === "X"))).to.be.false;
        });
    });

    it('getFirst', () => {
        expect(getFirst([1, 2, 3, 4, 5])).to.be.eq(1);
    });

    it('getLast', () => {
        expect(getLast([1, 2, 3, 4, 5])).to.be.eq(5);
    });

    describe('getFirstAndLast', () => {
        it('should return correct for array.length > 1', () => {
            const { first, last } = getFirstAndLast([1, 2, 3, 4, 5]);
            expect(first).to.be.eq(1);
            expect(last).to.be.eq(5);
        });
        it('should return correct for array.length === 1', () => {
            const { first, last } = getFirstAndLast([1]);
            expect(first).to.be.eq(1);
            expect(last).to.be.eq(1);
        });
        it('should throw for array.length === 0', () => {
            expect(() => getFirstAndLast([])).to.throw();
        });
    });

    it('createArrayWithLength (without init value)', () => {
        const values = createArrayWithLength<number>(4);
        expect(values).to.have.same.ordered.members([null, null, null, null]);
    });

    it('createArrayWithLength (with init value)', () => {
        const values = createArrayWithLength<string>(4, "Test");
        expect(values).to.have.same.ordered.members(["Test", "Test", "Test", "Test"]);
    });

    it('createIntRange (positive)', () => {
        const values = createIntRange(0, 5);
        expect(values).to.have.same.ordered.members([0, 1, 2, 3, 4, 5]);
    });

    it('createIntRange (negative)', () => {
        const values = createIntRange(-2, 2);
        expect(values).to.have.same.ordered.members([-2, -1, 0, 1, 2]);
    });

    it('shuffle', () => {
        const values = [1, 2, 3, 4];
        shuffle(values)
        expect(values).to.have.same.members([4, 3, 2, 1]);
    });

    it('newShuffled', () => {
        const values = [1, 2, 3, 4];
        const output = newShuffled(values);
        expect(values).to.be.not.eq(output);
        expect(values).to.have.same.ordered.members([1, 2, 3, 4]);
        expect(output).to.have.same.members([4, 3, 2, 1]);
    });

    it('split', () => {
        const values = [1, 6, 2, 8, 0];
        const result = split(values, (value => value < 3));

        expect(values).to.have.same.ordered.members([1, 6, 2, 8, 0]);
        expect(result.true).to.have.same.members([1, 2, 0]);
        expect(result.false).to.have.same.members([6, 8]);
    });

    it('split (all true)', () => {
        const values = [1, 6, 2, 8, 0];
        const result = split(values, (value => value < 10));

        expect(values).to.have.same.ordered.members([1, 6, 2, 8, 0]);
        expect(result.true).to.have.same.members([1, 6, 2, 8, 0]);
        expect(result.false).to.be.empty;
    });

    it('split (all false)', () => {
        const values = [1, 6, 2, 8, 0];
        const result = split(values, (value => value < 0));

        expect(values).to.have.same.ordered.members([1, 6, 2, 8, 0]);
        expect(result.false).to.have.same.members([1, 6, 2, 8, 0]);
        expect(result.true).to.be.empty;
    });

});

