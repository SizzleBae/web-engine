import { META_SERIALIZABLE_ID_KEY } from "./Serializable";
import { SerializableConstructorMap } from "./SerializableConstructorMap";
import { ObjectProperty } from "./ObjectProperty";
import { ArrayProperty } from "./ArrayProperty";
import { PropertyUtils } from "./PropertyUtils";
import { PropertySerializer } from "./PropertySerializer";
import uuidv1 from 'uuid/v1'
import { PropertyDeserializer } from "./PropertyDeserializer";

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

    static serializeObjects(targets: object[], keepExternal: boolean = false): any {
        // Create lookup for given objects using uuid
        const lookup = new Map<object, string>();
        targets.forEach(object => {
            lookup.set(object, uuidv1());
        });
        const serializer = new PropertySerializer(keepExternal, lookup);

        // Serialize each object into a json and insert that with its id in the final json
        const outJSON = {} as any;
        targets.forEach(object => {
            const objectJSON = {} as any;
            const constructorID = Reflect.get(object.constructor, META_SERIALIZABLE_ID_KEY);
            if (constructorID !== undefined) {
                objectJSON['constructorID'] = constructorID;

                PropertyUtils.forEachPropertyIn(object, (property, key) => {
                    objectJSON[key] = serializer.serialize(property);
                });

                outJSON[lookup.get(object) as string] = objectJSON;
            }
        });

        return outJSON;
    }

    static derializeObjects(inJSON: any): object[] {
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
        const deserializer = new PropertyDeserializer(lookup);
        for (const [objectID, object] of lookup) {
            const objectJSON = inJSON[objectID];

            PropertyUtils.forEachPropertyIn(object, (property, key) => {
                const propertyJSON = objectJSON[key];
                if (propertyJSON === undefined) {
                    console.warn(`Failed to deserialize property - ${property}. Missing property data in json.`);
                }

                property.copyFrom(deserializer.deserialize(propertyJSON));

            });

            result.push(object);
        }

        return result;
    }

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
                        if (element instanceof ObjectProperty) {
                            SerializeUtils.recursiveObjectSearch(result, element.get(), predicate);
                        }
                    });
                }
            }
        }
    }
}