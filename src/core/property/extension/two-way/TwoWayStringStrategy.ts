import {TwoWayStrategy} from "./TwoWayStrategy";

export class TwoWayStringStrategy extends TwoWayStrategy<string, HTMLInputElement> {
    constructor() {
        super(document.createElement('input'));
        
        this.root.className = "tw-string";
        
        this.root.addEventListener('change', () => this.onHTMLValue.emit(this.root.value));
    }
    
    onProgramValue(newValue: string): void {
        this.root.value = newValue;
    }

    onDestroy(): void {
    }
}