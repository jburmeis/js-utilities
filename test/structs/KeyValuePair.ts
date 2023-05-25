import { expect } from 'chai';
import { createKeyValuePair, sortKeyValuePairs } from '../../src';

describe('KeyValuePair', () => {

    it('createKeyValuePair', () => {
        const pair = createKeyValuePair("Test", 3);
        expect(pair.key).to.be.eq("Test");
        expect(pair.value).to.be.eq(3);

        const pair2 = createKeyValuePair(12, 3);
        expect(pair2.key).to.be.eq(12);
        expect(pair2.value).to.be.eq(3);
    });

    it('sortKeyValuePairs (ascending)', () => {
        const pairs = [
            createKeyValuePair("A", 3),
            createKeyValuePair("B", 1),
            createKeyValuePair("C", 7),
            createKeyValuePair("D", 2),
        ]

        sortKeyValuePairs(pairs, "ascending");
        expect(pairs).to.have.same.deep.ordered.members([
            { key: "B", value: 1 },
            { key: "D", value: 2 },
            { key: "A", value: 3 },
            { key: "C", value: 7 },
        ]);
    });

    it('sortKeyValuePairs (descending)', () => {
        const pairs = [
            createKeyValuePair("A", 3),
            createKeyValuePair("B", 1),
            createKeyValuePair("C", 7),
            createKeyValuePair("D", 2),
        ]

        sortKeyValuePairs(pairs, "descending");
        expect(pairs).to.have.same.deep.ordered.members([
            { key: "C", value: 7 },
            { key: "A", value: 3 },
            { key: "D", value: 2 },
            { key: "B", value: 1 },
        ]);
    });

})