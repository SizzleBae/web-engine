import { ArrayCompositeComponent } from "./core/components/ArrayCompositeComponent";
import { TransformComponent } from "./core/components/TransformComponent";
import { ObjectProperty } from "./core/property/ObjectProperty";

let composite = new ArrayCompositeComponent();
composite.add(new TransformComponent());

let child = composite.findChildComponent(TransformComponent);
if (child) {
}
