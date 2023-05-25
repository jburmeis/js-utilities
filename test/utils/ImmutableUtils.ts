
import { expect } from 'chai';
import {
    addElementsToImmutableArray,
    addElementToImmutableArray,
    deletePropertyFromImmutableObject,
    insertElementToImmutableArray,
    removeIndexFromImmutableArray,
    removeIndicesFromImmutableArray,
    removeValueFromImmutableArray,
    removeValuesFromImmutableArray,
    removeAllMatchesFromImmutableArray,
    swapIndicesFromImmutableArray,
    toggleValueInclusionFromImmutableArray,
    updateIndexFromImmutableArray,
    updatePropertyFromImmutableObject,
    updateFirstMatchFromImmutableArray,
    addElementToImmutableSet,
    addElementsToImmutableSet
} from '../../src';

describe('ImmutableUtils', () => {

    describe('addElementToImmutableArray', () => {
        it('should create a new array with the element added at the end (from number array)', () => {
            let baseArray = [2, 3, 4];
            const targetArray = [2, 3, 4, 1];
            const outputArray = addElementToImmutableArray(baseArray, 1);

            // Original array remains unchanged
            expect(baseArray).to.eql([2, 3, 4]);
            // Output array correct
            expect(outputArray).to.eql(targetArray);
        });
        it('should create a new array with the element added at the end (from empty string array)', () => {
            let baseArray: Array<string> = [];
            const targetArray = ["3"];
            const outputArray = addElementToImmutableArray(baseArray, "3");

            // Original array remains unchanged
            expect(baseArray).to.eql([]);
            // Output array correct
            expect(outputArray).to.eql(targetArray);
        });
    })

    describe('addElementsToImmutableArray', () => {
        it('should create a new array with the elements added at the end (from number array)', () => {
            let baseArray = [2, 3, 4];
            let additionalArray = [5, 6, 7];
            const targetArray = [2, 3, 4, 5, 6, 7];
            const outputArray = addElementsToImmutableArray(baseArray, additionalArray);

            // Original arrays remain unchanged
            expect(baseArray).to.eql([2, 3, 4]);
            expect(additionalArray).to.eql([5, 6, 7]);
            // Output array correct
            expect(outputArray).to.eql(targetArray);
        });
        it('should create a new array with the elements added at the end (from empty string array)', () => {
            let baseArray: Array<string> = [];
            let additionalArray = ["3", "4"];
            const targetArray = ["3", "4"];
            const outputArray = addElementsToImmutableArray(baseArray, additionalArray);

            // Original array remains unchanged
            expect(baseArray).to.eql([]);
            expect(additionalArray).to.eql(["3", "4"]);
            // Output array correct
            expect(outputArray).to.eql(targetArray);
        });
    });

    describe('insertElementToImmutableArray', () => {
        it('should create a new array with the element inserted at position 1', () => {
            let baseArray = [2, 3, 4];
            const targetArray = [2, 1, 3, 4];
            const outputArray = insertElementToImmutableArray(baseArray, 1, 1);

            // Original array remains unchanged
            expect(baseArray).to.eql([2, 3, 4]);
            // Output array correct
            expect(outputArray).to.eql(targetArray);
        });
        it('should create a new array with the element inserted at position 0', () => {
            let baseArray = [2, 3, 4];
            const targetArray = [1, 2, 3, 4];
            const outputArray = insertElementToImmutableArray(baseArray, 0, 1);

            // Original array remains unchanged
            expect(baseArray).to.eql([2, 3, 4]);
            // Output array correct
            expect(outputArray).to.eql(targetArray);
        });
    });

    describe('removeIndexFromImmutableArray', () => {
        it('should create a new array with the element at position 1 removed', () => {
            let baseArray = [2, 3, 4];
            const targetArray = [2, 4];
            const outputArray = removeIndexFromImmutableArray(baseArray, 1);

            // Original array remains unchanged
            expect(baseArray).to.eql([2, 3, 4]);
            // Output array correct
            expect(outputArray).to.eql(targetArray);
        });
        it('should create a new array with the element at position 0 removed ', () => {
            let baseArray = [2];
            const targetArray: Array<number> = [];
            const outputArray = removeIndexFromImmutableArray(baseArray, 0);

            // Original array remains unchanged
            expect(baseArray).to.eql([2]);
            // Output array correct
            expect(outputArray).to.eql(targetArray);
        });
    });

    describe('removeIndicesFromImmutableArray', () => {
        it('should create a new array with the elements at positions 1,3 removed', () => {
            let baseArray = [2, 3, 4, 5, 6];
            const targetArray = [2, 4, 6];
            const outputArray = removeIndicesFromImmutableArray(baseArray, [1, 3]);

            // Original array remains unchanged
            expect(baseArray).to.eql([2, 3, 4, 5, 6]);
            // Output array correct
            expect(outputArray).to.eql(targetArray);
        });

        it('should create a new array with the elements at position 0 removed', () => {
            let baseArray = [2];
            const targetArray: Array<number> = [];
            const outputArray = removeIndicesFromImmutableArray(baseArray, [0]);

            // Original array remains unchanged
            expect(baseArray).to.eql([2]);
            // Output array correct
            expect(outputArray).to.eql(targetArray);
        });
    });

    describe('removeValueFromImmutableArray', () => {
        it('should create a new array with an existing value removed, resulting in a non-empty array (number array)', () => {
            let baseArray = [2, 3, 4];
            const targetArray = [2, 4];
            const outputArray = removeValueFromImmutableArray(baseArray, 3);

            // Original array remains unchanged
            expect(baseArray).to.eql([2, 3, 4]);
            // Output array correct
            expect(outputArray).to.eql(targetArray);
        });
        it('should create a new array with an existing value removed, resulting in an empty array (string array)', () => {
            let baseArray = ["2"];
            const targetArray: Array<string> = [];
            const outputArray = removeValueFromImmutableArray(baseArray, "2");

            // Original array remains unchanged
            expect(baseArray).to.eql(["2"]);
            // Output array correct
            expect(outputArray).to.eql(targetArray);
        });

        it('should create a new array with an existing value removed (object array)', () => {
            let baseArray = [{ a: "2" }, { b: "c" }];
            const targetArray = [baseArray[1]];
            const outputArray = removeValueFromImmutableArray(baseArray, baseArray[0]);

            // Original array remains unchanged
            expect(baseArray).to.eql([{ a: "2" }, { b: "c" }]);
            // Output array correct
            expect(outputArray).to.eql(targetArray);
        })

        it('should create a new array with an non-existing value removed, resulting in an unchanged array (string array)', () => {
            let baseArray = ["2", "3", "4"];
            const targetArray: Array<string> = ["2", "3", "4"];
            const outputArray = removeValueFromImmutableArray(baseArray, "1");

            // Original array remains unchanged
            expect(baseArray).to.eql(["2", "3", "4"]);
            // Output array correct
            expect(outputArray).to.eql(targetArray);
        })
    });

    it('removeValuesFromImmutableArray', () => {
        {
            let baseArray = [2, 3, 4, 5, 6];
            const targetArray = [2, 4, 6];
            const outputArray = removeValuesFromImmutableArray(baseArray, [3, 5]);

            // Original array remains unchanged
            expect(baseArray).to.eql([2, 3, 4, 5, 6]);
            // Output array correct
            expect(outputArray).to.eql(targetArray);
        }
        {
            let baseArray = ["2", "3"];
            const targetArray: Array<string> = ["3"];
            const outputArray = removeValuesFromImmutableArray(baseArray, ["2"]);

            // Original array remains unchanged
            expect(baseArray).to.eql(["2", "3"]);
            // Output array correct
            expect(outputArray).to.eql(targetArray);
        }

        {
            let baseArray = [{ a: "2" }, { b: "c" }];
            const targetArray = [baseArray[1]];
            const outputArray = removeValuesFromImmutableArray(baseArray, [baseArray[0]]);

            // Original array remains unchanged
            expect(baseArray).to.eql([{ a: "2" }, { b: "c" }]);
            // Output array correct
            expect(outputArray).to.eql(targetArray);
        }
    });

    it('removeAllMatchesFromImmutableArray', () => {
        {
            let baseArray = [2, 5, 1, 6, 2];
            const targetArray = [2, 1, 2];
            const outputArray = removeAllMatchesFromImmutableArray(baseArray, value => value > 3);

            // Original array remains unchanged
            expect(baseArray).to.eql([2, 5, 1, 6, 2]);
            // Output array correct
            expect(outputArray).to.eql(targetArray);
        }
        {
            let baseArray = [{ a: "2" }, { b: "c" }, { a: "4"}, { c: "d"}];
            const targetArray = [{ b: "c" }, { a: "4"}, { c: "d"}];
            const outputArray = removeAllMatchesFromImmutableArray(baseArray, value => value["a"] === "2" );

            // Original array remains unchanged
            expect(baseArray).to.eql([{ a: "2" }, { b: "c" }, { a: "4"}, { c: "d"}]);
            // Output array correct
            expect(outputArray).to.deep.equal(targetArray);
        }
        {
            let baseArray = [{ a: "2" }, { b: "c" }, { a: "4"}, { c: "d"}];
            const outputArray = removeAllMatchesFromImmutableArray(baseArray, value => value["a"] === "6" );

            // Original array remains unchanged
            expect(baseArray).to.eql([{ a: "2" }, { b: "c" }, { a: "4"}, { c: "d"}]);
            // Output array is the same
            expect(outputArray).to.eql(baseArray);
        }

    });

    it('updateIndexFromImmutableArray', () => {
        {
            let baseArray = [2, 3, 4];
            const targetArray = [2, 7, 4];
            const outputArray = updateIndexFromImmutableArray(baseArray, 1, 7);

            // Original array remains unchanged
            expect(baseArray).to.eql([2, 3, 4]);
            // Output array correct
            expect(outputArray).to.eql(targetArray);
        }
    });

    it('updateIndexFromImmutableArray', () => {
        {
            let baseArray = [2, 3, 4];
            const targetArray = [2, 7, 4];
            const matchFunction = (value: number) => (value === 3);
            const outputArray = updateFirstMatchFromImmutableArray(baseArray, matchFunction, 7);

            // Original array remains unchanged
            expect(baseArray).to.eql([2, 3, 4]);
            // Output array correct
            expect(outputArray).to.eql(targetArray);
        }

        {
            let baseArray = [2, 3, 4];
            const matchFunction = (value: number) => (value === 10);
            const outputArray = updateFirstMatchFromImmutableArray(baseArray, matchFunction, 7);

            // Original array remains unchanged
            expect(baseArray).to.eql([2, 3, 4]);
            // Output array correct & not the same instance as input
            expect(outputArray).to.eql([2, 3, 4]);
        }
    });

    it('swapIndicesFromImmutableArray', () => {
        {
            let baseArray = [2, 3, 4];
            const targetArray = [4, 3, 2];
            const outputArray = swapIndicesFromImmutableArray(baseArray, 0, 2);

            // Original array remains unchanged
            expect(baseArray).to.eql([2, 3, 4]);
            // Output array correct
            expect(outputArray).to.eql(targetArray);
        }
    });

    it('toggleValueInclusionFromImmutableArray', () => {
        {
            let baseArray = [2, 3, 4];
            const targetArray = [2, 4];
            const outputArray = toggleValueInclusionFromImmutableArray(baseArray, 3);

            // Original array remains unchanged
            expect(baseArray).to.eql([2, 3, 4]);
            // Output array correct
            expect(outputArray).to.eql(targetArray);
        }
        {
            let baseArray = [2, 3, 4];
            const targetArray = [2, 3, 4, 5];
            const outputArray = toggleValueInclusionFromImmutableArray(baseArray, 5);

            // Original array remains unchanged
            expect(baseArray).to.eql([2, 3, 4]);
            // Output array correct
            expect(outputArray).to.eql(targetArray);
        }
    });

    it('updatePropertyFromImmutableObject', () => {
        {
            let baseObject = { a: "123", b: 10 };

            const outputObject = updatePropertyFromImmutableObject(baseObject, "b", 15);

            // Original object remains unchanged
            expect(baseObject).to.eql({ a: "123", b: 10 });
            // Output object correct
            expect(outputObject).to.eql({ a: "123", b: 15 });
        }
        {
            let baseObject = { a: "123", b: 10 };

            const outputObject = updatePropertyFromImmutableObject(baseObject, "c", "15");

            // Original object remains unchanged
            expect(baseObject).to.eql({ a: "123", b: 10 });
            // Output object correct
            expect(outputObject).to.eql({ a: "123", b: 10, c: "15" });
        }
    });

    it('deletePropertyFromImmutableObject', () => {
        {
            let baseObject = { a: "123", b: 10 };

            const outputObject = deletePropertyFromImmutableObject(baseObject, "b");

            // Original object remains unchanged
            expect(baseObject).to.eql({ a: "123", b: 10 });
            // Output object correct
            expect(outputObject).to.eql({ a: "123" });
            expect(outputObject["b"]).to.undefined;
        }
        {
            let baseObject = { a: "123", b: 10 };

            const outputObject = deletePropertyFromImmutableObject(baseObject, "c");

            // Original object remains unchanged
            expect(baseObject).to.eql({ a: "123", b: 10 });
            // Output object correct
            expect(outputObject).to.eql({ a: "123", b: 10 });
        }
    });

    describe('addElementToImmutableSet', () => {
        it('should create a new set with the element added (from number array)', () => {
            const baseSet = new Set<number>([2, 3, 4]);
            const outputSet = addElementToImmutableSet(baseSet, 1);

            // Original set remains unchanged
            expect(Array.from(baseSet)).to.have.same.members([2, 3, 4]);
            // Output set correct
            expect(Array.from(outputSet)).to.have.same.members([1, 2, 3, 4]);
        });
        it('should create a new array with the element added (from empty string array)', () => {
            const baseSet = new Set<string>();
            const outputSet = addElementToImmutableSet(baseSet, "3");

            // Original set remains unchanged
            expect(Array.from(baseSet)).to.have.same.members([]);
            // Output set correct
            expect(Array.from(outputSet)).to.have.same.members(["3"]);
        });
    })

    describe('addElementsToImmutableSet', () => {
        it('should create a new array with the elements added at the end (from number array)', () => {
            const baseSet = new Set<number>([2, 3, 4]);
            const additionalValues = [2, 4, 5, 7];
            const outputSet = addElementsToImmutableSet(baseSet, additionalValues);

            // Original arrays remain unchanged
            expect(Array.from(baseSet)).to.have.same.members([2, 3, 4]);
            // Output array correct
            expect(Array.from(outputSet)).to.have.same.members([2, 3, 4, 5, 7]);
        });
        it('should create a new array with the elements (from empty string array)', () => {
            const baseSet = new Set<string>();
            const additionalValues = ["3", "4"];
            const outputSet = addElementsToImmutableSet(baseSet, additionalValues);

            // Original array remains unchanged
            expect(Array.from(baseSet)).to.have.same.members([]);
            // Output array correct
            expect(Array.from(outputSet)).to.have.same.members(["3", "4"]);
        });
    });

});

