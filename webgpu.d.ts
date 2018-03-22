// https://webkit.org/wp-content/uploads/webgpu-api-proposal.html#api
declare interface WebGPURenderingContext {
    // -- Identification and feature detection
    readonly name: string
    supportsFeatureSet(featureSet: WebGPUFeatureSet): boolean

    // -- Library creation
    createLibrary(sourceCode: string): WebGPULibrary;

    // -- Command queue creation
    createCommandQueue(): WebGPUCommandQueue;

    // @@ Do we need createCommandQueueWithMaxCommandBufferCount?

    // -- Resources
    createBuffer(data: ArrayBufferView): WebGPUBuffer;
    createTexture(descriptor: WebGPUTextureDescriptor): WebGPUTexture
    createSamplerState(descriptor: WebGPUSamplerDescriptor): WebGPUSamplerState

    // -- Rendering objects
    createDepthStencilState(descriptor: WebGPUDepthStencilDescriptor): WebGPUDepthStencilState
    createRenderPipelineState(descriptor: WebGPURenderPipelineDescriptor): WebGPURenderPipelineState
    // @@ Do we need the completion block versions?

    // -- Compute
    createComputePipelineState(functio: WebGPUFunction): WebGPUComputePipelineState
    createComputePipelineState(descriptor: WebGPUComputePipelineDescriptor): WebGPUComputePipelineState

    // -- Getting the rendering destination
    nextDrawable(): WebGPUDrawable
    // @@ Come up with a better way to do this.
}
declare interface WebGPUCommandQueue {
    label: string
    createCommandBuffer(): WebGPUCommandBuffer;
}
declare interface WebGPUCommandBuffer {
    // -- Command Encoder
    createRenderCommandEncoder(descriptor: WebGPURenderPassDescriptor): WebGPURenderCommandEncoder
    createBlitCommandEncoder(): WebGPUBlitCommandEncoder
    createComputeCommandEncoder(): WebGPUComputeCommandEncoder
    createRenderCommandEncoderWithDescriptor(descriptor: WebGPURenderPassDescriptor): WebGPURenderCommandEncoder
    // -- Status
    readonly status: WebGPUStatus
    readonly error: string

    // - Execution
    commit(): void
    presentDrawable(drawable: WebGPUDrawable): void
    readonly scheduled: Promise<void>
    readonly completed: Promise<void>

    // @@ Should the completed promise be the return value of commit()?

    // @@ Maybe add enqueue or invent some way to offload filling the buffer
    // to workers?
}

declare interface WebGPUDrawable {
    readonly texture: WebGPUTexture
    present(): void
}
declare interface WebGPUCommandEncoder {
    readonly label: string
    endEncoding(): void
}

declare interface WebGPUViewportDictionary {

}
declare enum WebGPUTriangleFill{

}
declare interface WebGPURenderCommandEncoder extends WebGPUCommandEncoder {

    // -- State

    // @@ Should these be  s?
    setBlendColor(red: number, green: number, blue: number, alpha: number): void
    setCullMode(mode: WebGPUCullMode): void
    setDepthBias(bias: number, scale: number, clamp: number): void
    setDepthClipMode(mode: WebGPUDepthClipMode): void
    setDepthStencilState(depthStencilState: WebGPUDepthStencilState): void
    setFrontFacingWinding(mode: WebGPUWinding): void
    setRenderPipelineState(pipelineState: WebGPURenderPipelineState): void
    // @@ Use Geometry declare  interfaces?
    setScissorRect(x: number, y: number, width: number, height: number): void
    setStencilReferenceValue(value: number): void
    // @@ Check if we can overload here
    setStencilReferenceValue(front: number, back: number): void
    setTriangleFillMode(mode: WebGPUTriangleFill): void
    setViewport(viewport: WebGPUViewportDictionary): void
    setVisibilityResultMode(mode: WebGPUVisibilityResultMode, offset: number): void

    // -- Resources

    setVertexBuffer(buffer: WebGPUBuffer, offset: number, index: number): void
    setVertexBuffers(buffers: WebGPUBuffer[], offsets: number[],
        startIndex: number, count: number): void
    // @@ need setVertexBytes?
    setVertexSamplerState(samplerState: WebGPUSamplerState, index: number): void
    setVertexSamplerStates(samplerState: WebGPUSamplerState[], startIndex: number,
        count: number): void
    setVertexTexture(texture: WebGPUTexture, index: number): void
    setVertexTextures(textures: WebGPUTexture[], startIndex: number,
        count: number): void

    setFragmentBuffer(buffer: WebGPUBuffer, offset: number, index: number): void
    setFragmentBuffers(buffers: WebGPUBuffer[], offsets: number[],
        startIndex: number, count: number): void
    // @@ need setFragmentBytes?
    setFragmentSamplerState(samplerState: WebGPUSamplerState, index: number): void
    setFragmentSamplerStates(samplerState: WebGPUSamplerState[], startIndex: number,
        count: number): void
    setFragmentTexture(texture: WebGPUTexture, index: number): void
    setFragmentTextures(textures: WebGPUTexture[], startIndex: number,
        count: number): void

    // -- Drawing

    drawPrimitives(type: number, start: number, count: number): void
    // @@ add drawInstanced and drawIndexed

}
declare interface WebGPUBlitCommandEncoder extends WebGPUCommandEncoder {
    // -- Copying Data Between Two Buffers
    copyFromBufferToBuffer(source: WebGPUBuffer, sourceOffset: number,
        destination: WebGPUBuffer,
        destinationOffset: number, size: number): void

    // -- Copying Data From a Buffer to a Texture
    copyFromBufferToTexture(buffer: WebGPUBuffer, sourceOffset: number,
        sourceBytesPerRow: number,
        sourceBytesPerImage: number, size: WebGPUSize,
        texture: WebGPUTexture,
        destinationSlice: number, destinationLevel: number,
        origin: WebGPUOrigin): void

    // -- Copying Data Between Two Textures
    copyFromTextureToTexture(): void

    // -- Copying Data from a Texture to a Buffer
    copyFromTextureToBuffer(): void

    // - Image Operations
    fillBuffer(buffer: WebGPUBuffer, start: number,
        count: number, value: number): void
    generateMipmapsForTexture(): void
}
declare interface WebGPUComputeCommandEncoder extends WebGPUCommandEncoder {

    // - Specifying the Compute Pipeline State
    setComputePipelineState(state: WebGPUComputePipelineState): void

    // -- Buffers and Textures
    setBuffer(buffer: WebGPUBuffer, offset: number, index: number): void
    setBuffers(buffers: WebGPUBuffer[], offsets: number[],
        startIndex: number, count: number): void

    setBuffer(bufferView: ArrayBufferView, index: number): void

    setTexture(texture: WebGPUTexture, index: number): void
    setTextures(textures: WebGPUTexture[], startIndex: number, count: number): void

    setSamplerState(samplerState: WebGPUSamplerState, index: number): void
    setSamplerStates(samplerStates: WebGPUSamplerState[], startIndex: number,
        count: number): void

    // @@ do we need setThreadgroupMemoryLength?

    // -- Executing
    dispatch(threadgroupsPerGrid: WebGPUSize, threadsPerThreadgroup: WebGPUSize): void
    // @@ dispatchThreadgroupsWithIndirectBuffer?
}
declare interface WebGPUViewport {
    originX: number
    originY: number
    width: number
    height: number
    znear: number
    zfar: number
}
declare interface WebGPUVertexDescriptor {

}
declare class WebGPURenderPipelineDescriptor {
    label: string
    vertexFunction: WebGPUFunction
    vertexDescriptor: WebGPUVertexDescriptor
    fragmentFunction: WebGPUFunction

    sampleCount: number
    alphaToCoverageEnabled: boolean
    alphaToOneEnabled: boolean
    rasterizationEnabled: boolean
    readonly colorAttachments: WebGPURenderPipelineColorAttachmentDescriptor[]
    depthAttachmentPixelFormat: WebGPUPixelFormat
    stencilAttachmentPixelFormat: WebGPUPixelFormat

    reset(): void
}


declare interface WebGPURenderPipelineState {
    label: string
}


declare interface WebGPUComputePipelineDescriptor {

    label: string

    computeFunction: WebGPUFunction
    threadGroupSizeIsMultipleOfThreadExecutionWidth: boolean

    reset(): void

}

declare interface WebGPUComputePipelineState {
    maxTotalThreadsPerThreadgroup: number
    threadExecutionWidth: number
}


declare interface WebGPUDepthStencilDescriptor {

    label: string

    depthCompareFunction: WebGPUCompareFunction
    depthWriteEnabled: boolean

    backFaceStencil: WebGPUStencilDescriptor
    frontFaceStencil: WebGPUStencilDescriptor
}


declare interface WebGPUStencilDescriptor {

    // -- Specifying Stencil Functions and Operations
    stencilFailureOperation: WebGPUStencilOperation
    depthFailureOperation: WebGPUStencilOperation
    depthStencilPassOperation: WebGPUStencilOperation
    stencilCompareFunction: WebGPUCompareFunction

    // -- Specifying Stencil Bit Mask Properties
    readMask: number
    writeMask: number
}

declare interface WebGPUDepthStencilState {
    label: string
}

declare interface WebGPUSamplerDescriptor {
    rAddressMode: WebGPUSamplerAddressMode
    sAddressMode: WebGPUSamplerAddressMode
    tAddressMode: WebGPUSamplerAddressMode
    minFilter: WebGPUSamplerMinMagFilter
    magFilter: WebGPUSamplerMinMagFilter
    mipFilter: WebGPUSamplerMipFilter
    lodMinClamp: number
    lodMaxClamp: number
    lodAverage: boolean
    maxAnisotropy: number
    normalizedCoordinates: boolean
    compareFunction: WebGPUCompareFunction
    label: string
}

declare interface WebGPUSamplerState {
    label: string
}

declare interface WebGPURenderPassAttachmentDescriptor {

    // -- Texture
    texture: WebGPUTexture
    level: number
    slice: number
    depthPlane: number

    // -- Rendering Pass Actions
    loadAction: WebGPULoadAction
    storeAction: WebGPUStoreAction

    // -- Specifying the Texture to Resolve Multisample Data
    resolveTexture: WebGPUTexture
    resolveLevel: number
    resolveSlice: number
    resolveDepthPlane: number
}

declare interface WebGPURenderPassColorAttachmentDescriptor extends WebGPURenderPassAttachmentDescriptor {

    clearColor: number[] // @@ should color be a type?

}

declare interface WebGPURenderPassDepthAttachmentDescriptor extends WebGPURenderPassAttachmentDescriptor {

    clearDepth: number
    depthResolveFilter: WebGPUMultisampleDepthResolveFilter

}

declare interface WebGPURenderPassStencilAttachmentDescriptor extends WebGPURenderPassAttachmentDescriptor {

    clearStencil: number

}


declare class WebGPURenderPassDescriptor {

    readonly colorAttachments: WebGPURenderPassColorAttachmentDescriptor[]
    depthAttachment: WebGPURenderPassDepthAttachmentDescriptor
    stencilAttachment: WebGPURenderPassStencilAttachmentDescriptor

    visibilityResultBuffer: WebGPUBuffer

}

declare interface WebGPURenderPipelineColorAttachmentDescriptor {

    // -- Pipeline state
    pixelFormat: WebGPUPixelFormat
    writeMask: WebGPUColorWriteMask

    // -- Blending
    blendingEnabled: boolean
    rgbBlendOperation: WebGPUBlendOperation
    alphaBlendOperation: WebGPUBlendOperation

    // -- Blend Factors
    sourceRGBBlendFactor: WebGPUBlendFactor
    destinationRGBBlendFactor: WebGPUBlendFactor
    sourceAlphaBlendFactor: WebGPUBlendFactor
    destinationAlphaBlendFactor: WebGPUBlendFactor
}

declare interface WebGPUResource {
    readonly cpuCacheMode: WebGPUCPUCacheMode
    readonly storageMode: WebGPUStorageMode
    readonly label: string

    setPurgeableState(state: string): void
}

declare interface WebGPUOrigin {
    x: number
    y: number
    z: number
}

declare interface WebGPUSize {
    width: number
    height: number
    depth: number
}

declare interface WebGPURegion {
    origin: WebGPUOrigin
    size: WebGPUSize
}
declare interface WebGPURange {

}
declare interface WebGPUTexture extends WebGPUResource {

    // @@ need API to provide data from <img>, <canvas>, <video> etc

    // -- Copying Data into a Texture Image
    replaceRegion(region: WebGPURegion, mipmapLevel: number, slice: number,
        bytes: ArrayBufferView, bytesPerRow: number,
        bytesPerImage: number): void
    replaceRegion(region: WebGPURegion, mipmapLevel: number,
        bytes: ArrayBufferView, bytesPerRow: number): void

    // -- Copying Data from a Texture Image
    getBytes(bytesPerRow: number, bytesPerImage: number,
        region: WebGPURegion, mipmapLevel: number, slice: number): ArrayBufferView

    // -- Creating Textures by Reusing Image Data
    newTextureView(pixelFormat: string, textureType: string,
        levelRange: WebGPURange, sliceRange: WebGPURange): WebGPUTexture

    // -- Querying Texture  s
    readonly textureType: string
    readonly pixelFormat: string
    readonly width: number
    readonly height: number
    readonly depth: number
    readonly mipmapLevelCount: number
    readonly arrayLength: number
    readonly sampleCount: number
    readonly framebufferOnly: boolean
    readonly rootResource: WebGPUResource
    readonly usage: WebGPUTextureUsage

    // -- Querying Parent Texture  s
    readonly parentTexture: WebGPUTexture
    readonly parentRelativeLevel: number
    readonly parentRelativeSlice: number

    // -- Querying Source Buffer  s
    readonly buffer: WebGPUBuffer
    readonly bufferOffset: number
    readonly bufferBytesPerRow: number
}


declare interface WebGPUTextureDescriptor {
    textureType: string
    pixelFormat: string
    width: number
    height: number
    depth: number
    mipmapLevelCount: number
    sampleCount: number
    arrayCount: number
    resourceOptions: WebGPUResourceOptions
    cpuCacheMode: WebGPUCPUCacheMode
    storageMode: WebGPUStorageMode
    usage: WebGPUTextureUsage
}

declare interface WebGPUBuffer extends WebGPUResource {

    createTexture(descriptor: WebGPUTextureDescriptor,
        offset: number, bytesPerRow: number): WebGPUTexture

    readonly length: number
    readonly contents: ArrayBufferView

}

declare interface WebGPULibrary {

    readonly sourceCode: string
    label: string
    readonly functionNames: string[]

    functionWithName(name: string): WebGPUFunction

}


declare interface WebGPUFunction {

    readonly name: string
    readonly functionType: WebGPUFunctionType

}

declare const enum WebGPUCompareFunction {
    "never",
    "less",
    "equal",
    "lessequal",
    "greater",
    "notequal",
    "greaterequal",
    "always"
}

declare const enum WebGPUPixelFormat {
    "BGRA8Unorm" = 80,
    etc
}

declare const enum WebGPULoadAction {
    "dontcare",
    "load",
    "clear"
}

declare const enum WebGPUStoreAction {
    "dontcare",
    "store",
    "multisampleresolve"
}

declare const enum WebGPUPrimitiveType {
    "point",
    "line",
    "linestrip",
    "triangle",
    "trianglestrip"
}

declare const enum WebGPUFunctionType {
    "fragment",
    "vertex"
}

declare const enum WebGPUStencilOperation {
    "keep",
    "zero",
    "replace",
    "incrementclamp",
    "decrementclamp",
    "invert",
    "incrementwrap",
    "decrementwrap"
}

declare const enum WebGPUStatus {
    "notenqueued",
    "enqueued",
    "committed",
    "scheduled",
    "completed",
    "error"
}

declare const enum WebGPUSamplerAddressMode {
    "clamptoedge",
    "mirrorclamptoedge",
    "repeat",
    "mirrorrepeat",
    "clamptozero"
}

declare const enum WebGPUSamplerMinMagFilter {
    "nearest",
    "linear"
}

declare const enum WebGPUSamplerMipFilter {
    "notmipmapped",
    "nearest",
    "linear"
}

declare const enum WebGPUCullMode {
    "none",
    "front",
    "back"
}

declare const enum WebGPUIndexType {
    "uint16",
    "uint32"
}

declare const enum WebGPUVisibilityResultMode {
    "disabled",
    "boolean",
    "counting"
}

declare const enum WebGPUWinding {
    "clockwise",
    "counterclockwise"
}

declare const enum WebGPUDepthClipMode {
    "clip",
    "clamp"
}

declare const enum WebGPUTriangleFillMode {
    "fill",
    "lines"
}

declare const enum WebGPUCPUCacheMode {
    "defaultcache",
    "writecombined"
}

declare const enum WebGPUStorageMode {
    "shared",
    "managed",
    "private"
}

declare const enum WebGPUResourceOptions {
    "cpucachemodedefaultcache",
    "cpucachemodewritecombined",
    "storagemodeshared",
    "storagemodemanaged",
    "storagemodeprivate",
    "optioncpucachemodedefaultcache",
    "optioncpucachemodewritecombined"
}

declare const enum WebGPUTextureUsage {
    "unknown",
    "shaderread",
    "shaderwrite",
    "rendertarget",
    "pixelformatview"
}

declare const enum WebGPUBlendOperation {
    "add",
    "subtract",
    "reversesubtract",
    "min",
    "max"
}

declare const enum WebGPUBlendFactor {
    "zero",
    "one",
    "sourcecolor",
    "oneminussourcecolor",
    "sourcealpha",
    "oneminussourcealpha",
    "destinationcolor",
    "oneminusdestinationcolor",
    "destinationalpha",
    "oneminusdestinationalpha",
    "sourcealphasaturated",
    "blendcolor",
    "oneminusblendcolor",
    "blendalpha",
    "oneminusblendalpha",
}

declare const enum WebGPUColorWriteMask {
    // This is a mask, so the calling site
    // should take an array of them.
    "none",
    "red",
    "green",
    "blue",
    "alpha",
    "all"
}

declare const enum WebGPUMultisampleDepthResolveFilter {
    "sample0",
    "min",
    "max"
}

declare const enum WebGPUFeatureSet {
    // some names like...
    "level1",
    "level2"
}


declare interface HTMLCanvasElement {
    getContext(contextId: "webgpu"): WebGPURenderingContext | null;
}