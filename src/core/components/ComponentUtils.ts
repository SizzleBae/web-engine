import { Component } from "./Component";

export class ComponentUtils {

    static FindChildComponent<T>(component: Component, type: { new(...args: any[]): T }): T | null {
        for (const child of component) {
            if (child instanceof type) {
                return child;
            }
        }
        return null;
    }
}
