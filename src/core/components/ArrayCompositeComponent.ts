import { CompositeComponent } from "./CompositeComponent";
import { Component } from "./Component";
import { ArrayProperty } from "../property/ArrayProperty";
import { ObjectProperty } from "../property/ObjectProperty";
import { Serializable } from "../property/Serializable";

@Serializable('core.components.ArrayCompositeComponent')
export class ArrayCompositeComponent extends CompositeComponent {
	private readonly children = new ArrayProperty<Component>([]);

	public [Symbol.iterator](): Iterator<Component> {
		return this.children.getS().map(child => child.getS())[Symbol.iterator]();
	}

	public add(component: Component): void {
		super.add(component);

		this.children.getS().push(new ObjectProperty(component));

		component.parent.get()?.remove(component);

		component.parent.set(this);

	}

	public remove(component: Component): void {
		super.remove(component);

		const index = this.children.getS().findIndex(child => child.get() === component);

		if (index !== -1) {
			this.children.getS().splice(index, 1);
			component.parent.set(undefined);
		} else {
			console.warn(`Attempted to remove child that is not a child of array composite component. Component: ${component}. This: ${this}`);
		}
	}
}
