import {StrategyExtensions} from "../StrategyExtensions";
import {StringStrategy} from "../../strategy/StringStrategy";
import {TwoWayStringStrategy} from "./TwoWayStringStrategy";
import {TwoWayStrategy} from "./TwoWayStrategy";
import {NumberStrategy} from "../../strategy/NumberStrategy";
import {TwoWayNumberStrategy} from "./TwoWayNumberStrategy";
import {BooleanStrategy} from "../../strategy/BooleanStrategy";
import {TwoWayBooleanStrategy} from "./TwoWayBooleanStrategy";

export class TwoWayStrategyBuilders {
    builders = new StrategyExtensions<{ new(): TwoWayStrategy<any> }>();

    addDefaultBuilders() {
        this.builders.set(StringStrategy, TwoWayStringStrategy);
        this.builders.set(NumberStrategy, TwoWayNumberStrategy);
        this.builders.set(BooleanStrategy, TwoWayBooleanStrategy);

        return this;
    }
}