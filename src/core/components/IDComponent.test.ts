import { IDComponent } from "./IDComponent"

describe("IDComponent", () => {
    it("generates uuids", () => {
        let id1 = new IDComponent("test");
        let id2 = new IDComponent();
        let id3 = new IDComponent(id2.id.get() as string);
        let id4 = new IDComponent();

        expect(id1.id.get()).toBe("test");
        expect(id3.id.get()).toBe(id2.id.get());
        expect(id4.id.get()).not.toBe(id2.id.get());

        const uuid_pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        expect(uuid_pattern.test(id2.id.get() as string)).toBeTruthy();
        expect(uuid_pattern.test(id1.id.get() as string)).toBeFalsy();

    })
})