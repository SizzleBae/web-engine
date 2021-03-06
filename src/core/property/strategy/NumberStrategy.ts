﻿import {PropertyStrategy} from "./PropertyStrategy";

export class NumberStrategy extends PropertyStrategy<number, number> {
    constructor(public max?: number, public min?: number) {
        super();
    }
    
    serialize(value: number, keepExternal: boolean, lookup: Map<object, string>): number {
        return value;
    }
    
    deserialize(memento: number, lookup: Map<string, object>): number {
        return memento;
    }

    modify(value: number): number {
        if(this.max !== undefined) {
            value = Math.min(value, this.max);
        }
        if(this.min !== undefined) {
            value = Math.max(value, this.min);
        }
        return value;
    }

    createEmpty(): number {
        return 0;
    }
}

export const PNumber = (max?: number, min?: number)=>new NumberStrategy(max, min);