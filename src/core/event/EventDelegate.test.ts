import { EventDelegate } from "./EventDelegate";

describe('EventDelegate', () => {
    it('can do pub/sub with data', () => {

        const delegate = new EventDelegate<[name: string, count: number, state: boolean]>();

        let callCount = 0;

        const listener = delegate.subscribe((name, count, state) => {
            expect(name).toBe('testName');
            expect(count).toBe(13);
            expect(state).toBe(true);
            callCount++;
        });

        delegate.emit('testName', 13, true);

        delegate.unsubscribe(listener);

        delegate.emit('testName2', 3, false);

        expect(callCount).toBe(1);

    });
});