import { META_SERIALIZABLE_ID_KEY } from "./Serializable";
import { SerializableConstructorMap } from "./SerializableConstructorMap";

export class SerializedObject {
    public constructorID: string = "";
    public data: any = {};

    destruct(object: object): void {
        this.constructorID = Reflect.get(object.constructor, META_SERIALIZABLE_ID_KEY);
        if (this.constructorID === undefined) {
            throw new Error(`Failed to destruct object. Object ${object} is missing a serializable constructor.`);
        }
    }

    construct(): object {
        const Constructor = SerializableConstructorMap.instance().getOwnerConstructor(this.constructorID);
        if (Constructor === undefined) {
            throw new Error(`Failed to construct object. Object with id ${this.constructorID} is missing a serializable constructor.`);
        }

        return new Constructor();
    }
}

export class SerializedObjects {
    public properties: any = {};
    public objects: any = {};
}