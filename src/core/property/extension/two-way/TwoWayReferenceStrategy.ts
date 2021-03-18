import {TwoWayStrategy} from "./TwoWayStrategy";
import {Constructable} from "../../strategy/ReferenceStrategy";

type DragOptions<T extends object> = {
    dataKey: string,
    referenceFromData: (data: string)=>T | null;
}

type Options<T extends object> = {
    drag?: DragOptions<T>
}

export class TwoWayReferenceStrategy<T extends object> extends TwoWayStrategy<T, HTMLSpanElement> {
    constructor(public type: Constructable<T>, private options: Options<T>) {
        super(document.createElement('span'));
        
        this.root.className = "tw-reference";
        
        if(options.drag) {
            this.setupDrag(options.drag);
        }
    }
    
    private setupDrag(dragOptions: DragOptions<T>) {
        this.root.addEventListener("dragover", e=>{
            if(e.dataTransfer?.types?.includes(dragOptions.dataKey)) {
                e.dataTransfer.dropEffect = "move";
                e.preventDefault();
            }
        })
        this.root.addEventListener("dragenter", e=>{
            if(e.dataTransfer?.types?.includes(dragOptions.dataKey)) {
                e.preventDefault();
            }
        })
        this.root.addEventListener("drop", e=>{
            const data = e.dataTransfer?.getData(dragOptions.dataKey);

            if(data) {
                const droppedReference = dragOptions.referenceFromData(data);

                if(droppedReference) {
                    this.onHTMLValue.emit(droppedReference);
                }
            }
        })
    }

    onProgramValue(newValue: T): void {
        this.root.innerHTML = newValue.constructor.name;
    }

    onDestroy(): void {
    }
}