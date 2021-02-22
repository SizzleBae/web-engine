import {EventDelegate} from "../../../event/EventDelegate";

export abstract class TwoWayStrategy<TStrategy, TRoot extends HTMLElement = HTMLElement> {
    onHTMLValue = new EventDelegate<[newValue: TStrategy]>();

    protected constructor(public root: TRoot) {
    }

    abstract onProgramValue(newValue: TStrategy): void;
    abstract onDestroy(): void;

    destroy() {
        this.onHTMLValue.clearListeners();
        this.root.remove();
        
        this.onDestroy();
    }
}
