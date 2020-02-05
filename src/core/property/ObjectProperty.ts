import { DynamicProperty, SerializedProperty } from './Property';
import { META_SERIALIZABLE_ID_KEY, Serializable } from './Serializable';
import uuidv1 from 'uuid/v1'
import { SerializableConstructorMap } from './SerializableConstructorMap';

@Serializable('core.ObjectProperty')
export class ObjectProperty<T extends object> extends DynamicProperty<T> {

    public serialize(outJSON: any, lookup: Map<object, string>): SerializedProperty {
        const propertyJSON = new SerializedProperty(Reflect.get(this.constructor, META_SERIALIZABLE_ID_KEY), undefined);
        if (this.value === undefined) {
            return propertyJSON;
        }

        if (!lookup.has(this.value)) {
            const objectID = uuidv1();
            lookup.set(this.value, objectID);

            const objectJSON = {} as any;
            const constructorID = Reflect.get(this.value.constructor, META_SERIALIZABLE_ID_KEY);
            if (constructorID === undefined) {
                return propertyJSON;
            }
            objectJSON['constructorID'] = constructorID;

            for (const [propertyKey, propertyValue] of Object.entries(this.value)) {
                if (propertyValue instanceof DynamicProperty) {
                    objectJSON[propertyKey] = propertyValue.serialize(outJSON, lookup);
                }
            }

            outJSON[objectID] = objectJSON;
        }

        propertyJSON.data = lookup.get(this.value);
        return propertyJSON;

    }

    public deserialize(inJSON: any, lookup: Map<string, object>, property: SerializedProperty): void {
        const objectID = property.data;

        if (objectID === undefined) {
            return;
        }

        if (!lookup.has(objectID)) {
            const objectJSON = inJSON[objectID];

            // Instantiate json object
            const Constructor = SerializableConstructorMap.instance().getOwnerConstructor(objectJSON['constructorID']);
            if (Constructor === undefined) {
                throw new Error(`Failed to deserialize object property. Missing constructor id for - ${objectJSON}`)
            }

            const object = new Constructor();
            lookup.set(objectID, object);

            for (const [propertyKey, propertyValue] of Object.entries(object)) {
                if (propertyValue instanceof DynamicProperty) {
                    const propertyJSON = objectJSON[propertyKey];
                    if (propertyJSON === undefined) {
                        console.warn(`Failed to set deserialize property - ${propertyValue}. Missing property data in json.`);
                    }

                    propertyValue.deserialize(inJSON, lookup, propertyJSON);
                }
            }
        }

        // TODO: Type guard?
        this.value = lookup.get(objectID) as any;

    }

}