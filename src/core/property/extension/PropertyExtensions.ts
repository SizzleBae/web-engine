import {AbstractProperty} from "../AbstractProperty";

export class PropertyExtensions<TExtension> {
    private extensionMap = new Map<new(...args:any[])=>AbstractProperty, TExtension>();
    
    set(propertyType: new(...args:any[])=>AbstractProperty, extension: TExtension) {
        this.extensionMap.set(propertyType, extension);
    }
    
    get(property: AbstractProperty): TExtension | undefined {
       return this.extensionMap.get(property.constructor as any); 
    }
}