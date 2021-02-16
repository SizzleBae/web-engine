import {PropertyStrategy} from "./PropertyStrategy";

type PMapMemento = {key: any, value: any}[]

export class MapStrategy<TKey, TValue> extends PropertyStrategy<Map<TKey, TValue>, PMapMemento> {
    constructor(private keyStrategy: PropertyStrategy<TKey>, private valueStrategy: PropertyStrategy<TValue>) {
        super();
        
    }

    serialize(value: Map<TKey, TValue>, keepExternal: boolean, lookup: Map<object, string>): PMapMemento {
        return Array.from(value.entries()).map(([key, value])=>{
            return {
                key: this.keyStrategy.serialize(key, keepExternal, lookup),
                value: this.valueStrategy.serialize(value, keepExternal, lookup)
            }
        })
    }

    deserialize(memento: PMapMemento, lookup: Map<string, object>): Map<TKey, TValue> {
        const result = new Map<TKey, TValue>();
        memento.forEach(pair => {
            result.set(this.keyStrategy.deserialize(pair.key, lookup), this.valueStrategy.deserialize(pair.value, lookup));
        })
        return result;
    }

    modify(value: Map<TKey, TValue>): Map<TKey, TValue> {
        return value;
    }

    createEmpty(): Map<TKey, TValue> {
        return new Map();
    }
}

export const PMap = <TKey, TValue>(keyStrategy: PropertyStrategy<TKey>, valueStrategy: PropertyStrategy<TValue>)=>new MapStrategy(keyStrategy, valueStrategy);