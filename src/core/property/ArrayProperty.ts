import { DynamicProperty } from "./Property";
import { Serializable, META_SERIALIZABLE_ID_KEY } from "./Serializable";
import { SerializableConstructorMap } from "./SerializableConstructorMap";

@Serializable('core.ArrayProperty')
export class ArrayProperty<T extends DynamicProperty<any>> extends DynamicProperty<T[]> {

    public toJSON(): any {
        const json = {} as any;
        json['constructorID'] = Reflect.get(this.constructor, META_SERIALIZABLE_ID_KEY);

        if (this.value === null) {
            return json
        }

        json['array'] = [];
        this.value.forEach(element => {
            json['array'].push(element.toJSON());
        })

        return json;
    }

    public fromJSON(json: any): void {
        const newArray: T[] = [];
        json['array'].forEach((property: any) => {
            const Constructor = SerializableConstructorMap.instance().getOwnerConstructor(property['constructorID']);

            if (Constructor === undefined) {
                return;
            }

            const constructed = new Constructor() as T;
            constructed.fromJSON(property);
            newArray.push(constructed);
        })
        this.value = newArray;
    }

}