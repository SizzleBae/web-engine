import { ReferenceProperty } from "./ReferenceProperty";
import { IDComponent } from "../components/IDComponent";
import { Serializable } from "./Serializable";
import { ObjectProperty } from "./ObjectProperty";

@Serializable('test.RefereeTarget')
class RefereeTarget {
    public info = 'Hi, I a reference target!!';
}

@Serializable('test.Referee')
class Referee {
    public reference = new ReferenceProperty<ObjectProperty<RefereeTarget>>();
}

let counter = 0;
describe('Reading', () => {

    it('can serialize', () => {
        console.log(++counter);
        const target = new ObjectProperty(new RefereeTarget());

        // const serializing = new ObjectProperty<Referee>(new Referee());

        // serializing.getS().reference.set(new IDComponent('Hi, I am ID!'));

        // const json = serializing.toJSON();

        // const deserializing = new ObjectProperty<Referee>().fromJSON(json);

        // expect(deserializing.getS().reference.getS()).toBe(serializing.getS().reference.getS());

        // console.log(JSON.stringify(json));

    });
});


describe('Writing', () => {
    it('can be refered to after being deserialized', () => {
        console.log(++counter);

        // const jsonString = `{"constructorID":"core.ObjectProperty","object":{"constructorID":"test.ReferenceTest","reference":{"constructorID":"core.ReferenceProperty","referenceID":"0b211fc0-41f3-11ea-89ee-cb513871a604"}}}`;

        // const deserializing = new ObjectProperty<Referee>().fromJSON(JSON.parse(jsonString));

        // const referee = new RefereeTarget();
        // referee.reference.setID('0b211fc0-41f3-11ea-89ee-cb513871a604');

        // expect(referee.reference.getS()).toBe(deserializing.getS().reference.getS());

    });

});

