import { DynamicProperty, SerializedProperty } from './Property';
import { META_SERIALIZABLE_ID_KEY, Serializable } from './Serializable';
import { SerializableConstructorMap } from './SerializableConstructorMap';
import { PropertyVisitor } from './PropertyVisitor';

@Serializable('core.ObjectProperty')
export class ObjectProperty<T extends object> extends DynamicProperty<T> {

    public accept(visitor: PropertyVisitor): void {
        visitor.visitObject(this);
    }

    public copyFrom(source: DynamicProperty<T>): void {
        this.value = source.get();
    }

    public clone(): DynamicProperty<T> {
        return new ObjectProperty<T>(this.value, this.readonly);
    }

    public serialize(lookup: Map<object, string>): SerializedProperty {

        let objectID: string | undefined;

        if (this.value !== undefined) {
            objectID = lookup.get(this.value);
        }

        return new SerializedProperty(Reflect.get(this.constructor, META_SERIALIZABLE_ID_KEY), objectID);

    }

    public deserialize(lookup: Map<string, object>, property: SerializedProperty): void {
        const objectID = property.data;

        if (objectID !== undefined) {
            this.value = lookup.get(objectID) as T | undefined;
        }

    }

}