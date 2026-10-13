import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { LiquidGlass } from "~/components/liquid-glass/liquid-glass";
import { ProjectDisciplines } from "~/components/work/project-disciplines";
import { ProjectZones } from "~/components/work/project-zones";

const software = [
  {
    short: "Ps",
    name: "Photoshop",
  },
  {
    short: "Ai",
    name: "Illustrator",
  },
  {
    short: "SU",
    name: "SketchUp",
  },
];

export default component$(() => {
  return (
    <main class="min-h-screen bg-[#fafaf8] text-black">
      {/* -------------------------------------------------------
       * Project hero
       * ------------------------------------------------------- */}
      <section
        class={["relative min-h-[100svh] overflow-hidden", "bg-[#d9ddd4]"]}
      >
        {/* Project image */}
        <img
          src="/projects/first_project.png"
          alt="Zināšanām, mērķiem, tuvībai"
          width="1600"
          height="1000"
          class={["absolute inset-0", "h-full w-full", "object-cover"]}
        />

        {/* Soft editorial wash */}
        <div
          aria-hidden="true"
          class={[
            "pointer-events-none absolute inset-0",
            "bg-[linear-gradient(90deg,rgba(250,250,248,0.90)_0%,rgba(250,250,248,0.66)_27%,rgba(250,250,248,0.16)_56%,rgba(250,250,248,0.05)_100%)]",
          ]}
        />

        {/* Bottom wash */}
        <div
          aria-hidden="true"
          class={[
            "pointer-events-none absolute inset-x-0 bottom-0",
            "h-[42%]",
            "bg-[linear-gradient(to_bottom,transparent,rgba(250,250,248,0.16))]",
          ]}
        />

        {/* ---------------------------------------------------
         * Top navigation
         * --------------------------------------------------- */}
        <div
          class={[
            "absolute inset-x-0 top-0 z-20",
            "px-5 pt-5 md:px-8 md:pt-7 lg:px-12",
          ]}
        >
          <div class="mx-auto flex max-w-[1500px] items-center justify-between">
            <a
              href="/#work"
              class={[
                "font-['Advent_Pro_Local',sans-serif]",
                "text-[15px] font-normal",
                "text-black/65",
                "transition-colors duration-200",
                "hover:text-black",
              ]}
            >
              ← Atpakaļ
            </a>

            <span
              class={[
                "font-['Advent_Pro_Local',sans-serif]",
                "text-[13px] tracking-[0.14em] uppercase",
                "text-black/45",
              ]}
            >
              Projekts 01
            </span>
          </div>
        </div>

        {/* ---------------------------------------------------
         * Main content
         * --------------------------------------------------- */}
        <div
          class={[
            "relative z-10",
            "mx-auto min-h-[100svh] max-w-[1500px]",
            "px-5 pt-28 pb-8",
            "md:px-8 md:pt-32 md:pb-10",
            "lg:px-12 lg:pt-36 lg:pb-12",
          ]}
        >
          {/* Title */}
          <div class="max-w-[720px]">
            <h1
              class={[
                "font-['Yanone_Kaffeesatz',sans-serif]",
                "text-[clamp(4.6rem,8.2vw,8.6rem)]",
                "leading-[0.88]",
                "font-light",
                "tracking-[-0.055em]",
                "text-black/75",
              ]}
            >
              <span class="block">Zināšanām</span>

              <span class="mt-[0.28em] block">Mērķiem</span>

              <span class="mt-[0.28em] block">Tuvībai</span>
            </h1>
          </div>

          {/* -------------------------------------------------
           * Bottom information
           * ------------------------------------------------- */}
          <div
            class={["mt-20", "lg:absolute lg:inset-x-12 lg:bottom-12 lg:mt-0"]}
          >
            <div
              class={[
                "grid items-end",
                "gap-8 lg:gap-12",
                "lg:grid-cols-[minmax(0,760px)_1fr]",
              ]}
            >
              {/* Description glass */}
              <LiquidGlass
                material="contact"
                radius={34}
                backdrop
                fill={0.09}
                blur={18}
                saturation={1.16}
                refraction={0.58}
                thickness={0.54}
                interactive={false}
                class={[
                  "overflow-hidden",
                  "shadow-[0_18px_55px_rgba(37,44,32,0.12)]",
                ]}
              >
                <div
                  class={["px-6 py-6", "md:px-8 md:py-7", "lg:px-9 lg:py-8"]}
                >
                  <p
                    class={[
                      "max-w-[690px]",
                      "font-['Advent_Pro_Local',sans-serif]",
                      "text-[clamp(18px,1.5vw,24px)]",
                      "leading-[1.42]",
                      "font-normal",
                      "text-black/80",
                    ]}
                  >
                    Projekts tapis sakarā ar tehnikuma 4. kursa kvalifikācijas
                    darbu. Projekts atrodas Jelgavā, Spīdolas Valsts ģimnāzijas
                    pagalmā. Rekreācijas zonas mērķis bija radīt jauniešiem un
                    skolēniem alternatīvu mācību un brīvā laika vietu, kur var
                    droši justies un integrēt skolas aktīvo vidi.
                  </p>
                </div>
              </LiquidGlass>

              {/* Software */}
              <div class="lg:pb-2">
                <p
                  class={[
                    "mb-4",
                    "font-['Advent_Pro_Local',sans-serif]",
                    "text-[20px] font-normal",
                    "text-black/75",
                    "md:text-[22px]",
                  ]}
                >
                  Izmantotās aplikācijas
                </p>

                <div class="flex flex-wrap gap-3">
                  {software.map((item) => (
                    <LiquidGlass
                      key={item.name}
                      material="button"
                      radius={999}
                      backdrop
                      fill={0.07}
                      blur={12}
                      saturation={1.15}
                      interactive={false}
                      class={[
                        "overflow-hidden",
                        "shadow-[0_8px_28px_rgba(36,42,32,0.08)]",
                      ]}
                    >
                      <div
                        class={[
                          "flex h-[58px] items-center gap-3",
                          "px-4 pr-5",
                        ]}
                      >
                        <span
                          class={[
                            "flex h-9 w-9 items-center justify-center",
                            "rounded-full",
                            "bg-[#98A38A]/50",
                            "font-['Advent_Pro_Local',sans-serif]",
                            "text-[15px] font-medium",
                            "text-black/75",
                          ]}
                        >
                          {item.short}
                        </span>

                        <span
                          class={[
                            "font-['Advent_Pro_Local',sans-serif]",
                            "text-[15px] font-normal",
                            "text-black/75",
                          ]}
                        >
                          {item.name}
                        </span>
                      </div>
                    </LiquidGlass>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------
       * Space for the next project-story section
       * ------------------------------------------------------- */}
      <ProjectZones />
      <ProjectDisciplines />
    </main>
  );
});

export const head: DocumentHead = {
  title: "Zināšanām, mērķiem, tuvībai — Samanta Likanse",
  meta: [
    {
      name: "description",
      content: "Zināšanām, mērķiem, tuvībai — vides dizaina projekts Jelgavā.",
    },
  ],
};
