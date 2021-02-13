import {PropertyStrategy} from "../strategy/PropertyStrategy";
import {StringStrategy} from "../strategy/StringStrategy";
import {EventDelegate} from "../../event/EventDelegate";
import {StrategyExtensions} from "./StrategyExtensions";

export type TwoWayUI<T> = {
    html: HTMLElement;
    onChanged: EventDelegate<[newValue: T]>;
    updateValue(newValue: T): void;
}

export class TwoWayStrategy {
    builders = new StrategyExtensions<()=>TwoWayUI<any>>();
    
    addDefaultBuilders() {
        this.builders.set(StringStrategy, ()=>{
            const html = document.createElement("input");
            const twoWay: TwoWayUI<string> = {
                html: html,
                onChanged: new EventDelegate<[newValue: string]>(),
                updateValue(newValue: string) {
                    html.value = newValue;
                }
            }
            html.addEventListener('input', e => twoWay.onChanged.emit(html.value));
            
            return twoWay;
        });
        
        return this;
    }
}

// export function TwoWayUIBuilder(): Map<typeof PropertyStrategy, TwoWayUI> {
//    
// }