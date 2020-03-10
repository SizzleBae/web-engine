import { LeafComponent } from "./LeafComponent";
import { Serializable } from "../serialize/Serializable";
import { TransformComponent } from "./TransformComponent";
import uuidv1 from 'uuid/v1'
import { PString } from "../property/PString";

/**
 * An immutable component that stores a string ID.
 * The ID can be supplied when constructed, if no ID is supplied, an UUID is generated based on the system's time 
 */
@Serializable('core.components.IDComponent')
export class IDComponent extends LeafComponent {

	public readonly id: PString;

	constructor(id?: string) {
		super();

		if (id) {
			this.id = new PString(id);
		} else {
			this.id = new PString(uuidv1());
		}

	}

}
