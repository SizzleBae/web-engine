export abstract class TwoWayAbstractProperty<TRoot extends HTMLElement = HTMLElement> {
    protected constructor(public root: TRoot) {
    }
    
    destroy() {
        this.root.remove();
        this.onDestroy();
    }
    
    protected abstract onDestroy(): void;
}