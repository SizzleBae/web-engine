import { LeafComponent } from "./LeafComponent";
import { PrimitiveProperty } from "../property/PrimitiveProperty";
import { ObjectProperty } from "../property/ObjectProperty";
import { IDComponent } from "./IDComponent";
import { ArrayProperty } from "../property/ArrayProperty";
import { Serializable } from "../property/Serializable";

@Serializable('core.components.TransformComponent')
export class TransformComponent extends LeafComponent {
	public readonly transformParent = new ObjectProperty<IDComponent>(new IDComponent());

	public readonly x = new PrimitiveProperty<number>(5);
	public readonly y = new PrimitiveProperty<number>(4);
	public readonly z = new PrimitiveProperty<number>(3);

	public readonly rotation = new ArrayProperty<PrimitiveProperty<number>>([
		new PrimitiveProperty(0),
		new PrimitiveProperty(1),
		new PrimitiveProperty<number>(2)
	]);

	public readonly children = new ArrayProperty([
		new ObjectProperty(new IDComponent()),
		new ObjectProperty(new IDComponent()),
		new ObjectProperty(new IDComponent()),
	]);

	// public readonly ohgod = new ArrayProperty<ArrayProperty<ObjectProperty<IDComponent>>>([
	// 	new ArrayProperty<ObjectProperty<IDComponent>>([
	// 		new ObjectProperty(IDComponent, new IDComponent()),
	// 		new ObjectProperty(IDComponent, new IDComponent()),
	// 		new ObjectProperty(IDComponent, new IDComponent())
	// 	])
	// ]);

	constructor() {
		super();
	}

}
