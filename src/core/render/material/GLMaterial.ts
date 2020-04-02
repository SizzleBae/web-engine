import { GLProgram } from "../gl/GLProgram";
import { Property } from "../../property/Property";
import { PType } from "../../property/DynamicProperty";
import { Matrix4 } from "../../math/Matrix4";


export abstract class GLMaterial {
    constructor(protected program: GLProgram) { }

}