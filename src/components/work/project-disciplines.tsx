import { component$ } from "@builder.io/qwik";
import { LiquidGlass } from "../liquid-glass/liquid-glass";

const disciplines = [
  {
    short: "IB",
    name: "Internacionālais bakalaurs",
    color: "#8A50B2",
  },
  {
    short: "KOM",
    name: "Komerczinības",
    color: "#526FA2",
  },
  {
    short: "SOC",
    name: "Sociālās zinības",
    color: "#9B3434",
  },
  {
    short: "VID",
    name: "Vides zinības",
    color: "#39752D",
  },
] as const;

export const ProjectDisciplines = component$(() => {
  return (
    <section
      class={[
        "relative overflow-hidden",
        "bg-[#3A312D]",
        "px-5 py-24",
        "md:px-8 md:py-32",
        "lg:px-12 lg:py-40",
      ]}
    >
      <div
        aria-hidden="true"
        class={[
          "pointer-events-none",
          "absolute inset-x-0 top-1/2",
          "h-full",
          "-translate-y-1/2",
          "opacity-[0.92]",
        ]}
      >
        <svg
          viewBox="0 0 1366 690"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          class="h-full w-full"
        >
          <path
            d="M1424.5 590.546C1415.67 610.046 1378 647.746 1298 642.546C1198 636.046 1035 586.047 1141.5 462.047C1248 338.047 1326 303.047 1298 192.047C1271.1 85.4173 1056.5 11.5465 917 63.5465C777.5 115.547 765 163.547 701.5 266.047C638 368.547 901 734.765 500.5 590.546C231.262 493.594 687.093 197.332 422.5 78.2652C352.5 46.7652 28.5 50.2652 96 252.765C163.5 455.265 292.5 634.546 144 619.046C25.2 606.646 -50.8333 500.547 -74 449.047"
            stroke="#C88A59"
            stroke-width="93"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <div
        aria-hidden="true"
        class={[
          "pointer-events-none absolute",
          "top-[12%] left-[18%]",
          "h-[340px] w-[500px]",
          "rounded-full bg-[#C88A59]/10",
          "blur-[100px]",
        ]}
      />

      <div
        aria-hidden="true"
        class={[
          "pointer-events-none absolute",
          "right-[10%] bottom-[8%]",
          "h-[320px] w-[480px]",
          "rounded-full bg-[#98A38A]/12",
          "blur-[110px]",
        ]}
      />

      <div class="relative z-10 mx-auto max-w-[1180px]">
        <LiquidGlass
          material="contact"
          radius={42}
          backdrop
          fill={0.08}
          blur={22}
          saturation={1.16}
          refraction={0.52}
          thickness={0.52}
          interactive={false}
          class={[
            "overflow-hidden",
            "ring-1 ring-white/30",
            "shadow-[0_30px_80px_rgba(42,38,31,0.16)]",
          ]}
        >
          <div class={["px-6 py-8", "md:px-10 md:py-11", "lg:px-14 lg:py-14"]}>
            <div
              class={[
                "grid gap-8",
                "lg:grid-cols-[minmax(0,1fr)_330px]",
                "lg:items-end lg:gap-16",
              ]}
            >
              <div>
                <p
                  class={[
                    "mb-4",
                    "font-['Advent_Pro_Local',sans-serif]",
                    "text-[13px] font-medium",
                    "tracking-[0.16em] uppercase",
                    "text-black/40",
                  ]}
                >
                  Teritorijas koncepcija
                </p>

                <h2
                  class={[
                    "max-w-[760px]",
                    "font-['Yanone_Kaffeesatz',sans-serif]",
                    "text-[clamp(2.7rem,5vw,5.2rem)]",
                    "leading-[0.96]",
                    "font-light",
                    "tracking-[-0.025em]",
                    "text-black/85",
                  ]}
                >
                  Četras zonas.
                  <br />
                  Četri profesionālie virzieni.
                </h2>
              </div>

              <p
                class={[
                  "max-w-[330px]",
                  "font-['Advent_Pro_Local',sans-serif]",
                  "text-[18px]",
                  "leading-[1.45]",
                  "font-normal",
                  "text-black/65",
                  "md:text-[20px]",
                ]}
              >
                Teritorija ir sadalīta četrās daļās, kur katra krāsa reprezentē
                vienu no Spīdolas skolas profesiju novirzieniem.
              </p>
            </div>

            <div
              class={[
                "mt-10 grid",
                "overflow-hidden rounded-[24px]",
                "shadow-[0_12px_35px_rgba(35,35,30,0.12)]",
                "sm:grid-cols-2",
                "lg:mt-14 lg:grid-cols-4",
              ]}
            >
              {disciplines.map((discipline) => (
                <div
                  key={discipline.short}
                  class={[
                    "group relative",
                    "min-h-[150px]",
                    "overflow-hidden",
                    "px-5 py-5",
                    "md:min-h-[170px] md:px-6 md:py-6",
                  ]}
                  style={{
                    backgroundColor: discipline.color,
                  }}
                >
                  <div
                    aria-hidden="true"
                    class={[
                      "pointer-events-none",
                      "absolute inset-x-0 top-0",
                      "h-px bg-white/35",
                    ]}
                  />

                  <div
                    class={[
                      "relative flex h-full flex-col",
                      "justify-between gap-7",
                    ]}
                  >
                    <span
                      class={[
                        "font-['Advent_Pro_Local',sans-serif]",
                        "text-[12px] font-medium",
                        "tracking-[0.15em] uppercase",
                        "text-[#fffbea]/65",
                      ]}
                    >
                      {discipline.name}
                    </span>

                    <span
                      class={[
                        "font-['Yanone_Kaffeesatz',sans-serif]",
                        "text-[clamp(3.4rem,5vw,5rem)]",
                        "leading-none font-light",
                        "tracking-[-0.025em]",
                        "text-[#fffbea]",
                      ]}
                    >
                      {discipline.short}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </LiquidGlass>
      </div>
    </section>
  );
});
