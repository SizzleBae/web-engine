import { SerializableConstructorMap } from './SerializableConstructorMap';
import "reflect-metadata";
import { Serializable } from './Serializable';

export abstract class DynamicProperty<T> {
    protected readonly readonly: boolean;
    protected value: T | null;

    constructor(defaultValue?: T | null, readonly?: boolean) {
        if (defaultValue === undefined) {
            this.value = null;
        } else {
            this.value = defaultValue;
        }

        if (readonly === undefined) {
            this.readonly = false;
        } else {
            this.readonly = readonly;
        }
    }

    public get(): T | null {
        return this.value;
    }

    public set(value: T | null): void {
        if (this.readonly) {
            throw new Error('Attempted to set value on *readonly* dynamic property!')
        }

        this.value = value;
    }

    public abstract toJSON(): any;
    public abstract fromJSON(json: any): void;

    // public abstract serialize(): string;
    // public abstract deserialize(value: string): void;


}

// export class PropertyArray {
//     public readonly properties: Array<DynamicProperty<any>> = [];

//     public add<T extends DynamicProperty<any>>(property: T): T {
//         this.properties.push(property);
//         return property;
//     }

//     public remove<T extends DynamicProperty<any>>(property: T): T {
//         let index = this.properties.indexOf(property);
//         if (index !== -1) {
//             this.properties.splice(index, 1)[0];
//         }
//         return property;
//     }
// }

// export interface PropertyOwner {
//     properties: PropertyArray;
// }
