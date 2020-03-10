import { PropertyMemento } from "./PropertyMemento";

export class SerializedObject {
    public constructorID: string = "";
    public properties: Record<string, string> = {};
}

export class SerializedObjects {
    public properties: Record<string, PropertyMemento> = {};
    public objects: Record<string, SerializedObject> = {};
}