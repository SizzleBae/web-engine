import { ReferenceProperty } from "./ReferenceProperty";
import { IDComponent } from "../components/IDComponent";
import { Serializable } from "./Serializable";
import { ObjectProperty } from "./ObjectProperty";

describe('ReferenceProperty', () => {
    @Serializable('test.ReferenceTest')
    class ReferenceTest {
        public ref1 = new ReferenceProperty<IDComponent>();
    }

    it('can serialize', () => {
        const serializing = new ObjectProperty<ReferenceTest>(new ReferenceTest());

        serializing.getSafe().ref1.set(new IDComponent('Hi, I am ID!'));

        const json = serializing.toJSON();

        console.log(json);

        const deserializing = new ObjectProperty<ReferenceTest>().fromJSON(json);

        console.log('Serializing:   ' + serializing.getSafe().ref1.getSafe().id.getSafe());
        console.log('Deserializing: ' + deserializing.getSafe().ref1.getSafe().id.getSafe());

    });
});