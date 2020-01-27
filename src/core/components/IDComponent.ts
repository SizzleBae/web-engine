import { LeafComponent } from "./LeafComponent";
import { Serializable } from "../property/Serializable";
import { PrimitiveProperty } from "../property/PrimitiveProperty";
import { ObjectProperty } from "../property/ObjectProperty";
import { TransformComponent } from "./TransformComponent";
import uuidv1 from 'uuid/v1'

/**
 * An immutable component that stores a string ID.
 * The ID can be supplied when constructed, if no ID is supplied, an UUID is generated based on the system's time 
 */
@Serializable('core.components.IDComponent')
export class IDComponent extends LeafComponent {

	public readonly id: PrimitiveProperty<string>;

	public readonly loop = new ObjectProperty<TransformComponent>(new TransformComponent());

	constructor(id?: string) {
		super();

		if (id) {
			this.id = new PrimitiveProperty(id, true);
		} else {
			this.id = new PrimitiveProperty(uuidv1(), true);
		}

	}

}
