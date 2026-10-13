import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

const zones = [
  {
    id: 1,
    label: "Info dēlis",
    targetX: 15,
    targetY: 56,
    markerX: 10,
    markerY: 9,
  },
  {
    id: 2,
    label: "Aktivitāšu galdu zona",
    targetX: 16.5,
    targetY: 48,
    markerX: 25,
    markerY: 12,
  },
  {
    id: 3,
    label: "Augu dobes",
    targetX: 46,
    targetY: 43,
    markerX: 38,
    markerY: 13,
  },
  {
    id: 4,
    label: "Atpūtas zona",
    targetX: 54,
    targetY: 62,
    markerX: 54,
    markerY: 18,
  },
  {
    id: 5,
    label: "Skatuves zona",
    targetX: 88,
    targetY: 55,
    markerX: 82,
    markerY: 10,
  },
] as const;

export const ProjectZones = component$(() => {
  const sectionRef = useSignal<HTMLElement>();
  const activeZone = useSignal<number | null>(null);

  useVisibleTask$(({ cleanup }) => {
    const section = sectionRef.value;

    if (!section) {
      return;
    }

    let context: { revert(): void } | undefined;
    let destroyed = false;

    void import("gsap").then(({ default: gsap }) => {
      if (destroyed) {
        return;
      }

      context = gsap.context(() => {
        const timeline = gsap.timeline({
          defaults: {
            ease: "power3.out",
          },
        });

        timeline.from("[data-zone-legend]", {
          y: -8,
          opacity: 0,
          duration: 0.55,
          stagger: 0.055,
          clearProps: "transform,opacity",
        });

        timeline.from(
          "[data-zone-line]",
          {
            opacity: 0,
            duration: 0.5,
            stagger: 0.065,
            clearProps: "opacity",
          },
          "-=0.2",
        );
      }, section);
    });

    cleanup(() => {
      destroyed = true;
      context?.revert();
    });
  });

  const setZone = $((id: number | null) => {
    activeZone.value = id;
  });

  return (
    <section
      ref={sectionRef}
      class={["bg-[#fafaf8]", "px-5 py-20", "md:px-8 md:py-28", "lg:px-12"]}
    >
      <div class="mx-auto max-w-[1500px]">
        <div
          class={[
            "mb-10 grid",
            "gap-x-5 gap-y-4",
            "sm:grid-cols-2",
            "lg:mb-14 lg:grid-cols-5",
          ]}
        >
          {zones.map((zone) => {
            const faded =
              activeZone.value !== null && activeZone.value !== zone.id;

            return (
              <button
                key={zone.id}
                type="button"
                data-zone-legend
                onPointerEnter$={() => {
                  setZone(zone.id);
                }}
                onPointerLeave$={() => {
                  setZone(null);
                }}
                onFocus$={() => {
                  setZone(zone.id);
                }}
                onBlur$={() => {
                  setZone(null);
                }}
                class={[
                  "text-left",
                  "font-['Yanone_Kaffeesatz',sans-serif]",
                  "text-[clamp(1.6rem,2.1vw,2.5rem)]",
                  "leading-none font-light",
                  "transition-opacity duration-200",
                  faded ? "opacity-30" : "opacity-100",
                ]}
              >
                {zone.id}. {zone.label}
              </button>
            );
          })}
        </div>

        <div class={["relative", "shadow-[0_32px_65px_rgba(35,40,30,0.25)]"]}>
          <div class={["relative overflow-hidden", "bg-[#e8e9e3]"]}>
            <img
              src="/projects/first_project_hero.png"
              alt="Projekta zonu plānojums"
              width="1600"
              height="900"
              draggable={false}
              class={[
                "block h-auto w-full select-none",
                "translate-y-[19%] scale-[1.2]",
                "origin-center",
              ]}
            />

            <div
              aria-hidden="true"
              class={[
                "pointer-events-none",
                "absolute inset-x-0 top-0 z-10",
                "h-[32%]",
              ]}
              style={{
                background:
                  "linear-gradient(to bottom, #fafaf8 0%, rgba(250,250,248,1) 12%, rgba(250,250,248,0.96) 28%, rgba(250,250,248,0.78) 47%, rgba(250,250,248,0.42) 68%, rgba(250,250,248,0.12) 86%, rgba(250,250,248,0) 100%)",
              }}
            />

            <div
              aria-hidden="true"
              class={[
                "pointer-events-none absolute z-10",
                "top-[-10%] left-[-8%]",
                "h-[35%] w-[72%]",
                "rounded-full",
                "bg-[#fafaf8]",
                "blur-[65px]",
                "md:blur-[90px]",
              ]}
            />

            <div
              aria-hidden="true"
              class={[
                "pointer-events-none absolute z-10",
                "top-[-12%] right-[-8%]",
                "h-[36%] w-[70%]",
                "rounded-full",
                "bg-[#fafaf8]/95",
                "blur-[70px]",
                "md:blur-[100px]",
              ]}
            />

            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              class={[
                "pointer-events-none",
                "absolute inset-0 z-20",
                "h-full w-full",
              ]}
            >
              {zones.map((zone) => {
                const selected = activeZone.value === zone.id;

                const faded =
                  activeZone.value !== null && activeZone.value !== zone.id;

                return (
                  <line
                    key={zone.id}
                    data-zone-line
                    x1={zone.markerX}
                    y1={zone.markerY}
                    x2={zone.targetX}
                    y2={zone.targetY}
                    vector-effect="non-scaling-stroke"
                    stroke="black"
                    stroke-width={selected ? 2.5 : 2}
                    stroke-linecap="round"
                    style={{
                      opacity: faded ? "0.18" : "0.82",
                      transition: "opacity 220ms ease, stroke-width 220ms ease",
                    }}
                  />
                );
              })}
            </svg>

            {zones.map((zone) => {
              const selected = activeZone.value === zone.id;

              const faded =
                activeZone.value !== null && activeZone.value !== zone.id;

              return (
                <div
                  key={zone.id}
                  class={[
                    "pointer-events-none",
                    "absolute z-30",
                    "-translate-x-1/2 -translate-y-1/2",
                  ]}
                  style={{
                    left: `${zone.markerX}%`,
                    top: `${zone.markerY}%`,
                  }}
                >
                  <div
                    data-zone-marker={zone.id}
                    onPointerEnter$={() => {
                      setZone(zone.id);
                    }}
                    onPointerLeave$={() => {
                      setZone(null);
                    }}
                    class={[
                      "pointer-events-auto",
                      "flex items-center justify-center",

                      "h-[54px] w-[54px]",
                      "md:h-[66px] md:w-[66px]",
                      "lg:h-[78px] lg:w-[78px]",

                      "rounded-full",
                      "border-2 border-black",

                      "bg-[#fafaf8]/95",

                      "font-['Advent_Pro_Local',sans-serif]",
                      "text-[24px] leading-none font-normal",
                      "text-black",

                      "md:text-[29px]",
                      "lg:text-[34px]",

                      "shadow-[0_5px_18px_rgba(0,0,0,0.10)]",

                      "transition-[background-color,opacity]",
                      "duration-200",

                      selected && "bg-[#98A38A]",
                      faded ? "opacity-30" : "opacity-100",
                    ]}
                  >
                    {zone.id}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
});
