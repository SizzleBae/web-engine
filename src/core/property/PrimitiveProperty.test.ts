import { PrimitiveProperty } from './PrimitiveProperty';
import { SerializeUtils } from './SerializeUtils';

describe('PrimitiveProperty', () => {
    it('can serialize', () => {
        const serializingString = new PrimitiveProperty<string>('Hello, I am string!');
        const deserializingString = new PrimitiveProperty<string>();
        SerializeUtils.deserializeProperty(deserializingString, SerializeUtils.serializeProperty(serializingString));
        expect(deserializingString.get()).toBe('Hello, I am string!');

        const serializingNumber = new PrimitiveProperty<number>(69);
        const deserializingNumber = new PrimitiveProperty<number>();
        SerializeUtils.deserializeProperty(deserializingNumber, SerializeUtils.serializeProperty(serializingNumber));
        expect(deserializingNumber.get()).toBe(69);

        const serializingBool = new PrimitiveProperty<boolean>(true);
        const deserializingBool = new PrimitiveProperty<boolean>();
        SerializeUtils.deserializeProperty(deserializingBool, SerializeUtils.serializeProperty(serializingBool));
        expect(deserializingBool.get()).toBe(true);

        // expect(() => deserializingString.fromJSON(serializingNumber.toJSON())).toThrow();
        // expect(() => deserializingNumber.fromJSON({ what: 'what' })).toThrow();

        // deserializingString.set(undefined);
        // expect(() => deserializingString.fromJSON(serializingNumber.toJSON())).not.toThrow();
    });
});