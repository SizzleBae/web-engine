import {TwoWayStrategy} from "./TwoWayStrategy";

export class TwoWayNullableStrategy<T> extends TwoWayStrategy<T | null, HTMLSpanElement> {
    
    constructor(private wrappedStrategy: TwoWayStrategy<T>) {
        super(wrappedStrategy.root);
        
        wrappedStrategy.onHTMLValue.subscribe((newValue)=>this.onHTMLValue.emit(newValue));
        
        
    }

    onProgramValue(newValue: T | null): void {
        if(newValue !== null) {
            this.wrappedStrategy.onProgramValue(newValue);
        }
        
        //TODO: Handle null value display
    }

    onDestroy(): void {
        this.wrappedStrategy.destroy();
    }
}