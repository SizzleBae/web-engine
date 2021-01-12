import { META_SERIALIZABLE_ID_KEY } from "./Serializable";
import { SerializableConstructorMap } from "./SerializableConstructorMap";
import { PropertyUtils } from "../property/PropertyUtils";
import uuidv1 from 'uuid/v1'
import { SerializedObject } from "./SerializedObject";
import {AbstractProperty} from "../property-new/AbstractProperty";

type SerializedObjects = Record<string, SerializedObject>;

export class SerializeUtils {

    static serializeObjects(targets: object[], keepExternal: boolean = false): SerializedObjects {
        const result: SerializedObjects = {};
        
        // Create lookup for given objects using uuid
        const lookup = new Map<object, string>();

        // Serialize each object and add them to result
        targets.forEach(object => {
            
            const serializedObject = new SerializedObject();
            serializedObject.constructorID = Reflect.get(object.constructor, META_SERIALIZABLE_ID_KEY);
            if (!serializedObject.constructorID) {
                console.warn('Attempted to serialize object that lacks a constructor id, dud you forget to add Serializable decorator to objects class? ');
            }

            const objectID = uuidv1();
            result[objectID] = serializedObject;
            
            lookup.set(object, objectID);
            PropertyUtils.forEachPropertyIn(object, (property, key) => {
                lookup.set(property, `${objectID}->${key}`);
            });
        });

        // Serialize each property and add them to result
        targets.forEach(object => {
            const objectID = lookup.get(object) as string;
            PropertyUtils.forEachPropertyIn(object, (property, key) => {
                result[objectID].properties[key] = property.memento(keepExternal, lookup);
            });
        })

        return result;
    }

    static deserializeObjects(data: SerializedObjects): object[] {
        // Create a lookup that will contain all properties and objects indexed by an id
        const lookup = new Map<string, object>();

        // Construct all serialized objects, map them to their data and add them to lookup
        const objects = new Map<object, SerializedObject>();
        const properties: Map<AbstractProperty, any> = new Map();
        for (const [objectID, serializedObject] of Object.entries(data)) {
            const object = SerializeUtils.constructFromID(serializedObject.constructorID);

            objects.set(object, serializedObject);
            lookup.set(objectID, object);

            // Find properties in constructed object, map them to their serialized counterpart and add them to lookup
            PropertyUtils.forEachPropertyIn(object, (property, key) => {
                properties.set(property, serializedObject.properties[key]);
                
                const propertyID = `${objectID}->${key}`;
                lookup.set(propertyID, property);
            });
        }

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