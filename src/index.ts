import { ArrayCompositeComponent } from "./core/components/ArrayCompositeComponent";
import { IDComponent } from "./core/components/IDComponent";

let composite = new ArrayCompositeComponent();
composite.add(new IDComponent());

let child = composite.findChildComponent(IDComponent);
if (child) {
    console.log(child.id);
}