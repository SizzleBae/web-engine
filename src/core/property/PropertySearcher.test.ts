import { ObjectProperty } from "./ObjectProperty";
import { ArrayProperty } from "./ArrayProperty";
import { PrimitiveProperty } from "./PrimitiveProperty";
import { PropertySearcher } from "./PropertySearcher";

describe('PropertySearcher', () => {
    class ObjectTest {
        name = new PrimitiveProperty<string>();
        object = new ObjectProperty<ObjectTest>();
        array = new ArrayProperty<ObjectTest>();
    }

    const obj1 = new ObjectTest();
    const obj2 = new ObjectTest();
    const obj3 = new ObjectTest();
    obj1.name.set('obj1');
    obj2.name.set('obj2');
    obj3.name.set('obj3');
    obj1.object.set(obj2);
    obj2.array.set([new ObjectProperty(obj1), new ObjectProperty(obj2), new ObjectProperty(obj3)]);
    obj3.object.set(obj2);

    const search = new PropertySearcher().add(obj2).find(object => (object as any).name.get() === 'obj3');
    it('can find objects', () => {
        expect(search.entries.length).toBe(2);
        expect(search.entries).toContain(obj2);
        expect(search.entries).toContain(obj3);
        expect(search.entries).not.toContain(obj1);

        search.find(object => (object as any).name.get() === 'obj1');
        expect(search.entries.length).toBe(3);
        expect(search.entries).toContain(obj1);
        expect(search.entries).toContain(obj2);
        expect(search.entries).toContain(obj3);
    });
});