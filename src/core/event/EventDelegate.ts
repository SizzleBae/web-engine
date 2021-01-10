export class EventDelegate<T extends any[]> {
    private listeners: Set<(...data: T) => void> = new Set();

    subscribe(listener: (...data: T) => void): (...data: T) => void {
        this.listeners.add(listener);
        return listener;
    }

    unsubscribe(listener: (...data: T) => void) {
        this.listeners.delete(listener);
    }

    emit(...data: T) {
        this.listeners.forEach(listener => listener(...data));
    }
}
