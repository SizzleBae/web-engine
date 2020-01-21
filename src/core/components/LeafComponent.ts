import { Component } from "./Component";

export abstract class LeafComponent extends Component {
  public [Symbol.iterator](): Iterator<Component, any, undefined> {
    throw new Error(
      `Attempted to create iterator from a non-composite component : ${this}`
    );
  }

  public add(component: Component) {
    throw new Error(
      `Attempted to add child component to a non-composite component : ${this}`
    );
  }

  public remove(component: Component) {
    throw new Error(
      `Attempted to remove child component from a non-composite component : ${this}`
    );
  }
}
