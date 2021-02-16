import {PropertyStrategy} from "./strategy/PropertyStrategy";
import {EventDelegate} from "../event/EventDelegate";
import {AbstractProperty} from "./AbstractProperty";
import {PropertyVisitor} from "./extension/PropertyVisitor";

type PropertyMemento = any;

export class Property<T> extends AbstractProperty<PropertyMemento>{

    readonly onChanged = new EventDelegate<[newValue: T, oldValue: T]>();

    private value: T;
    
    constructor(public strategy: PropertyStrategy<T>, value: T) {
        super();
        
        this.value = value;
    }
    
    set(value: T) {
        const oldValue = this.value;
        this.value = this.strategy.modify(value);
        
        this.onChanged.emit(this.value, oldValue);
    }
    
    get() {
        return this.value;
    }
    
    memento(keepExternal: boolean = false, lookup: Map<object, string> = new Map()): PropertyMemento {
        return this.strategy.serialize(this.value, keepExternal, lookup);
    }

    restore(memento: PropertyMemento, lookup: Map<string, object> = new Map()): void {
        this.value = this.strategy.deserialize(memento, lookup);
    }

    accept(visitor: PropertyVisitor): void {
        visitor.visitProperty(this);
    }
}