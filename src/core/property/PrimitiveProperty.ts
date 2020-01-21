import { DynamicProperty } from "./Property";
import { SerializeUtils } from "./SerializeUtils";

export type Primitive = string | number | boolean;

export class PrimitiveProperty<T extends Primitive> extends DynamicProperty<T> {

    constructor(defaultValue: T, readonly?: boolean) {
        super(defaultValue, readonly);

    }

    public get(): T {
        return this.value as T;
    }

    public set(value: T): void {
        if (this.readonly) {
            throw new Error("Attempted to set value on *readonly* dynamic property!")
        }

        this.value = value;
    }

    public serialize(): string {
        return SerializeUtils.serializePrimitive(this.value as T);
    }

    public deserialize(value: string): void {
        const deserialized = SerializeUtils.deserializePrimitive(value) as T;

        if (typeof deserialized === typeof this.value) {
            this.value = deserialized;
        } else {
            throw new Error(`Failed to deserialize primitive property, incompatible type? Received:${typeof deserialized} - Expected:${typeof this.value}`);
        }
    }
}