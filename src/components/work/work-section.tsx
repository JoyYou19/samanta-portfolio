import { $, component$, useSignal } from "@builder.io/qwik";
import { Process } from "../art/process";
import { LiquidGlass } from "../liquid-glass/liquid-glass";

const projects = [
  {
    index: "1",
    image: "/projects/first_project.png",
    href: "/work/1/",
    tilt: -1,
  },
  {
    index: "2",
    image: "/projects/second_project.png",
    href: "/work/1/",
    tilt: 1,
  },
  {
    index: "3",
    image: "/work1.png",
    href: "/work/1/",
    tilt: -1,
  },
  {
    index: "4",
    image: "/work1.png",
    href: "/work/1/",
    process: true,
    tilt: 1,
  },
];

export const WorkSection = component$(() => {
  const frameId = useSignal<number>();
  const cursorRef = useSignal<HTMLDivElement>();
  const cursorVisible = useSignal(false);

  const moveProjectCursor = $((clientX: number, clientY: number) => {
    const cursor = cursorRef.value;

    if (!cursor) {
      return;
    }

    cursor.style.transform = `translate3d(
    ${clientX}px,
    ${clientY}px,
    0
  ) translate3d(-50%, -50%, 0)`;
  });

  const showProjectCursor = $(() => {
    cursorVisible.value = true;
  });

  const hideProjectCursor = $(() => {
    cursorVisible.value = false;
  });

  const updateCard = $(
    (
      element: HTMLElement,
      clientX: number,
      clientY: number,
      tiltDirection: number,
    ) => {
      const bounds = element.getBoundingClientRect();

      const x = (clientX - bounds.left) / bounds.width;
      const y = (clientY - bounds.top) / bounds.height;

      // -1 → 1
      const normalizedX = (x - 0.5) * 2;
      const normalizedY = (y - 0.5) * 2;

      const portal = element.querySelector<HTMLElement>("[data-work-portal]");

      const image = element.querySelector<HTMLElement>("[data-work-image]");

      const number = element.querySelector<HTMLElement>("[data-work-number]");

      if (!portal || !image) {
        return;
      }

      /*
       * The PORTAL moves.
       *
       * Very restrained rotation — this is a portfolio,
       * not a 3D card demo.
       */
      const rotate = normalizedX * 2.2 + tiltDirection * 0.45;

      const translateY = normalizedY * 3;

      portal.style.transform = `
        translate3d(0, ${translateY}px, 0)
        rotate(${rotate}deg)
      `;

      /*
       * Counter-rotate the image.
       *
       * This makes the photograph feel like a stationary plane
       * being viewed through a moving rectangular opening.
       */
      const imageX = normalizedX * -8;
      const imageY = normalizedY * -6;

      image.style.transform = `
        translate3d(${imageX}px, ${imageY}px, 0)
        rotate(${-rotate}deg)
        scale(1.09)
      `;

      if (number) {
        const numberX = normalizedX * 4;

        number.style.transform = `
          translate3d(${numberX}px, -3px, 0)
          scale(1.13)
        `;
      }
    },
  );

  const resetCard = $((element: HTMLElement) => {
    const portal = element.querySelector<HTMLElement>("[data-work-portal]");

    const image = element.querySelector<HTMLElement>("[data-work-image]");

    const number = element.querySelector<HTMLElement>("[data-work-number]");

    if (portal) {
      portal.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
    }

    if (image) {
      image.style.transform = "translate3d(0, 0, 0) rotate(0deg) scale(1.04)";
    }

    if (number) {
      number.style.transform = "translate3d(0, 0, 0) scale(1)";
    }
  });

  return (
    <section
      id="work"
      class={[
        "relative overflow-hidden",
        "bg-[#fafaf8]",
        "px-5 md:px-8 lg:px-12",
        "pb-24 md:pb-32",
      ]}
    >
      {/* Ambient background */}
      <div aria-hidden="true" class="pointer-events-none absolute inset-0">
        <div class="absolute top-[24%] left-[4%] h-[420px] w-[420px] rounded-full bg-[#aab398]/12 blur-[110px]" />

        <div class="absolute top-[23%] left-[31%] h-[420px] w-[420px] rounded-full bg-[#aab398]/10 blur-[110px]" />

        <div class="absolute top-[23%] right-[29%] h-[420px] w-[420px] rounded-full bg-[#aab398]/10 blur-[110px]" />

        <div class="absolute top-[24%] right-[3%] h-[420px] w-[420px] rounded-full bg-[#aab398]/12 blur-[110px]" />
      </div>

      <div class="relative mx-auto max-w-[1500px]">
        {/* Heading */}
        <div class="mb-16 flex justify-center md:mb-20">
          <h2
            class={[
              "font-['Caveat',cursive]",
              "text-[clamp(5rem,9vw,9rem)]",
              "leading-none font-normal",
            ]}
          >
            Darbi
          </h2>
        </div>

        {/* Projects */}
        <div
          class={[
            "grid",
            "gap-x-8 gap-y-16",
            "sm:grid-cols-2",
            "lg:grid-cols-4",
          ]}
        >
          {projects.map((project) => (
            <article
              key={project.index}
              data-work-card
              class="group relative"
              onPointerMove$={(event, element) => {
                if (event.pointerType === "touch") {
                  return;
                }

                if (frameId.value) {
                  cancelAnimationFrame(frameId.value);
                }

                const x = event.clientX;
                const y = event.clientY;

                frameId.value = requestAnimationFrame(() => {
                  updateCard(element, x, y, project.tilt);
                });
              }}
              onPointerLeave$={(_, element) => {
                if (frameId.value) {
                  cancelAnimationFrame(frameId.value);
                }

                resetCard(element);
              }}
            >
              <a
                href={project.href}
                data-work-portal
                aria-label={`Open project ${project.index}`}
                onPointerEnter$={(event) => {
                  if (event.pointerType === "touch") {
                    return;
                  }

                  showProjectCursor();
                  moveProjectCursor(event.clientX, event.clientY);
                }}
                onPointerMove$={(event) => {
                  if (event.pointerType === "touch") {
                    return;
                  }

                  moveProjectCursor(event.clientX, event.clientY);
                }}
                onPointerLeave$={() => {
                  hideProjectCursor();
                }}
                onClick$={() => {
                  hideProjectCursor();
                }}
                class={[
                  "relative block",
                  "origin-center",
                  "cursor-none",
                  "transition-transform",
                  "duration-500",
                  "ease-[cubic-bezier(0.22,1,0.36,1)]",
                  "will-change-transform",
                ]}
              >
                {/* Green depth/shadow belongs to portal */}
                <div
                  aria-hidden="true"
                  class={[
                    "absolute",
                    "inset-x-[7%]",
                    "top-[-18px] bottom-[-12px]",
                    "bg-[#aab398]/28",
                    "blur-[18px]",

                    "transition-[opacity,transform]",
                    "duration-500",

                    "group-hover:opacity-90",
                    "group-hover:scale-[1.03]",
                  ]}
                />

                {/* Top shadow */}
                <div
                  aria-hidden="true"
                  class={[
                    "absolute",
                    "inset-x-[12%]",
                    "top-[-10px]",
                    "h-8",
                    "bg-black/35",
                    "blur-xl",

                    "transition-opacity",
                    "duration-500",

                    "group-hover:opacity-70",
                  ]}
                />

                {/* The actual window */}
                <div
                  class={[
                    "relative",
                    "aspect-[0.56]",
                    "overflow-hidden",
                    "bg-[#d6d8d1]",
                  ]}
                >
                  {/* Larger stationary image plane */}
                  <img
                    data-work-image
                    src={project.image}
                    width="700"
                    height="1100"
                    loading="lazy"
                    class={[
                      "absolute",
                      "inset-[-5%]",
                      "h-[110%]",
                      "w-[110%]",
                      "max-w-none",
                      "object-cover",

                      "grayscale",
                      "brightness-[0.88]",
                      "contrast-[1.04]",

                      "transition-[transform,filter]",
                      "duration-500",
                      "ease-[cubic-bezier(0.22,1,0.36,1)]",

                      "will-change-transform",

                      "group-hover:grayscale-0",
                      "group-hover:brightness-100",
                      "group-hover:contrast-100",

                      "scale-[1.04]",
                      "will-change-transform",
                    ]}
                  />

                  <div
                    aria-hidden="true"
                    class={[
                      "pointer-events-none",
                      "absolute inset-0",
                      "bg-black/[0.025]",
                    ]}
                  />
                </div>
              </a>

              {/* Number */}
              <div class="relative mt-2 min-h-[112px]">
                <div class="flex justify-center">
                  <span
                    data-work-number
                    class={[
                      "inline-block",
                      "origin-center",

                      "font-['Caveat',cursive]",
                      "text-[clamp(5.5rem,7vw,8rem)]",
                      "leading-[0.92]",
                      "font-normal",
                      "text-black",

                      "transition-transform",
                      "duration-500",
                      "ease-[cubic-bezier(0.22,1,0.36,1)]",

                      "will-change-transform",
                    ]}
                  >
                    {project.index}
                  </span>
                </div>

                {project.process && (
                  <div class={["absolute", "top-11 right-0", "rotate-[-8deg]"]}>
                    <Process class="rotate-[-4deg]text-black/70 w-33.75" />
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div
        ref={cursorRef}
        aria-hidden="true"
        class={[
          "pointer-events-none",
          "fixed top-0 left-0 z-[100]",
          "hidden md:block",
          "h-14 w-20.5",
          "will-change-transform",
        ]}
        style={{
          transform:
            "translate3d(-120px, -120px, 0) translate3d(-50%, -50%, 0)",
        }}
      >
        <LiquidGlass
          material="projectCursor"
          radius={999}
          backdrop
          fill={0.08}
          blur={8}
          present={cursorVisible.value}
          interactive={false}
          class={[
            "liquid-glass--project-cursor",
            "h-full w-full",
            "rounded-full",
          ]}
        >
          <div
            class={[
              "flex h-full w-full",
              "items-center justify-center",
              "font-['Advent_Pro_Local',sans-serif]",
              "text-[12px] font-medium",
              "tracking-[0.08em]",
              "text-black/80",
            ]}
          >
            SKATĪT ↗
          </div>
        </LiquidGlass>
      </div>
    </section>
  );
});
