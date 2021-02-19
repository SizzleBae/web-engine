import {PropertyStrategy} from "./strategy/PropertyStrategy";
import {EventDelegate} from "../event/EventDelegate";
import {AbstractProperty} from "./AbstractProperty";
import {PropertyVisitor} from "./extension/PropertyVisitor";

type MapPropertyMemento = [any, any][];

export class MapProperty<TKey, TValue> extends AbstractProperty<MapPropertyMemento> {

    readonly onChanged = new EventDelegate<[]>();

    private map = new Map<TKey, TValue>();
    
    constructor(public keyStrategy: PropertyStrategy<TKey>, public valueStrategy: PropertyStrategy<TValue>) {
        super();
    }

    set(key: TKey, value: TValue) {
        this.map.set(this.keyStrategy.modify(key), this.valueStrategy.modify(value));
        
        this.onChanged.emit();
    }

    get(key: TKey): TValue | undefined {
        return this.map.get(key);
    }
    
    has(key: TKey): boolean {
        return this.map.has(key);
    }
    
    raw(): Map<TKey, TValue> {
        return this.map;
    }
    
    delete(key: TKey) {
        this.map.delete(key);
        
        this.onChanged.emit();
    }
    
    [Symbol.iterator]() {
        return this.map[Symbol.iterator]();
    }

    memento(keepExternal: boolean = false, lookup: Map<object, string> = new Map()): MapPropertyMemento {
        const memento: MapPropertyMemento = [];
        
        for(const [key, value] of this.map.entries()) {
            memento.push([
                this.keyStrategy.serialize(key, keepExternal, lookup), 
                this.valueStrategy.serialize(value, keepExternal, lookup)
            ]);
        }
        
        return memento;
    }

    restore(memento: MapPropertyMemento, lookup: Map<string, object> = new Map()): void {
        const deserializedEntries: [TKey, TValue][] = memento.map(entryMemento => [
            this.keyStrategy.deserialize(entryMemento[0], lookup),
            this.valueStrategy.deserialize(entryMemento[1], lookup)
        ]);
        
        this.map = new Map<TKey, TValue>(deserializedEntries); 
    }

    accept(visitor: PropertyVisitor): void {
        //TODO: Visitor?
        visitor.visitArrayProperty(this as any);
    }
}