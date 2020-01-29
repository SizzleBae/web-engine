import { PrimitiveProperty } from './PrimitiveProperty';

describe('PrimitiveProperty', () => {
    it('can serialize', () => {
        const serializingString = new PrimitiveProperty<string>('Hello, I am string!');
        const deserializingString = new PrimitiveProperty<string>();
        deserializingString.fromJSON(serializingString.toJSON());
        expect(deserializingString.get()).toBe('Hello, I am string!');

        const serializingNumber = new PrimitiveProperty<number>(69);
        const deserializingNumber = new PrimitiveProperty<number>();
        deserializingNumber.fromJSON(serializingNumber.toJSON());
        expect(deserializingNumber.get()).toBe(69);

        const serializingBool = new PrimitiveProperty<boolean>(true);
        const deserializingBool = new PrimitiveProperty<boolean>();
        deserializingBool.fromJSON(serializingBool.toJSON());
        expect(deserializingBool.get()).toBe(true);

        expect(() => deserializingString.fromJSON(serializingNumber.toJSON())).toThrow();
        expect(() => deserializingNumber.fromJSON({ what: 'what' })).toThrow();

        deserializingString.set(undefined);
        expect(() => deserializingString.fromJSON(serializingNumber.toJSON())).not.toThrow();
    });
});