import { META_SERIALIZABLE_ID_KEY } from "./Serializable";
import { SerializableConstructorMap } from "./SerializableConstructorMap";
import { PropertyUtils } from "../property/PropertyUtils";
import uuidv1 from 'uuid/v1'
import { SerializedObject, SerializedObjects } from "./SerializedObject";
import { DynamicProperty } from "../property/DynamicProperty";
import { PropertyMemento } from "../property/PropertyMemento";

export class SerializeUtils {

    static serializeObjects(targets: object[], keepExternal: boolean = false): SerializedObjects {
        // Create lookup for given objects using uuid
        const lookup = new Map<object, string>();

        const properties = new Set<DynamicProperty<any>>();
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
        properties.forEach(property => {
            result.properties[lookup.get(property) as string] = property.memento(keepExternal, lookup);
        })

        // Serialize each object and add them to result
        targets.forEach(object => {
            const serializedObject = new SerializedObject();

            serializedObject.constructorID = Reflect.get(object.constructor, META_SERIALIZABLE_ID_KEY);
            if (serializedObject.constructorID) {
                PropertyUtils.forEachPropertyIn(object, (property, key) => {
                    serializedObject.properties[key] = lookup.get(property) as string;
                });

                result.objects[lookup.get(object) as string] = serializedObject;
            } else {
                console.warn('Attempted to serialize object that lacks a constructor id, dud you forget to add Serializable decorator to objects class? ');
            }
        });

        return result;
    }

    static derializeObjects(data: SerializedObjects): object[] {
        // Create a lookup that will contain all properties and objects indexed by an id
        const lookup = new Map<string, object>();

        // Construct all serialized objects, map them to their data and add them to lookup
        const objects = new Map<object, SerializedObject>();
        for (const [objectID, serializedObject] of Object.entries(data.objects)) {
            const object = SerializeUtils.constructFromID(serializedObject.constructorID);

            objects.set(object, serializedObject);
            lookup.set(objectID, object);

        }

        // Find properties in constructed objects, map them to their serialized counterpart and add them to lookup
        const properties: Map<DynamicProperty<any>, PropertyMemento> = new Map();
        objects.forEach((serializedObject, object) => {
            PropertyUtils.forEachPropertyIn(object, (property, key) => {
                const propertyID = serializedObject.properties[key];

                if (propertyID) {
                    properties.set(property, data.properties[propertyID]);
                    lookup.set(propertyID, property);
                } else {
                    console.warn(`Failed to deserialize property ${property} in object ${object}. Missing property data in json.`);
                }
            });
        })

        // Finally, go through each property and deserialize them
        properties.forEach((memento, property) => {
            property.restore(memento, lookup);
        });

        return [...objects.keys()];
    }

    static constructFromID(constructorID: string): object {
        const Constructor = SerializableConstructorMap.instance().getOwnerConstructor(constructorID);

        if (Constructor) {
            return new Constructor();
        } else {
            throw new Error(`Failed to construct object, invalid constructor id: ${constructorID}`);
        }
    }
}