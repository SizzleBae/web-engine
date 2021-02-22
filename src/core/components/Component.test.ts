import {Component} from "./Component";

describe("Component", () => {
    class TestComponent extends Component { }

    // Create a test tree of components
    const root = new TestComponent();
    const child1 = new TestComponent();
    child1.parent.set(root);
    const child2 = new TestComponent();
    child2.parent.set(root);
    const descendant1 = new TestComponent();
    descendant1.parent.set(child2);
    const descendant2 = new TestComponent();
    descendant2.parent.set(child2);
    const child3 = new TestComponent();
    // Set parent twice to make sure that state is properly maintained when changing parent
    child3.parent.set(descendant2);
    child3.parent.set(root);
    
    it("can create an ancestor iterator", () => {
        const ancestors = Array.from(descendant2.ancestors());
        expect(ancestors).toEqual(expect.arrayContaining([child2, root]));
        expect(ancestors.length).toBe(2);
    })

    it("can create a descendants iterator", () => {
        const descendants = Array.from(root.descendants());
        expect(descendants).toEqual(expect.arrayContaining([child1, child2, child3, descendant1, descendant2]));
        expect(descendants.length).toBe(5);
    })

    it("can create a siblings iterator", () => {
        const descendants = Array.from(child2.siblings());
        expect(descendants).toEqual([child1, child3]);
        expect(descendants.length).toBe(2);
    })
});