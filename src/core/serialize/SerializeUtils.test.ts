import { SerializeUtils } from "./SerializeUtils";
import { Serializable } from "./Serializable";
import { PType } from "../property/DynamicProperty";
import { PData } from "../property/PData";
import { PReference } from "../property/PReference";
import { Property } from "../property/Property";
import { ArrayProperty } from "../property/ArrayProperty";

describe('SerializeUtils', () => {

    @Serializable('test.ObjectTest')
    class ObjectTest {
        value1 = new Property(PType.Number, 1)
        value2 = new Property(PType.Number, 2)
        value3 = new Property(PType.Number, 3)
    }

    @Serializable('test.ObjectTest2')
    class ObjectTest2 {
        object1 = new Property<ObjectTest>(PType.Data, new ObjectTest());
        object2 = new Property<ObjectTest2>(PType.Reference);
        array1 = new ArrayProperty<ObjectTest2>(PType.Reference, []);
        prop1 = new Property<Property<ObjectTest>>(PType.Reference);
    }

    it('can serialize and deserialize objects', () => {
        const serializing = new ObjectTest2();
        serializing.object1.get()?.value1.set(69);
        serializing.object2.set(serializing);

        const serializing2 = new ObjectTest2();
        serializing2.object1.get()?.value1.set(96);

        serializing2.prop1.set(serializing.object1);

        const outsider = new ObjectTest2();
        outsider.object1.get()?.value1.set(123);

        serializing2.object2.set(outsider);
        serializing2.array1.get()?.push(serializing, outsider, serializing2);

        const serialized = SerializeUtils.serializeObjects([serializing, serializing2], false);

        const deserialized = SerializeUtils.derializeObjects(serialized);

        const deserializing = deserialized[0] as ObjectTest2;
        const deserializing2 = deserialized[1] as ObjectTest2;

        expect(deserializing.object1.get()?.value1.get()).toBe(69);
        expect(deserializing2.object1.get()?.value1.get()).toBe(96);

        expect(deserializing2.array1.get()?.[0]).toBe(deserializing);
        //expect(deserializing2.array1.get()?.[1].get()).toBe(outsider);
        expect(deserializing2.array1.get()?.[2]).toBe(deserializing2);

        //expect(deserializing2.array1.get()?.[1].get()?.object1.get()?.value1.get()).toBe(123);

        expect(deserializing2.prop1.get()?.get()).toBe(deserializing.object1.get());

        expect(serializing).not.toBe(deserializing);
        expect(serializing2).not.toBe(deserializing2);
    });

});