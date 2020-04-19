import { Property } from "./Property";
import { PType, safe } from "./DynamicProperty";
import { Serializable } from "../serialize/Serializable";

describe('Property', () => {
    @Serializable('test.ObjectTest')
    class ObjectTest {
        number = new Property<number, safe>(PType.Number, 0);
        string = new Property<string>(PType.String, '');
    }

    it('can restore using mementos', () => {
        // Primitives
        const number = new Property<number>(PType.Number, 69);
        const numberMemento = number.memento();
        number.set(1337);
        number.restore(numberMemento);
        expect(number.get()).toBe(69);

        // Data object
        const originalData = new ObjectTest();
        const data = new Property<ObjectTest>(PType.Data, originalData);
        data.get()?.number.set(69);

        const dataMemento = data.memento();
        data.get()?.number.set(1337);
        data.restore(dataMemento);

        expect(data.get()?.number.get()).toBe(69);
        expect(data.get()).not.toBe(originalData);

        // Reference
        const originalReference = new ObjectTest();
        const reference = new Property<ObjectTest>(PType.Reference, originalReference);
        reference.get()?.number.set(69);

        const referenceMemento = reference.memento(true);
        reference.get()?.number.set(1337);
        reference.restore(referenceMemento);

        expect(reference.get()?.number.get()).toBe(1337);
        expect(reference.get()).toBe(originalReference);

    });
});