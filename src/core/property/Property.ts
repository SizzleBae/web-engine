import { SerializableConstructorMap } from './SerializableConstructorMap';
import "reflect-metadata";

export abstract class DynamicProperty<T> {
    protected readonly readonly: boolean;

    constructor(protected value: T | null, readonly?: boolean) {
        if (readonly === undefined) {
            this.readonly = false;
        } else {
            this.readonly = readonly;
        }
    }

    public abstract get(): T | null;
    public abstract set(value: T | null): void;

    public abstract serialize(): string;
    public abstract deserialize(value: string): void;
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
