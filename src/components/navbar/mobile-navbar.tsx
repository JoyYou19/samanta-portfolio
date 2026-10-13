import { $, component$, useSignal } from "@builder.io/qwik";
import { LiquidGlass } from "~/components/liquid-glass/liquid-glass";
import { NavbarChildProps } from "./navbar";

const links = [
  { label: "Intro", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

const CLOSED_WIDTH = 96;
const OPEN_WIDTH = 300;

const NAV_PADDING = 8;
const NAV_GAP = 4;

const TOUCH_LENS_WIDTH = 114;
const TOUCH_LENS_HEIGHT = 74;

const BUTTON_WIDTH =
  (OPEN_WIDTH - NAV_PADDING * 2 - NAV_GAP * (links.length - 1)) / links.length;

const BUTTON_STEP = BUTTON_WIDTH + NAV_GAP;

export const MobileNavbar = component$<NavbarChildProps>((props) => {
  const menuOpen = useSignal(false);

  const selectedIndex = props.selectedIndex;
  const previewIndex = useSignal(0);
  const dragging = useSignal(false);

  const glassRef = useSignal<HTMLDivElement>();
  const selectorRef = useSignal<HTMLDivElement>();

  const touchLensVisible = useSignal(false);
  const touchLensTargetX = useSignal<number>();
  const dragTransitionUntil = useSignal(0);

  const moveSelectorTo = $((left: number, animate: boolean) => {
    const selector = selectorRef.value;

    if (!selector) {
      return;
    }

    selector.style.left = "0";
    selector.style.right = "auto";
    selector.style.width = `${BUTTON_WIDTH}px`;

    selector.style.transition = animate
      ? "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)"
      : "none";

    selector.style.transform = `translate3d(${left}px, 0, 0)`;
  });

  const moveSelectorCollapsed = $((animate: boolean) => {
    const selector = selectorRef.value;

    if (!selector) {
      return;
    }

    const width = CLOSED_WIDTH - 16;
    const left = OPEN_WIDTH - NAV_PADDING - width;

    selector.style.left = "0";
    selector.style.right = "auto";
    selector.style.width = `${width}px`;

    selector.style.transition = animate
      ? "transform 300ms cubic-bezier(0.22, 1, 0.36, 1), width 300ms cubic-bezier(0.22, 1, 0.36, 1)"
      : "none";

    selector.style.transform = `translate3d(${left}px, 0, 0)`;
  });

  const updateDragFromPointer = $((clientX: number) => {
    const glass = glassRef.value;

    if (!glass) {
      return;
    }

    const glassBounds = glass.getBoundingClientRect();
    const localX = clientX - glassBounds.left;

    const rawLensX = localX - TOUCH_LENS_WIDTH / 2;

    touchLensTargetX.value = Math.max(
      -TOUCH_LENS_WIDTH * 0.12,
      Math.min(
        rawLensX,
        OPEN_WIDTH - TOUCH_LENS_WIDTH + TOUCH_LENS_WIDTH * 0.12,
      ),
    );

    touchLensVisible.value = true;

    const selectorLeft = Math.max(
      NAV_PADDING,
      Math.min(
        localX - BUTTON_WIDTH / 2,
        OPEN_WIDTH - NAV_PADDING - BUTTON_WIDTH,
      ),
    );

    const selector = selectorRef.value;

    if (selector) {
      selector.style.left = "0";
      selector.style.right = "auto";
      selector.style.width = `${BUTTON_WIDTH}px`;

      const enteringDrag = performance.now() < dragTransitionUntil.value;

      selector.style.transition = enteringDrag
        ? "transform 160ms cubic-bezier(0.22, 1, 0.36, 1)"
        : "none";

      selector.style.transform = `translate3d(${selectorLeft}px, 0, 0)`;
    }

    const nearestIndex = Math.max(
      0,
      Math.min(
        links.length - 1,
        Math.round((localX - NAV_PADDING - BUTTON_WIDTH / 2) / BUTTON_STEP),
      ),
    );

    if (previewIndex.value !== nearestIndex) {
      previewIndex.value = nearestIndex;
    }
  });

  const snapToIndex = $((index: number) => {
    const buttonLeft = NAV_PADDING + index * BUTTON_STEP;
    const buttonCenter = buttonLeft + BUTTON_WIDTH / 2;

    previewIndex.value = index;

    touchLensTargetX.value = buttonCenter - TOUCH_LENS_WIDTH / 2;

    const selector = selectorRef.value;

    if (selector) {
      selector.style.left = "0";
      selector.style.right = "auto";
      selector.style.width = `${BUTTON_WIDTH}px`;
      selector.style.transition =
        "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)";
      selector.style.transform = `translate3d(${buttonLeft}px, 0, 0)`;
    }
  });

  const endDrag = $(() => {
    const index = previewIndex.value;

    dragging.value = false;

    snapToIndex(index);

    selectedIndex.value = index;

    window.setTimeout(() => {
      touchLensVisible.value = false;
    }, 90);

    window.setTimeout(() => {
      moveSelectorCollapsed(true);
      menuOpen.value = false;
      window.location.hash = links[index].href;
    }, 150);
  });

  return (
    <div class="pointer-events-none fixed inset-0 z-50 md:hidden">
      <div
        class="pointer-events-auto absolute right-4"
        style={{
          width: `${OPEN_WIDTH}px`,
          bottom: "max(16px, env(safe-area-inset-bottom))",
        }}
      >
        <div
          aria-hidden="true"
          class="pointer-events-none absolute top-1/2 left-0 z-30 -translate-y-1/2"
          style={{
            width: `${TOUCH_LENS_WIDTH}px`,
            height: `${TOUCH_LENS_HEIGHT}px`,
          }}
        >
          <LiquidGlass
            material="touchLens"
            radius={999}
            interactive={false}
            backdrop={false}
            fill={0.12}
            present={touchLensVisible.value}
            targetX={touchLensTargetX.value}
            springPosition
            class="h-full w-full"
          />
        </div>

        <div
          class={[
            "relative ml-auto h-14 overflow-hidden rounded-full",
            "shadow-[0_10px_35px_rgba(36,42,32,0.12)]",
            "transition-[width] duration-500",
            "ease-[cubic-bezier(0.22,1,0.36,1)]",
          ]}
          style={{
            width: menuOpen.value ? `${OPEN_WIDTH}px` : `${CLOSED_WIDTH}px`,
            clipPath: "inset(0 round 999px)",
            WebkitClipPath: "inset(0 round 999px)",
          }}
        >
          <div
            ref={glassRef}
            class="absolute top-0 right-0 h-14"
            style={{
              width: `${OPEN_WIDTH}px`,
            }}
          >
            <LiquidGlass
              material="mobileNavigation"
              radius={999}
              interactive={false}
              backdrop
              fill={0.6}
              class="liquid-glass--navigation h-full w-full"
            >
              <div class="relative h-full w-full">
                <div
                  ref={selectorRef}
                  aria-hidden="true"
                  class={[
                    "pointer-events-none absolute top-2 bottom-2 left-0 z-[5]",
                    "rounded-full bg-[#98A38A]",
                  ]}
                  style={{
                    width: `${CLOSED_WIDTH - 16}px`,
                    transform: `translate3d(${
                      OPEN_WIDTH - NAV_PADDING - (CLOSED_WIDTH - 16)
                    }px, 0, 0)`,
                  }}
                />

                <nav
                  aria-label="Mobile navigation"
                  aria-hidden={!menuOpen.value}
                  onPointerDown$={(event, element) => {
                    event.preventDefault();

                    dragging.value = true;

                    dragTransitionUntil.value = performance.now() + 120;

                    element.setPointerCapture?.(event.pointerId);

                    updateDragFromPointer(event.clientX);
                  }}
                  onPointerMove$={(event) => {
                    if (!dragging.value) {
                      return;
                    }

                    event.preventDefault();

                    updateDragFromPointer(event.clientX);
                  }}
                  onPointerUp$={(event, element) => {
                    if (!dragging.value) {
                      return;
                    }

                    event.preventDefault();

                    if (element.hasPointerCapture?.(event.pointerId)) {
                      element.releasePointerCapture(event.pointerId);
                    }

                    updateDragFromPointer(event.clientX);

                    endDrag();
                  }}
                  onPointerCancel$={(event, element) => {
                    dragging.value = false;

                    if (element.hasPointerCapture?.(event.pointerId)) {
                      element.releasePointerCapture(event.pointerId);
                    }

                    snapToIndex(selectedIndex.value);

                    touchLensVisible.value = false;
                  }}
                  onContextMenu$={(event) => {
                    event.preventDefault();
                  }}
                  class={[
                    "absolute inset-0 z-20",
                    "flex items-center gap-1 p-2",
                    "font-['Advent_Pro_Local',sans-serif]",
                    "text-[15px]",
                    "touch-none select-none",
                    "transition-[opacity,transform,visibility] duration-250",
                    menuOpen.value
                      ? "pointer-events-auto visible translate-x-0 opacity-100"
                      : "pointer-events-none invisible translate-x-3 opacity-0",
                  ]}
                  style={{
                    WebkitUserSelect: "none",
                    userSelect: "none",
                    WebkitTouchCallout: "none",
                  }}
                >
                  {links.map((link, index) => {
                    const activeIndex = dragging.value
                      ? previewIndex.value
                      : selectedIndex.value;

                    return (
                      <button
                        key={link.href}
                        type="button"
                        data-mobile-nav-index={index}
                        aria-current={
                          activeIndex === index ? "page" : undefined
                        }
                        draggable={false}
                        class={[
                          "relative z-20 flex h-10 flex-1",
                          "items-center justify-center rounded-full px-3",
                          "touch-none select-none",
                          "transition-colors duration-150",
                          activeIndex === index
                            ? "text-black"
                            : "text-black/70",
                        ]}
                        style={{
                          WebkitUserSelect: "none",
                          userSelect: "none",
                          WebkitTouchCallout: "none",
                        }}
                      >
                        {link.label}
                      </button>
                    );
                  })}
                </nav>

                <button
                  type="button"
                  aria-label="Open navigation"
                  aria-expanded={menuOpen.value}
                  draggable={false}
                  onPointerDown$={(event, element) => {
                    event.preventDefault();

                    element.setPointerCapture?.(event.pointerId);

                    const glass = glassRef.value;

                    if (!glass) {
                      return;
                    }

                    const glassBounds = glass.getBoundingClientRect();
                    const elementBounds = element.getBoundingClientRect();

                    const center =
                      elementBounds.left -
                      glassBounds.left +
                      elementBounds.width / 2;

                    touchLensTargetX.value = center - TOUCH_LENS_WIDTH / 2;
                    touchLensVisible.value = true;
                  }}
                  onPointerUp$={(event, element) => {
                    event.preventDefault();

                    if (element.hasPointerCapture?.(event.pointerId)) {
                      element.releasePointerCapture(event.pointerId);
                    }

                    menuOpen.value = true;
                    previewIndex.value = selectedIndex.value;

                    requestAnimationFrame(() => {
                      moveSelectorTo(
                        NAV_PADDING + selectedIndex.value * BUTTON_STEP,
                        true,
                      );

                      snapToIndex(selectedIndex.value);
                    });

                    window.setTimeout(() => {
                      touchLensVisible.value = false;
                    }, 110);
                  }}
                  onPointerCancel$={() => {
                    touchLensVisible.value = false;
                  }}
                  onContextMenu$={(event) => {
                    event.preventDefault();
                  }}
                  class={[
                    "absolute top-0 right-0 z-20",
                    "flex h-14 items-center justify-center",
                    "font-['Advent_Pro_Local',sans-serif]",
                    "text-[16px] text-black",
                    "touch-none select-none",
                    "transition-[opacity,transform,visibility] duration-200",
                    menuOpen.value
                      ? "pointer-events-none invisible -translate-x-2 opacity-0"
                      : "visible translate-x-0 opacity-100",
                  ]}
                  style={{
                    width: `${CLOSED_WIDTH}px`,
                    WebkitUserSelect: "none",
                    userSelect: "none",
                    WebkitTouchCallout: "none",
                  }}
                >
                  {links[selectedIndex.value].label}
                </button>
              </div>
            </LiquidGlass>
          </div>
        </div>
      </div>
    </div>
  );
});
