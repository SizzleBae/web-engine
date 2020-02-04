import { PrimitiveProperty } from "./PrimitiveProperty";
import { SerializeUtils } from "./SerializeUtils";
import { ObjectProperty } from "./ObjectProperty";
import { Serializable } from "./Serializable";
import { ArrayProperty } from "./ArrayProperty";

describe('SerializeUtils', () => {
    it('can handle primtives', () => {
        const serializing = new PrimitiveProperty<number>(69);

        const json = SerializeUtils.serializeProperty(serializing);

        const deserializing = new PrimitiveProperty<number>();

        SerializeUtils.deserializeProperty(deserializing, json);

        expect(deserializing.getS()).toBe(serializing.getS());
    });

    @Serializable('test.ObjectTest')
    class ObjectTest {
        value1 = new PrimitiveProperty<number>(1);
        value2 = new PrimitiveProperty<number>(3);
        value3 = new PrimitiveProperty<number>(2);
    }

    it('can handle objects', () => {
        const serializing = new ObjectProperty<ObjectTest>(new ObjectTest());
        serializing.getS().value1.set(69);

        const json = SerializeUtils.serializeProperty(serializing);

        const deserializing = new ObjectProperty<ObjectTest>();

        SerializeUtils.deserializeProperty(deserializing, json);

        expect(deserializing.getS().value1.getS()).toBe(69);
        expect(serializing.getS()).not.toBe(deserializing.getS());
    });

    it('can handle arrays', () => {
        const serializing = new ArrayProperty<ObjectProperty<ObjectTest>>([]);
        serializing.getS().push(new ObjectProperty(new ObjectTest()));
        serializing.getS().push(new ObjectProperty(new ObjectTest()));
        serializing.getS().push(new ObjectProperty(new ObjectTest()));
        serializing.getS()[1].getS().value2.set(69);

        const json = SerializeUtils.serializeProperty(serializing);

        const deserializing = new ArrayProperty<ObjectProperty<ObjectTest>>();

        SerializeUtils.deserializeProperty(deserializing, json);

        expect(deserializing.getS()[1].getS().value2.getS()).toBe(69);
        expect(serializing.getS()[1].getS()).not.toBe(deserializing.getS()[1].getS());
    });
});