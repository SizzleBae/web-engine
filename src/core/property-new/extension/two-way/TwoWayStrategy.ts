import {EventDelegate} from "../../../event/EventDelegate";

export abstract class TwoWayStrategy<TStrategy, TRoot extends HTMLElement = HTMLElement> {
    onHTMLValue = new EventDelegate<[newValue: TStrategy]>();

    protected constructor(public root: TRoot) {
    }

    abstract onProgramValue(newValue: TStrategy): void;

    destroy() {
        this.onHTMLValue.clearListeners();
        this.root.parentElement?.removeChild(this.root);
    }
}
