import {TwoWayStrategy} from "./TwoWayStrategy";


export class TwoWayNullableStrategy<T> extends TwoWayStrategy<T | null, HTMLSpanElement> {
    
    private nullHTML = document.createElement('input');
    private setNullButton = document.createElement('button');
    
    constructor(private wrappedStrategy: TwoWayStrategy<T>) {
        super(document.createElement('span'));

        this.nullHTML.readOnly = true;
        this.nullHTML.value = "NULL";
        
        this.setNullButton.innerHTML = "X";
        this.setNullButton.onclick = ()=>this.onHTMLValue.emit(null);
        this.root.appendChild(this.setNullButton);
        
        wrappedStrategy.onHTMLValue.subscribe((newValue)=>this.onHTMLValue.emit(newValue));
    }

    private displayWrappedStrategy(display: boolean) {
        this.setNullButton.hidden = !display;
        if(display) {
            if(this.nullHTML.isConnected) {
                this.nullHTML.remove();
            }
            if(!this.wrappedStrategy.root.isConnected) {
                this.root.prepend(this.wrappedStrategy.root);
            }
        } else {
            if(this.wrappedStrategy.root.isConnected) {
                this.wrappedStrategy.root.remove();
            }
            if(!this.nullHTML.isConnected) {
                this.root.prepend(this.nullHTML);
            }
        }
    }
    
    onProgramValue(newValue: T | null): void {
        if(newValue !== null) {
            this.wrappedStrategy.onProgramValue(newValue);
        }

        this.displayWrappedStrategy(newValue !== null);
    }

    onDestroy(): void {
        this.wrappedStrategy.destroy();
    }
}