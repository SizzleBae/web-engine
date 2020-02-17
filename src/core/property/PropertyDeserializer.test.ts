import { ArrayProperty } from "./ArrayProperty";
import { ObjectProperty } from "./ObjectProperty";
import { Serializable } from "./Serializable";
import { PrimitiveProperty } from "./PrimitiveProperty";
import { PropertySerializer } from "./PropertySerializer";
import { PropertyDeserializer } from "./PropertyDeserializer";

@Serializable('test.ObjectTest')
class ObjectTest {
    obj = new ObjectProperty<ObjectTest>();
    prim = new PrimitiveProperty<string>("Hello! I am string");
}

const obj1 = new ObjectTest();
const obj2 = new ObjectTest();
const obj3 = new ObjectTest();
const testProp = new ArrayProperty(
    [
        new ObjectProperty(obj1),
        new ObjectProperty(obj2),
        new ObjectProperty(obj3)
    ]
);

const serializer = new PropertySerializer(true)
const serialized = serializer.serialize(testProp);

describe('PropertySerializer', () => {
    it('can serialize properties', () => {

        expect(serialized).toBeDefined();
    });
});

const deserializer = new PropertyDeserializer()
const deserialized = deserializer.deserialize(serialized) as ArrayProperty<ObjectTest>;

describe('PropertyDeserializer', () => {
    it('can deserialize properties', () => {
        expect(deserialized).toBeDefined();
        expect(deserialized.getS()[0].get()).toBe(obj1);
    });
});
