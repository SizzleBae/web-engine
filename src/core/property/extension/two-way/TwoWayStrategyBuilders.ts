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
    builders = new StrategyExtensions<(strategy: PropertyStrategy)=>TwoWayStrategy<any>>();

    addDefaultBuilders() {
        this.builders.set(StringStrategy, ()=>new TwoWayStringStrategy());
        this.builders.set(NumberStrategy, ()=>new TwoWayNumberStrategy());
        this.builders.set(BooleanStrategy, ()=>new TwoWayBooleanStrategy());
        this.builders.set(NullableStrategy, (strategy)=>new TwoWayNullableStrategy(this.build(strategy)));

        return this;
    }
    
    build(strategy: PropertyStrategy<any>): TwoWayStrategy<any> {
        const builder = this.builders.get(strategy);
        
        if(!builder) {
            throw new Error(`TwoWayStrategyBuilders: Missing builder for strategy.`);
        }
        
        return builder(strategy);
    }
}