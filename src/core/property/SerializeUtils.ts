import { META_SERIALIZABLE_ID_KEY } from "./Serializable";
import { DynamicProperty, SerializedProperty } from "./Property";
import uuidv1 from 'uuid/v1'
import { SerializableConstructorMap } from "./SerializableConstructorMap";
import { ObjectProperty } from "./ObjectProperty";
import { ArrayProperty } from "./ArrayProperty";

export class SerializeUtils {

    static serializeObjects(objects: object[]): string {

        // Create lookup for given objects using uuid
        const lookup = new Map<object, string>();
        objects.forEach(object => {
            lookup.set(object, uuidv1());
        });

        // Serialize each object into a json and insert that with its id in the final json
        const outJSON = {} as any;
        objects.forEach(object => {
            const objectJSON = {} as any;
            const constructorID = Reflect.get(object.constructor, META_SERIALIZABLE_ID_KEY);
            if (constructorID !== undefined) {
                objectJSON['constructorID'] = constructorID;

                for (const [propertyKey, propertyValue] of Object.entries(object)) {
                    if (propertyValue instanceof DynamicProperty) {
                        objectJSON[propertyKey] = propertyValue.serialize(lookup);
                    }
                }

                outJSON[lookup.get(object) as string] = objectJSON;
            }
        });

        return JSON.stringify(outJSON);
    }

    static derializeObjects(inJSONString: string): object[] {
        const inJSON = JSON.parse(inJSONString);

        // Prepare lookup of deserializing objects, calling the default constructor of the serialized objects
        const lookup = new Map<string, object>();
        for (const [objectID, objectJSON] of Object.entries(inJSON) as [string, any][]) {

            // Find constructor that matches serialized object
            const Constructor = SerializableConstructorMap.instance().getOwnerConstructor(objectJSON['constructorID']);
            if (Constructor === undefined) {
                throw new Error(`Failed to deserialize object property. Missing constructor id for - ${objectJSON}`)
            }
            const object = new Constructor();

            lookup.set(objectID, object);
        }

        const result: object[] = [];
        for (const [objectID, object] of lookup) {
            const objectJSON = inJSON[objectID];

            for (const [propertyKey, propertyValue] of Object.entries(object)) {
                if (propertyValue instanceof DynamicProperty) {
                    const propertyJSON = objectJSON[propertyKey];
                    if (propertyJSON === undefined) {
                        console.warn(`Failed to deserialize property - ${propertyValue}. Missing property data in json.`);
                    }

                    propertyValue.deserialize(lookup, propertyJSON);
                }
            }

            result.push(object);
        }

        return result;
    }

    static findObjects(entries: object[], predicate: (object: any) => boolean): object[] {
        const result: object[] = [];

        entries.forEach(entry => {
            this.recursiveObjectSearch(result, entry, predicate);
        });

        return result;
    }

    private static recursiveObjectSearch(result: object[], current: object, predicate: (object: any) => boolean) {
        if (current === undefined) {
            return;
        }

        if (predicate(current) && !result.includes(current)) {
            result.push(current);

            for (const [propertyKey, propertyValue] of Object.entries(current)) {

                if (propertyValue instanceof ObjectProperty) {
                    SerializeUtils.recursiveObjectSearch(result, propertyValue.get(), predicate);
                } else if (propertyValue instanceof ArrayProperty) {
                    propertyValue.get()?.forEach(element => {
                        if (propertyValue instanceof ObjectProperty) {
                            SerializeUtils.recursiveObjectSearch(result, element.get(), predicate);
                        }
                    });
                }
            }
        }
    }
}































// import { Primitive } from "./PrimitiveProperty";
// import { DynamicProperty } from "./Property";
// import { META_SERIALIZABLE_ID_KEY } from "./Serializable";
// import { SerializableConstructorMap } from "./SerializableConstructorMap";

// export class SerializeUtils {
//     public static serializePrimitive<T extends Primitive>(primitive: T): string {
//         switch (typeof primitive) {
//             case 'string':
//                 return `"${primitive}"`;
//             case 'number':
//                 return primitive.toString();
//             case 'boolean':
//                 return primitive.toString();
//         }
//         //throw new Error(`Failed to serialize primitive property, it isn't a primitive? ${primitive}`);
//     }

//     public static deserializePrimitive(primitive: string): Primitive {
//         const parsedNumber = Number.parseFloat(primitive);
//         if (!isNaN(parsedNumber)) {
//             return parsedNumber;
//         }

//         if (primitive === 'true') {
//             return true;
//         } else if (primitive === 'false') {
//             return false;
//         }

//         return primitive;
//     }

//     public static serializeObject(object: Object | null): string {
//         if (object === null) {
//             return 'null';
//         }

//         // Only serializable objects will be serialized, meaning there must be a matching constructor mapped for the object
//         const constructorKey = Reflect.get(object.constructor, META_SERIALIZABLE_ID_KEY);
//         if (constructorKey === undefined) {
//             return 'null';
//         }

//         let result = `{(${constructorKey})`;

//         for (const [key, value] of Object.entries(object)) {
//             if (value instanceof DynamicProperty) {
//                 result = result.concat(key, ':', value.serialize(), ';');
//             }
//         }

//         return result + '}';
//     }

//     public static deserializeObject(object: string): Object {
//         console.log(object);
//         // Check that this is an object
//         if (object[0] !== '{' || object[object.length - 1] !== '}') {
//             throw new Error(`Failed to deserialize object, missing {} encapsulation: ${object}`);
//         }

//         // Remove {}
//         object = object.substring(1, object.length - 1);

//         // Get constructor identifier
//         const constructorIdExp = /\(.*?\)/;
//         const constructorMatch = constructorIdExp.exec(object);
//         if (constructorMatch === null) {
//             throw new Error(`Failed to deserialize object, invalid constructor id: ${object}`);
//         }

//         // Remove () from id
//         const constructorID = constructorMatch[0].substring(1, constructorMatch[0].length - 1);

//         const SerializableConstructor = SerializableConstructorMap.instance().getOwnerConstructor(constructorID);
//         if (SerializableConstructor === undefined) {
//             throw new Error(`Failed to deserialize object, constructor id matches no constructor: ${constructorID}`);
//         }

//         const resultObject = new SerializableConstructor() as Object;

//         // Remove (constructor id) from string
//         object = object.replace(constructorMatch[0], "");

//         const propertyPairs = new Map<string, string>();
//         let index = 0;
//         console.log(object);
//         while (index !== -1) {
//             const keyStart = index;

//             index = object.indexOf(':', index);

//             if (index === -1) {
//                 break;
//             }

//             const propertyKey = object.substring(keyStart, index);

//             const property = Object.entries(resultObject).find(([key, value]) => key === propertyKey)?.[1];

//             if (property === undefined) {
//                 throw new Error(`Failed to deserialize object, constructed object - ${resultObject} - is missing property: ${propertyKey}`);
//             }

//             if (property instanceof DynamicProperty) {
//                 const valueStart = index + 1;

//                 if (object[valueStart] === '[') {
//                     // This is an object property
//                     property.deserialize(this.getClosedSubstring(object, valueStart, '[', ']'));
//                 } else if (object[valueStart] === '{') {
//                     property.deserialize(this.getClosedSubstring(object, valueStart, '{', '}'));
//                 } else {
//                     // This is a primitive property
//                     index = object.indexOf(';', index);

//                     if (index === -1) {
//                         throw new Error(`Failed to deserialize object, couldn't match primtive - ${propertyKey} - in: ${object}`);
//                     }

//                     property.deserialize(object.substring(valueStart, index));

//                 }
//             } else {
//                 throw new Error(`Failed to deserialize object, can't assign value to non dynamic property - ${propertyKey} - in ${resultObject}`);
//             }
//             index++;

//             // if (object[index] === ':') {
//             //     const propertyKey = object.substring(keyStart, index);

//             //     const property = Object.entries(resultObject).find(([key, value]) => key === propertyKey)?.[1];

//             //     if (property === undefined) {
//             //         throw new Error(`Failed to deserialize object, constructed object - ${resultObject} - is missing property: ${propertyKey}`);
//             //     }

//             //     if (property instanceof DynamicProperty) {
//             //         if (object[index + 1] === '[' || object[index + 1] === '{') {
//             //             // This is an object property

//             //         } else {
//             //             // This is a primitive property
//             //             const primitiveExp = /.*?;/;

//             //             const primitiveMatch = primitiveExp.exec(object.substring(index + 1, object.length));

//             //             if (!primitiveMatch) {
//             //                 throw new Error(`Failed to deserialize object, couldn't match primtive - ${propertyKey} - in: ${object}`);
//             //             }

//             //             property.deserialize(primitiveMatch[0].substring(0, primitiveMatch[0].length - 1));

//             //             index += primitiveMatch[0].length;

//             //         }

//             //         keyStart = index + 1;

//             //     } else {
//             //         throw new Error(`Failed to deserialize object, can't assign value to non dynamic property - ${propertyKey} - in ${resultObject}`);
//             //     }
//             // }
//         }

//         console.log(object);
//         return new Object();

//     }

//     public static getClosedSubstring(target: string, start: number, characterOpen: string, characterClose: string): string {
//         let index = start;

//         // Find first open
//         let openCount = 0;
//         while (index < target.length) {
//             if (target[index] === characterOpen) {
//                 openCount++;
//                 break;
//             }
//             index++;
//         }

//         // Return empty if there is no opening character
//         if (openCount === 0) {
//             return "";
//         }

//         const startIndex = index;

//         while (openCount > 0 && ++index < target.length) {

//             if (target[index] === characterOpen) {
//                 openCount++;
//             } else if (target[index] === characterClose) {
//                 openCount--;
//             }

//         }

//         // Return empty if there wasn't enough closing characters
//         if (openCount > 0) {
//             return "";
//         }

//         const endIndex = index;

//         return target.substring(startIndex, endIndex + 1);

//     }
// }