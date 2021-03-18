import {PropertyExtensions} from "../PropertyExtensions";
import {TwoWayAbstractProperty} from "./TwoWayAbstractProperty";
import {Property} from "../../Property";
import {TwoWayProperty} from "./TwoWayProperty";
import {AbstractProperty} from "../../AbstractProperty";
import {TwoWayStrategyBuilders} from "./TwoWayStrategyBuilders";
import {ArrayProperty} from "../../ArrayProperty";
import {TwoWayArrayProperty} from "./TwoWayArrayProperty";
import {MapProperty} from "../../MapProperty";
import {TwoWayMapProperty} from "./TwoWayMapProperty";

type TwoWayPropertyExtension<T extends AbstractProperty> = (property: T) => TwoWayAbstractProperty;

export class TwoWayPropertyBuilder extends PropertyExtensions<TwoWayPropertyExtension<any>> {
    constructor(public strategies: TwoWayStrategyBuilders) {
        super();
        
        this.set(Property, (property) => new TwoWayProperty(property, strategies));
        this.set(ArrayProperty, (property) => new TwoWayArrayProperty(property, strategies));
        this.set(MapProperty, (property) => new TwoWayMapProperty(property, strategies));
    }
    
    buildFor(property: AbstractProperty) {
        const builder = this.get(property);
        if(builder) {
            return builder(property);
        }
        throw new Error("Missing TwoWay property builder.");
    }
}