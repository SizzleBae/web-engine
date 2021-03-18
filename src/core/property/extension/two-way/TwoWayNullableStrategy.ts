import {TwoWayStrategy} from "./TwoWayStrategy";


export class TwoWayNullableStrategy<T> extends TwoWayStrategy<T | null, HTMLSpanElement> {
    
    private nullHTML = document.createElement('span');
    private setNullButton = document.createElement('button');
    
    constructor(private wrappedStrategy: TwoWayStrategy<T>) {
        super(document.createElement('span'));

        this.root.className = "tw-nullable";
        
        //this.nullHTML.readOnly = true;
        this.nullHTML.innerHTML = "NULL";
        
        this.setNullButton.innerHTML = "X";
        this.setNullButton.onclick = ()=>this.onHTMLValue.emit(null);
        
        this.root.appendChild(this.setNullButton);
        
        // Forward events to contained strategy when null is displayed
        this.nullHTML.addEventListener("drop", e => this.forwardEvent(e, DragEvent));
        this.nullHTML.addEventListener("dragenter", e => this.forwardEvent(e, DragEvent));
        this.nullHTML.addEventListener("dragover", e => this.forwardEvent(e, DragEvent));
        
        wrappedStrategy.onHTMLValue.subscribe((newValue)=>this.onHTMLValue.emit(newValue));
    }
    
    private forwardEvent<T extends Event>(originalEvent: T, EventConstructor: {new(type: string, init: any):T}) {
        const duplicatedEvent = new EventConstructor(originalEvent.type, originalEvent);
        return this.wrappedStrategy.root.dispatchEvent(duplicatedEvent);
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