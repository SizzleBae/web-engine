import { SerializeUtils } from "./SerializeUtils";
import { Serializable } from "./Serializable";
import { PrimitiveProperty } from "./PrimitiveProperty";
import { ObjectProperty } from "./ObjectProperty";
import { ArrayProperty } from "./ArrayProperty";

describe('SerializeUtils', () => {
    @Serializable('test.TestObjectX')
    class TestObjectX {
        public readonly x = new PrimitiveProperty<number>(1);
        public readonly y = new PrimitiveProperty<number>(2);
        public readonly z = new PrimitiveProperty<number>(3);
    }

    @Serializable('test.TestObjectY')
    class TestObjectY {
        public readonly w = new PrimitiveProperty<number>(4);
        public readonly obj = new ArrayProperty<TestObjectX>([new TestObjectX(), new TestObjectX(), new TestObjectX()]);
    }

    it('can deserialize objects', () => {
        const testObjectX = new TestObjectX();
        const testObjectY = new TestObjectY();
        SerializeUtils.deserializeObject(SerializeUtils.serializeObject(testObjectX));
        SerializeUtils.deserializeObject(SerializeUtils.serializeObject(testObjectY));
    });
})