export default function (): {
    init: (ctx: WebGLRenderingContext) => void;
    mightBeEnum: (value: any) => boolean;
    glEnumToString: (value: number) => string;
    glFunctionArgToString: (functionName: string, numArgs: number, argumentIndex: any, value: any) => string;
    glFunctionArgsToString: (functionName: string, args: number) => string;

    makeDebugContext<T extends WebGL2RenderingContext | WebGLRenderingContext>(
        ctx: T,
        opt_onErrorFunc?: (err: any, funcName: any, args: any) => void,
        opt_onFunc?: (arg0: any, arg1: any) => void,
        opt_err_ctx?: T): T;

    makeLostContextSimulatingCanvas: (canvas: any) => any;
    resetToInitialState: (ctx: any) => void;
}