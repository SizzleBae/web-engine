import { PropertyVisitor } from "./PropertyVisitor"
import { primitive, PrimitiveProperty } from "./PrimitiveProperty";
import { ObjectProperty } from "./ObjectProperty";
import { ArrayProperty } from "./ArrayProperty";
import uuidv1 from 'uuid/v1'
import { META_SERIALIZABLE_ID_KEY } from "./Serializable";
import { PropertyUtils } from "./PropertyUtils";

export class ObjectSerializer extends PropertyVisitor {

    private json: any = {};

    constructor(private targets: object[], private keepExternalRefs: boolean) {
        super();
    }

    toJSON(): any {
        // Create lookup for given objects using uuid
        const lookup = new Map<object, string>();
        this.targets.forEach(object => {
            lookup.set(object, uuidv1());
        });

        // Serialize each object into a json and insert that with its id in the final json
        this.targets.forEach(object => {
            const objectJSON = {} as any;
            const constructorID = Reflect.get(object.constructor, META_SERIALIZABLE_ID_KEY);
            if (constructorID !== undefined) {
                objectJSON['constructorID'] = constructorID;

                PropertyUtils.forEachPropertyIn(object, (property, key) => {
                    objectJSON[key] = property.serialize(lookup);
                });

                this.json[lookup.get(object) as string] = objectJSON;
            }
        });

        return this.json;
    }

    visitPrimitive<T extends primitive>(property: PrimitiveProperty<T>): void {

    }

    visitObject<T extends object>(property: ObjectProperty<T>): void {

    }

    visitArray<T>(property: ArrayProperty<T>): void {

    }


}