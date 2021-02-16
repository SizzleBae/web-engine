import {Serializable} from "../serialize/Serializable";
import {Property} from "./Property";
import {PString} from "./strategy/StringStrategy";
import {PNumber} from "./strategy/NumberStrategy";
import {PRef} from "./strategy/ReferenceStrategy";
import {PNullable} from "./strategy/NullableStrategy";
import {PMap} from "./strategy/MapStrategy";
import {PArray} from "./strategy/ArrayStrategy";

describe('Property', () => {
    @Serializable('test.ObjectTest')
    class ObjectTest {
        number = new Property(PNumber(), 0);
        string = new Property(PString(), "");
    }
    
    function reSerialize<T>(property: Property<T>, objects: object[] = []): Property<T> {
        property.restore(property.memento(true));
        return property;
    }

    it('can use numbers', ()=>{
        const number = new Property(PNumber(), 69);
        const numberMemento = number.memento();
        number.set(1337);
        number.restore(numberMemento);
        expect(number.get()).toBe(69);
    })
    
    it('can use references', ()=> {
        // Reference
        const originalReference = new ObjectTest();
        const reference = new Property(PRef<ObjectTest>(), originalReference);
        reference.get().number.set(69);

        const referenceMemento = reference.memento(true);
        reference.get().number.set(1337);
        reference.restore(referenceMemento);

        expect(reference.get().number.get()).toBe(1337);
        expect(reference.get()).toBe(originalReference);
    })
    
    it('can use arrays', ()=>{
        const property = new Property(PArray(PNumber()), [1, 3, 3, 7]);

        reSerialize(property);

        expect(property.get()[3]).toBe(7);
    })

    it('can use maps', ()=>{
        const property = new Property(PMap(PString(), PNumber()), new Map());

        property.get().set("test1", 69);
        property.get().set("test2", 1337);  
        
        reSerialize(property);

        expect(property.get().get("test1")).toBe(69);
        expect(property.get().get("test2")).toBe(1337);
    })
    
    it('can use nullable',()=>{
        // Nullable
        const obj = new ObjectTest();
        const nullable = new Property(PNullable(PRef<ObjectTest>()), null);
        const nullableMemento = nullable.memento();
        nullable.set(obj);
        expect(nullable.get()).toBe(obj);
        nullable.restore(nullableMemento);
        expect(nullable.get()).toBe(null);
    })
});