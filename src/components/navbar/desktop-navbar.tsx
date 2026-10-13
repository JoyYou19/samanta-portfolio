import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { LiquidGlass } from "~/components/liquid-glass/liquid-glass";
import { NAV_LINKS, type NavbarChildProps } from "./navbar";

const HOVER_LENS_WIDTH = 104;

export const DesktopNavbar = component$<NavbarChildProps>((props) => {
  const desktopNavRef = useSignal<HTMLDivElement>();
  const selectorRef = useSignal<HTMLDivElement>();

  const blobVisible = useSignal(false);
  const selectorReady = useSignal(false);

  const lensTargetX = useSignal<number>();

  /*
   * Position the selector.
   *
   * animate = false -> immediate
   * animate = true  -> GSAP glide
   */
  const positionSelector = $(async (index: number, animate: boolean) => {
    const wrapper = desktopNavRef.value;
    const selector = selectorRef.value;

    if (!wrapper || !selector) {
      return;
    }

    const selectedElement = wrapper.querySelector<HTMLElement>(
      `[data-nav-index="${index}"]`,
    );

    if (!selectedElement) {
      return;
    }

    const wrapperBounds = wrapper.getBoundingClientRect();
    const itemBounds = selectedElement.getBoundingClientRect();

    const x = itemBounds.left - wrapperBounds.left;

    const { default: gsap } = await import("gsap");

    if (animate) {
      gsap.to(selector, {
        x,
        width: itemBounds.width,

        duration: 0.48,
        ease: "power3.out",

        overwrite: true,
      });

      return;
    }

    /*
     * Kill an in-progress scroll animation first,
     * then place the pill immediately.
     */
    gsap.killTweensOf(selector);

    gsap.set(selector, {
      x,
      width: itemBounds.width,
    });
  });

  /*
   * Initial position.
   */
  useVisibleTask$(
    async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      await new Promise<any>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        });
      });

      await positionSelector(props.selectedIndex.value, false);

      selectorReady.value = true;
    },
    {
      strategy: "document-ready",
    },
  );

  /*
   * selectedIndex changes caused by scrolling.
   */
  useVisibleTask$(({ track }) => {
    const index = track(() => props.selectedIndex.value);

    if (!selectorReady.value) {
      return;
    }

    void positionSelector(index, true);
  });

  return (
    <header class="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div
        class={[
          "pointer-events-auto absolute top-4 left-1/2",
          "hidden -translate-x-1/2 md:block",
          "rounded-[26px]",
          "shadow-[0_8px_30px_rgba(36,42,32,0.08)]",
        ]}
      >
        <div ref={desktopNavRef} class="relative">
          {/* Main glass */}
          <div class="pointer-events-none absolute inset-0 z-0">
            <LiquidGlass
              material="navigation"
              radius={26}
              interactive={false}
              backdrop
              fill={0.055}
              blur={16}
              saturation={1.22}
              class={["liquid-glass--navigation", "h-full w-full"]}
            />
          </div>

          {/* Physical edge */}
          <div
            aria-hidden="true"
            class={[
              "pointer-events-none absolute inset-0 z-[1]",
              "rounded-[26px]",
              "ring-1 ring-black/[0.025]",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]",
            ]}
          />

          {/* Selected section */}
          <div
            ref={selectorRef}
            aria-hidden="true"
            class={[
              "pointer-events-none",
              "absolute top-[5px] left-0 z-10",
              "h-[42px]",
              "rounded-full",
              "bg-[#98A38A]/45",
              "will-change-transform",
            ]}
            style={{
              /*
               * SSR/default state = Intro.
               *
               * JS measures the exact dimensions after fonts load
               * and takes over from here.
               */
              width: "72px",
              transform: "translate3d(8px, 0, 0)",
            }}
          />

          {/* Hover liquid lens */}
          <div
            aria-hidden="true"
            class={[
              "pointer-events-none",
              "absolute top-1/2 left-0 z-20",
              "h-[76px]",
              "-translate-y-1/2",
            ]}
            style={{
              width: `${HOVER_LENS_WIDTH}px`,
            }}
          >
            <LiquidGlass
              material="lens"
              radius={38}
              interactive={false}
              backdrop={false}
              fill={0}
              present={blobVisible.value}
              targetX={lensTargetX.value}
              springPosition
              class="h-full w-full"
            />
          </div>

          {/* Navigation */}
          <nav
            aria-label="Primary navigation"
            onPointerLeave$={() => {
              blobVisible.value = false;
            }}
            class={[
              "relative z-30",
              "flex h-[52px] items-center gap-1 px-2",
              "font-['Advent_Pro_Local',sans-serif]",
              "text-[15px] font-light",
            ]}
          >
            {NAV_LINKS.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                data-nav-index={index}
                aria-current={
                  props.selectedIndex.value === index ? "page" : undefined
                }
                onPointerEnter$={(_, element) => {
                  const wrapper = desktopNavRef.value;

                  if (!wrapper) {
                    return;
                  }

                  const wrapperBounds = wrapper.getBoundingClientRect();

                  const itemBounds = element.getBoundingClientRect();

                  const itemCenter =
                    itemBounds.left - wrapperBounds.left + itemBounds.width / 2;

                  lensTargetX.value = itemCenter - HOVER_LENS_WIDTH / 2;

                  blobVisible.value = true;
                }}
                onClick$={() => {
                  blobVisible.value = false;
                }}
                class={[
                  "relative",
                  "flex h-10 items-center",
                  "rounded-full px-5",

                  "transition-colors duration-200",

                  props.selectedIndex.value === index
                    ? "text-black"
                    : "text-black/72 hover:text-black",
                ]}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
});
