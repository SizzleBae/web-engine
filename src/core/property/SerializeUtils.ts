import { Primitive } from "./PrimitiveProperty";
import { DynamicProperty } from "./Property";
import { META_SERIALIZABLE_ID_KEY } from "./Serializable";

export class SerializeUtils {
    public static serializePrimitive<T extends Primitive>(primitive: T): string {
        switch (typeof primitive) {
            case 'string':
                return primitive;
            case 'number':
                return primitive.toString();
            case 'boolean':
                return primitive.toString();
        }
        //throw new Error(`Failed to serialize primitive property, it isn't a primitive? ${primitive}`);
    }

    public static deserializePrimitive(primitive: string): Primitive {

        const parsedNumber = Number.parseFloat(primitive);
        if (!isNaN(parsedNumber)) {
            return parsedNumber;
        }

        if (primitive === 'true') {
            return true;
        } else if (primitive === 'false') {
            return false;
        }

        return primitive;
    }

    public static serializeObject(object: Object | null): string {
        if (object === null) {
            return 'null';
        }

        // Only serializable objects will be serialized, meaning there must be a matching constructor mapped for the object
        const constructorKey = Reflect.get(object.constructor, META_SERIALIZABLE_ID_KEY);
        if (constructorKey === undefined) {
            return 'null';
        }

        let result = `{(${constructorKey})`;

        for (const [key, value] of Object.entries(object)) {
            if (value instanceof DynamicProperty) {
                result = result.concat(key, ':', value.serialize(), ';');
            }
        }

        return result + '}';

    }
}