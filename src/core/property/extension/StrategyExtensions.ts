﻿import {PropertyStrategy} from "../strategy/PropertyStrategy";

export class StrategyExtensions<TExtension> {
    private extensionMap = new Map<new(...args:any[])=>PropertyStrategy, TExtension>();
    
    set<T>(strategyType: new(...args:any[])=>PropertyStrategy<T>, extension: TExtension) {
        this.extensionMap.set(strategyType, extension);
    }
    
    get<T>(strategy: PropertyStrategy<T>): TExtension | undefined {
       return this.extensionMap.get(strategy.constructor as any); 
    }
}