import { expect } from 'chai';
import { CounterMap } from '../../src';

describe('CounterMap<string> (default setting: allowNegatives, keepZeros)', () => {

    it('constructor (empty)', () => {
        const map = new CounterMap<string>();
        expect(map.size()).to.be.eq(0);
    });

    it('constructor (with init values)', () => {
        const map = new CounterMap<string>(["A", "C", "A", "B"]);
        expect(map.size()).to.be.eq(3);
        expect(map.get("A")).to.be.eq(2);
        expect(map.get("B")).to.be.eq(1);
        expect(map.get("C")).to.be.eq(1);
    });

    it('constructor (with option: restrictKeys)', () => {
        const map = new CounterMap<string>([], { restrictKeys: ["A", "B", "C"] });
        
        map.increase("A");
        map.increaseBy("B", 2);
        map.set("C", 2);
        map.increaseAll(["A", "B"]);

        expect(map.get("A")).to.be.eq(2);
        expect(map.get("B")).to.be.eq(3);
        expect(map.get("C")).to.be.eq(2);
        expect(map.get("D")).to.be.eq(0);

        expect(() => map.increase("D")).to.throw();
        expect(() => map.increaseBy("D", 2)).to.throw();
        expect(() => map.set("D", 2)).to.throw();
        expect(() => map.decrease("D")).to.throw();
        expect(() => map.decreaseBy("D", 2)).to.throw();
        expect(() => map.increaseAll(["A", "B", "D"])).to.throw();
        expect(() => map.decreaseAll(["A", "B", "D"])).to.throw();
        expect(() => map.setAll(["A", "B", "D"], 3)).to.throw();
    });


    it('increase', () => {
        const map = new CounterMap<string>();
        map.increase("A");
        map.increase("B");
        map.increase("C");
        map.increase("C");
        map.increase("A");
        map.increase("A");

        expect(map.get("A")).to.be.eq(3);
        expect(map.get("B")).to.be.eq(1);
        expect(map.get("C")).to.be.eq(2);
        expect(map.get("D")).to.be.eq(0);
    });

    it('increaseBy', () => {
        const map = new CounterMap<string>();
        map.increaseBy("A", 3);
        map.increaseBy("B", 1);
        map.increaseBy("C", 2);
        map.increaseBy("D", 0);

        expect(map.get("A")).to.be.eq(3);
        expect(map.get("B")).to.be.eq(1);
        expect(map.get("C")).to.be.eq(2);
        expect(map.get("D")).to.be.eq(0);
        expect(map.get("E")).to.be.eq(0);
    });

    it('increaseBy (throws)', () => {
        const map = new CounterMap<string>();
        expect(() => map.increaseBy("B", -1)).to.throw();
    });

    it('increaseAll', () => {
        const map = new CounterMap<string>();
        map.increaseAll(["A", "B", "C", "C", "A", "A"]);

        expect(map.get("A")).to.be.eq(3);
        expect(map.get("B")).to.be.eq(1);
        expect(map.get("C")).to.be.eq(2);
        expect(map.get("D")).to.be.eq(0);
    });

    it('decrease', () => {
        const map = new CounterMap<string>();
        map.increase("A");
        map.decrease("B");
        map.increase("C");
        map.decrease("C");
        map.decrease("A");
        map.increase("A");

        expect(map.get("A")).to.be.eq(1);
        expect(map.get("B")).to.be.eq(-1);
        expect(map.get("C")).to.be.eq(0);
        expect(map.get("D")).to.be.eq(0);
    });

    it('decreaseBy', () => {
        const map = new CounterMap<string>();
        map.increaseBy("A", 2);
        map.decreaseBy("B", 1);
        map.decreaseBy("C", 2);
        map.decreaseBy("C", 1);
        map.decreaseBy("A", 1);

        expect(map.get("A")).to.be.eq(1);
        expect(map.get("B")).to.be.eq(-1);
        expect(map.get("C")).to.be.eq(-3);
        expect(map.get("D")).to.be.eq(0);
    });

    it('decreaseBy (throws)', () => {
        const map = new CounterMap<string>();
        expect(() => map.decreaseBy("B", -1)).to.throw();
    });

    it('decreaseAll', () => {
        const map = new CounterMap<string>();
        map.decreaseAll(["A", "B", "C", "C", "A", "A"]);

        expect(map.get("A")).to.be.eq(-3);
        expect(map.get("B")).to.be.eq(-1);
        expect(map.get("C")).to.be.eq(-2);
        expect(map.get("D")).to.be.eq(0);
    });

    it('set', () => {
        const map = new CounterMap<string>();
        map.increaseBy("A", 4);
        map.set("A", -2);
        expect(map.get("A")).to.be.eq(-2);
    });

    it('setAll', () => {
        const map = new CounterMap<string>();
        map.increaseBy("A", 4);
        map.decreaseBy("B", 3);
        map.increaseBy("D", 5);
        map.setAll(["A", "B", "C"], -2);

        expect(map.get("A")).to.be.eq(-2);
        expect(map.get("B")).to.be.eq(-2);
        expect(map.get("C")).to.be.eq(-2);
        expect(map.get("D")).to.be.eq(5);
    });

    it('setAll (init with zero)', () => {
        const map = new CounterMap<string>();
        map.setAll(["A", "B", "C"], 0);

        expect(map.get("A")).to.be.eq(0);
        expect(map.get("B")).to.be.eq(0);
        expect(map.get("C")).to.be.eq(0);
        expect(map.get("D")).to.be.eq(0);

        expect(map.has("A")).to.be.true;
        expect(map.has("B")).to.be.true;
        expect(map.has("C")).to.be.true;
        expect(map.has("D")).to.be.false;
    });


    it('setAllCounters', () => {
        const map = new CounterMap<string>();
        map.increaseBy("A", 4);
        map.decreaseBy("B", 3);
        map.increaseBy("C", 5);
        map.setAllCounters(1);

        expect(map.get("A")).to.be.eq(1);
        expect(map.get("B")).to.be.eq(1);
        expect(map.get("C")).to.be.eq(1);
        expect(map.get("D")).to.be.eq(0);
    });

    it('setIfKeyIsUndefined', () => {
        const map = new CounterMap<string>();
        map.increaseBy("A", 4);
        map.increaseBy("B", 4);

        map.setIfKeyIsUndefined("A", 1);
        map.setIfKeyIsUndefined("C", 1);

        expect(map.get("A")).to.be.eq(4);
        expect(map.get("B")).to.be.eq(4);
        expect(map.get("C")).to.be.eq(1);
    });

    it('setIfCounterIsZero', () => {
        const map = new CounterMap<string>();
        map.increase("A");
        map.decrease("A");
        map.increaseBy("B", 0);
        map.increase("C");

        map.setIfCounterIsZero("A", 4);
        map.setIfCounterIsZero("B", 4);
        map.setIfCounterIsZero("C", 4);

        expect(map.get("A")).to.be.eq(4);
        expect(map.get("B")).to.be.eq(4);
        expect(map.get("C")).to.be.eq(1);
    });

    it('get', () => {
        // 'get' is implicitly tested by all other tests

        const map = new CounterMap<string>();
        map.increase("A");
        expect(map.get("A")).to.be.eq(1);

        map.increase("A");
        expect(map.get("A")).to.be.eq(2);

        map.decrease("B");
        expect(map.get("B")).to.be.eq(-1);

        expect(map.get("C")).to.be.eq(0);
    });

    it('getKeys', () => {
        const map = new CounterMap<string>();
        map.increase("A");
        map.increase("B");
        map.increase("C");
        map.increase("C");
        map.increase("A");
        map.increase("A");

        const keys = map.getKeys();
        expect(keys).to.have.members(["A", "B", "C"]);
        expect(keys.length).to.be.eq(3);
    });

    it('isCounterZero', () => {
        const map = new CounterMap<string>();
        map.increase("A");

        expect(map.isCounterZero("A")).to.be.false;
        expect(map.isCounterZero("B")).to.be.true;
    });

    it('getEntries', () => {
        const map = new CounterMap<string>();
        map.increase("A");
        map.increase("B");
        map.increase("C");
        map.increase("C");
        map.increase("A");
        map.increase("A");

        const entries = map.getEntries();
        expect(entries).to.have.same.deep.members([
            {key: "A", value: 3},
            {key: "B", value: 1},
            {key: "C", value: 2},
        ]);
    });

    it('getEntries (sorted ascending)', () => {
        const map = new CounterMap<string>();
        map.increase("A");
        map.increase("B");
        map.increase("C");
        map.increase("C");
        map.increase("A");
        map.increase("A");

        const entries = map.getEntries("ascending");
        expect(entries).to.have.same.deep.ordered.members([
            {key: "B", value: 1},
            {key: "C", value: 2},
            {key: "A", value: 3},
        ]);
    });

    it('getEntries (sorted descending)', () => {
        const map = new CounterMap<string>();
        map.increase("A");
        map.increase("B");
        map.increase("C");
        map.increase("C");
        map.increase("A");
        map.increase("A");

        const entries = map.getEntries("descending");
        expect(entries).to.have.same.deep.ordered.members([
            {key: "A", value: 3},
            {key: "C", value: 2},
            {key: "B", value: 1},
        ]);
    });

    it('getEntriesWithMinCount', () => {
        const map = new CounterMap<string>();
        map.increase("A");
        map.increase("B");
        map.increase("C");
        map.increase("C");
        map.increase("A");
        map.increase("A");

        const entries = map.getEntriesWithMinCount(2);
        expect(entries).to.have.same.deep.members([
            {key: "A", value: 3},
            {key: "C", value: 2},
        ]);
    });

    it('getEntriesWithMaxCount', () => {
        const map = new CounterMap<string>();
        map.increase("A");
        map.increase("B");
        map.increase("C");
        map.increase("C");
        map.increase("A");
        map.increase("A");

        const entries = map.getEntriesWithMaxCount(2);
        expect(entries).to.have.same.deep.members([
            {key: "B", value: 1},
        ]);
    });

    it('getAscendingEntries', () => {
        const map = new CounterMap<string>();
        map.increase("A");
        map.increase("B");
        map.increase("C");
        map.increase("C");
        map.increase("A");
        map.increase("A");

        const entries = map.getAscendingEntries();
        expect(entries).to.have.same.deep.ordered.members([
            {key: "B", value: 1},
            {key: "C", value: 2},
            {key: "A", value: 3},
        ]);
    });

    it('getDescendingEntries', () => {
        const map = new CounterMap<string>();
        map.increase("A");
        map.increase("B");
        map.increase("C");
        map.increase("C");
        map.increase("A");
        map.increase("A");

        const entries = map.getDescendingEntries();
        expect(entries).to.have.same.deep.ordered.members([
            {key: "A", value: 3},
            {key: "C", value: 2},
            {key: "B", value: 1},
        ]);
    });

    it('getEntriesForKeys', () => {
        const map = new CounterMap<string>();
        map.increase("A");
        map.increase("B");
        map.increase("C");
        map.increase("C");
        map.increase("A");
        map.increase("A");

        const entries = map.getEntriesForKeys(["C", "A", "X"])
        expect(entries).to.have.same.deep.ordered.members([
            {key: "C", value: 2},
            {key: "A", value: 3},
            {key: "X", value: 0},
        ]);
    });

    it('getEntriesScaledByMaxCounter', () => {
        const map = new CounterMap<string>();
        map.increase("A");
        map.increase("B");
        map.increase("C");
        map.increase("C");
        map.increase("A");
        map.increase("A");

        const entries = map.getEntriesScaledByMaxCounter();
        expect(entries).to.have.same.deep.members([
            {key: "A", value: 3 / 3},
            {key: "B", value: 1 / 3},
            {key: "C", value: 2 / 3},
        ]);
    });

    it('getEntriesScaledByAllCounters', () => {
        const map = new CounterMap<string>();
        map.increase("A");
        map.increase("B");
        map.increase("C");
        map.increase("C");
        map.increase("A");
        map.increase("A");

        const entries = map.getEntriesScaledByAllCounters();
        expect(entries).to.have.same.deep.members([
            {key: "A", value: 3 / 6},
            {key: "B", value: 1 / 6},
            {key: "C", value: 2 / 6},
        ]);
    });

    it('getSumOfAllPositiveCounters (only increases)', () => {
        const map = new CounterMap<string>();
        expect(map.getSumOfAllPositiveCounters()).to.be.eq(0);

        map.increase("A");
        map.increase("B");
        map.increase("C");
        map.increase("C");
        map.increase("A");
        map.increase("A");
        expect(map.getSumOfAllPositiveCounters()).to.be.eq(6);
    });

    it('getSumOfAllPositiveCounters (with decreases)', () => {
        const map = new CounterMap<string>();
        map.decrease("A");
        map.decrease("B");
        map.decrease("C");
        map.decrease("C");
        map.increase("A");
        map.increase("A");
        expect(map.getSumOfAllPositiveCounters()).to.be.eq(1);
    });


    it('getMin (positive values only)', () => {
        const map = new CounterMap<string>();
        map.increase("A");
        map.increase("A");
        map.increase("B");

        expect(map.getMin()).to.be.eq(1);
    });

    it('getMin (negative values)', () => {
        const map = new CounterMap<string>();
        map.increase("A");
        map.increase("A");
        map.decrease("B");
        map.decrease("B");

        expect(map.getMin()).to.be.eq(-2);
    });

    it('getMax (positive values)', () => {
        const map = new CounterMap<string>();
        map.increase("A");
        map.increase("A");
        map.increase("B");

        expect(map.getMax()).to.be.eq(2);
    });

    it('getMax (negative values)', () => {
        const map = new CounterMap<string>();
        map.decrease("A");
        map.decrease("A");
        map.decrease("B");

        expect(map.getMax()).to.be.eq(-1);
    });

    it('isEmpty (true)', () => {
        const map = new CounterMap<string>();
        expect(map.isEmpty()).to.be.true;
    });

    it('isEmpty (false)', () => {
        const map = new CounterMap<string>();
        map.increase("A");
        expect(map.isEmpty()).to.be.false;
    });

    it('remove', () => {
        const map = new CounterMap<string>();
        map.increase("A");
        map.increase("A");
        map.increase("B");
        map.remove("A");

        expect(map.has("A")).to.be.false;
        expect(map.get("B")).to.be.eq(1);
    });

    it('removeAll', () => {
        const map = new CounterMap<string>();
        map.increase("A");
        map.increase("A");
        map.increase("B");
        map.remove("A");

        expect(map.has("A")).to.be.false;
        expect(map.has("A")).to.be.false;
    });

    it('clear', () => {
        const map = new CounterMap<string>();
        map.increase("A");
        map.decrease("B");
        map.clear();

        expect(map.isEmpty()).to.be.true;
    });

    it('has', () => {
        const map = new CounterMap<string>();
        map.increase("A");
        map.decrease("B");

        expect(map.has("A")).to.be.true;
        expect(map.has("B")).to.be.true;
        expect(map.has("C")).to.be.false;
    });

    it('size', () => {
        const map = new CounterMap<string>();
        map.increase("A");
        map.increase("A");
        map.decrease("B");

        expect(map.size()).to.be.eq(2);
    });

});