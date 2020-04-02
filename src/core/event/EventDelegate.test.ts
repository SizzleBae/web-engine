import { EventDelegate } from "./EventDelegate";

describe('EventDelegate', () => {
    it('can do pub/sub with data', () => {

        const delegate = new EventDelegate<{ name: string, count: number, state: boolean }>();

        let callCount = 0;

        const listener = delegate.subscribe((data) => {
            expect(data.name).toBe('testName');
            expect(data.count).toBe(13);
            expect(data.state).toBe(true);
            callCount++;
        });

        delegate.emit({ name: 'testName', count: 13, state: true });

        delegate.unsubscribe(listener);

        delegate.emit({ name: 'testName2', count: 3, state: false });

        expect(callCount).toBe(1);

    });
});