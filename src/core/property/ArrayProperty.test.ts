import { ArrayProperty } from "./ArrayProperty";
import { PrimitiveProperty } from "./PrimitiveProperty";
import { Serializable } from "./Serializable";
import { ObjectProperty } from "./ObjectProperty";

describe('ArrayProperty', () => {
    it('can serialize', () => {

        @Serializable('test.ArrayTest')
        class ArrayTest {
            rotation = new ArrayProperty<PrimitiveProperty<number>>([
                new PrimitiveProperty<number>(0),
                new PrimitiveProperty<number>(1),
                new PrimitiveProperty<number>(2)
            ]);
        }

        const serializing = new ObjectProperty<ArrayTest>(new ArrayTest());
        serializing.get()?.rotation.get()?.[1].set(69);

        const json = serializing.toJSON();

        const deserializing = new ObjectProperty<ArrayTest>();
        deserializing.fromJSON(json);

        for (let i = 0; i < serializing.getS().rotation.getS().length; i++) {
            const original = serializing.getS().rotation.getS()[i].getS();
            const duplicate = deserializing.getS().rotation.getS()[i].getS();
            expect(original).toBe(duplicate)
        }

    });
});