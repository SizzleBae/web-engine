import {TwoWayStrategy} from "./TwoWayStrategy";

export class TwoWayBooleanStrategy extends TwoWayStrategy<boolean, HTMLInputElement> {
    constructor() {
        super(document.createElement('input'));
        
        this.root.className = "tw-boolean";
        
        this.root.type = "checkbox";
        
        this.root.addEventListener('change', () => this.onHTMLValue.emit(this.root.checked));
    }
    
    onProgramValue(newValue: boolean): void {
        this.root.checked = newValue;
    }

    onDestroy(): void {
    }
}