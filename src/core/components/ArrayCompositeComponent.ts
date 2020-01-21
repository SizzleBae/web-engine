import { CompositeComponent } from "./CompositeComponent";
import { Component } from "./Component";

export class ArrayCompositeComponent extends CompositeComponent {
  private readonly children: Array<Component> = [];

  public [Symbol.iterator](): Iterator<Component> {
    return this.children[Symbol.iterator]();
  }

  public add(component: Component): void {
    this.children.push(component);

    if (component.parent) {
      component.parent.remove(component);
    }

    component.parent = this;

  }

  public remove(component: Component): void {
    this.children.splice(this.children.indexOf(component), 1);
    component.parent = null;
  }
}
