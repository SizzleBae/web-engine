import { PrimitiveProperty } from './PrimitiveProperty';
import { ObjectProperty } from './ObjectProperty';
import { IDComponent } from '../components/IDComponent';
import { TransformComponent } from '../components/TransformComponent';

describe('ObjectProperty', () => {
    it('can serialize', () => {
        const serializingObject = new ObjectProperty<IDComponent>(new IDComponent());
        const jsonFilled = serializingObject.toJSON();

        const deserialzingObject = new ObjectProperty<IDComponent>();
        deserialzingObject.fromJSON(jsonFilled);

        expect(deserialzingObject.get()?.id.get()).toBe(serializingObject.get()?.id.get());

    });
});