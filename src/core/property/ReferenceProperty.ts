import { DynamicProperty } from "./Property";
import { ReferenceManager } from "./ReferenceManager";
import uuidv1 from 'uuid/v1'
import { META_SERIALIZABLE_ID_KEY, Serializable } from "./Serializable";

@Serializable('core.ReferenceProperty')
export class ReferenceProperty<T extends object> extends DynamicProperty<T> {

    private id: string | undefined;

    constructor(readonly?: boolean) {
        super(undefined, readonly);
    }

    public get(): T | null {
        if (this.id === undefined) {
            return null;
        }

        const reference = ReferenceManager.instance().getTarget(this.id);
        if (reference === undefined) {
            return null;
        }

        // TODO: Runtime type checking?
        return reference as T;
    }

    public set(target: T | null): void {
        if (this.readonly) {
            throw new Error('Attempted to set value on *readonly* dynamic property!')
        }

        if (target !== null) {
            const oldID = ReferenceManager.instance().getID(target);
            if (oldID === undefined) {
                this.id = uuidv1();
            } else {
                this.id = oldID;
            }

            ReferenceManager.instance().set(this.id, target);
        } else {
            this.id = undefined;

        }
    }

    public setID(id: string): void {
        this.id = id;
    }

    public toJSON(): object {
        const json = {} as any;
        json['constructorID'] = Reflect.get(this.constructor, META_SERIALIZABLE_ID_KEY);

        json['referenceID'] = this.id;

        return json;
    }

    public fromJSON(json: any): void {

        this.id = json['referenceID'];

    }


}