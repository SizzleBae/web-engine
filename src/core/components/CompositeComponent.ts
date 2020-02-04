import { Component } from "./Component";

export abstract class CompositeComponent extends Component {
    public add(component: Component): void {
        component.onComponentAdded.emit(this);
    }

    public remove(component: Component): void {
        component.onComponentRemoved.emit(this);
    }
}
