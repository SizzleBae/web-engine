import { EventDelegate } from "./EventDelegate";

describe('EventDelegate', () => {
    it('can emit events with arguments', () => {

        const delegate = new EventDelegate<[string, number, boolean]>();

        delegate.subscribe((name, count, state) => {
            expect(name).toBe('testName');
            expect(count).toBe(13);
            expect(state).toBe(true);
        });

        delegate.emit('testName', 13, true);

    });
});