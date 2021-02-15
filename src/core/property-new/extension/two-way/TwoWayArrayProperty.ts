import {TwoWayProperty} from "./TwoWayProperty";
import {TwoWayStrategyBuilders} from "./TwoWayStrategyBuilders";
import {TwoWayStrategy} from "./TwoWayStrategy";
import {ArrayProperty} from "../../ArrayProperty";

export class TwoWayArrayProperty extends TwoWayProperty {
    private twoWayArray: TwoWayStrategy<any>[] = [];
    
    private propertyChangeListener = ()=>this.refreshTwoWayArray();
    
    constructor(private property: ArrayProperty<any>, private strategyBuilders: TwoWayStrategyBuilders) {
        super(document.createElement('div'));

        property.onChanged.subscribe(this.propertyChangeListener);
        
        // Handle remove button click event, do this at parent to prevent creating large amounts of handlers per button
        this.root.onclick = e => {
            if(e.target instanceof HTMLButtonElement) {
                const removeIndex = e.target.getAttribute("data-remove");
                if(removeIndex !== null) {
                    this.property.remove(Number.parseInt(removeIndex));
                }
            }
        };
        
        
        this.refreshTwoWayArray();
    }
    
    private refreshTwoWayArray() {
        this.twoWayArray.forEach(twoWay => twoWay.destroy());
        
        this.root.innerHTML = '';
        
        const StrategyTwoWay = this.strategyBuilders.builders.get(this.property.strategy);
        if (!StrategyTwoWay) {
            throw new Error("Missing two way strategy.");
        }

        this.twoWayArray = this.property.raw().map((element, index) => {
            const elementTwoWay = new StrategyTwoWay();

            elementTwoWay.onHTMLValue.subscribe(newValue => this.property.set(index, newValue));
            elementTwoWay.onProgramValue(element);

            return elementTwoWay;
        });
        
        this.twoWayArray.forEach((element, index) => {
            this.root.appendChild(element.root);

            const removeButton = document.createElement('button');
            removeButton.innerHTML = 'X';
            
            // Store index in attribute to lookup for when it is pressed
            removeButton.setAttribute("data-remove", index.toString());

            this.root.appendChild(removeButton);
        });

        const addButton = document.createElement('button');
        addButton.innerHTML = '+';
        addButton.addEventListener('click', () => this.property.push(this.property.strategy.createEmpty()));
        this.root.appendChild(addButton);
    }
    
    protected onDestroy(): void {
        this.twoWayArray.forEach(twoWay => twoWay.destroy());
        this.property.onChanged.unsubscribe(this.propertyChangeListener);
    }
}