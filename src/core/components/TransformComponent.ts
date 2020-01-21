import { LeafComponent } from "./LeafComponent";
import { PrimitiveProperty } from "../property/PrimitiveProperty";
import { ObjectProperty } from "../property/ObjectProperty";
import { IDComponent } from "./IDComponent";
import { ArrayProperty } from "../property/ArrayProperty";
import { Serializable } from "../property/Serializable";

@Serializable('core.components.TransformComponent')
export class TransformComponent extends LeafComponent {
  public readonly transformParent = new ObjectProperty(IDComponent, new IDComponent());
  public readonly x = new PrimitiveProperty<number>(0);
  public readonly y = new PrimitiveProperty<number>(0);
  public readonly z = new PrimitiveProperty<number>(0);
  public readonly rotation = new ArrayProperty<number>([1, 1, 1]);
  public readonly identifiers = new ArrayProperty<IDComponent>([new IDComponent(), new IDComponent(), new IDComponent()]);

  constructor() {
    super();
  }

}
