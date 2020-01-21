import { DynamicProperty } from './Property';
import { PrimitiveProperty } from './PrimitiveProperty';
import { SerializeUtils } from './SerializeUtils';

export class ObjectProperty<T extends Object> extends DynamicProperty<T> {
    constructor(protected type: { new(): T }, defaultValue: T | null, readonly?: boolean) {
        super(defaultValue, readonly);
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

    public serialize(): string {
        return SerializeUtils.serializeObject(this.value);
    }

    public deserialize(value: string): void {

    }

}