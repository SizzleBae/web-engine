import {PropertyStrategy} from "./PropertyStrategy";
import {META_SERIALIZABLE_ID_KEY} from "../../serialize/Serializable";
import {NumberStrategy} from "./NumberStrategy";
import {ArrayStrategy} from "./ArrayStrategy";
import {MapStrategy} from "./MapStrategy";

export type SerializedStrategy = { 
    id: string,
    data: any 
};

export class StrategySerializer {
    static serialize(strategy: PropertyStrategy<any>): SerializedStrategy {
        if(strategy instanceof NumberStrategy) {
            return {
                id: "number",
                data: {
                    max: strategy.max,
                    min: strategy.min
                }
            }
        } else if(strategy instanceof ArrayStrategy) {
            return {
                id: "array",
                data: StrategySerializer.serialize(strategy.elementStrategy)
            }
        } else if(strategy instanceof MapStrategy) {
            
        }

        throw new Error(`StrategySerializer: Failed to serialize strategy, unrecognized constructor.`);
    }
    
    static deserialize(serialized: SerializedStrategy): PropertyStrategy<any> {
        switch (serialized.id) {
            case "number":
                return new NumberStrategy(serialized.data.max, serialized.data.min);
        }

        throw new Error(`StrategySerializer: Failed to deserialize strategy, unrecognized id.`);
    }
}