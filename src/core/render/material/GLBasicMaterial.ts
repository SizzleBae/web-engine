import { GLMaterial } from "./GLMaterial";
import { Property } from "../../property/Property";
import { Matrix4 } from "../../math/Matrix4";
import { PType } from "../../property/DynamicProperty";
import { GLProgram } from "../gl/GLProgram";
import { GLShader } from "../gl/GLShader";

export class GLBasicMaterial extends GLMaterial {
	readonly projectionMatrix: Property<Matrix4> = new Property(PType.Data, new Matrix4());

	constructor(gl: WebGL2RenderingContext) {
		super(new GLProgram(gl,
			new GLShader(gl,
				() => `
					attribute vec4 aVertexPosition;

					uniform mat4 uModelViewMatrix;
					uniform mat4 uProjectionMatrix;

					void main() {
						gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
					}`,
				() => `
					void main() {
						gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
					}`
			)));

		this.projectionMatrix.onChanged.subscribe((data) => {
			this.program.
		})
	}
}