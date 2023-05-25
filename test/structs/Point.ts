import { expect } from 'chai';
import { createPoint } from '../../src';

describe('Point', () => {
    describe('createPoint', () => {
        it('should initialize values correctly', () => {
            const point = createPoint(1, 3);
            expect(point.x).to.be.eq(1);
            expect(point.y).to.be.eq(3);

            const point2 = createPoint(1, -3);
            expect(point2.x).to.be.eq(1);
            expect(point2.y).to.be.eq(-3);
        });
    })
})