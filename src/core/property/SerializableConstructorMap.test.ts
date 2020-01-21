import { SerializableConstructorMap } from "./SerializableConstructorMap";
import { Serializable, META_SERIALIZABLE_ID_KEY } from "./Serializable";

describe("PropertOwnerConstructorMap", () => {
    it("registers constructors", () => {
        @Serializable('test.RegisterTest')
        class RegisterTest {
            value: string;
            constructor() {
                this.value = "testValue";
            }
        }

        const test = new RegisterTest();
        let constructor = SerializableConstructorMap.instance().getOwnerConstructor(Reflect.get(RegisterTest, META_SERIALIZABLE_ID_KEY));

        expect(constructor).toBeDefined();
        if (constructor) {
            let constructed = new constructor();

            expect(constructed).toBeInstanceOf(RegisterTest);
        }
    })
});