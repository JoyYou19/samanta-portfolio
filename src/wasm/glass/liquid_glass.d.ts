/* tslint:disable */
/* eslint-disable */

export class LiquidGlassRenderer {
    free(): void;
    [Symbol.dispose](): void;
    needs_animation(): boolean;
    constructor(canvas: HTMLCanvasElement);
    position_x(): number;
    render(elapsed_seconds: number): void;
    resize(width: number, height: number, device_pixel_ratio: number): void;
    set_caustic_strength(value: number): void;
    set_edge_strength(value: number): void;
    set_fresnel_strength(value: number): void;
    set_hovered(hovered: boolean): void;
    set_motion(amount: number): void;
    set_pointer(x: number, y: number): void;
    set_present(present: boolean): void;
    set_pressed(pressed: boolean): void;
    set_radius(radius: number): void;
    set_refraction(refraction: number): void;
    set_specular_strength(value: number): void;
    set_target_x(value: number): void;
    set_thickness(value: number): void;
    set_tint(r: number, g: number, b: number): void;
    set_velocity(x: number, y: number): void;
    set_visibility(value: number): void;
    snap_presence(value: number): void;
    snap_x(value: number): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_liquidglassrenderer_free: (a: number, b: number) => void;
    readonly liquidglassrenderer_needs_animation: (a: number) => number;
    readonly liquidglassrenderer_new: (a: number, b: number) => void;
    readonly liquidglassrenderer_position_x: (a: number) => number;
    readonly liquidglassrenderer_render: (a: number, b: number) => void;
    readonly liquidglassrenderer_resize: (a: number, b: number, c: number, d: number) => void;
    readonly liquidglassrenderer_set_caustic_strength: (a: number, b: number) => void;
    readonly liquidglassrenderer_set_edge_strength: (a: number, b: number) => void;
    readonly liquidglassrenderer_set_fresnel_strength: (a: number, b: number) => void;
    readonly liquidglassrenderer_set_hovered: (a: number, b: number) => void;
    readonly liquidglassrenderer_set_motion: (a: number, b: number) => void;
    readonly liquidglassrenderer_set_pointer: (a: number, b: number, c: number) => void;
    readonly liquidglassrenderer_set_present: (a: number, b: number) => void;
    readonly liquidglassrenderer_set_pressed: (a: number, b: number) => void;
    readonly liquidglassrenderer_set_radius: (a: number, b: number) => void;
    readonly liquidglassrenderer_set_refraction: (a: number, b: number) => void;
    readonly liquidglassrenderer_set_specular_strength: (a: number, b: number) => void;
    readonly liquidglassrenderer_set_target_x: (a: number, b: number) => void;
    readonly liquidglassrenderer_set_thickness: (a: number, b: number) => void;
    readonly liquidglassrenderer_set_tint: (a: number, b: number, c: number, d: number) => void;
    readonly liquidglassrenderer_set_velocity: (a: number, b: number, c: number) => void;
    readonly liquidglassrenderer_set_visibility: (a: number, b: number) => void;
    readonly liquidglassrenderer_snap_presence: (a: number, b: number) => void;
    readonly liquidglassrenderer_snap_x: (a: number, b: number) => void;
    readonly __wbindgen_export: (a: number, b: number, c: number) => void;
    readonly __wbindgen_export2: (a: number) => void;
    readonly __wbindgen_export3: (a: number, b: number) => number;
    readonly __wbindgen_export4: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
