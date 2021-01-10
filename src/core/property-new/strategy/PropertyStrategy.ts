export abstract class PropertyStrategy<TValue, TValueMemento = any, TMemento = any> {
    abstract modify(value: TValue): TValue;
    
    abstract serialize(value: TValue, keepExternal: boolean, lookup: Map<object, string>): TValueMemento;
    abstract deserialize(memento: TValueMemento, lookup: Map<string, object>): TValue;
}