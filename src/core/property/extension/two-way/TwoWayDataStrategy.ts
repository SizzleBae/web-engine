import {TwoWayStrategy} from "./TwoWayStrategy";
import {PropertyUtils} from "../../PropertyUtils";
import {TwoWayPropertyBuilder} from "./TwoWayPropertyBuilder";
import {TwoWayAbstractProperty} from "./TwoWayAbstractProperty";

export class TwoWayDataStrategy<T extends object> extends TwoWayStrategy<T, HTMLSpanElement> {
    propertyTwoWays = new Map<string, TwoWayAbstractProperty>();
    
    constructor(public twoWayPropertyBuilder: TwoWayPropertyBuilder) {
        super(document.createElement('span'));
        
        this.root.className = "tw-data";
    }

    onProgramValue(newValue: T): void {
        this.clearTwoWays();
        
        // Create two ways for properties in new value
        PropertyUtils.forEachPropertyIn(newValue, (property, key) => {
             const propertyTwoWay = this.twoWayPropertyBuilder.buildFor(property);
             
             this.propertyTwoWays.set(key, propertyTwoWay);
        });

        // Create html for new two ways
        this.propertyTwoWays.forEach((propertyTwoWay, key) => {
            const twoWayKey = document.createElement("span");
            twoWayKey.innerText = key + ": ";

            const twoWayContainer = document.createElement("span");
            twoWayContainer.className = "tw-data-property";
            twoWayContainer.append(twoWayKey, propertyTwoWay.root);

            this.root.append(twoWayContainer);
        });
    }
    
    private clearTwoWays() {
        this.propertyTwoWays.forEach(twoWay => twoWay.destroy());
        this.propertyTwoWays.clear();
        // This function is standard, yet it is not defined in typescript lib.dom.d.ts for some reason...
        // @ts-ignore
        this.root.replaceChildren();
    }
    
    onDestroy(): void {
        this.clearTwoWays();
    }
}