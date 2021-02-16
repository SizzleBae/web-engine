import {Serializable} from "../serialize/Serializable";
import {Property} from "./Property";
import {PString} from "./strategy/StringStrategy";
import {PNumber} from "./strategy/NumberStrategy";
import {PRef} from "./strategy/ReferenceStrategy";
import {PNullable} from "./strategy/NullableStrategy";
import {PMap} from "./strategy/MapStrategy";
import {PArray} from "./strategy/ArrayStrategy";
import {ArrayProperty} from "./ArrayProperty";

describe('ArrayProperty', () => {
    function reSerialize<T>(property: ArrayProperty<T>, objects: object[] = []): ArrayProperty<T> {
        property.restore(property.memento(true));
        return property;
    }

    it('can serialize', ()=>{
        const property = new ArrayProperty(PArray(PNumber()), [
            [6, 9],
            [1, 3, 3, 7]
        ]);
        
        reSerialize(property);
        
        expect(property.get(1)[3]).toBe(7);
    })
});
