import { ArrayCompositeComponent } from "./core/components/ArrayCompositeComponent";
import { IDComponent } from "./core/components/IDComponent";
import { TransformComponent } from "./core/components/TransformComponent";
import { SerializeUtils } from "./core/property/SerializeUtils";

let composite = new ArrayCompositeComponent();
composite.add(new TransformComponent());

let child = composite.findChildComponent(TransformComponent);
if (child) {
    console.log(SerializeUtils.serializeObject(child));
}