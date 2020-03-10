import { CompositeComponent } from "./CompositeComponent";
import { Component } from "./Component";
import { Serializable } from "../serialize/Serializable";
import { PArray } from "../property/PArray";
import { PReference } from "../property/PReference";

@Serializable('core.components.ArrayCompositeComponent')
export class ArrayCompositeComponent extends CompositeComponent {
	private readonly children = new PArray<Component>([]);

	public *[Symbol.iterator](): Iterator<Component> {
		const children = this.children.get();
		if (children) {
			for (const child of children) {
				const c = child.get();
				if (c) {
					yield c;
				}
			}
		}
	}

	public add(component: Component): void {
		super.add(component);

		this.children.get()?.push(new PReference(component));

		component.parent.get()?.remove(component);

		component.parent.set(this);

	}

	public remove(component: Component): void {
		super.remove(component);

		const index = this.children.get()?.findIndex(child => child.get() === component) as number;

		if (index !== -1) {
			this.children.get()?.splice(index, 1);
			component.parent.set(undefined);
		} else {
			console.warn(`Attempted to remove child that is not a child of array composite component. Component: ${component}. This: ${this}`);
		}
	}
}
