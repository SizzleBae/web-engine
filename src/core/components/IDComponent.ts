import { Serializable } from "../serialize/Serializable";
import { Property } from "../property/Property";
import {PString} from "../property/strategy/StringStrategy";
import {Component} from "./Component";
import uuidv1 from 'uuid/v1'

/**
 * An immutable component that stores a string ID.
 * The ID can be supplied when constructed, if no ID is supplied, an UUID is generated
 */
@Serializable('core.components.IDComponent')
export class IDComponent extends Component {

	public readonly id: Property<string>;

	constructor(id?: string) {
		super();

		if (id) {
			this.id = new Property(PString(), id);
		} else {
			this.id = new Property(PString(), uuidv1());
		}

	}

}
