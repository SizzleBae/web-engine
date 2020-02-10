import { META_SERIALIZABLE_ID_KEY } from "./Serializable";
import { DynamicProperty } from "./Property";
import { SerializableConstructorMap } from "./SerializableConstructorMap";
import { ObjectProperty } from "./ObjectProperty";
import { ArrayProperty } from "./ArrayProperty";
import uuidv1 from 'uuid/v1'

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

    /**
     * Copies properties that have the same key and same property type from source to target.
     * 
     * Only properties that have undefined values in target are overriden.
     * @param source The object with properties to copy from
     * @param target The object that will receive copied properties
     */
    static mergeProperties(source: object, target: object) {
        // Extract source properties
        const sourceProperties = new Map<string, DynamicProperty<any>>();
        for (const [propertyKey, propertyValue] of Object.entries(source)) {
            if (propertyValue instanceof DynamicProperty) {
                sourceProperties.set(propertyKey, propertyValue);
            }
        }

        // Extract target properties
        const targetProperties = new Map<string, DynamicProperty<any>>();
        for (const [propertyKey, propertyValue] of Object.entries(target)) {
            if (propertyValue instanceof DynamicProperty) {
                targetProperties.set(propertyKey, propertyValue);
            }
        }

        sourceProperties.forEach((sourceProperty, sourceKey) => {
            if (targetProperties.has(sourceKey)) {
                const targetProperty = targetProperties.get(sourceKey) as DynamicProperty<any>;

                if (targetProperty instanceof sourceProperty.constructor) {
                    if (targetProperty.get() === undefined) {
                        targetProperty.set(sourceProperty.get());
                    }
                }
            }
        });
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
                        if (element instanceof ObjectProperty) {
                            SerializeUtils.recursiveObjectSearch(result, element.get(), predicate);
                        }
                    });
                }
            }
        }
    }
}