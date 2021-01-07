import { SerializableConstructorMap } from "./SerializableConstructorMap";

export const META_SERIALIZABLE_ID_KEY = "serializableID";

export const Serializable = (id: string) => {

    return <T extends { new(...args: any[]): {} }>(constructor: T) => {
        Reflect.set(constructor, META_SERIALIZABLE_ID_KEY, id);
        SerializableConstructorMap.instance().registerSerializableConstructor(id, constructor);

    }
}