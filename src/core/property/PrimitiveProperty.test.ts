import { PrimitiveProperty } from './PrimitiveProperty';

describe('PrimitiveProperty', () => {
    it('can serialize', () => {
        const testStringPrimitive = new PrimitiveProperty<string>('Hello, I am string!');
        expect(testStringPrimitive.serialize()).toBe('Hello, I am string!');
        testStringPrimitive.deserialize('stringed');
        expect(testStringPrimitive.serialize()).toBe('stringed');
        expect(testStringPrimitive.get()).toBe('stringed');

        const testNumberPrimitive = new PrimitiveProperty<number>(69);
        expect(testNumberPrimitive.serialize()).toBe('69');
        testNumberPrimitive.deserialize('773');
        expect(testNumberPrimitive.serialize()).toBe('773');
        expect(testNumberPrimitive.get()).toBe(773);
        expect(() => testNumberPrimitive.deserialize('not a number')).toThrow();

        const testBooleanPrimitive = new PrimitiveProperty<boolean>(true);
        expect(testBooleanPrimitive.serialize()).toBe('true');
        testBooleanPrimitive.deserialize('false');
        expect(testBooleanPrimitive.serialize()).toBe('false');
        expect(testBooleanPrimitive.get()).toBe(false);
        expect(() => testBooleanPrimitive.deserialize('45')).toThrow();

    });
});