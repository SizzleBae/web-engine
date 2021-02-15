import {TwoWayStrategy} from "./TwoWayStrategy";
import {Vector} from "../../strategy/CustomStrategy";

export class TwoWayVectorStrategy extends TwoWayStrategy<Vector, HTMLSpanElement> {
    private xInput = document.createElement('input');
    private yInput = document.createElement('input');
    
    private inputChangeListener = () => this.onHTMLValue.emit(this.getHTMLVector());
    
    constructor() {
        super(document.createElement('span'));
        
        this.xInput.type = "number";
        this.yInput.type = "number";
        
        this.root.appendChild(this.xInput);
        this.root.appendChild(this.yInput);
        
        this.xInput.addEventListener('change', this.inputChangeListener);
        this.yInput.addEventListener('change', this.inputChangeListener);
    }
    
    onProgramValue(newValue: Vector): void {
        this.xInput.value = newValue.x.toString();
        this.yInput.value = newValue.y.toString();
    }
    
    private getHTMLVector(): Vector {
        return new Vector(Number.parseFloat(this.xInput.value), Number.parseFloat(this.yInput.value));
    }
}