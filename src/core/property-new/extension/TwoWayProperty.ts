import {PropertyVisitor} from "./PropertyVisitor";
import {Property} from "../Property";
import {ArrayProperty} from "../ArrayProperty";
import {AbstractProperty} from "../AbstractProperty";
import {TwoWayUI, TwoWayStrategy} from "./TwoWayStrategy";

export class TwoWayProperty implements PropertyVisitor {
    private result?: HTMLElement;
    
    constructor(public strategyTwoWay: TwoWayStrategy) {
    }
    
    buildFor(property: AbstractProperty) {
        property.accept(this);
        
        return this.result;
    }
    
    visitProperty(property: Property<any>): void {
        const builder = this.strategyTwoWay.builders.get(property.strategy.constructor as any);
        if(builder) {
            const twoWay = builder(); 
            
            twoWay.onChanged.subscribe(newValue => property.set(newValue));
            property.onChanged.subscribe(newValue => twoWay.updateValue(newValue));
            
            this.result = twoWay.html;
        }
    }
    
    visitArrayProperty(property: ArrayProperty<any>): void {
    }
}