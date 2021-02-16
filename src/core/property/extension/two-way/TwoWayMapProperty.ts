import {TwoWayProperty} from "./TwoWayProperty";
import {TwoWayStrategyBuilders} from "./TwoWayStrategyBuilders";
import {TwoWayStrategy} from "./TwoWayStrategy";
import {MapProperty} from "../../MapProperty";

export class TwoWayMapProperty extends TwoWayProperty {
    private twoWayEntries: { key: TwoWayStrategy<any>, value: TwoWayStrategy<any> }[] = [];
    
    private propertyChangeListener = ()=>this.refreshTwoWayMap();
    
    constructor(private property: MapProperty<any, any>, private strategyBuilders: TwoWayStrategyBuilders) {
        super(document.createElement('div'));

        property.onChanged.subscribe(this.propertyChangeListener);
        
        this.refreshTwoWayMap();
    }
    
    private destroyTwoWayEntries() {
        this.twoWayEntries.forEach((entry) => {
            entry.key.destroy();
            entry.value.destroy();
        });
        
        this.twoWayEntries = [];
    }
    
    private refreshTwoWayMap() {
        this.root.innerHTML = '';
        this.destroyTwoWayEntries();
        
        const KeyStrategyTwoWay = this.strategyBuilders.builders.get(this.property.keyStrategy);
        if (!KeyStrategyTwoWay) {
            throw new Error("Missing key two way strategy.");
        }

        const ValueStrategyTwoWay = this.strategyBuilders.builders.get(this.property.valueStrategy);
        if (!ValueStrategyTwoWay) {
            throw new Error("Missing value two way strategy.");
        }
        
        for(const [key, value] of this.property) {
            const keyTwoWay = new KeyStrategyTwoWay();
            const valueTwoWay = new ValueStrategyTwoWay();
            
            keyTwoWay.onProgramValue(key);
            valueTwoWay.onProgramValue(value);
            
            keyTwoWay.onHTMLValue.subscribe(newKey => {
                this.property.raw().delete(key);
                this.property.set(newKey, value);
            })
            
            valueTwoWay.onHTMLValue.subscribe(newValue => {
                this.property.set(key, newValue);
            })

            const removeButton = document.createElement('button');
            removeButton.innerHTML = 'X';
            removeButton.onclick = e => this.property.delete(key);

            const entryContainer = document.createElement("div");
            entryContainer.appendChild(keyTwoWay.root);
            entryContainer.appendChild(valueTwoWay.root);
            entryContainer.appendChild(removeButton);
            this.root.appendChild(entryContainer);
        }

        const addButton = document.createElement('button');
        addButton.innerHTML = '+';
        addButton.addEventListener('click', () => {
            const emptyKey = this.property.keyStrategy.createEmpty();
            const emptyValue = this.property.valueStrategy.createEmpty();
            this.property.set(emptyKey, emptyValue);
        });
        this.root.appendChild(addButton);
    }
    
    protected onDestroy(): void {
        this.destroyTwoWayEntries();
        this.property.onChanged.unsubscribe(this.propertyChangeListener);
    }
}