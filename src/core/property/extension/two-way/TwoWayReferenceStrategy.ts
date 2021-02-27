import {TwoWayStrategy} from "./TwoWayStrategy";
import {Constructable} from "../../strategy/ReferenceStrategy";

export class TwoWayReferenceStrategy<T extends object> extends TwoWayStrategy<T, HTMLInputElement> {
    constructor(public type: Constructable<T>) {
        super(document.createElement('input'));
        this.root.readOnly = true;

        // this.root.addEventListener('change', () => this.onHTMLValue.emit());
    }

    onProgramValue(newValue: T): void {
        this.root.value = newValue.constructor.name;
    }

    onDestroy(): void {
    }
}