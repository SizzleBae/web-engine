import {PropertyExtensions} from "../PropertyExtensions";
import {TwoWayProperty} from "./TwoWayProperty";
import {Property} from "../../Property";
import {TwoWaySingleProperty} from "./TwoWaySingleProperty";
import {AbstractProperty} from "../../AbstractProperty";
import {TwoWayStrategyBuilders} from "./TwoWayStrategyBuilders";
import {ArrayProperty} from "../../ArrayProperty";
import {TwoWayArrayProperty} from "./TwoWayArrayProperty";

type TwoWayPropertyExtension<T extends AbstractProperty> = (property: T) => TwoWayProperty;

export class TwoWayPropertyBuilder extends PropertyExtensions<TwoWayPropertyExtension<any>> {
    constructor(public strategies: TwoWayStrategyBuilders) {
        super();
        
        this.set(Property, (property) => new TwoWaySingleProperty(property, strategies));
        this.set(ArrayProperty, (property) => new TwoWayArrayProperty(property, strategies));
    }
    
    buildFor(property: AbstractProperty) {
        const builder = this.get(property);
        if(builder) {
            return builder(property);
        }
        throw new Error("Missing TwoWay property builder.");
    }
}


// import {PropertyVisitor} from "../PropertyVisitor";
// import {AbstractProperty} from "../../AbstractProperty";
// import {Property} from "../../Property";
// import {ArrayProperty} from "../../ArrayProperty";
// import {TwoWayStrategyBuilders} from "./TwoWayStrategyBuilders";
// import {TwoWayStrategy} from "./TwoWayStrategy";
//
// export class TwoWayPropertyBuilder implements PropertyVisitor {
//     private result?: TwoWayStrategy<any>;
//
//     constructor(public strategyTwoWay: TwoWayStrategyBuilders) {
//     }
//
//     buildFor(property: AbstractProperty) {
//         this.result = undefined;
//         property.accept(this);
//
//         return this.result;
//     }
//
//     visitProperty(property: Property<any>): void {
//         const TwoWay = this.strategyTwoWay.builders.get(property.strategy);
//         if (TwoWay) {
//             const twoWay = new TwoWay();
//            
//             twoWay.onHTMLValue.subscribe(newValue => property.set(newValue));
//             property.onChanged.subscribe(newValue => twoWay.onProgramValue(newValue));
//
//             twoWay.onProgramValue(property.get());
//
//             this.result = twoWay;
//         }
//     }
//
//     visitArrayProperty(property: ArrayProperty<any>): void {
//         const TwoWay = this.strategyTwoWay.builders.get(property.strategy.constructor as any);
//         if (TwoWay) {
//             const container = document.createElement('div');
//
//             const refreshArrayHTML = () => {
//                 container.innerHTML = '';
//
//                 const twoWayArray = property.raw().map((element, index) => {
//                     const elementTwoWay = new TwoWay();
//
//                     elementTwoWay.onHTMLValue.subscribe(newValue => property.set(index, newValue));
//                     elementTwoWay.onProgramValue(element);
//
//                     return elementTwoWay;
//                 })
//
//                 twoWayArray.forEach((element, index) => {
//                     container.appendChild(element.root);
//
//                     const removeButton = document.createElement('button');
//                     removeButton.innerHTML = 'X';
//                     removeButton.addEventListener('click', () => property.remove(index));
//
//                     container.appendChild(removeButton);
//                 });
//
//                 const addButton = document.createElement('button');
//                 addButton.innerHTML = '+';
//                 addButton.addEventListener('click', () => property.push(property.strategy.createEmpty()));
//                 container.appendChild(addButton);
//             };
//
//             refreshArrayHTML();
//
//             property.onChanged.subscribe(refreshArrayHTML);
//
//             this.result = container;
//         }
//     }
// }