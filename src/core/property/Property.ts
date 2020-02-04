import { EventDelegate } from "../event/EventDelegate";

export class SerializedProperty {
    constructor(public constructorID: string, public data: any) { }
}

export abstract class DynamicProperty<T> {

    /**
     * Fired when this property's value changes 
     * @param args_0 Old value
     * @param args_1 New value
     */
    public onPropertyChanged = new EventDelegate<[T | undefined, T | undefined]>();

    protected readonly readonly: boolean;
    protected value: T | undefined;

    constructor(defaultValue?: T, readonly?: boolean) {
        this.value = defaultValue;

        if (readonly === undefined) {
            this.readonly = false;
        } else {
            this.readonly = readonly;
        }
    }

    public get(): T | undefined {
        return this.value;
    }

    public set(value: T | undefined): void {
        if (this.readonly) {
            throw new Error('Attempted to set value on *readonly* dynamic property!')
        }

        this.onPropertyChanged.emit(this.value, value);

        this.value = value;
    }

    public getS(): T {
        const result = this.get();

        if (result === undefined) {
            throw new Error(`Get safe on ${this} failed! get() returned undefined!`);
        }

        return result;
    }

    public abstract serialize(outJSON: any, lookup: Map<object, string>): SerializedProperty;
    public abstract deserialize(inJSON: any, property: SerializedProperty): void;

    // public abstract toJSON(result: Map<string, object>): void;
    // public abstract fromJSON(json: any): void;

}
