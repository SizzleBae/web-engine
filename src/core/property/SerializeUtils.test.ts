import { SerializeUtils } from "./SerializeUtils";
import { Serializable } from "./Serializable";
import { PNumber } from "../new-property/PNumber";
import { Property } from "../new-property/Property";
import { PData } from "../new-property/PData";
import { PReference } from "../new-property/PReference";
import { PArray } from "../new-property/PArray";

describe('SerializeUtils', () => {

    @Serializable('test.ObjectTest')
    class ObjectTest {
        value1 = new Property(new PNumber(), 1)
        value2 = new Property(new PNumber(), 2)
        value3 = new Property(new PNumber(), 3)
    }

    @Serializable('test.ObjectTest2')
    class ObjectTest2 {
        object1 = new Property(new PReference<ObjectTest>(), new ObjectTest());
        object2 = new Property(new PReference<ObjectTest2>(), undefined);
        array1 = new Property(new PArray<ObjectTest2>(), []);
    }

    it('can serialize objects', () => {
        const serializing = new ObjectTest();
        serializing.value1.set(69);

        const json = SerializeUtils.serializeObjects([serializing]);

        const deserializing = SerializeUtils.derializeObjects(json)[0] as ObjectTest;

        expect(deserializing.value1.get()).toBe(69);
        expect(serializing).not.toBe(deserializing);
    });

    const target = new ObjectTest2();
    target.object1.set(new ObjectTest());
    target.object2.set(target);
    target.array1.get()?.push(new Property(new PReference(), target));
    target.array1.get()?.push(new Property(new PReference(), new ObjectTest2()));

    const serializedNoRefs = SerializeUtils.stringify(SerializeUtils.serializeObjects([target], false));
    const deserializedNoRefs = SerializeUtils.derializeObjects(SerializeUtils.parse(serializedNoRefs))[0] as ObjectTest2;

    it('can serialize only relevant references', () => {
        expect(deserializedNoRefs.object1.get()).toBeUndefined();
        expect(deserializedNoRefs.object2.get()).toBe(deserializedNoRefs);
        expect(deserializedNoRefs.array1.get()?.[0].get()).toBe(deserializedNoRefs);
        expect(deserializedNoRefs.array1.get()?.[1].get()).toBeUndefined();
    });

    const deserializedRefs = SerializeUtils.derializeObjects(SerializeUtils.serializeObjects([target], true))[0] as ObjectTest2;

    it('can serialize and keep external references', () => {
        expect(deserializedRefs.object1.get()).toBe(target.object1.get());
        expect(deserializedRefs.object2.get()).toBe(deserializedRefs);
        expect(deserializedRefs.array1.get()?.[0].get()).toBe(deserializedRefs);
        expect(deserializedRefs.array1.get()?.[1].get()).toBe(target.array1.get()?.[1].get());
    });
});