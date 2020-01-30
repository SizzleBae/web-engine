import { ArrayCompositeComponent } from "./core/components/ArrayCompositeComponent";
import { TransformComponent } from "./core/components/TransformComponent";

let composite = new ArrayCompositeComponent();
composite.add(new TransformComponent());

let child = composite.findChildComponent(TransformComponent);
if (child) {
}
