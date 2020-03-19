import { LeafComponent } from "./LeafComponent";
import { IDComponent } from "./IDComponent";
import { Serializable } from "../serialize/Serializable";
import { Property } from "../property/Property";
import { PType } from "../property/DynamicProperty";
import { ArrayProperty } from "../property/ArrayProperty";

@Serializable('core.components.TransformComponent')
export class TransformComponent extends LeafComponent {
	public readonly transformParent = new Property<IDComponent>(PType.Reference, new IDComponent());
	public readonly transformParent2 = new Property<IDComponent>(PType.Reference, new IDComponent());
	public readonly transformParent3 = new Property<IDComponent>(PType.Reference, this.transformParent.get());

	public readonly x = new Property(PType.Number, 5);
	public readonly y = new Property(PType.Number, 4);
	public readonly z = new Property(PType.Number, 3);

	public readonly rotation = new ArrayProperty<number>(PType.Number, [
		0,
		1,
		2
	]);

	public readonly children = new ArrayProperty(PType.Reference, [
		new IDComponent(),
		new IDComponent(),
		new IDComponent(),
	]);

	public readonly ohgod =
		new ArrayProperty(PType.Reference, [
			new ArrayProperty(PType.Reference, [
				new ArrayProperty(PType.Reference, [
					new IDComponent(),
				]),
				new ArrayProperty(PType.Reference, [
					new IDComponent(),
					new IDComponent(),
				]),
				new ArrayProperty(PType.Reference, [
					new IDComponent(),
					new IDComponent(),
					new IDComponent(),
				]),
			]),
			new ArrayProperty(PType.Reference, [
				new ArrayProperty(PType.Reference, [
					new IDComponent(),
				]),
				new ArrayProperty(PType.Reference, [
					new IDComponent(),
					new IDComponent(),
				]),
				new ArrayProperty(PType.Reference, [
					new IDComponent(),
					new IDComponent(),
					new IDComponent(),
				]),
			]),
		]);

	constructor() {
		super();

	}

}
