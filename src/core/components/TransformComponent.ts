import { LeafComponent } from "./LeafComponent";
import { IDComponent } from "./IDComponent";
import { Serializable } from "../serialize/Serializable";
import { Property } from "../property/Property";
import { PType } from "../property/DynamicProperty";
import { ArrayProperty } from "../property/ArrayProperty";
import { Vector3 } from "../math/Vector3";

@Serializable('core.components.TransformComponent')
export class TransformComponent extends LeafComponent {
	public readonly position = new Property<Vector3>(PType.Data, new Vector3(0, 0, 0));
	public readonly rotation = new Property<Vector3>(PType.Data, new Vector3(0, 0, 0));
	public readonly scale = new Property<Vector3>(PType.Data, new Vector3(0, 0, 0));

	public readonly children = new ArrayProperty<TransformComponent>(PType.Reference, []);

	constructor() {
		super();

		const rot = this.rotation.get()
		if (rot) {
			rot.x = 2;

		}
	}

}
