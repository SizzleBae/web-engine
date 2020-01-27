import { DynamicProperty } from "./Property";
import { ReferenceManager } from "./ReferenceManager";
import uuidv1 from 'uuid/v1'

export class ReferenceProperty<T extends Object> extends DynamicProperty<T> {

    private id: string | undefined;

    public get(): T | null {
        return this.value;
    }

    public set(value: T | null): void {
        if (this.readonly) {
            throw new Error('Attempted to set value on *readonly* dynamic property!')
        }

        if (value !== null) {
            if (ReferenceManager.instance().getID(value === undefined)) {
                this.id = uuidv1();
                ReferenceManager.instance().set(this.id, value);
            }

            ReferenceManager.instance().set(value);
            ReferenceManager.instance().inreaseReferenceCount(uuidv1());
        }

        this.value = value;
    }

    public toJSON() {
        throw new Error("Method not implemented.");
    }

    public fromJSON(json: any): void {
        throw new Error("Method not implemented.");
    }


}