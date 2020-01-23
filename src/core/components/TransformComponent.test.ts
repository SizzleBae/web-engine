import { ObjectProperty } from "../property/ObjectProperty";

import { TransformComponent } from "./TransformComponent";

describe('TransformComponent', () => {
    it('can be serialized', () => {

        const test = new ObjectProperty(new TransformComponent());
        const testJSON = test.toJSON();
        const test2 = new ObjectProperty().fromJSON(testJSON);

        console.log(test2);

    });
});