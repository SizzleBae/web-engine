import { DynamicProperty, SerializedProperty } from './Property';
import { META_SERIALIZABLE_ID_KEY, Serializable } from './Serializable';
import uuidv1 from 'uuid/v1'

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
            objectJSON['constructorID'] = Reflect.get(this.value.constructor, META_SERIALIZABLE_ID_KEY);

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

    public deserialize(inJSON: any, property: SerializedProperty): void {

    }

}