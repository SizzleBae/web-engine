import {PropertyVisitor} from "./extension/PropertyVisitor";

export abstract class AbstractProperty<TMemento = any> {
    abstract memento(keepExternal: boolean, lookup: Map<object, string>): TMemento;
    abstract restore(memento: TMemento, lookup: Map<string, object>): void;
    
    abstract accept(visitor: PropertyVisitor): void;
}