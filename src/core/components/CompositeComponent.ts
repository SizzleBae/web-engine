import { Component } from "./Component";

export abstract class CompositeComponent extends Component {
    public add(component: Component): void {
        this.onComponentAdd.emit(component);
    }

    public remove(component: Component): void {
        this.onComponentRemove.emit(component);
    }
}
