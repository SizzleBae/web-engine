import { PrimitiveProperty } from './PrimitiveProperty';
import { ObjectProperty } from './ObjectProperty';
import { IDComponent } from '../components/IDComponent';
import { TransformComponent } from '../components/TransformComponent';

describe('ObjectProperty', () => {
    it('can serialize', () => {
        const testComponent = new ObjectProperty(TransformComponent, null);
        expect(testComponent.serialize()).toBe('null');
        testComponent.set(new TransformComponent());
        console.log(testComponent.serialize());
        // expect(testIDComponent.serialize()).toBe(testIDComponent.get()?.id.get());


    });
});