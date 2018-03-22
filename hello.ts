///<reference path="./webgpu.d.ts" />
class Zelaren {
    canvas: HTMLCanvasElement
    rect: ClientRect
    gpu: WebGPURenderingContext
    commandQueue: WebGPUCommandQueue
    renderPassDescriptor: WebGPURenderPassDescriptor
    renderPipelineState: WebGPURenderPipelineState
    constructor(name: string) {
        this.canvas = document.getElementById(name) as HTMLCanvasElement
        this.rect = this.canvas.getBoundingClientRect()
        this.gpu = this.canvas.getContext("webgpu")
        this.commandQueue = this.gpu.createCommandQueue()
        let library = this.gpu.createLibrary(document.getElementById("library").innerText)
        let vertexFunction = library.functionWithName("vertex_main")
        let fragmentFunction = library.functionWithName("fragment_main")

        let pipelineDescriptor = new WebGPURenderPipelineDescriptor()
        pipelineDescriptor.vertexFunction = vertexFunction
        pipelineDescriptor.fragmentFunction = fragmentFunction
        pipelineDescriptor.colorAttachments[0].pixelFormat = WebGPUPixelFormat.BGRA8Unorm


        this.renderPipelineState = this.gpu.createRenderPipelineState(pipelineDescriptor);

        this.renderPassDescriptor = new WebGPURenderPassDescriptor();
        // NOTE: Our API proposal has some of these values as declare enums, not constant numbers.
        // We haven't got around to implementing the declare enums yet.
        this.renderPassDescriptor.colorAttachments[0].loadAction = WebGPULoadAction.clear;
        this.renderPassDescriptor.colorAttachments[0].storeAction = WebGPUStoreAction.store;
        this.renderPassDescriptor.colorAttachments[0].clearColor = [0.35, 0.65, 0.85, 1.0];
    }
    public render() {
        let commandBuffer = this.commandQueue.createCommandBuffer();
        let drawable = this.gpu.nextDrawable();
        this.renderPassDescriptor.colorAttachments[0].texture = drawable.texture;

        let commandEncoder = commandBuffer.createRenderCommandEncoderWithDescriptor(this.renderPassDescriptor)
        commandEncoder.setRenderPipelineState(this.renderPipelineState);

        // NOTE: We didn't attach any buffers. We create the geometry in the vertex shader using
        // the vertex ID.

        // NOTE: Our API proposal uses the declare enum value "triangle" here. We haven't got around to implementing the declare enums yet.
        commandEncoder.drawPrimitives(WebGPUPrimitiveType.triangle, 0, 3);

        commandEncoder.endEncoding();
        commandBuffer.presentDrawable(drawable);
        commandBuffer.commit();
    }
}


window.onload = () => {
    var a = new Zelaren("canvas")
    a.render()
}