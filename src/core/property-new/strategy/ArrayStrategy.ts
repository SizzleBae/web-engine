import {PropertyStrategy} from "./PropertyStrategy";

type PArrayMemento = any[]

export class ArrayStrategy<T> extends PropertyStrategy<T[], PArrayMemento> {
    constructor(public elementStrategy: PropertyStrategy<T>) {
        super();
        
    }

    serialize(value: T[], keepExternal: boolean, lookup: Map<object, string>): PArrayMemento {
        return value.map(element => this.elementStrategy.serialize(element, keepExternal, lookup));
    }
    
    deserialize(memento: PArrayMemento, lookup: Map<string, object>): T[] {
        return memento.map(elementData => this.elementStrategy.deserialize(elementData, lookup));
    }

    modify(value: T[]): T[] {
        return value;
    }
}

export const PArray = <T>(elementStrategy: PropertyStrategy<T>)=>new ArrayStrategy(elementStrategy); 