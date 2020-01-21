import { ArrayCompositeComponent } from "./ArrayCompositeComponent";
import { IDComponent } from "./IDComponent";
import { TransformComponent } from "./TransformComponent";

describe("Component", () => {
    it("can find child components", () => {
        const compositeComponent = new ArrayCompositeComponent();

        const idComponent = new IDComponent("iasdiaisdf");
        const transformComponent = new TransformComponent();

        compositeComponent.add(idComponent);
        compositeComponent.add(transformComponent);

        expect(compositeComponent.findChildComponent(TransformComponent)).toBe(transformComponent);

        compositeComponent.remove(transformComponent);

        expect(compositeComponent.findChildComponent(TransformComponent)).toBeNull();

        expect(() => idComponent.findChildComponent(IDComponent)).toThrow();
    });

    it("can travarese ancestors", () => {
        const compositeComponent = new ArrayCompositeComponent();
        const compositeComponent1 = new ArrayCompositeComponent();
        const compositeComponent2 = new ArrayCompositeComponent();
        const idComponent = new IDComponent();

        compositeComponent.add(compositeComponent1);
        compositeComponent1.add(compositeComponent2);
        compositeComponent2.add(idComponent);

        let traverseCount = 0;
        idComponent.traverseAncestors(() => traverseCount++);
        expect(traverseCount).toBe(4);

        compositeComponent.add(idComponent);

        traverseCount = 0;
        idComponent.traverseAncestors(() => traverseCount++);
        expect(traverseCount).toBe(2);

    });
});