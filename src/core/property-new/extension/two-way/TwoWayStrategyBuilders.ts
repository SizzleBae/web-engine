import {StrategyExtensions} from "../StrategyExtensions";
import {StringStrategy} from "../../strategy/StringStrategy";
import {TwoWayStringStrategy} from "./TwoWayStringStrategy";
import {TwoWayStrategy} from "./TwoWayStrategy";

export class TwoWayStrategyBuilders {
    builders = new StrategyExtensions<{ new(): TwoWayStrategy<any> }>();

    addDefaultBuilders() {
        this.builders.set(StringStrategy, TwoWayStringStrategy);

        return this;
    }
}