export class Reference {
    public referenceCount = 0;

    constructor(public target: Object) { }
}

export class ReferenceManager {

    private static _instance: ReferenceManager | undefined;

    public static instance(): ReferenceManager {
        if (ReferenceManager._instance === undefined) {
            ReferenceManager._instance = new ReferenceManager();
        }

        return ReferenceManager._instance;
    }

    private referenceMap = new Map<string, Reference>();

    public set(id: string, target: Object) {
        const currentRef = this.referenceMap.get(id);
        if (currentRef !== undefined && currentRef.target !== target) {
            console.warn(`Overwriting value with id: ${id}!`);
        }

        this.referenceMap.set(id, new Reference(target));
    }

    public getTarget(id: string): Object | undefined {
        const reference = this.referenceMap.get(id);

        if (reference !== undefined) {
            return reference.target;
        }

        return undefined;
    }

    public getID(target: Object): string | undefined {

        for (const [id, reference] of this.referenceMap.entries()) {
            if (reference.target === target) {
                return id;
            }
        }

        return undefined;
    }

    public decreaseReferenceCount(id: string): void {
        const reference = this.referenceMap.get(id);

        if (reference === undefined) {
            throw new Error(`Attempted to decrease reference count on a reference that does not exist: ${id}`);
        }

        reference.referenceCount--;

        if (reference.referenceCount <= 0) {
            this.referenceMap.delete(id);
        }

    }

    public inreaseReferenceCount(id: string): void {
        const reference = this.referenceMap.get(id);

        if (reference === undefined) {
            throw new Error(`Attempted to increase reference count on a reference that does not exist: ${id}`);
        }

        reference.referenceCount++;

    }

    // /**
    //  * Returns a reference with given id, if it exists.
    //  * Does not increase reference counter, meaning this reference may be removed from the reference manager.
    //  * @param id The id of the reference to get
    //  */
    // public getWeak<T>(id: string): T | undefined {
    //     const reference = this.referenceMap.get(id);

    //     if (reference !== undefined) {
    //         return reference.target;
    //     }
    //     return undefined;
    // }

    // /**
    //  * Returns a reference with given id, if it exists.
    //  * Increases reference counter, meaning this reference will be kept in the reference manager, until reference count reaches zero
    //  * ReferenceManager.clearThree(id) must be called to decrease reference count
    //  * @param id The id of the reference to get
    //  */
    // public getStrong<T>(id: string): T | undefined {
    //     const reference = this.referenceMap.get(id);

    //     if (reference !== undefined) {
    //         reference.referenceCount++;
    //         return reference.target;
    //     }
    //     return undefined;
    // }

    // /**
    //  * Decrements reference counter of reference with id, if reference count reaches zero, the reference is deleted from the reference manager
    //  * @param id The id of the reference to decrement reference counter for 
    //  */
    // public clearStrong(id: string) {
    //     const reference = this.referenceMap.get(id);

    //     if (reference === undefined) {
    //         throw new Error(`Reference with id - ${id} - does not exist!`);
    //     }

    //     reference.referenceCount--;

    //     if (reference.referenceCount <= 0) {
    //         this.referenceMap.delete(id);
    //     }

    // }

}