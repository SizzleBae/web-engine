import {TwoWayProperty} from "./TwoWayProperty";
import {TwoWayStrategyBuilders} from "./TwoWayStrategyBuilders";
import {TwoWayStrategy} from "./TwoWayStrategy";
import {ArrayProperty} from "../../ArrayProperty";

export class TwoWayArrayProperty extends TwoWayProperty {
    private twoWayArray: TwoWayStrategy<any>[] = [];
    
    private propertyChangeListener = ()=>this.refreshTwoWayArray();
    
    private arrayContainer = document.createElement('div');
    
    constructor(private property: ArrayProperty<any>, private strategyBuilders: TwoWayStrategyBuilders) {
        super(document.createElement('div'));

        property.onChanged.subscribe(this.propertyChangeListener);
        
        // Handle remove button click event, do this at parent to prevent creating large amounts of handlers per button
        this.root.onclick = e => {
            if(e.target instanceof HTMLButtonElement) {
                const remove = e.target.getAttribute("data-remove");
                if(remove !== null) {
                    this.property.remove(Number.parseInt(remove));
                }
            }
        };
        
        this.root.appendChild(this.arrayContainer);

        // Create add element button
        const addButton = document.createElement('button');
        addButton.innerHTML = '+';
        addButton.addEventListener('click', () => this.property.push(this.property.strategy.createEmpty()));
        this.root.appendChild(addButton);
        
        this.refreshTwoWayArray();
    }
    
    private refreshTwoWayArray() {
        // Destroy excess two way elements
        this.twoWayArray.splice(this.property.length()).forEach(twoWay => {
            twoWay.root.parentElement?.remove();
            twoWay.destroy();
        });
        
        // Create two way elements if necessary
        for(let i = this.twoWayArray.length; i < this.property.length(); i++) {
            // Create two way object
            const twoWay = this.strategyBuilders.build(this.property.strategy);

            twoWay.onHTMLValue.subscribe(newValue => this.property.set(i, newValue));
            
            this.twoWayArray.push(twoWay);
            
            // Create container html
            const removeButton = document.createElement('button');
            removeButton.innerHTML = 'X';

            // Store index in attribute to lookup for when it is pressed
            removeButton.setAttribute("data-remove", i.toString());

            const elementContainer = document.createElement('div');
            elementContainer.appendChild(twoWay.root);
            elementContainer.appendChild(removeButton);
            this.arrayContainer.appendChild(elementContainer);
        }
        
        // Update two way state to match property state
        this.twoWayArray.forEach((twoWay, index) => twoWay.onProgramValue(this.property.get(index)));
    }
    
    protected onDestroy(): void {
        this.twoWayArray.forEach(twoWay => twoWay.destroy());
        this.property.onChanged.unsubscribe(this.propertyChangeListener);
    }
}