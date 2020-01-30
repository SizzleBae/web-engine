import { Component } from "../components/Component";

// export class EventDelegate {
//     private listenerMap = new Map<string, Function[]>();

//     subscribe(event: string, listener: Function): void {
//         if (!this.listenerMap.has(event)) {
//             this.listenerMap.set(event, []);
//         }

//         const listeners = this.listenerMap.get(event) as Function[];
//         listeners.push(listener);
//     }

//     unsubscribe(event: string, listener: Function) {
//         const listeners = this.listenerMap.get(event);
//         if (listeners) {
//             this.listenerMap.set(event, listeners.filter(elem => elem !== listener));
//         }
//     }

//     emit(event: string, ...args: any[]) {
//         const listeners = this.listenerMap.get(event);
//         if (listeners) {
//             listeners.forEach(listener => listener(args));
//         }
//     }
// }

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
