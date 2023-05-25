import { expect } from 'chai';
import { MultiSet } from '../../src';

describe('MultiSet', () => {

    it('add, get, size', () => {
        const set = new MultiSet<string, string>();
        set.add("Key A", "Value A");
        set.add("Key A", "Value B");
        set.add("Key A", "Value A");
        set.add("Key B", "Value A");
        set.add("Key C", "Value C");

        expect(set.size()).to.be.eq(3);
        expect(set.get("Key A")).to.have.same.members(["Value A", "Value B"]);
        expect(set.get("Key B")).to.have.same.members(["Value A"]);
        expect(set.get("Key C")).to.have.same.members(["Value C"]);
        expect(set.get("Undefined")).to.have.same.members([]);
    });

    it('addAll, get, size', () => {
        const set = new MultiSet<string, string>();
        set.addAll("Key A", ["Value A", "Value B", "Value A"]);
        set.addAll("Key B", ["Value A"]);
        set.addAll("Key C", ["Value C"]);

        expect(set.size()).to.be.eq(3);
        expect(set.get("Key A")).to.have.same.members(["Value A", "Value B"]);
        expect(set.get("Key B")).to.have.same.members(["Value A"]);
        expect(set.get("Key C")).to.have.same.members(["Value C"]);
        expect(set.get("Undefined")).to.have.same.members([]);
    });

    it('size (empty)', () => {
        const set = new MultiSet<string, string>();
        expect(set.size()).to.be.eq(0);
    });

    it('keys', () => {
        const set = new MultiSet<string, string>();
        set.add("Key A", "Value A");
        set.add("Key A", "Value B");
        set.add("Key A", "Value A");
        set.add("Key B", "Value A");
        set.add("Key C", "Value C");

        expect(set.keys()).to.have.same.members(["Key A", "Key B", "Key C"]);
    });

    it('entries', () => {
        const set = new MultiSet<string, string>();
        set.add("Key A", "Value A");
        set.add("Key A", "Value B");
        set.add("Key A", "Value A");
        set.add("Key B", "Value A");
        set.add("Key C", "Value C");

        expect(set.entries()).to.have.same.deep.members([
            { key: "Key A", values: ["Value A", "Value B"] },
            { key: "Key B", values: ["Value A"] },
            { key: "Key C", values: ["Value C"] },
        ]);
    });

    it('entriesWithMinNumberOfValues', () => {
        const set = new MultiSet<string, string>();
        set.add("Key A", "Value A");
        set.add("Key A", "Value B");
        set.add("Key A", "Value A");
        set.add("Key B", "Value A");
        set.add("Key C", "Value C");

        expect(set.entriesWithMinNumberOfValues(2)).to.have.same.deep.members([
            { key: "Key A", values: ["Value A", "Value B"] },
        ]);
    });

    it('entriesWithMaxNumberOfValues', () => {
        const set = new MultiSet<string, string>();
        set.add("Key A", "Value A");
        set.add("Key A", "Value B");
        set.add("Key A", "Value A");
        set.add("Key B", "Value A");
        set.add("Key C", "Value C");

        expect(set.entriesWithMaxNumberOfValues(2)).to.have.same.deep.members([
            { key: "Key B", values: ["Value A"] },
            { key: "Key C", values: ["Value C"] },
        ]);
    });

});