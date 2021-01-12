import {PropertyStrategy} from "./strategy/PropertyStrategy";
import {EventDelegate} from "../event/EventDelegate";
import {AbstractProperty} from "./AbstractProperty";

type ArrayPropertyMemento = any[];

export class ArrayProperty<T> extends AbstractProperty<ArrayPropertyMemento> {

    readonly onChanged = new EventDelegate<[array: T[]]>();

    constructor(private strategy: PropertyStrategy<T>, private value: T[]) {
        super();
    }

    set(index: number, value: T) {
        this.value[index] = this.strategy.modify(value);
        
        this.onChanged.emit(this.value);
    }

    get(index: number): T {
        return this.value[index];
    }
    
    push(...items: T[]) {
        this.value.push(...items);
        
        this.onChanged.emit(this.value);
    }
    
    [Symbol.iterator]() {
        return this.value[Symbol.iterator];
    }

    memento(keepExternal: boolean = false, lookup: Map<object, string> = new Map()): ArrayPropertyMemento {
        return this.value.map(element => this.strategy.serialize(element, keepExternal, lookup));
    }

    restore(memento: ArrayPropertyMemento, lookup: Map<string, object> = new Map()): void {
        this.value = memento.map(element => this.strategy.deserialize(element, lookup));
    }
}