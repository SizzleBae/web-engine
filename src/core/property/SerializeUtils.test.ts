import { SerializeUtils } from "./SerializeUtils";
import { Serializable } from "./Serializable";
import { PNumber } from "./PNumber";
import { Property } from "./Property";
import { PData } from "./PData";
import { PReference } from "./PReference";
import { PArray } from "./PArray";

describe('SerializeUtils', () => {

    @Serializable('test.ObjectTest')
    class ObjectTest {
        value1 = new PNumber(1)
        value2 = new PNumber(2)
        value3 = new PNumber(3)
    }

    @Serializable('test.ObjectTest2')
    class ObjectTest2 {
        object1 = new PData<ObjectTest>(new ObjectTest());
        object2 = new PReference<ObjectTest2>(undefined);
        array1 = new PArray<ObjectTest2>([]);
    }

    it('can serialize and deserialize objects', () => {
        const serializing = new ObjectTest2();
        serializing.object1.get()?.value1.set(69);
        serializing.object2.set(serializing);

        const serializing2 = new ObjectTest2();
        serializing2.object1.get()?.value1.set(96);

        const outsider = new ObjectTest2();
        outsider.object1.get()?.value1.set(123);

        serializing2.object2.set(outsider);
        serializing2.array1.get()?.push(
            new PReference(serializing),
            new PReference(outsider),
            new PReference(serializing2));

        const serialized = SerializeUtils.serializeObjects([serializing, serializing2], true);

        const deserialized = SerializeUtils.derializeObjects(serialized);

        const deserializing = deserialized[0] as ObjectTest2;
        const deserializing2 = deserialized[1] as ObjectTest2;

        expect(deserializing.object1.get()?.value1.get()).toBe(69);
        expect(deserializing2.object1.get()?.value1.get()).toBe(96);

        expect(deserializing2.array1.get()?.[0].get()).toBe(deserializing);
        expect(deserializing2.array1.get()?.[1].get()).toBe(outsider);
        expect(deserializing2.array1.get()?.[2].get()).toBe(deserializing2);

        expect(deserializing2.array1.get()?.[1].get()?.object1.get()?.value1.get()).toBe(123);

        expect(serializing).not.toBe(deserializing);
        expect(serializing2).not.toBe(deserializing2);
    });

});