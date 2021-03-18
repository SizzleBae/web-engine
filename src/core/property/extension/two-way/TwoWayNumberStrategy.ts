import {TwoWayStrategy} from "./TwoWayStrategy";

export class TwoWayNumberStrategy extends TwoWayStrategy<number, HTMLInputElement> {
    constructor() {
        super(document.createElement('input'));
        
        this.root.className = "tw-number";
        
        this.root.type = "number";
        
        this.root.addEventListener('change', () => this.onHTMLValue.emit(Number.parseFloat(this.root.value)));
    }
    
    onProgramValue(newValue: number): void {
        this.root.value = newValue.toString();
    }

    onDestroy(): void {
    }
}