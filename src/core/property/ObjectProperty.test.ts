import { PrimitiveProperty } from './PrimitiveProperty';
import { ObjectProperty } from './ObjectProperty';
import { IDComponent } from '../components/IDComponent';
import { TransformComponent } from '../components/TransformComponent';

describe('ObjectProperty', () => {
    it('can serialize', () => {
        const serializingObject = new ObjectProperty<TransformComponent>(new TransformComponent());
        serializingObject.getS().z.set(169);
        const json = {} as any;
        json.main = serializingObject.serialize(json, new Map());

        console.log(JSON.stringify(json));
        const deserialzingObject = new ObjectProperty<TransformComponent>();
        deserialzingObject.deserialize(json, new Map(), json.main);
        deserialzingObject.getS().x.set(69);

        // expect(deserialzingObject.get()?.id.get()).toBe(serializingObject.get()?.id.get());

    });
});