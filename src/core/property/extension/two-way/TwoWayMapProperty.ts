import {TwoWayProperty} from "./TwoWayProperty";
import {TwoWayStrategyBuilders} from "./TwoWayStrategyBuilders";
import {TwoWayStrategy} from "./TwoWayStrategy";
import {MapProperty} from "../../MapProperty";

export class TwoWayMapProperty extends TwoWayProperty {
    private twoWayMap = new Map<any, { key: TwoWayStrategy<any>, value: TwoWayStrategy<any> }>();
    
    private propertyChangeListener = ()=>this.refreshTwoWayMap();
    
    private mapContainer = document.createElement('div');
    
    constructor(private property: MapProperty<any, any>, private strategyBuilders: TwoWayStrategyBuilders) {
        super(document.createElement('div'));

        property.onChanged.subscribe(this.propertyChangeListener);
        
        this.root.appendChild(this.mapContainer);
        
        // Create add entry button
        const addButton = document.createElement('button');
        addButton.innerHTML = '+';
        addButton.addEventListener('click', () => {
            const emptyKey = this.property.keyStrategy.createEmpty();
            const emptyValue = this.property.valueStrategy.createEmpty();
            this.property.set(emptyKey, emptyValue);
        });
        this.root.appendChild(addButton);
        
        this.refreshTwoWayMap();
    }
    
    private destroyRemovedEntries() {
        const removedKeys: any[] = [];
        
        for(const key of this.twoWayMap.keys()) {
            if(!this.property.has(key)) {
                removedKeys.push(key);
            }
        }
        
        removedKeys.forEach(key => {
            const twoWayEntry = this.twoWayMap.get(key);
            
            if(twoWayEntry) {
                this.twoWayMap.delete(key);

                // Remove entry container
                twoWayEntry.key.root.parentElement?.remove();

                twoWayEntry.key.destroy();
                twoWayEntry.value.destroy();
            }
        })
    }
    
    private createAddedEntries() {
        for(const [key, value] of this.property) {
            if(!this.twoWayMap.has(key)) {
                const keyTwoWay = this.strategyBuilders.build(this.property.keyStrategy);
                const valueTwoWay = this.strategyBuilders.build(this.property.valueStrategy);
                
                this.twoWayMap.set(key, {key: keyTwoWay, value: valueTwoWay});

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
                this.mapContainer.appendChild(entryContainer);
            }
        }
    }
    
    private updateHTMLValues() {
        for(const [key, value] of this.property) {
            const twoWay = this.twoWayMap.get(key);
            if(twoWay) {
                twoWay.key.onProgramValue(key);
                twoWay.value.onProgramValue(value);
            }
        }
    }
    
    private refreshTwoWayMap() {
        this.destroyRemovedEntries();
        this.createAddedEntries();
        this.updateHTMLValues();
    }
    
    protected onDestroy(): void {
        this.twoWayMap.forEach(entry => {
            entry.value.destroy();
            entry.key.destroy();
        })
        
        this.property.onChanged.unsubscribe(this.propertyChangeListener);
    }
}