import {TwoWayAbstractProperty} from "./TwoWayAbstractProperty";
import {Property} from "../../Property";
import {TwoWayStrategyBuilders} from "./TwoWayStrategyBuilders";
import {TwoWayStrategy} from "./TwoWayStrategy";

export class TwoWayProperty extends TwoWayAbstractProperty {
    private strategyTwoWay: TwoWayStrategy<any>;
    
    private propertyChangeListener = (newValue: any) => this.strategyTwoWay.onProgramValue(newValue);
    
    constructor(private property: Property<any>, private strategyBuilders: TwoWayStrategyBuilders) {
        super(document.createElement('div'));
        
        this.root.className = "tw-property";

        this.strategyTwoWay = strategyBuilders.build(property.strategy);

        this.strategyTwoWay.onHTMLValue.subscribe(newValue => property.set(newValue));
        this.property.onChanged.subscribe(this.propertyChangeListener);

        this.strategyTwoWay.onProgramValue(property.get());
        
        this.root.appendChild(this.strategyTwoWay.root);
    }
    
    protected onDestroy(): void {
        this.strategyTwoWay.destroy();
        this.property.onChanged.unsubscribe(this.propertyChangeListener);
    }
}