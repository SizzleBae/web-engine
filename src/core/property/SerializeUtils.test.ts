import { PrimitiveProperty } from "./PrimitiveProperty";
import { SerializeUtils } from "./SerializeUtils";
import { ObjectProperty } from "./ObjectProperty";
import { Serializable } from "./Serializable";
import { ArrayProperty } from "./ArrayProperty";

describe('SerializeUtils', () => {

    @Serializable('test.ObjectTest')
    class ObjectTest {
        value1 = new PrimitiveProperty<number>(1);
        value2 = new PrimitiveProperty<number>(3);
        value3 = new PrimitiveProperty<number>(2);
    }

    @Serializable('test.ObjectTest2')
    class ObjectTest2 {
        object1 = new ObjectProperty<ObjectTest>();
        object2 = new ObjectProperty<ObjectTest2>();
        array1 = new ArrayProperty<ObjectTest2>([]);
    }

    it('can serialize objects', () => {
        const serializing = new ObjectTest();
        serializing.value1.set(69);

        const json = SerializeUtils.serializeObjects([serializing]);

        const deserializing = SerializeUtils.derializeObjects(json)[0] as ObjectTest;

        expect(deserializing.value1.getS()).toBe(69);
        expect(serializing).not.toBe(deserializing);
    });

    const target = new ObjectTest2();
    target.object1.set(new ObjectTest());
    target.object2.set(target);
    target.array1.getS().push(new ObjectProperty(target));
    target.array1.getS().push(new ObjectProperty(new ObjectTest2()));

    const deserializedNoRefs = SerializeUtils.derializeObjects(JSON.parse(JSON.stringify(SerializeUtils.serializeObjects([target], false))))[0] as ObjectTest2;

    it('can serialize only relevant references', () => {
        expect(deserializedNoRefs.object1.get()).toBeUndefined();
        expect(deserializedNoRefs.object2.get()).toBe(deserializedNoRefs);
        expect(deserializedNoRefs.array1.getS()[0].get()).toBe(deserializedNoRefs);
        expect(deserializedNoRefs.array1.getS()[1].get()).toBeUndefined();
    });

    const deserializedRefs = SerializeUtils.derializeObjects(SerializeUtils.serializeObjects([target], true))[0] as ObjectTest2;

    it('can serialize and keep external references', () => {
        expect(deserializedRefs.object1.get()).toBe(target.object1.get());
        expect(deserializedRefs.object2.get()).toBe(deserializedRefs);
        expect(deserializedRefs.array1.getS()[0].get()).toBe(deserializedRefs);
        expect(deserializedRefs.array1.getS()[1].get()).toBe(target.array1.getS()[1].get());
    });
});