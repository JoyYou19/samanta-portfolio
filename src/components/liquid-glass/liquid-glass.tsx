import {
  Slot,
  component$,
  noSerialize,
  useSignal,
  useTask$,
  useVisibleTask$,
  type ClassList,
  type NoSerialize,
} from "@builder.io/qwik";
import "./liquid-glass.css";

import { LIQUID_GLASS_MATERIALS, type LiquidGlassMaterial } from "./materials";

import type { LiquidGlassRendererInstance } from "./types";
import { loadLiquidGlassWasm } from "./wasm";

interface LiquidGlassProps {
  class?: ClassList;

  material?: LiquidGlassMaterial;

  radius?: number;

  blur?: number;
  saturation?: number;

  fill?: number;

  /**
   * Whether this surface samples/blurs
   * the page behind it.
   *
   * Nested glass layers should normally
   * set this to false.
   */
  backdrop?: boolean;

  refraction?: number;
  thickness?: number;

  fresnel?: number;
  specular?: number;
  caustic?: number;
  edge?: number;

  tint?: [number, number, number];

  motion?: number;
  targetX?: number;

  springPosition?: boolean;

  present?: boolean;

  visibility?: number;

  velocityX?: number;
  velocityY?: number;

  interactive?: boolean;
}

export const LiquidGlass = component$<LiquidGlassProps>((props) => {
  const hostRef = useSignal<HTMLDivElement>();

  const canvasRef = useSignal<HTMLCanvasElement>();

  /*
   * WASM objects/functions are runtime-only
   * and should not be serialized by Qwik.
   */
  const rendererRef = useSignal<NoSerialize<LiquidGlassRendererInstance>>();

  const requestFrameRef = useSignal<NoSerialize<() => void>>();
  const springInitializedRef = useSignal(false);
  const presenceInitializedRef = useSignal(false);
  /*
   * Resolve the CSS-side material values
   * during rendering.
   */
  const material = LIQUID_GLASS_MATERIALS[props.material ?? "regular"];

  const blur = props.blur ?? material.blur;
  const saturation = props.saturation ?? material.saturation;
  const radius = props.radius ?? 24;
  const fill = props.fill ?? 0.08;
  const backdrop = props.backdrop ?? true;
  const present = props.present ?? true;

  /*
   * ----------------------------------------------------------
   * Renderer lifecycle
   * ----------------------------------------------------------
   */
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(
    ({ cleanup }) => {
      const host = hostRef.value;
      const canvas = canvasRef.value;

      if (!host || !canvas) {
        return;
      }

      let destroyed = false;

      let resizeObserver: ResizeObserver | undefined;

      let frameId = 0;
      let framePending = false;

      /*
       * ----------------------------------------------------------
       * Animation frame
       * ----------------------------------------------------------
       */

      const renderFrame = (time: number) => {
        framePending = false;

        if (destroyed) {
          return;
        }

        const renderer = rendererRef.value;

        if (!renderer) {
          return;
        }

        renderer.render(time / 1000);

        /*
         * Rust owns the spring position.
         *
         * Do not send this through Qwik reactivity every frame.
         */
        if (props.springPosition) {
          const x = renderer.position_x();

          host.style.transform = `translate3d(${x}px, 0, 0)`;
        }

        if (renderer.needs_animation()) {
          requestFrame();
        }
      };

      const requestFrame = () => {
        if (destroyed || framePending) {
          return;
        }

        framePending = true;

        frameId = requestAnimationFrame(renderFrame);
      };

      requestFrameRef.value = noSerialize(requestFrame);

      /*
       * ----------------------------------------------------------
       * Resize
       * ----------------------------------------------------------
       */

      const resize = () => {
        if (destroyed) {
          return;
        }

        const renderer = rendererRef.value;

        if (!renderer) {
          return;
        }

        /*
         * clientWidth/clientHeight are intentional.
         *
         * getBoundingClientRect() contains transforms,
         * which would make spring movement affect
         * WebGL resolution.
         */
        const width = host.clientWidth;

        const height = host.clientHeight;

        if (width <= 0 || height <= 0) {
          return;
        }

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const renderWidth = Math.max(1, Math.round(width * dpr));

        const renderHeight = Math.max(1, Math.round(height * dpr));

        /*
         * Only resize the drawing buffer when
         * something actually changed.
         */
        if (canvas.width !== renderWidth || canvas.height !== renderHeight) {
          canvas.width = renderWidth;

          canvas.height = renderHeight;
        }

        renderer.resize(width, height, dpr);

        requestFrame();
      };

      /*
       * ----------------------------------------------------------
       * Pointer handlers
       * ----------------------------------------------------------
       */

      const handlePointerMove = (event: PointerEvent) => {
        if (props.interactive === false || event.pointerType === "touch") {
          return;
        }

        const renderer = rendererRef.value;

        if (!renderer) {
          return;
        }

        const bounds = host.getBoundingClientRect();

        if (bounds.width <= 0 || bounds.height <= 0) {
          return;
        }

        renderer.set_pointer(
          (event.clientX - bounds.left) / bounds.width,

          (event.clientY - bounds.top) / bounds.height,
        );

        requestFrame();
      };

      const handlePointerEnter = () => {
        if (props.interactive === false) {
          return;
        }

        rendererRef.value?.set_hovered(true);

        requestFrame();
      };

      const handlePointerLeave = () => {
        if (props.interactive === false) {
          return;
        }

        const renderer = rendererRef.value;

        renderer?.set_hovered(false);

        renderer?.set_pointer(0.5, 0.5);

        requestFrame();
      };

      const handlePointerDown = () => {
        if (props.interactive === false) {
          return;
        }

        rendererRef.value?.set_pressed(true);

        requestFrame();
      };

      const handlePointerUp = () => {
        rendererRef.value?.set_pressed(false);

        requestFrame();
      };

      const handlePointerCancel = () => {
        rendererRef.value?.set_pressed(false);

        requestFrame();
      };

      /*
       * Register listeners synchronously.
       *
       * Do not register cleanup callbacks from
       * inside an async function after await.
       */
      host.addEventListener("pointermove", handlePointerMove);

      host.addEventListener("pointerenter", handlePointerEnter);

      host.addEventListener("pointerleave", handlePointerLeave);

      host.addEventListener("pointerdown", handlePointerDown);

      window.addEventListener("pointerup", handlePointerUp);

      window.addEventListener("pointercancel", handlePointerCancel);

      /*
       * ----------------------------------------------------------
       * Start renderer
       * ----------------------------------------------------------
       */

      const start = async () => {
        try {
          const wasm = await loadLiquidGlassWasm();

          if (destroyed) {
            return;
          }

          /*
           * Make sure the component acquired real
           * layout dimensions before creating WebGL.
           */
          if (host.clientWidth <= 0 || host.clientHeight <= 0) {
            await new Promise<void>((resolve) => {
              requestAnimationFrame(() => resolve());
            });
          }

          if (destroyed) {
            return;
          }

          const renderer = new wasm.LiquidGlassRenderer(canvas);

          if (destroyed) {
            renderer.free();

            return;
          }

          rendererRef.value = noSerialize(renderer);

          /*
           * Start observing only after the renderer
           * actually exists.
           */
          resizeObserver = new ResizeObserver(() => {
            resize();
          });

          resizeObserver.observe(host);

          /*
           * Explicit initial sizing + render.
           *
           * Do not rely on ResizeObserver's first
           * callback arriving at a particular time.
           */
          resize();

          requestFrame();
        } catch (error) {
          if (!destroyed) {
            console.error("Could not start liquid glass renderer:", error);
          }
        }
      };

      void start();

      /*
       * ----------------------------------------------------------
       * Cleanup
       * ----------------------------------------------------------
       */

      cleanup(() => {
        destroyed = true;

        resizeObserver?.disconnect();

        cancelAnimationFrame(frameId);

        host.removeEventListener("pointermove", handlePointerMove);

        host.removeEventListener("pointerenter", handlePointerEnter);

        host.removeEventListener("pointerleave", handlePointerLeave);

        host.removeEventListener("pointerdown", handlePointerDown);

        window.removeEventListener("pointerup", handlePointerUp);

        window.removeEventListener("pointercancel", handlePointerCancel);

        rendererRef.value?.free();

        rendererRef.value = undefined;

        requestFrameRef.value = undefined;

        springInitializedRef.value = false;

        presenceInitializedRef.value = false;
      });
    },
    {
      strategy: "document-ready",
    },
  );

  /*
   * ----------------------------------------------------------
   * Reactive shader/material state
   * ----------------------------------------------------------
   *
   * IMPORTANT:
   * This must be a separate top-level Qwik hook.
   */
  useTask$(({ track }) => {
    const renderer = track(() => rendererRef.value);

    const materialName = track(() => props.material ?? "regular");

    const radius = track(() => props.radius ?? 24);

    const refractionOverride = track(() => props.refraction);

    const thicknessOverride = track(() => props.thickness);

    const fresnelOverride = track(() => props.fresnel);

    const specularOverride = track(() => props.specular);

    const causticOverride = track(() => props.caustic);

    const edgeOverride = track(() => props.edge);

    const tintOverride = track(() => props.tint);

    const motion = track(() => props.motion ?? 0);

    const velocityX = track(() => props.velocityX ?? 0);

    const velocityY = track(() => props.velocityY ?? 0);

    const visibilityOverride = track(() => props.visibility);

    const targetX = track(() => props.targetX);

    const present = track(() => props.present ?? true);

    /*
     * During SSR, and before the visible WebGL task
     * has initialized the renderer, there is nothing
     * to synchronize.
     */
    if (!renderer) {
      return;
    }

    const material = LIQUID_GLASS_MATERIALS[materialName];

    const refraction = refractionOverride ?? material.refraction;

    const thickness = thicknessOverride ?? material.thickness;

    const fresnel = fresnelOverride ?? material.fresnel;

    const specular = specularOverride ?? material.specular;

    const caustic = causticOverride ?? material.caustic;

    const edge = edgeOverride ?? material.edge;

    const tint = tintOverride ?? material.tint;

    const visibility = visibilityOverride ?? material.visibility;

    renderer.set_radius(radius);
    renderer.set_refraction(refraction);
    renderer.set_thickness(thickness);

    renderer.set_fresnel_strength(fresnel);
    renderer.set_specular_strength(specular);
    renderer.set_caustic_strength(caustic);
    renderer.set_edge_strength(edge);

    renderer.set_tint(tint[0], tint[1], tint[2]);

    if (!props.springPosition) {
      renderer.set_motion(motion);
      renderer.set_velocity(velocityX, velocityY);
    }

    renderer.set_visibility(visibility);

    if (!presenceInitializedRef.value) {
      renderer.snap_presence(present ? 1 : 0);

      presenceInitializedRef.value = true;
    } else {
      renderer.set_present(present);
    }

    if (props.springPosition && targetX !== undefined) {
      if (!springInitializedRef.value) {
        renderer.snap_x(targetX);

        springInitializedRef.value = true;
      } else {
        renderer.set_target_x(targetX);
      }
    }

    requestFrameRef.value?.();
  });

  return (
    <div
      ref={hostRef}
      class={[
        "liquid-glass",
        !backdrop && "liquid-glass--surface-only",
        props.class,
      ]}
      style={{
        "--liquid-glass-blur": `${blur}px`,
        "--liquid-glass-saturation": `${saturation}`,
        "--liquid-glass-radius": `${radius}px`,
        "--liquid-glass-fill": `${fill}`,
        "--liquid-glass-present": present ? "1" : "0",
        "--liquid-glass-content-scale": present ? "1" : "0.72",
      }}
    >
      <div aria-hidden="true" class="liquid-glass__backdrop" />

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        class="liquid-glass__surface"
      />

      <div class="liquid-glass__content">
        <Slot />
      </div>
    </div>
  );
});
