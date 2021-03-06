﻿import {PropertyStrategy} from "./PropertyStrategy";
import {DataStrategy} from "./DataStrategy";

export class Vector {
    constructor(public x = 0, public y = 0) {}
}

type VectorMemento = {
    x: number,
    y: number
}

export class VectorStrategy extends PropertyStrategy<Vector, VectorMemento> {

    serialize(value: Vector, keepExternal: boolean, lookup: Map<object, string>): VectorMemento {
        return {x: value.x, y:value.y};
    }

    deserialize(memento: VectorMemento, lookup: Map<string, object>): Vector {
        return new Vector(memento.x, memento.y);
    }

    modify(value: Vector): Vector {
        return value;
    }

    createEmpty(): Vector {
        return new Vector();
    }
}

export const PVector = ()=>new VectorStrategy();