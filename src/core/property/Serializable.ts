import { SerializableConstructorMap } from "./SerializableConstructorMap";
import uuidv1 from 'uuid/v1'

export const META_SERIALIZABLE_ID_KEY = "serializableID";

export const Serializable = (id: string) => {

    return <T extends { new(): {} }>(constructor: T) => {
        Reflect.set(constructor, META_SERIALIZABLE_ID_KEY, id);
        SerializableConstructorMap.instance().registerSerializableConstructor(id, constructor);

    }
}