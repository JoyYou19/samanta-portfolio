import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Signature } from "~/components/art/signature";

const SOURCE_WIDTH = 1366;
const SOURCE_HEIGHT = 768;

const layers = [
  { src: "/cover/hero-09.png", depth: "ground" },
  { src: "/cover/hero-08.png", depth: 1 },
  { src: "/cover/hero-07.png", depth: 1 },
  { src: "/cover/hero-06.png", depth: "ground" },
  { src: "/cover/hero-05.png", depth: 2 },
  { src: "/cover/hero-04.png", depth: 3 },
  { src: "/cover/hero-03.png", depth: 2 },
  { src: "/cover/hero-02.png", depth: 4 },
  { src: "/cover/hero-01.png", depth: 5 },
] as const;

const depthMovement = {
  1: 18,
  2: 8,
  3: 50,
  4: 68,
  5: 86,
} as const;

const depthOffset = {
  1: 10,
  2: 0, // push depth 2 down
  3: 0,
  4: 30,
  5: 40,
} as const;

export const HeroSection = component$(() => {
  const sectionRef = useSignal<HTMLElement>();
  const sceneRef = useSignal<HTMLDivElement>();
  const canvasRef = useSignal<HTMLCanvasElement>();

  useVisibleTask$(({ cleanup }) => {
    const section = sectionRef.value;
    const scene = sceneRef.value;
    const canvas = canvasRef.value;

    if (!section || !scene || !canvas) {
      return;
    }

    const context2d = canvas.getContext("2d", {
      alpha: true,
    });

    if (!context2d) {
      return;
    }

    let destroyed = false;
    let frameId = 0;
    let gsapContext: { revert(): void } | undefined;

    const depthState = {
      1: { y: 0 },
      2: { y: 0 },
      3: { y: 0 },
      4: { y: 0 },
      5: { y: 0 },
    };

    const images: HTMLImageElement[] = [];

    const draw = () => {
      frameId = 0;

      if (destroyed) {
        return;
      }

      const cssWidth = canvas.clientWidth;
      const cssHeight = canvas.clientHeight;

      if (cssWidth <= 0 || cssHeight <= 0) {
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const renderWidth = Math.round(cssWidth * dpr);
      const renderHeight = Math.round(cssHeight * dpr);

      if (canvas.width !== renderWidth || canvas.height !== renderHeight) {
        canvas.width = renderWidth;
        canvas.height = renderHeight;
      }

      context2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      context2d.clearRect(0, 0, cssWidth, cssHeight);

      // Keep the complete original composition visible.
      // This preserves both building edges instead of cropping them.
      const fitScale = Math.min(
        cssWidth / SOURCE_WIDTH,
        cssHeight / SOURCE_HEIGHT,
      );

      const drawWidth = SOURCE_WIDTH * fitScale;
      const drawHeight = SOURCE_HEIGHT * fitScale;

      const baseX = (cssWidth - drawWidth) / 2;
      const baseY = (cssHeight - drawHeight) / 2;

      for (let index = 0; index < images.length; index++) {
        const image = images[index];

        if (!image.complete || image.naturalWidth === 0) {
          continue;
        }

        const layer = layers[index];

        if (layer.depth === "ground") {
          context2d.drawImage(image, baseX, baseY, drawWidth, drawHeight);

          continue;
        }

        const y = depthState[layer.depth].y;
        const offsetY = depthOffset[layer.depth];

        context2d.drawImage(
          image,
          baseX,
          baseY + offsetY + y,
          drawWidth,
          drawHeight,
        );
      }
    };

    const requestDraw = () => {
      if (destroyed || frameId !== 0) {
        return;
      }

      frameId = requestAnimationFrame(draw);
    };

    const loadImages = async () => {
      try {
        const loaded = await Promise.all(
          layers.map(
            (layer) =>
              new Promise<HTMLImageElement>((resolve, reject) => {
                const image = new Image();

                image.decoding = "async";
                image.onload = () => resolve(image);
                image.onerror = reject;
                image.src = layer.src;
              }),
          ),
        );

        if (destroyed) {
          return;
        }

        images.push(...loaded);
        requestDraw();

        const { default: gsap } = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");

        if (destroyed) {
          return;
        }

        gsap.registerPlugin(ScrollTrigger);

        gsapContext = gsap.context(() => {
          const typography = section.querySelector<HTMLElement>(
            "[data-hero-typography]",
          );

          const name = section.querySelector<HTMLElement>("[data-hero-name]");

          const scrollCue = section.querySelector<HTMLElement>(
            "[data-hero-scroll-cue]",
          );

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,

              // Hard boundaries for the ScrollTrigger.
              start: "clamp(top top)",
              end: "clamp(+=130%)",

              pin: scene,
              pinSpacing: true,

              // Small smoothing prevents individual wheel/touch scroll deltas
              // from appearing as tiny jumps in the canvas animation.
              scrub: 0.12,

              invalidateOnRefresh: true,

              // Don't pre-emptively move into the pinned state.
              anticipatePin: 0,

              // markers: true,

              onUpdate: requestDraw,
            },
          });

          (
            Object.keys(depthMovement) as unknown as Array<
              keyof typeof depthMovement
            >
          ).forEach((depthKey) => {
            const depth = depthState[depthKey];
            const movement = depthMovement[depthKey];

            timeline.fromTo(
              depth,
              {
                y: 0,
              },
              {
                y: -movement * 0.5,
                ease: "none",
              },
              0,
            );
          });

          if (typography) {
            timeline.fromTo(
              typography,
              {
                y: 0,
                opacity: 1,
              },
              {
                y: -95,
                opacity: 0.86,
                ease: "none",
              },
              0,
            );
          }

          if (name) {
            timeline.fromTo(
              name,
              {
                y: 0,
              },
              {
                y: -28,
                ease: "none",
              },
              0,
            );
          }

          if (scrollCue) {
            timeline.fromTo(
              scrollCue,
              {
                opacity: 1,
              },
              {
                opacity: 0,
                duration: 0.22,
                ease: "none",
              },
              0,
            );
          }
        }, section);

        ScrollTrigger.refresh();
        requestDraw();
      } catch (error) {
        console.error("Failed to initialize hero:", error);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      requestDraw();
    });

    if (resizeObserver) {
      resizeObserver.observe(canvas);
    }

    void loadImages();

    cleanup(() => {
      destroyed = true;

      resizeObserver?.disconnect();

      if (frameId !== 0) {
        cancelAnimationFrame(frameId);
      }

      gsapContext?.revert();
    });
  });

  return (
    <section ref={sectionRef} id="top" class="relative bg-[#fafaf8]">
      <div
        ref={sceneRef}
        class={[
          "relative",
          "h-[100svh] min-h-[680px]",
          "overflow-hidden",
          "bg-[#fafaf8]",
        ]}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 z-0 h-full w-full"
        />

        <div
          data-hero-bottom-mist
          aria-hidden="true"
          class={[
            "pointer-events-none absolute",
            "inset-x-0 bottom-0 z-10",
            "h-[130px]",
          ]}
        >
          <div
            class="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(250,250,248,0) 0%, rgba(250,250,248,0.08) 20%, rgba(250,250,248,0.32) 42%, rgba(250,250,248,0.72) 65%, #fafaf8 88%, #fafaf8 100%)",
            }}
          />

          <div
            class="absolute inset-x-[-5%] bottom-[-35px] h-[90px]"
            style={{
              background: "#fafaf8",
              filter: "blur(24px)",
            }}
          />
        </div>

        <div
          data-hero-name
          class={[
            "pointer-events-none absolute",
            "top-[4.5%] left-[3%] z-30",
            "font-['Advent_Pro_Local',sans-serif]",
            "text-[clamp(2rem,3vw,3.4rem)]",
            "font-light tracking-[-0.035em]",
            "text-black/75",
          ]}
        >
          Samanta Līkanse
        </div>

        <div
          data-hero-typography
          class={[
            "pointer-events-none absolute inset-0 z-20",
            "flex items-start justify-center",
            "pt-[30vh]",
          ]}
        >
          <div class="relative">
            <h1
              class={[
                "font-['Yanone_Kaffeesatz',sans-serif]",
                "text-[clamp(7rem,15vw,13.5rem)]",
                "leading-[0.82]",
                "font-normal",
                "tracking-[-0.01em]",
                "text-black",
              ]}
            >
              Portfolio.
            </h1>

            <Signature class="absolute right-[-2%] -bottom-[38%] w-[clamp(220px,23vw,370px)] rotate-[-4deg] text-black/70" />
          </div>
        </div>

        <div
          data-hero-scroll-cue
          aria-hidden="true"
          class={[
            "pointer-events-none absolute",
            "right-[3%] bottom-7 z-30",
            "flex items-center gap-3",
            "font-['Advent_Pro_Local',sans-serif]",
            "text-xs tracking-[0.18em]",
            "text-black/35 uppercase",
          ]}
        >
          <span>Scroll</span>
          <span class="block h-8 w-px bg-black/20" />
        </div>
      </div>
    </section>
  );
});
