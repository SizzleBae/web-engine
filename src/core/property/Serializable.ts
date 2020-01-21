import { SerializableConstructorMap } from "./SerializableConstructorMap";

export const META_SERIALIZABLE_ID_KEY = "serializableID";

export const Serializable = (id: string) => {
    return (constructor: { new(...args: any[]): {} }) => {
        Reflect.set(constructor, META_SERIALIZABLE_ID_KEY, id);
        SerializableConstructorMap.instance().registerSerializableConstructor(id, constructor);
    }
}