import { expect } from 'chai';
import { SequenceIdProvider } from '../../src';

describe('SequenceIdProvider', () => {

    it('same group should return subsequent values', () => {
        const provider = new SequenceIdProvider<string>();
        expect(provider.generateId("groupA")).to.be.eq("0");
        expect(provider.generateId("groupA")).to.be.eq("1");
        expect(provider.generateId("groupA")).to.be.eq("2");
    });

    it('different groups should have separate sequences', () => {
        const provider = new SequenceIdProvider<string>();
        expect(provider.generateId("groupA")).to.be.eq("0");
        expect(provider.generateId("groupA")).to.be.eq("1");
        expect(provider.generateId("groupB")).to.be.eq("0");
        expect(provider.generateId("groupB")).to.be.eq("1");
        expect(provider.generateId("groupA")).to.be.eq("2");
        expect(provider.generateId("groupC")).to.be.eq("0");
    });
})