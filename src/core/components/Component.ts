import { EventDelegate } from "../event/EventDelegate";

export abstract class Component {
	/**
	 * Optional parent of this component, used for efficiency purposes
	 */
	public parent: Component | undefined;

	public readonly onComponentAdd = new EventDelegate<[Component]>();
	public readonly onComponentRemove = new EventDelegate<[Component]>();

	public abstract [Symbol.iterator](): Iterator<Component>;

	/**
	 * Adds a component to this component's composition
	 * @param component The component to add
	 */
	public abstract add(component: Component): void;

	/**
	 * Removes component from this component's composition
	 * @param component The component to remove
	 */
	public abstract remove(component: Component): void;

	/**
	 * Searches through children of this component. Returns the first child that matches type, if no child component matches type, returns undefined.
	 * @param type The class type of the component to search for
	 */
	public findChildComponent<T extends Component>(type: { new(...args: any[]): T }): T | undefined {
		for (const child of this) {
			if (child instanceof type) {
				return child;
			}
		}
		return undefined;
	}

	/**
	 * Executes callback for this component and all ancestors
	 * @param callback The function to execute
	 */
	public traverseAncestors(callback: (ancestor?: Component) => void) {
		callback(this);
		if (this.parent) {
			this.parent.traverseAncestors(callback);
		}
	}

}
