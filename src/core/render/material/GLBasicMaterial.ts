import { GLMaterial } from "./GLMaterial";
import { Property } from "../../property/Property";
import { Matrix4 } from "../../math/Matrix4";
import { PType } from "../../property/DynamicProperty";
import { GLProgram } from "../gl/GLProgram";
import { GLShader } from "../gl/GLShader";

export class GLBasicMaterial extends GLMaterial {
	readonly modelViewMatrix: Property<Matrix4> = new Property(PType.Data, new Matrix4());
	readonly projectionMatrix: Property<Matrix4> = new Property(PType.Data, new Matrix4());

	readonly uModelViewMatrix: WebGLUniformLocation;
	readonly uProjectionMatrix: WebGLUniformLocation;

	constructor(private gl: WebGL2RenderingContext) {
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

		this.uModelViewMatrix = this.program.getUniformLocation('uModelViewMatrix') as WebGLUniformLocation;
		this.uProjectionMatrix = this.program.getUniformLocation('uProjectionMatrix') as WebGLUniformLocation;

		this.projectionMatrix.get()?.m.onArrayChanged.subscribe(() => {
			const array = this.projectionMatrix.get()?.m.get() as number[];
			this.gl.uniformMatrix4fv(this.uProjectionMatrix, false, array);
		});

		this.modelViewMatrix.get()?.m.onArrayChanged.subscribe(() => {
			const array = this.modelViewMatrix.get()?.m.get() as number[];
			this.gl.uniformMatrix4fv(this.uModelViewMatrix, false, array);
		});
	}
}