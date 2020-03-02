import { LeafComponent } from "./LeafComponent";
import { IDComponent } from "./IDComponent";
import { Serializable } from "../property/Serializable";
import { PReference } from "../property/PReference";
import { PNumber } from "../property/PNumber";
import { PArray } from "../property/PArray";
import { PData } from "../property/PData";

@Serializable('core.components.TransformComponent')
export class TransformComponent extends LeafComponent {
	public readonly transformParent = new PReference<IDComponent>(new IDComponent());
	public readonly transformParent2 = new PReference<IDComponent>(new IDComponent());
	public readonly transformParent3 = new PReference<IDComponent>(this.transformParent.get());

	public readonly x = new PNumber(5);
	public readonly y = new PNumber(4);
	public readonly z = new PNumber(3);

	public readonly rotation = new PArray<number>([
		new PNumber(0),
		new PNumber(1),
		new PNumber(2)
	]);

	public readonly children = new PArray([
		new PData(new IDComponent()),
		new PData(new IDComponent()),
		new PData(new IDComponent()),
	]);

	public readonly ohgod =
		new PArray([
			new PArray([
				new PArray([
					new PData(new IDComponent()),
				]),
				new PArray([
					new PData(new IDComponent()),
					new PData(new IDComponent()),
				]),
				new PArray([
					new PData(new IDComponent()),
					new PData(new IDComponent()),
					new PData(new IDComponent()),
				]),
			]),
			new PArray([
				new PArray([
					new PData(new IDComponent()),
				]),
				new PArray([
					new PData(new IDComponent()),
					new PData(new IDComponent()),
				]),
				new PArray([
					new PData(new IDComponent()),
					new PData(new IDComponent()),
					new PData(new IDComponent()),
				]),
			]),
		]);

	public readonly ohgod2 = new PArray([
		new PArray([
			new PData(new IDComponent()),
			new PData(new IDComponent()),
			new PData(new IDComponent())
		])
	]);

	constructor() {
		super();

	}

}
