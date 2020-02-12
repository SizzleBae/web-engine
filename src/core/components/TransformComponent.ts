import { LeafComponent } from "./LeafComponent";
import { PrimitiveProperty } from "../property/PrimitiveProperty";
import { ObjectProperty } from "../property/ObjectProperty";
import { IDComponent } from "./IDComponent";
import { ArrayProperty } from "../property/ArrayProperty";
import { Serializable } from "../property/Serializable";
import { DynamicProperty } from "../property/Property";

@Serializable('core.components.TransformComponent')
export class TransformComponent extends LeafComponent {
	public readonly transformParent = new ObjectProperty<IDComponent>(new IDComponent());
	public readonly transformParent2 = new ObjectProperty<IDComponent>(new IDComponent());
	public readonly transformParent3 = new ObjectProperty<IDComponent>(this.transformParent.getS());

	public readonly x = new PrimitiveProperty<number>(5);
	public readonly y = new PrimitiveProperty<number>(4);
	public readonly z = new PrimitiveProperty<number>(3);

	public readonly rotation = new ArrayProperty<number>([
		new PrimitiveProperty<number>(0),
		new PrimitiveProperty<number>(1),
		new PrimitiveProperty<number>(2)
	]);

	public readonly children = new ArrayProperty([
		new ObjectProperty(new IDComponent()),
		new ObjectProperty(new IDComponent()),
		new ObjectProperty(new IDComponent()),
	]);

	public readonly ohgod =
		new ArrayProperty([
			new ArrayProperty([
				new ArrayProperty([
					new ObjectProperty(new IDComponent()),
				]),
				new ArrayProperty([
					new ObjectProperty(new IDComponent()),
					new ObjectProperty(new IDComponent()),
				]),
				new ArrayProperty([
					new ObjectProperty(new IDComponent()),
					new ObjectProperty(new IDComponent()),
					new ObjectProperty(new IDComponent()),
				]),
			]),
			new ArrayProperty([
				new ArrayProperty([
					new ObjectProperty(new IDComponent()),
				]),
				new ArrayProperty([
					new ObjectProperty(new IDComponent()),
					new ObjectProperty(new IDComponent()),
				]),
				new ArrayProperty([
					new ObjectProperty(new IDComponent()),
					new ObjectProperty(new IDComponent()),
					new ObjectProperty(new IDComponent()),
				]),
			]),
		]);

	public readonly ohgod2 = new ArrayProperty([
		new ArrayProperty([
			new ObjectProperty(new IDComponent()),
			new ObjectProperty(new IDComponent()),
			new ObjectProperty(new IDComponent())
		])
	]);

	constructor() {
		super();

	}

}
