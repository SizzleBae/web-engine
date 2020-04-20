import { GLMaterial } from "./GLMaterial";
import { Property } from "../../property/Property";
import { Matrix4 } from "../../math/Matrix4";
import { PType, safe } from "../../property/DynamicProperty";
import { GLProgram } from "../gl/GLProgram";
import { GLShader } from "../gl/GLShader";

export class GLBasicMaterial extends GLMaterial {

	readonly modelViewMatrix: Property<Matrix4, safe> = new Property(PType.Data, new Matrix4());
	readonly projectionMatrix: Property<Matrix4, safe> = new Property(PType.Data, new Matrix4());

	readonly aVertexPosition: number;
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
						gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
					}`
			)));

		this.aVertexPosition = this.program.getAttribLocation('aVertexPosition');
		this.uModelViewMatrix = this.program.getUniformLocation('uModelViewMatrix') as WebGLUniformLocation;
		this.uProjectionMatrix = this.program.getUniformLocation('uProjectionMatrix') as WebGLUniformLocation;

		this.projectionMatrix.get().e.onArrayChanged.subscribe(() => {
			this.gl.uniformMatrix4fv(this.uProjectionMatrix, false, this.projectionMatrix.get().e.get());
		});

		this.modelViewMatrix.get().e.onArrayChanged.subscribe(() => {
			this.gl.uniformMatrix4fv(this.uModelViewMatrix, false, this.modelViewMatrix.get().e.get());
		});
	}

	use() {
		this.gl.useProgram(this.program.program);
	}
}