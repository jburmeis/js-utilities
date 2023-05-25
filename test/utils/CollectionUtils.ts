
import { expect } from 'chai';
import { createArrayFromSet, createArrayOfUniques, createInverseMap, createSetFromArray, mapEntriesAsArray, mapKeysAsArray, mapValuesAsArray } from '../../src';

describe('CollectionUtils', () => {

    it('createArrayFromSet', () => {
        const sourceSet = new Set([1, 2, 3, 4, 5]);
        expect(createArrayFromSet(sourceSet)).to.have.same.members([1, 2, 3, 4, 5]);
    });

    it('createSetFromArray', () => {
        const source = [1, 2, 3, 4, 5];
        const resultSet = createSetFromArray([1, 2, 2, 3, 4, 1, 5, 2]);

        expect(resultSet.size).to.be.eq(5);
        for (const value of source) {
            expect(resultSet.has(value)).to.be.true;
        }
    });

    it('createArrayOfUniques', () => {
        const source = [1, 2, 2, 3, 4, 1, 5, 2];
        expect(createArrayOfUniques(source)).to.have.same.members([1, 2, 3, 4, 5]);
    });

    it('mapKeysAsArray', () => {
        const sourceMap = new Map<string, number>();
        sourceMap.set("A", 1);
        sourceMap.set("B", 2);
        sourceMap.set("C", 3);
        sourceMap.set("B", 10);

        expect(mapKeysAsArray(sourceMap)).to.have.same.members(["A", "B", "C"]);
    });

    it('mapValuesAsArray', () => {
        const sourceMap = new Map<string, number>();
        sourceMap.set("A", 1);
        sourceMap.set("B", 2);
        sourceMap.set("C", 3);
        sourceMap.set("B", 10);

        expect(mapValuesAsArray(sourceMap)).to.have.same.members([1, 10, 3]);
    });

    it('mapEntriesAsArray', () => {
        const sourceMap = new Map<string, number>();
        sourceMap.set("A", 1);
        sourceMap.set("B", 2);
        sourceMap.set("C", 3);
        sourceMap.set("B", 10);

        expect(mapEntriesAsArray(sourceMap)).to.have.same.deep.members([
            { key: "A", value: 1 },
            { key: "B", value: 10 },
            { key: "C", value: 3 },
        ]);
    });

    it('createInverseMap', () => {
        const sourceMap = new Map<string, number>();
        sourceMap.set("A", 1);
        sourceMap.set("B", 2);
        sourceMap.set("C", 3);

        const inverseMap = createInverseMap(sourceMap);
        expect(inverseMap.size).to.be.eq(3);
        expect(inverseMap.get(1)).to.be.eq("A");
        expect(inverseMap.get(2)).to.be.eq("B");
        expect(inverseMap.get(3)).to.be.eq("C");
    });

    it('createInverseMap (error)', () => {
        const sourceMap = new Map<string, number>();
        sourceMap.set("A", 1);
        sourceMap.set("B", 2);
        sourceMap.set("C", 3);
        sourceMap.set("D", 3);

        expect(() => createInverseMap(sourceMap)).to.throw;
    });

});

