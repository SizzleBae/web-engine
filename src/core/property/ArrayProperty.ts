import {PropertyStrategy} from "./strategy/PropertyStrategy";
import {EventDelegate} from "../event/EventDelegate";
import {AbstractProperty} from "./AbstractProperty";
import {PropertyVisitor} from "./extension/PropertyVisitor";

type ArrayPropertyMemento = any[];

export class ArrayProperty<T> extends AbstractProperty<ArrayPropertyMemento> {

    readonly onChanged = new EventDelegate<[array: T[]]>();

    constructor(public strategy: PropertyStrategy<T>, private array: T[]) {
        super();
    }

    set(index: number, value: T) {
        this.array[index] = this.strategy.modify(value);
        
        this.onChanged.emit(this.array);
    }

    get(index: number): T {
        return this.array[index];
    }
    
    raw(): T[] {
        return this.array;
    }
    
    length(): number {
        return this.array.length;
    }
    
    push(...items: T[]) {
        this.array.push(...items);
        
        this.onChanged.emit(this.array);
    }
    
    remove(index: number) {
        this.array.splice(index, 1);
        
        this.onChanged.emit(this.array);
    }
    
    [Symbol.iterator]() {
        return this.array[Symbol.iterator];
    }

    memento(keepExternal: boolean = false, lookup: Map<object, string> = new Map()): ArrayPropertyMemento {
        return this.array.map(element => this.strategy.serialize(element, keepExternal, lookup));
    }

    restore(memento: ArrayPropertyMemento, lookup: Map<string, object> = new Map()): void {
        this.array = memento.map(element => this.strategy.deserialize(element, lookup));
    }

    accept(visitor: PropertyVisitor): void {
        visitor.visitArrayProperty(this);
    }
}