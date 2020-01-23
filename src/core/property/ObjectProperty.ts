import { DynamicProperty } from './Property';
import { META_SERIALIZABLE_ID_KEY, Serializable } from './Serializable';
import { SerializableConstructorMap } from './SerializableConstructorMap';

@Serializable('core.ObjectProperty')
export class ObjectProperty<T extends Object> extends DynamicProperty<T> {

    public toJSON(): any {
        const json = {} as any;
        json['constructorID'] = Reflect.get(this.constructor, META_SERIALIZABLE_ID_KEY);

        if (this.value === null) {
            return json
        }

        json['object'] = {};

        // Only serializable objects will be serialized, meaning there must be a matching constructor mapped for the object
        const constructorID = Reflect.get(this.value.constructor, META_SERIALIZABLE_ID_KEY);
        if (constructorID === undefined) {
            return json;
        }
        json['object']['constructorID'] = constructorID;

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

        for (const [key, value] of Object.entries(this.value)) {
            if (value instanceof DynamicProperty) {
                value.fromJSON(json['object'][key]);
            }
        }

        return this;

    }

}