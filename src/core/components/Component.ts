import { EventDelegate } from "../event/EventDelegate";
import { Property } from "../property/Property";
import {PNullable} from "../property/strategy/NullableStrategy";
import {PRef} from "../property/strategy/ReferenceStrategy";

export abstract class Component {
	
	/**
	 * Parent of this component, change this to safely update component tree
	 */
	readonly parent = new Property(PNullable(PRef(Component)), null);

	/**
	 * An array containing the children of this component, used for optimization purposes
	 * @private
	 */
	private childrenArray: Component[] = [];
	
	private root: Component = this;
	
	readonly onDescendantAdded = new EventDelegate<[added: Component]>();
	readonly onDescendantRemoved = new EventDelegate<[removed: Component]>();
	readonly onChildAdded = new EventDelegate<[added: Component]>();
	readonly onChildRemoved = new EventDelegate<[removed: Component]>();
	readonly onRootChanged = new EventDelegate<[newRoot: Component, oldRoot: Component]>();

	constructor() {
		this.parent.onChanged.subscribe((newParent, oldParent) => {
			if(oldParent) {
				oldParent.childrenArray.splice(oldParent.childrenArray.indexOf(this));

				// Notify that a component has been removed
				oldParent.onChildRemoved.emit(this);
				for(const ancestor of oldParent.ancestors()) {
					ancestor.onDescendantRemoved.emit(this);
				}
			}
			if(newParent) {
				newParent.childrenArray.push(this);
				this.setRoot(newParent.root);

				// Notify that a component has been added
				newParent.onChildAdded.emit(this);
				for(const ancestor of newParent.ancestors()) {
					ancestor.onDescendantAdded.emit(this);
				}
			} else {
				this.setRoot(this);
			}
		})
	}

	*ancestors(): Generator<Component> {
		const parent = this.parent.get();
		if(parent) {
			yield parent;
			yield * parent.ancestors();
		}
	}
	
	*descendants(): Generator<Component> {
		for(const child of this.children()) {
			yield child;
			yield * child.descendants();
		}
	}

	*children(): Generator<Component> {
		for(const child of this.childrenArray) {
			yield child;
		}
	}

	*siblings(): Generator<Component> {
		const parent = this.parent.get();

		if(parent) {
			for(const sibling of parent.children()) {
				if(sibling !== this) {
					yield sibling;
				}
			}
		}
	}	
	
	getRoot() {
		return this.root;
	}

	/**
	 * Recursively updates root for this component and descendants.
	 * @param newRoot
	 * @private
	 */
	private setRoot(newRoot: Component) {
		const oldRoot = this.root;
		for(const descendant of this.descendants()) {
			descendant.root = newRoot
			descendant.onRootChanged.emit(newRoot, oldRoot);
		}
	}
}
