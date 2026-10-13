import type { LiquidGlassWasmModule } from "./types";

let modulePromise: Promise<LiquidGlassWasmModule> | undefined;

export const loadLiquidGlassWasm = (): Promise<LiquidGlassWasmModule> => {
  if (!modulePromise) {
    modulePromise = (async () => {
      const wasm = (await import(
        "~/wasm/glass/liquid_glass"
      )) as unknown as LiquidGlassWasmModule;

      await wasm.default();

      return wasm;
    })().catch((error) => {
      /*
       * Allow a later attempt to retry if initialization
       * genuinely failed.
       */
      modulePromise = undefined;

      throw error;
    });
  }

  return modulePromise;
};
