import { ObjectProperty } from "../property/ObjectProperty";
import { Serializable } from "../property/Serializable";
import { ArrayCompositeComponent } from "./ArrayCompositeComponent";
import { LeafComponent } from "./LeafComponent";
import { SerializeUtils } from "../property/SerializeUtils";
import { PrimitiveProperty } from "../property/PrimitiveProperty";

describe('ArrayCompositeComponent', () => {
    @Serializable('test.TestComponent')
    class TestComponent extends LeafComponent {
        readonly reference = new ObjectProperty<TestComponent>();
        readonly payload = new PrimitiveProperty<string>('No payload...');
    }

    it('can serialize', () => {
        const serializingArray = new ObjectProperty(new ArrayCompositeComponent());
        const serializingChild1 = new TestComponent();
        const serializingChild2 = new TestComponent();
        const serializingChild3 = new TestComponent();
        serializingArray.getS().add(serializingChild1);
        serializingArray.getS().add(serializingChild2);
        serializingArray.getS().add(serializingChild3);
        serializingChild3.reference.set(serializingChild1);
        serializingChild1.reference.set(serializingChild3);
        serializingChild1.payload.set(`Here's the payload!!`);

        const json = SerializeUtils.serializeProperty(serializingArray)

        const deserializingArray = new ObjectProperty<ArrayCompositeComponent>();
        SerializeUtils.deserializeProperty(deserializingArray, json);

        let success = false;
        for (const child of deserializingArray.getS()) {
            if (child instanceof TestComponent) {
                if (child.payload.getS() === `Here's the payload!!`) {
                    success = true;
                }
            }
        }
        expect(success).toBe(true);

    });
});