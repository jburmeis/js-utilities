import { expect } from 'chai';
import { IndexEncoder } from '../../src';

describe('IndexEncoder', () => {

    it('initialize', () => {
        const length = 10;
        const encoder = IndexEncoder.fromLength(length);
        for(let i = 0; i < length; i++){
            expect(encoder.isSet(i)).to.be.false;
        }
    });

    it('set first', () => {
        const length = 10;
        const encoder = IndexEncoder.fromLength(length);
        encoder.set(0);
        for(let i = 0; i < length; i++){
            if(i !== 0){
                expect(encoder.isSet(i)).to.be.false;
            } else {
                expect(encoder.isSet(i)).to.be.true;
            }
        }
    });

    it('set last', () => {
        const length = 10;
        const encoder = IndexEncoder.fromLength(length);
        encoder.set(9);
        for(let i = 0; i < length; i++){
            if(i !== 9){
                expect(encoder.isSet(i)).to.be.false;
            } else {
                expect(encoder.isSet(i)).to.be.true;
            }
        }
    });

    it('set multiple', () => {
        const length = 10;
        const encoder = IndexEncoder.fromLength(length);
        encoder.set(1);
        encoder.set(4);
        encoder.set(5);

        for(let i = 0; i < length; i++){
            if(i === 1 || i === 4 || i === 5){
                expect(encoder.isSet(i)).to.be.true;
            } else {
                expect(encoder.isSet(i)).to.be.false;
            }
        }
    });

    it('clear first', () => {
        const length = 10;
        const encoder = IndexEncoder.fromLength(length);
        encoder.setAll();
        encoder.clear(0);
        for(let i = 0; i < length; i++){
            if(i === 0){
                expect(encoder.isSet(i)).to.be.false;
            } else {
                expect(encoder.isSet(i)).to.be.true;
            }
        }
    });

    it('clear last', () => {
        const length = 10;
        const encoder = IndexEncoder.fromLength(length);
        encoder.setAll();
        encoder.clear(9);
        for(let i = 0; i < length; i++){
            if(i === 9){
                expect(encoder.isSet(i)).to.be.false;
            } else {
                expect(encoder.isSet(i)).to.be.true;
            }
        }
    });


    it('setAll', () => {
        const length = 10;
        const encoder = IndexEncoder.fromLength(length);
        encoder.setAll();

        for (let i = 0; i < length; i++) {
            expect(encoder.isSet(i)).to.be.true;
        }
    });

    it('clearAll', () => {
        const length = 10;
        const encoder = IndexEncoder.fromLength(length);
        encoder.set(0);
        encoder.set(4);
        encoder.set(7);
        encoder.set(9);

        encoder.clearAll();
        for (let i = 0; i < length; i++) {
            expect(encoder.isSet(i)).to.be.false;
        }
    });

    it('clearMultiple', () => {
        const length = 10;
        const encoder = IndexEncoder.fromLength(length);
        encoder.setAll();
        encoder.clear(0);
        encoder.clear(1);
        encoder.clear(7);
        encoder.clear(9);

        for (let i = 0; i < length; i++) {
            if(i === 0 || i === 1 || i === 7 || i === 9){
                expect(encoder.isSet(i)).to.be.false;
            } else {
                expect(encoder.isSet(i)).to.be.true;
            }
        }
    });

    it('outside range negative', () => {
        const length = 10;
        const encoder = IndexEncoder.fromLength(length);
        encoder.set(1);
        encoder.set(4);
        encoder.set(5);

        expect(encoder.isSet(-1)).to.be.false;
    });

    it('outside range too large', () => {
        const length = 10;
        const encoder = IndexEncoder.fromLength(length);
        encoder.set(1);
        encoder.set(4);
        encoder.set(5);

        expect(encoder.isSet(12)).to.be.false;
    });

    it('count set 0', () => {
        const length = 10;
        const encoder = IndexEncoder.fromLength(length);
        
        expect(encoder.numSet()).to.be.equal(0);
    });

    it('count set 2', () => {
        const length = 10;
        const encoder = IndexEncoder.fromLength(length);
        encoder.set(1);
        encoder.set(4);
        
        expect(encoder.numSet()).to.be.equal(2);
    });

    it('create key', () => {
        const length = 10;
        const encoder = IndexEncoder.fromLength(length);
        encoder.set(1);
        encoder.set(4);
        
        const key = encoder.toKey();
        expect(key.length).to.be.equal(2);
    });

    it('from key', () => {
        const length = 10;
        const encoder = IndexEncoder.fromLength(length);
        encoder.set(1);
        encoder.set(4);
        encoder.set(5);
        
        const key = encoder.toKey();

        const readEncoder = IndexEncoder.fromKey(key);

        for(let i = 0; i < length; i++){
            expect(readEncoder.isSet(i) === encoder.isSet(i)).to.be.true;
        }
    });

    it('from indices', () => {
        const indices = new Set<number>();
        indices.add(1);
        indices.add(4);
        indices.add(5);

        const encoder = IndexEncoder.fromIndices(indices);

        for (let i = 0; i < 10; i++) {
            if (i === 1 || i === 4 || i === 5) {
                expect(encoder.isSet(i)).to.be.true;
            } else {
                expect(encoder.isSet(i)).to.be.false;
            }
        }
    });

});