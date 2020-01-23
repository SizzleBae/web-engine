import { DynamicProperty } from "./Property";
import { Serializable } from "./Serializable";

@Serializable('core.ArrayProperty')
export class ArrayProperty<T extends DynamicProperty<any>> extends DynamicProperty<T[]> {

    public toJSON(): any {
        return this.value;
    }

    public fromJSON(json: any): void {
        json.forEach(element => {

        });
    }

}