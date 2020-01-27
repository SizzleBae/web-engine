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

        const Constructor = SerializableConstructorMap.instance().getOwnerConstructor(Reflect.get(RegisterTest, META_SERIALIZABLE_ID_KEY));

        expect(Constructor).toBeDefined();
        if (Constructor) {
            const constructed = new Constructor();

            expect(constructed).toBeInstanceOf(RegisterTest);
        }
    })
});