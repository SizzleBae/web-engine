export abstract class DynamicProperty<T> {
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

        this.value = value;
    }

    public getS(): T {
        const result = this.get();

        if (result === undefined) {
            throw new Error(`Get safe on ${this} failed! get() returned undefined!`);
        }

        return result;
    }

    public abstract toJSON(): object;
    public abstract fromJSON(json: any): void;

}
