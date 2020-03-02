import { META_SERIALIZABLE_ID_KEY } from "./Serializable";
import { SerializableConstructorMap } from "./SerializableConstructorMap";
import { PropertyUtils } from "./PropertyUtils";
import uuidv1 from 'uuid/v1'
import { PropertySerializer } from "./PropertySerializer";
import { PropertyDeserializer } from "./PropertyDeserializer";
import { SerializedObject, SerializedObjects } from "./SerializedObject";
import { Property } from "./Property";

export class SerializeUtils {

    // static serializeObjects(objects: object[]): string {

    //     // Create lookup for given objects using uuid
    //     const lookup = new Map<object, string>();
    //     objects.forEach(object => {
    //         lookup.set(object, uuidv1());
    //     });

    //     // Serialize each object into a json and insert that with its id in the final json
    //     const outJSON = {} as any;
    //     objects.forEach(object => {
    //         const objectJSON = {} as any;
    //         const constructorID = Reflect.get(object.constructor, META_SERIALIZABLE_ID_KEY);
    //         if (constructorID !== undefined) {
    //             objectJSON['constructorID'] = constructorID;

    //             PropertyUtils.forEachPropertyIn(object, (property, key) => {
    //                 objectJSON[key] = property.serialize(lookup);
    //             });

    //             outJSON[lookup.get(object) as string] = objectJSON;
    //         }
    //     });

    //     return JSON.stringify(outJSON);
    // }

    // static cloneObjects(targets: object[]): object[] {
    //     return SerializeUtils.derializeObjects(SerializeUtils.serializeObjects(targets, true));
    // }

    static serializeObjects(targets: object[], keepExternal: boolean = false): SerializedObjects {
        // Create lookup for given objects using uuid
        const lookup = new Map<object, string>();

        const properties = new Set<Property<any>>();
        const objects = new Set<object>();

        targets.forEach(object => {
            lookup.set(object, uuidv1());
            objects.add(object);

            PropertyUtils.forEachPropertyIn(object, (property, key) => {
                lookup.set(property, uuidv1());
                properties.add(property);
            });
        });

        const result = new SerializedObjects();

        // Serialize each property and add them to result
        const serializer = new PropertySerializer(keepExternal, lookup);
        properties.forEach(property => {
            result.properties[lookup.get(property) as string] = serializer.serialize(property);
        })

        // Serialize each object and add them to result
        targets.forEach(object => {
            const serializedObject = new SerializedObject();

            serializedObject.destruct(object);

            PropertyUtils.forEachPropertyIn(object, (property, key) => {
                serializedObject.data[key] = lookup.get(property);
            });

            result.objects[lookup.get(object) as string] = serializedObject;

        });

        return result;
    }

    static derializeObjects(data: SerializedObjects): object[] {
        // Create a lookup that will contain all properties and objects indexed by an id
        const lookup = new Map<string, object>();

        // Construct all serialized objects, map them to their data and add them to lookup
        const objects = new Map<object, SerializedObject>();
        for (const [objectID, serializedObject] of Object.entries(data.objects) as [string, SerializedObject][]) {
            const object = serializedObject.construct();

            objects.set(object, serializedObject);
            lookup.set(objectID, object);

        }

        // Find properties in constructed objects, map them to their serialized counterpart and add them to lookup
        const properties: Map<Property<any>, SerializedObject> = new Map();
        objects.forEach((serializedObject, object) => {
            PropertyUtils.forEachPropertyIn(object, (property, key) => {
                const propertyID = serializedObject.data[key] as string;

                if (propertyID) {
                    properties.set(property, data.properties[propertyID]);
                    lookup.set(propertyID, property);
                } else {
                    console.warn(`Failed to deserialize property ${property} in object ${object}. Missing property data in json.`);
                }
            });
        })

        // Finally, go through each property and deserialize them
        const deserializer = new PropertyDeserializer(lookup);
        properties.forEach((serializedProperty, property) => {
            deserializer.deserialize(property, serializedProperty);
        });

        return [...objects.keys()];
    }

    // static stringify(map: Map<string, SerializedObject>): string {
    //     return JSON.stringify([...map]);
    // }

    // static parse(string: string): Map<string, SerializedObject> {
    //     return new Map(JSON.parse(string));
    // }

    // static derializeObjects(inJSONString: string): object[] {
    //     const inJSON = JSON.parse(inJSONString);

    //     // Prepare lookup of deserializing objects, calling the default constructor of the serialized objects
    //     const lookup = new Map<string, object>();
    //     for (const [objectID, objectJSON] of Object.entries(inJSON) as [string, any][]) {

    //         // Find constructor that matches serialized object
    //         const Constructor = SerializableConstructorMap.instance().getOwnerConstructor(objectJSON['constructorID']);
    //         if (Constructor === undefined) {
    //             throw new Error(`Failed to deserialize object property. Missing constructor id for - ${objectJSON}`)
    //         }
    //         const object = new Constructor();

    //         lookup.set(objectID, object);
    //     }

    //     const result: object[] = [];
    //     for (const [objectID, object] of lookup) {
    //         const objectJSON = inJSON[objectID];

    //         PropertyUtils.forEachPropertyIn(object, (property, key) => {
    //             const propertyJSON = objectJSON[key];
    //             if (propertyJSON === undefined) {
    //                 console.warn(`Failed to deserialize property - ${property}. Missing property data in json.`);
    //             }

    //             property.deserialize(lookup, propertyJSON);

    //         });

    //         result.push(object);
    //     }

    //     return result;
    // }

    // /**
    //  * Copies properties that have the same key and same property type from source to target.
    //  * 
    //  * Only properties that have undefined values in target are overriden.
    //  * @param source The object with properties to copy from
    //  * @param target The object that will receive copied properties
    //  */
    // static mergeProperties(source: object, target: object) {
    //     // Extract source properties
    //     const sourceProperties = new Map<string, DynamicProperty<any>>();
    //     PropertyUtils.forEachPropertyIn(source, (property, key) => {
    //         sourceProperties.set(key, property);
    //     })

    //     // Extract target properties
    //     const targetProperties = new Map<string, DynamicProperty<any>>();
    //     for (const [propertyKey, propertyValue] of Object.entries(target)) {
    //         if (propertyValue instanceof DynamicProperty) {
    //             targetProperties.set(propertyKey, propertyValue);
    //         }
    //     }

    //     const merge = (source: DynamicProperty<any>, target: DynamicProperty<any>) => {
    //         if (target.get() === undefined) {
    //             target.copyFrom(source);
    //         }
    //     };
    //     sourceProperties.forEach((sourceProperty, sourceKey) => {
    //         if (targetProperties.has(sourceKey)) {
    //             const targetProperty = targetProperties.get(sourceKey) as DynamicProperty<any>;

    //             // TODO: Find a way to avoid branching on array properties, it's not pretty
    //             if (targetProperty instanceof sourceProperty.constructor) {
    //                 if (targetProperty instanceof ArrayProperty) {
    //                     for (let i = 0; i < sourceProperty)
    //                     // sourceProperty.getS().forEach((element: DynamicProperty<any>) => {
    //                     //     merge(sourceProperty, element);
    //                     // });
    //                 } else {
    //                     merge(sourceProperty, targetProperty);
    //                 }
    //             }
    //         }
    //     });
    // }

    // static findObjects(entries: object[], predicate: (object: any) => boolean = () => true): object[] {
    //     const result: object[] = [];

    //     entries.forEach(entry => {
    //         this.recursiveObjectSearch(result, entry, predicate);
    //     });

    //     return result;
    // }

    // private static recursiveObjectSearch(result: object[], current: object, predicate: (object: any) => boolean) {
    //     if (current === undefined) {
    //         return;
    //     }

    //     if (predicate(current) && !result.includes(current)) {
    //         result.push(current);

    //         for (const [propertyKey, propertyValue] of Object.entries(current)) {

    //             if (propertyValue instanceof ObjectProperty) {
    //                 SerializeUtils.recursiveObjectSearch(result, propertyValue.get(), predicate);

    //             } else if (propertyValue instanceof ArrayProperty) {
    //                 propertyValue.get()?.forEach(element => {
    //                     if (element instanceof ObjectProperty) {
    //                         SerializeUtils.recursiveObjectSearch(result, element.get(), predicate);
    //                     }
    //                 });
    //             }
    //         }
    //     }
    // }
}