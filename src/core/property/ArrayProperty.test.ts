import { ArrayProperty } from "./ArrayProperty";
import { PrimitiveProperty } from "./PrimitiveProperty";
import { Serializable } from "./Serializable";
import { ObjectProperty } from "./ObjectProperty";
import { SerializeUtils } from "./SerializeUtils";

describe('ArrayProperty', () => {
    it('can serialize', () => {

        @Serializable('test.ArrayTest')
        class ArrayTest {
            rotation = new ArrayProperty([
                new PrimitiveProperty<number>(0),
                new PrimitiveProperty<number>(1),
                new PrimitiveProperty<number>(2)
            ]);

            woah = new ArrayProperty<ArrayTest>([]);
        }

        const serializing = new ArrayTest();
        serializing.rotation.getS()[1].set(69);
        serializing.woah.getS().push(new ObjectProperty(new ArrayTest()));
        serializing.woah.getS().push(new ObjectProperty(new ArrayTest()));
        serializing.woah.getS().push(new ObjectProperty(new ArrayTest()));
        serializing.woah.getS()[1].getS().rotation.getS()[1].set(96);

        const json = SerializeUtils.serializeObjects(SerializeUtils.findObjects([serializing], () => true));

        const deserializing = SerializeUtils.derializeObjects(json)[0] as ArrayTest;

        for (let i = 0; i < serializing.rotation.getS().length; i++) {
            const original = serializing.rotation.getS()[i].getS();
            const duplicate = deserializing.rotation.getS()[i].getS();
            expect(original).toBe(duplicate)
        }
        expect(deserializing.woah.getS()[1].getS().rotation.getS()[1].getS()).toBe(96);

    });
});