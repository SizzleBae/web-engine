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

    it('can find objects', () => {
        const target = new ObjectTest2();
        target.object1.set(new ObjectTest());
        target.object2.set(new ObjectTest2());
        target.object2.getS().object2.set(target);
        target.array1.getS().push(new ObjectProperty(target));
        target.array1.getS().push(new ObjectProperty(new ObjectTest2()));
        const target2 = new ObjectTest2();
        target2.object1.set(target.object1.get());
        target2.object2.set(target);
        target.array1.getS().push(new ObjectProperty(target2));

        const searchResult = SerializeUtils.findObjects([target, target2], object => object instanceof ObjectTest2);
        expect(searchResult.length).toBe(4);
    });

    const target = new ObjectTest2();
    target.object1.set(new ObjectTest());
    target.object2.set(target);
    target.array1.getS().push(new ObjectProperty(target));
    target.array1.getS().push(new ObjectProperty(new ObjectTest2()));

    const serializedString = SerializeUtils.serializeObjects([target]);

    const deserializedTarget = SerializeUtils.derializeObjects(serializedString)[0] as ObjectTest2;

    it('can serialize only relevant references', () => {
        expect(deserializedTarget.object1.get()).toBeUndefined();
        expect(deserializedTarget.object2.get()).toBe(deserializedTarget);
        expect(deserializedTarget.array1.getS()[0].get()).toBe(deserializedTarget);
        expect(deserializedTarget.array1.getS()[1].get()).toBeUndefined();
    });
});