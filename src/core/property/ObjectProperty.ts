import { DynamicProperty } from './Property';
import { META_SERIALIZABLE_ID_KEY, Serializable } from './Serializable';
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

    // public serialize(lookup: Map<object, string>): SerializedProperty {

    //     let objectData: T | string | undefined;

    //     if (this.value !== undefined) {
    //         if (lookup.has(this.value)) {
    //             objectData = lookup.get(this.value);
    //         } else {
    //             objectData = this.value;
    //         }
    //     }

    //     return new SerializedProperty(Reflect.get(this.constructor, META_SERIALIZABLE_ID_KEY), objectData);

    // }

    // public deserialize(lookup: Map<string, object>, property: SerializedProperty): void {
    //     const objectData = property.data as T | string | undefined;

    //     if (typeof objectData === 'string') {
    //         this.value = lookup.get(objectData) as T | undefined;
    //     } else {
    //         this.value = objectData;
    //     }

    // }

}