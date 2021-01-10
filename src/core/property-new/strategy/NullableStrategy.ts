import {PropertyStrategy} from "./PropertyStrategy";

type Nullable<T> = T | null; 

export class NullableStrategy<T> extends PropertyStrategy<Nullable<T>, Nullable<T>> {
    constructor(private wrappedStrategy: PropertyStrategy<T>) {
        super();
    }

    serialize(value: Nullable<T>, keepExternal: boolean, lookup: Map<object, string>): Nullable<T> {
        if(value) {
            return this.wrappedStrategy.serialize(value, keepExternal, lookup);
        }
        return null;
    }

    deserialize(memento: Nullable<T>, lookup: Map<string, object>): Nullable<T> {
        if(memento) {
            return this.wrappedStrategy.deserialize(memento, lookup);
        }
        return null;
    }

    modify(value: Nullable<T>): Nullable<T> {
        if(value) {
            return this.wrappedStrategy.modify(value);
        }
        return null;
    }
}

export const PNullable = <T>(wrappedStrategy: PropertyStrategy<T>)=>new NullableStrategy(wrappedStrategy);