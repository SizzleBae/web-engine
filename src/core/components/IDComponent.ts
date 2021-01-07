import { LeafComponent } from "./LeafComponent";
import { Serializable } from "../serialize/Serializable";
import { Property } from "../property/Property";
import uuidv1 from 'uuid/v1'
import { PType } from "../property/DynamicProperty";

/**
 * An immutable component that stores a string ID.
 * The ID can be supplied when constructed, if no ID is supplied, an UUID is generated based on the system's time 
 */
@Serializable('core.components.IDComponent')
export class IDComponent extends LeafComponent {

	public readonly id: Property<string>;

	constructor(id?: string) {
		super();

		if (id) {
			this.id = new Property<string>(PType.String, id);
		} else {
			this.id = new Property<string>(PType.String, uuidv1());
		}

	}

}
