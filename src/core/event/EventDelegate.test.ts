import { EventDelegate } from "./EventDelegate";

describe('EventDelegate', () => {
    it('can do pub/sub with data', () => {

        const delegate = new EventDelegate<[string, number, boolean]>();

        let callCount = 0;
        const listener = (name: string, count: number, state: boolean) => {
            expect(name).toBe('testName');
            expect(count).toBe(13);
            expect(state).toBe(true);
            callCount++;
        };
        delegate.subscribe(listener);

        delegate.emit('testName', 13, true);

        delegate.unsubscribe(listener);

        delegate.emit('testName2', 3, false);

        expect(callCount).toBe(1);
    });
});