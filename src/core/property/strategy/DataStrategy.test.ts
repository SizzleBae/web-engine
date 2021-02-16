import {DataStrategy, PData} from "./DataStrategy";
import {Serializable} from "../../serialize/Serializable";
import {Property} from "../Property";
import {PString} from "./StringStrategy";
import {PNullable} from "./NullableStrategy";

describe('DataStrategy', () => {
    @Serializable("test.ObjectTest")
    class ObjectTest {
        x = new Property(PString(), "");
        y = new Property(PNullable(PData<ObjectTest>()), null);
    }
    
    it('can serialize', ()=>{
        const strategy = new DataStrategy<ObjectTest>();
        
        const obj1 = new ObjectTest();
        obj1.x.set("Hello!");

        const obj2 = new ObjectTest();
        obj2.x.set("World!");

        obj1.y.set(obj2);
        
        const memento = strategy.serialize(obj1, true, new Map());
        
        const obj3 = strategy.deserialize(JSON.parse(JSON.stringify(memento)), new Map());
        
        expect(obj3.y.get()?.x.get()).toBe("World!");
        
    })
});
