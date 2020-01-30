export class EventDelegate<T extends any[]> {
    private listeners: Array<(...args: T) => void> = [];

    subscribe(listener: (...args: T) => void) {
        this.listeners.push(listener);
    }

    unsubscribe(listener: (...args: T) => void) {
        const index = this.listeners.indexOf(listener);
        if (index >= 0) {
            this.listeners.splice(index, 1);
        } else {
            console.warn(`Attempted to unsubscribe listener - ${listener} - that isn't subscribed to ${this}!`);
        }
    }

    emit(...args: T) {
        this.listeners.forEach(listener => listener(...args));
    }

}
