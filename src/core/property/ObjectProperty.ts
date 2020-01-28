import { DynamicProperty } from './Property';
import { META_SERIALIZABLE_ID_KEY, Serializable } from './Serializable';
import { SerializableConstructorMap } from './SerializableConstructorMap';
import { ReferenceManager } from './ReferenceManager';

@Serializable('core.ObjectProperty')
export class ObjectProperty<T extends object> extends DynamicProperty<T> {

    public toJSON(): object {
        const json = {} as any;
        json['constructorID'] = Reflect.get(this.constructor, META_SERIALIZABLE_ID_KEY);

        json['object'] = {};

        if (this.value === null) {
            return json;
        }

        // Only serializable objects will be serialized, meaning there must be a matching constructor mapped for the object
        const constructorID = Reflect.get(this.value.constructor, META_SERIALIZABLE_ID_KEY);
        if (constructorID === undefined) {
            return json;
        }
        json['object']['constructorID'] = constructorID;

        // If the object exists in the reference manager, save its referable ID
        const referenceID = ReferenceManager.instance().getID(this.value);
        if (referenceID !== undefined) {
            json['object']['referenceID'] = referenceID;
        }

        for (const [key, value] of Object.entries(this.value)) {
            if (value instanceof DynamicProperty) {
                json['object'][key] = value.toJSON();
            }
        }

        return json;
    }

    public fromJSON(json: any): ObjectProperty<T> {
        if (json['object'] === undefined) {
            return this;
        }

        const Constructor = SerializableConstructorMap.instance().getOwnerConstructor(json['object']['constructorID']);
        if (Constructor === undefined) {
            return this;
        }

        this.value = new Constructor() as T;

        // If the object has a referable id, assign it to that id in reference manager
        const referenceID = json['object']['referenceID'];
        if (referenceID !== undefined) {
            ReferenceManager.instance().set(referenceID, this.value);
        }

        for (const [key, value] of Object.entries(this.value)) {
            if (value instanceof DynamicProperty) {
                const jsonValue = json['object'][key];
                if (jsonValue !== undefined) {
                    value.fromJSON(jsonValue);
                } else {
                    console.warn(`Object property JSON - ${json} - is missing value: ${value}`);
                }
            }
        }

        return this;

    }

}