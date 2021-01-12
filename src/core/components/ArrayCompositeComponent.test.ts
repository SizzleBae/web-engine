import { Serializable } from "../serialize/Serializable";
import { ArrayCompositeComponent } from "./ArrayCompositeComponent";
import { LeafComponent } from "./LeafComponent";
import { SerializeUtils } from "../serialize/SerializeUtils";
import { PType } from "../property/DynamicProperty";
import { Property } from "../property/Property";

describe('ArrayCompositeComponent', () => {
    @Serializable('test.TestComponent')
    class TestComponent extends LeafComponent {
        readonly reference = new Property<TestComponent | undefined>(PType.Reference, undefined);
        readonly payload = new Property<string>(PType.String, 'No payload...');
    }

    it('can serialize', () => {
        const originalArrayComp = new ArrayCompositeComponent();
        const serializingChild1 = new TestComponent();
        const serializingChild2 = new TestComponent();
        const serializingChild3 = new TestComponent();
        originalArrayComp.add(serializingChild1);
        originalArrayComp.add(serializingChild2);
        originalArrayComp.add(serializingChild3);
        serializingChild3.reference.set(serializingChild1);
        serializingChild1.reference.set(serializingChild3);
        serializingChild1.payload.set(`Here's the payload!!`);

        const json = SerializeUtils.serializeObjects([originalArrayComp, serializingChild1, serializingChild2, serializingChild3], true);

        const duplicateArrayComp = SerializeUtils.deserializeObjects(json)[0] as ArrayCompositeComponent;

        let success = false;
        for (const child of duplicateArrayComp) {
            if (child instanceof TestComponent) {
                if (child.payload.get() === `Here's the payload!!`) {
                    success = true;
                }
            }
        }
        expect(success).toBe(true);

    });
});