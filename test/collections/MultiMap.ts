import { expect } from 'chai';
import { MultiMap } from '../../src';

describe('MultiMap', () => {

    it('add, get, size', () => {
        const map = new MultiMap<string, string>();
        map.add("Key A", "Value A");
        map.add("Key A", "Value B");
        map.add("Key A", "Value A");
        map.add("Key B", "Value A");
        map.add("Key C", "Value C");

        expect(map.size()).to.be.eq(3);
        expect(map.get("Key A")).to.have.same.members(["Value A", "Value A", "Value B"]);
        expect(map.get("Key B")).to.have.same.members(["Value A"]);
        expect(map.get("Key C")).to.have.same.members(["Value C"]);
        expect(map.get("Undefined")).to.have.same.members([]);
    });

    it('addAll', () => {
        const map = new MultiMap<string, string>();
        map.addAll("Key A", ["Value A", "Value B", "Value A"]);
        map.addAll("Key B", ["Value A"]);
        map.addAll("Key C", []);

        expect(map.size()).to.be.eq(3);
        expect(map.get("Key A")).to.have.same.members(["Value A", "Value A", "Value B"]);
        expect(map.get("Key B")).to.have.same.members(["Value A"]);
        expect(map.get("Key C")).to.have.same.members([]);
        expect(map.get("Undefined")).to.have.same.members([]);
    });

    it('keys', () => {
        const map = new MultiMap<string, string>();
        map.addAll("Key A", ["Value A", "Value B", "Value A"]);
        map.add("Key B", "Value A");
        map.add("Key C", "Value C");

        expect(map.keys()).to.have.same.members(["Key A", "Key B", "Key C"]);
    });

    it('entries', () => {
        const map = new MultiMap<string, string>();
        map.addAll("Key A", ["Value A", "Value B", "Value A"]);
        map.add("Key B", "Value A");
        map.add("Key C", "Value C");

        expect(map.entries()).to.have.same.deep.members([
            { key: "Key A", values: ["Value A", "Value B", "Value A"] },
            { key: "Key B", values: ["Value A"] },
            { key: "Key C", values: ["Value C"] },
        ]);
    });

    it('entriesWithMinNumberOfValues', () => {
        const map = new MultiMap<string, string>();
        map.addAll("Key A", ["Value A", "Value B", "Value A"]);
        map.add("Key B", "Value A");
        map.add("Key C", "Value C");

        expect(map.entriesWithMinNumberOfValues(2)).to.have.same.deep.members([
            { key: "Key A", values: ["Value A", "Value B", "Value A"] },
        ]);
    });

    it('entriesWithMaxNumberOfValues', () => {
        const map = new MultiMap<string, string>();
        map.addAll("Key A", ["Value A", "Value B", "Value A"]);
        map.add("Key B", "Value A");
        map.add("Key C", "Value C");

        expect(map.entriesWithMaxNumberOfValues(2)).to.have.same.deep.members([
            { key: "Key B", values: ["Value A"] },
            { key: "Key C", values: ["Value C"] },
        ]);
    });

    it('createInverseMultiMap', () => {
        const map = new MultiMap<string, string>();
        map.addAll("Key A", ["Value A", "Value B", "Value A"]);
        map.add("Key B", "Value C");
        map.add("Key C", "Value A");

        const inverseMap = map.createInverseMultiMap();

        expect(inverseMap.get("Value A")).to.have.same.members(["Key A", "Key C"]);
        expect(inverseMap.get("Value B")).to.have.same.members(["Key A"]);
        expect(inverseMap.get("Value C")).to.have.same.members(["Key B"]);
    });

    it('createInverseMap', () => {
        const map = new MultiMap<string, string>();
        map.addAll("Key A", ["Value A", "Value B", "Value A"]);
        map.add("Key B", "Value C");
        map.add("Key C", "Value D");

        const inverseMap = map.createInverseMap();

        expect(inverseMap.get("Value A")).to.be.eq("Key A");
        expect(inverseMap.get("Value B")).to.be.eq("Key A");
        expect(inverseMap.get("Value C")).to.be.eq("Key B");
        expect(inverseMap.get("Value D")).to.be.eq("Key C");
    });

    it('createInverseMap (throw)', () => {
        const map = new MultiMap<string, string>();
        map.addAll("Key A", ["Value A", "Value B"]);
        map.add("Key B", "Value C");
        map.add("Key C", "Value A");

        expect(() => map.createInverseMap()).to.throw;
    });

});