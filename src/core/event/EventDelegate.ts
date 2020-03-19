export class EventDelegate<T> {
    private listeners: Array<(data: T) => void> = [];

    subscribe(listener: (data: T) => void): (data: T) => void {
        this.listeners.push(listener);
        return listener;
    }

    unsubscribe(listener: (data: T) => void) {
        const index = this.listeners.indexOf(listener);
        if (index >= 0) {
            this.listeners.splice(index, 1);
        } else {
            console.warn(`Attempted to unsubscribe listener - ${listener} - that isn't subscribed to ${this}!`);
        }
    }

    emit(data: T) {
        this.listeners.forEach(listener => listener(data));
    }

}
