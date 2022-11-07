import isEqualish from './isEqualish';

describe('compare', () => {
    it('arrays should be true when different order', () => {
        const obj1 = { x: 1, y: 2 };
        const obj2 = { x: 3, y: 4 };

        const a = [obj1, obj2];
        const b = [obj2, obj1];

        expect(isEqualish(a, b)).toBeTruthy();
    });

    it('different objects should be false', () => {
        const obj1 = { x: 1, y: 2 };
        const obj2 = { x: 3, y: 4 };

        expect(isEqualish(obj1, obj2)).toBeFalsy();
    });

    it('objects with arrays should be true', () => {
        const obj1 = { x: 1, y: [1, 2, 3] };
        const obj2 = { x: 1, y: [1, 2, 3] };

        expect(isEqualish(obj1, obj2)).toBeTruthy();
    });

    it('objects with arrays in different order should be true', () => {
        const obj1 = { x: 1, y: [1, 2, 3] };
        const obj2 = { x: 1, y: [2, 1, 3] };

        expect(isEqualish(obj1, obj2)).toBeTruthy();
    });

    it('objects with different array lengths should false', () => {
        const obj1 = { x: 1, y: [1, 2, 3] };
        const obj2 = { x: 1, y: [2, 1, 3, 4] };

        expect(isEqualish(obj1, obj2)).toBeFalsy();
    });

    it('objects with different array values should false', () => {
        const obj1 = { x: 1, y: [1, 2, 3] };
        const obj2 = { x: 1, y: [2, 1, 4] };

        expect(isEqualish(obj1, obj2)).toBeFalsy();
    });
});
