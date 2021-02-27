import {StrategyExtensions} from "../StrategyExtensions";
import {StringStrategy} from "../../strategy/StringStrategy";
import {TwoWayStringStrategy} from "./TwoWayStringStrategy";
import {TwoWayStrategy} from "./TwoWayStrategy";
import {NumberStrategy} from "../../strategy/NumberStrategy";
import {TwoWayNumberStrategy} from "./TwoWayNumberStrategy";
import {BooleanStrategy} from "../../strategy/BooleanStrategy";
import {TwoWayBooleanStrategy} from "./TwoWayBooleanStrategy";
import {PropertyStrategy} from "../../strategy/PropertyStrategy";
import {NullableStrategy} from "../../strategy/NullableStrategy";
import {TwoWayNullableStrategy} from "./TwoWayNullableStrategy";

export class TwoWayStrategyBuilders {
    private builders = new StrategyExtensions<(strategy: PropertyStrategy)=>TwoWayStrategy<any>>();
    
    constructor() {
        this.add(StringStrategy, ()=>new TwoWayStringStrategy());
        this.add(NumberStrategy, ()=>new TwoWayNumberStrategy());
        this.add(BooleanStrategy, ()=>new TwoWayBooleanStrategy());
        this.add(NullableStrategy, strategy => new TwoWayNullableStrategy(this.build(strategy.wrappedStrategy)));
    }
    
    add<T extends PropertyStrategy>(strategyType: {new(...args: any[]):T}, builder: (strategy: T)=>TwoWayStrategy<any>) {
        this.builders.set(strategyType, builder as (strategy: PropertyStrategy)=>TwoWayStrategy<any>);
    }
    
    build(strategy: PropertyStrategy<any>): TwoWayStrategy<any> {
        const builder = this.builders.get(strategy);
        
        if(!builder) {
            throw new Error(`TwoWayStrategyBuilders: Missing builder for strategy.`);
        }
        
        return builder(strategy);
    }
}