import {PNumber} from "./strategy/NumberStrategy";
import {PArray} from "./strategy/ArrayStrategy";
import {MapProperty} from "./MapProperty";
import {PString} from "./strategy/StringStrategy";

describe('MapProperty', () => {
    function reSerialize<TKey, TValue>(property: MapProperty<TKey, TValue>, objects: object[] = []): MapProperty<TKey, TValue> {
        property.restore(property.memento(true));
        return property;
    }

    it('can serialize', ()=>{
        const property = new MapProperty(PString(), PNumber());
        
        property.set("Hello", 5);
        property.set("world!", 1337);
        
        reSerialize(property);

        expect(property.get("world!")).toBe(1337);
    })
});
