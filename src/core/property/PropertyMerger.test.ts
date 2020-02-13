import { ObjectProperty } from "./ObjectProperty";
import { ArrayProperty } from "./ArrayProperty";
import { PrimitiveProperty } from "./PrimitiveProperty";
import { PropertyMerger } from "./PropertyMerger";

describe('PropertyMerger', () => {

    class ObjectTest {
        readonly prop1 = new ObjectProperty<ObjectTest>();
        readonly prop2 = new PrimitiveProperty<number>();
        readonly prop3 = new ArrayProperty<ObjectTest>();
    }

    it('can merge properties', () => {
        const source = new ObjectTest();
        source.prop1.set(source);
        source.prop2.set(69);
        source.prop3.set([
            new ObjectProperty(new ObjectTest()),
            new ObjectProperty(source),
            new ObjectProperty(new ObjectTest()),
        ])

        const target = new ObjectTest();
        target.prop3.set([
            new ObjectProperty(new ObjectTest()),
            new ObjectProperty(),
            new ObjectProperty(),
        ])

        const merge = new PropertyMerger();
        merge.mergePropertyOwners(source, target);

        expect(target.prop1.get()).toBe(source);
        expect(target.prop2.get()).toBe(69);
        expect(target.prop3.getS()[0].get()).not.toBe(source.prop3.getS()[0].get());
        expect(target.prop3.getS()[1].get()).toBe(source);
        expect(target.prop3.getS()[2].get()).toBe(source.prop3.getS()[2].get());
    });
});