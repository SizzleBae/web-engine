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

    public getS(): T {
        const result = this.get();

        if (result === null) {
            throw new Error(`Get safe on ${this} failed! Get() returned null!`);
        }

        return result;
    }

    public abstract toJSON(): object;
    public abstract fromJSON(json: any): void;

}
