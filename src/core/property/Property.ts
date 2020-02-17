import { EventDelegate } from "../event/EventDelegate";
import { PropertyVisitor } from "./PropertyVisitor";

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

    /**
     * Returns true if the value of this property is not undefined, returns false if it is undefined
     */
    public valid(): boolean {
        return this.value !== undefined;
    }

    public abstract accept(visitor: PropertyVisitor): void;

    public abstract copyFrom(source: DynamicProperty<T>): void;
    public abstract clone(): DynamicProperty<T>;

    // public abstract serialize(lookup: Map<object, string>): SerializedProperty;
    // public abstract deserialize(lookup: Map<string, object>, property: SerializedProperty): void;

}
