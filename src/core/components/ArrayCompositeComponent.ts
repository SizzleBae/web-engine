import { Component } from "./Component";
import { CompositeComponent } from "./CompositeComponent";
import { Serializable } from "../serialize/Serializable";
import { PType } from "../property/DynamicProperty";
import { ArrayProperty } from "../property/ArrayProperty";

@Serializable('core.components.ArrayCompositeComponent')
export class ArrayCompositeComponent extends CompositeComponent {
	private readonly children = new ArrayProperty<Component>(PType.Reference, []);

	public *[Symbol.iterator](): IterableIterator<Component> {
		const children = this.children.get();
		if (children) {
			for (const child of children) {
				yield child;
			}
		}
	}

	public add(component: Component): void {
		super.add(component);

		this.children.get()?.push(component);

		component.parent.get()?.remove(component);

		component.parent.set(this);

	}

	public remove(component: Component): void {
		super.remove(component);

		const index = this.children.get()?.findIndex(child => child === component) as number;

		if (index !== -1) {
			this.children.get()?.splice(index, 1);
			component.parent.set(undefined);
		} else {
			console.warn(`Attempted to remove child that is not a child of array composite component. Component: ${component}. This: ${this}`);
		}
	}
}
