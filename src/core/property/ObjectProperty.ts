import { DynamicProperty } from './Property';
import { PrimitiveProperty } from './PrimitiveProperty';
import { SerializeUtils } from './SerializeUtils';
import { META_SERIALIZABLE_ID_KEY, Serializable } from './Serializable';

@Serializable('core.ObjectProperty')
export class ObjectProperty<T extends Object> extends DynamicProperty<T> {

    public toJSON(): any {
        const result = {} as any;
        result['constructorID'] = Reflect.get(this.constructor, META_SERIALIZABLE_ID_KEY);

        if (this.value === null) {
            return result
        }

        const value = {} as any;
        result['value'] = value;

        // Only serializable objects will be serialized, meaning there must be a matching constructor mapped for the object
        const constructorID = Reflect.get(this.value.constructor, META_SERIALIZABLE_ID_KEY);
        if (constructorID === undefined) {
            return result;
        }

        for (const [key, value] of Object.entries(this.value)) {
            if (value instanceof DynamicProperty) {
                result[key] = value.toJSON();
            }
        }

        result['constructorID'] = constructorID;

    }

    public fromJSON(json: any): void {
    }

}