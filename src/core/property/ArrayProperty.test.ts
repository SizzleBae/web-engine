import { ArrayProperty } from "./ArrayProperty";
import { PrimitiveProperty } from "./PrimitiveProperty";
import { Serializable } from "./Serializable";
import { ObjectProperty } from "./ObjectProperty";
import { SerializeUtils } from "./SerializeUtils";

describe('ArrayProperty', () => {
    it('can serialize', () => {

        @Serializable('test.ArrayTest')
        class ArrayTest {
            rotation = new ArrayProperty<PrimitiveProperty<number>>([
                new PrimitiveProperty<number>(0),
                new PrimitiveProperty<number>(1),
                new PrimitiveProperty<number>(2)
            ]);

            woah = new ArrayProperty<ObjectProperty<ArrayTest>>([]);
        }

        const serializing = new ObjectProperty<ArrayTest>(new ArrayTest());
        serializing.getS().rotation.getS()[1].set(69);
        serializing.getS().woah.getS().push(new ObjectProperty(new ArrayTest()));
        serializing.getS().woah.getS().push(new ObjectProperty(new ArrayTest()));
        serializing.getS().woah.getS().push(new ObjectProperty(new ArrayTest()));
        serializing.getS().woah.getS()[1].getS().rotation.getS()[1].set(96);

        const json = SerializeUtils.serializeProperty(serializing);

        const deserializing = new ObjectProperty<ArrayTest>();
        SerializeUtils.deserializeProperty(deserializing, json);

        for (let i = 0; i < serializing.getS().rotation.getS().length; i++) {
            const original = serializing.getS().rotation.getS()[i].getS();
            const duplicate = deserializing.getS().rotation.getS()[i].getS();
            expect(original).toBe(duplicate)
        }
        expect(deserializing.getS().woah.getS()[1].getS().rotation.getS()[1].getS()).toBe(96);

    });
});