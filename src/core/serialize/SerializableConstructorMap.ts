export class SerializableConstructorMap {
    private static _instance: SerializableConstructorMap | undefined;

    private map = new Map<string, { new(): {} }>();

    protected constructor() { }

    /**
     * Stores a property owner constructer with a name as an identifier
     * @param name The identifier of the constructor
     * @param owner The property owner constructor
     */
    public registerSerializableConstructor(name: string, owner: { new(): {} }): void {

        // Ensure that the name is unique
        if (this.map.has(name)) {
            throw new Error(`Attempted to register a constructor that is already defined: ${name}`)
        }

        this.map.set(name, owner);

    }

    public getOwnerConstructor(name: string): { new(): {} } | undefined {
        return this.map.get(name) as { new(): {} };
    }

    public static instance(): SerializableConstructorMap {
        if (SerializableConstructorMap._instance === undefined) {
            SerializableConstructorMap._instance = new SerializableConstructorMap();
        }
        return SerializableConstructorMap._instance;
    }
}