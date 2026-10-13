/* @ts-self-types="./liquid_glass.d.ts" */

export class LiquidGlassRenderer {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LiquidGlassRendererFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_liquidglassrenderer_free(ptr, 0);
    }
    /**
     * @returns {boolean}
     */
    needs_animation() {
        const ret = wasm.liquidglassrenderer_needs_animation(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.liquidglassrenderer_new(retptr, addHeapObject(canvas));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0;
            LiquidGlassRendererFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {number}
     */
    position_x() {
        const ret = wasm.liquidglassrenderer_position_x(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} elapsed_seconds
     */
    render(elapsed_seconds) {
        wasm.liquidglassrenderer_render(this.__wbg_ptr, elapsed_seconds);
    }
    /**
     * @param {number} width
     * @param {number} height
     * @param {number} device_pixel_ratio
     */
    resize(width, height, device_pixel_ratio) {
        wasm.liquidglassrenderer_resize(this.__wbg_ptr, width, height, device_pixel_ratio);
    }
    /**
     * @param {number} value
     */
    set_caustic_strength(value) {
        wasm.liquidglassrenderer_set_caustic_strength(this.__wbg_ptr, value);
    }
    /**
     * @param {number} value
     */
    set_edge_strength(value) {
        wasm.liquidglassrenderer_set_edge_strength(this.__wbg_ptr, value);
    }
    /**
     * @param {number} value
     */
    set_fresnel_strength(value) {
        wasm.liquidglassrenderer_set_fresnel_strength(this.__wbg_ptr, value);
    }
    /**
     * @param {boolean} hovered
     */
    set_hovered(hovered) {
        wasm.liquidglassrenderer_set_hovered(this.__wbg_ptr, hovered);
    }
    /**
     * @param {number} amount
     */
    set_motion(amount) {
        wasm.liquidglassrenderer_set_motion(this.__wbg_ptr, amount);
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    set_pointer(x, y) {
        wasm.liquidglassrenderer_set_pointer(this.__wbg_ptr, x, y);
    }
    /**
     * @param {boolean} present
     */
    set_present(present) {
        wasm.liquidglassrenderer_set_present(this.__wbg_ptr, present);
    }
    /**
     * @param {boolean} pressed
     */
    set_pressed(pressed) {
        wasm.liquidglassrenderer_set_pressed(this.__wbg_ptr, pressed);
    }
    /**
     * @param {number} radius
     */
    set_radius(radius) {
        wasm.liquidglassrenderer_set_radius(this.__wbg_ptr, radius);
    }
    /**
     * @param {number} refraction
     */
    set_refraction(refraction) {
        wasm.liquidglassrenderer_set_refraction(this.__wbg_ptr, refraction);
    }
    /**
     * @param {number} value
     */
    set_specular_strength(value) {
        wasm.liquidglassrenderer_set_specular_strength(this.__wbg_ptr, value);
    }
    /**
     * @param {number} value
     */
    set_target_x(value) {
        wasm.liquidglassrenderer_set_target_x(this.__wbg_ptr, value);
    }
    /**
     * @param {number} value
     */
    set_thickness(value) {
        wasm.liquidglassrenderer_set_thickness(this.__wbg_ptr, value);
    }
    /**
     * @param {number} r
     * @param {number} g
     * @param {number} b
     */
    set_tint(r, g, b) {
        wasm.liquidglassrenderer_set_tint(this.__wbg_ptr, r, g, b);
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    set_velocity(x, y) {
        wasm.liquidglassrenderer_set_velocity(this.__wbg_ptr, x, y);
    }
    /**
     * @param {number} value
     */
    set_visibility(value) {
        wasm.liquidglassrenderer_set_visibility(this.__wbg_ptr, value);
    }
    /**
     * @param {number} value
     */
    snap_presence(value) {
        wasm.liquidglassrenderer_snap_presence(this.__wbg_ptr, value);
    }
    /**
     * @param {number} value
     */
    snap_x(value) {
        wasm.liquidglassrenderer_snap_x(this.__wbg_ptr, value);
    }
}
if (Symbol.dispose) LiquidGlassRenderer.prototype[Symbol.dispose] = LiquidGlassRenderer.prototype.free;
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg___wbindgen_boolean_get_7a12af2b3f899c5a: function(arg0) {
            const v = getObject(arg0);
            const ret = typeof(v) === 'boolean' ? v : undefined;
            return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
        },
        __wbg___wbindgen_throw_5d9e815e6fdf150f: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg_attachShader_74ecf95efc73ee58: function(arg0, arg1, arg2) {
            getObject(arg0).attachShader(getObject(arg1), getObject(arg2));
        },
        __wbg_bindBuffer_f1f33e087b91687c: function(arg0, arg1, arg2) {
            getObject(arg0).bindBuffer(arg1 >>> 0, getObject(arg2));
        },
        __wbg_bufferData_c074912da5a8e8c2: function(arg0, arg1, arg2, arg3) {
            getObject(arg0).bufferData(arg1 >>> 0, getObject(arg2), arg3 >>> 0);
        },
        __wbg_clearColor_b7dd90543da7fe3c: function(arg0, arg1, arg2, arg3, arg4) {
            getObject(arg0).clearColor(arg1, arg2, arg3, arg4);
        },
        __wbg_clear_55f5d5ab26fe80b4: function(arg0, arg1) {
            getObject(arg0).clear(arg1 >>> 0);
        },
        __wbg_compileShader_cabeb4aa8cb42914: function(arg0, arg1) {
            getObject(arg0).compileShader(getObject(arg1));
        },
        __wbg_createBuffer_77a9a8580e5123cc: function(arg0) {
            const ret = getObject(arg0).createBuffer();
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        },
        __wbg_createProgram_89a2bb21dab7e222: function(arg0) {
            const ret = getObject(arg0).createProgram();
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        },
        __wbg_createShader_70a84327b207bda4: function(arg0, arg1) {
            const ret = getObject(arg0).createShader(arg1 >>> 0);
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        },
        __wbg_deleteProgram_c990794adb74a326: function(arg0, arg1) {
            getObject(arg0).deleteProgram(getObject(arg1));
        },
        __wbg_deleteShader_9b34ccd212c66de7: function(arg0, arg1) {
            getObject(arg0).deleteShader(getObject(arg1));
        },
        __wbg_disable_6907c683adc38e04: function(arg0, arg1) {
            getObject(arg0).disable(arg1 >>> 0);
        },
        __wbg_drawArrays_983f352c9e94d800: function(arg0, arg1, arg2, arg3) {
            getObject(arg0).drawArrays(arg1 >>> 0, arg2, arg3);
        },
        __wbg_enableVertexAttribArray_ad4d8ff487ea8fe1: function(arg0, arg1) {
            getObject(arg0).enableVertexAttribArray(arg1 >>> 0);
        },
        __wbg_error_757e9472f8410341: function(arg0, arg1) {
            let deferred0_0;
            let deferred0_1;
            try {
                deferred0_0 = arg0;
                deferred0_1 = arg1;
                console.error(getStringFromWasm0(arg0, arg1));
            } finally {
                wasm.__wbindgen_export(deferred0_0, deferred0_1, 1);
            }
        },
        __wbg_getContext_2c75bba1a1c9739b: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = getObject(arg0).getContext(getStringFromWasm0(arg1, arg2), getObject(arg3));
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        }, arguments); },
        __wbg_getProgramInfoLog_0e335b65673afba8: function(arg0, arg1, arg2) {
            const ret = getObject(arg1).getProgramInfoLog(getObject(arg2));
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export3, wasm.__wbindgen_export4);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_getProgramParameter_2a5860ab824690ec: function(arg0, arg1, arg2) {
            const ret = getObject(arg0).getProgramParameter(getObject(arg1), arg2 >>> 0);
            return addHeapObject(ret);
        },
        __wbg_getShaderInfoLog_e66ab6619bcd208d: function(arg0, arg1, arg2) {
            const ret = getObject(arg1).getShaderInfoLog(getObject(arg2));
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export3, wasm.__wbindgen_export4);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_getShaderParameter_d542b1412563ae42: function(arg0, arg1, arg2) {
            const ret = getObject(arg0).getShaderParameter(getObject(arg1), arg2 >>> 0);
            return addHeapObject(ret);
        },
        __wbg_getUniformLocation_03b9677a8f868582: function(arg0, arg1, arg2, arg3) {
            const ret = getObject(arg0).getUniformLocation(getObject(arg1), getStringFromWasm0(arg2, arg3));
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        },
        __wbg_instanceof_WebGl2RenderingContext_015d221b904a3c7b: function(arg0) {
            let result;
            try {
                result = getObject(arg0) instanceof WebGL2RenderingContext;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_linkProgram_e408ee5f93686f1f: function(arg0, arg1) {
            getObject(arg0).linkProgram(getObject(arg1));
        },
        __wbg_new_227d7c05414eb861: function() {
            const ret = new Error();
            return addHeapObject(ret);
        },
        __wbg_new_bebc3f4757acf305: function() {
            const ret = new Object();
            return addHeapObject(ret);
        },
        __wbg_set_a377297433dfea63: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
            return ret;
        }, arguments); },
        __wbg_shaderSource_108c27c8694ef4c0: function(arg0, arg1, arg2, arg3) {
            getObject(arg0).shaderSource(getObject(arg1), getStringFromWasm0(arg2, arg3));
        },
        __wbg_stack_3b0d974bbf31e44f: function(arg0, arg1) {
            const ret = getObject(arg1).stack;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export3, wasm.__wbindgen_export4);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_uniform1f_6067a9c69ed38c8b: function(arg0, arg1, arg2) {
            getObject(arg0).uniform1f(getObject(arg1), arg2);
        },
        __wbg_uniform2f_2ef046aa3e732a9a: function(arg0, arg1, arg2, arg3) {
            getObject(arg0).uniform2f(getObject(arg1), arg2, arg3);
        },
        __wbg_uniform3f_31d9b8602ff6b7e8: function(arg0, arg1, arg2, arg3, arg4) {
            getObject(arg0).uniform3f(getObject(arg1), arg2, arg3, arg4);
        },
        __wbg_useProgram_fcab4319331e0094: function(arg0, arg1) {
            getObject(arg0).useProgram(getObject(arg1));
        },
        __wbg_vertexAttribPointer_b6db7a62b9bda090: function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            getObject(arg0).vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
        },
        __wbg_viewport_704a6159fb0395cb: function(arg0, arg1, arg2, arg3, arg4) {
            getObject(arg0).viewport(arg1, arg2, arg3, arg4);
        },
        __wbindgen_generic_0000000000000001: function(arg0, arg1) {
            // Cast intrinsic for `Ref(Slice(F32)) -> NamedExternref("Float32Array")`.
            const ret = getArrayF32FromWasm0(arg0, arg1);
            return addHeapObject(ret);
        },
        __wbindgen_generic_0000000000000002: function(arg0, arg1) {
            // Cast intrinsic for `Ref(String) -> Externref`.
            const ret = getStringFromWasm0(arg0, arg1);
            return addHeapObject(ret);
        },
        __wbindgen_object_drop_ref: function(arg0) {
            takeObject(arg0);
        },
    };
    return {
        __proto__: null,
        "./liquid_glass_bg.js": import0,
    };
}

const LiquidGlassRendererFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_liquidglassrenderer_free(ptr, 1));

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function dropObject(idx) {
    if (idx < 1028) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function getArrayF32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let cachedFloat32ArrayMemory0 = null;
function getFloat32ArrayMemory0() {
    if (cachedFloat32ArrayMemory0 === null || cachedFloat32ArrayMemory0.byteLength === 0) {
        cachedFloat32ArrayMemory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    return decodeText(ptr >>> 0, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getObject(idx) { return heap[idx]; }

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_export2(addHeapObject(e));
    }
}

let heap = new Array(1024).fill(undefined);
heap.push(undefined, null, true, false);

let heap_next = heap.length;

function isLikeNone(x) {
    return x === undefined || x === null;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedFloat32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (!module.ok) {
            throw new Error(`failed to fetch Wasm: ${module.status} ${module.statusText} fetching '${module.url}'`);
        }

        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('liquid_glass_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
