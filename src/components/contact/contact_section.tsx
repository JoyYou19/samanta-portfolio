import { component$ } from "@builder.io/qwik";
import { LiquidGlass } from "~/components/liquid-glass/liquid-glass";

export const ContactSection = component$(() => {
  return (
    <section
      id="contact"
      class={[
        "relative overflow-hidden",
        "bg-[#fafaf8]",
        "px-5 py-28",
        "md:px-8 md:py-36",
        "lg:px-12",
      ]}
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Main sage field behind the glass */}
        <div
          class={[
            "absolute",
            "top-[30%] left-1/2",
            "h-[430px] w-[min(1100px,88vw)]",
            "-translate-x-1/2",
            "rounded-[50%]",
            "bg-[#aab398]/38",
            "blur-[95px]",
          ]}
        />

        {/* Slightly deeper sage variation */}
        <div
          class={[
            "absolute",
            "top-[34%] left-[5%]",
            "h-[330px] w-[430px]",
            "rotate-[-10deg]",
            "rounded-[46%]",
            "bg-[#8f9b7e]/24",
            "blur-[90px]",
          ]}
        />

        {/* Softer right-side sage */}
        <div
          class={[
            "absolute",
            "top-[38%] right-[4%]",
            "h-[370px] w-[460px]",
            "rotate-[8deg]",
            "rounded-[48%]",
            "bg-[#b6bea9]/34",
            "blur-[100px]",
          ]}
        />

        {/* Warm variation through the middle */}
        <div
          class={[
            "absolute",
            "top-[34%] left-[45%]",
            "h-[260px] w-[320px]",
            "rounded-full",
            "bg-[#d8d0bf]/20",
            "blur-[85px]",
          ]}
        />

        {/* Bottom atmosphere */}
        <div
          class={[
            "absolute",
            "bottom-[-130px] left-1/2",
            "h-[320px] w-[720px]",
            "-translate-x-1/2",
            "rounded-full",
            "bg-[#aab398]/18",
            "blur-[120px]",
          ]}
        />
      </div>

      <div class="relative mx-auto max-w-[1120px]">
        {/* Heading */}
        <div class="mb-16 text-center md:mb-20">
          <h2
            class={[
              "font-['Caveat',cursive]",
              "text-[clamp(5rem,9vw,8.5rem)]",
              "leading-[0.8]",
              "font-normal",
            ]}
          >
            Sazināmies
          </h2>
        </div>

        <div class="mx-auto max-w-[980px]">
          {/* Main contact glass */}
          <LiquidGlass
            material="thick"
            radius={34}
            backdrop
            fill={0.065}
            blur={22}
            saturation={1.18}
            thickness={0.58}
            refraction={0.5}
            fresnel={0.95}
            specular={0.78}
            caustic={0.72}
            edge={0.95}
            tint={[0.95, 0.97, 0.92]}
            interactive
            class={[
              "overflow-hidden",
              "shadow-[0_28px_80px_rgba(54,64,46,0.13)]",
            ]}
          >
            <div class="relative">
              {/* Very restrained physical glass edge */}
              <div
                aria-hidden="true"
                class={[
                  "pointer-events-none",
                  "absolute inset-0 z-[1]",
                  "rounded-[34px]",
                  "ring-1 ring-white/25",
                  "shadow-[inset_0_1px_0_rgba(255,255,255,0.42)]",
                ]}
              />

              <div
                class={["relative z-10", "grid", "md:grid-cols-[1fr_1.15fr]"]}
              >
                {/* Intro */}
                <div
                  class={[
                    "flex flex-col justify-between",
                    "border-black/[0.07]",
                    "p-7",
                    "md:border-r md:p-10",
                    "lg:p-12",
                  ]}
                >
                  <div>
                    <span
                      class={[
                        "font-['Advent_Pro_Local',sans-serif]",
                        "text-xs",
                        "tracking-[0.22em]",
                        "text-black/35",
                        "uppercase",
                      ]}
                    >
                      Raksti man
                    </span>

                    <p
                      class={[
                        "mt-5 max-w-[360px]",
                        "font-['Advent_Pro_Local',sans-serif]",
                        "text-[clamp(2rem,3.5vw,3rem)]",
                        "leading-[1.05]",
                        "font-light",
                        "tracking-[-0.025em]",
                        "text-black/80",
                      ]}
                    >
                      Par idejām, sadarbību un jauniem projektiem.
                    </p>
                  </div>

                  <div
                    class={[
                      "mt-10",
                      "font-['Advent_Pro_Local',sans-serif]",
                      "text-sm",
                      "tracking-[0.14em]",
                      "text-black/35",
                      "uppercase",
                    ]}
                  >
                    Samanta Līkanse · Rīga
                  </div>
                </div>

                {/* Contact details */}
                <div class="p-7 md:p-10 lg:p-12">
                  <div class="space-y-1">
                    <ContactRow
                      label="E-pasts"
                      value="samanta.likanse@gmail.com"
                      href="mailto:samanta.likanse@gmail.com"
                    />

                    <ContactRow
                      label="Tālrunis"
                      value="+371 25750333"
                      href="tel:+37125750333"
                    />

                    <ContactRow
                      label="Instagram"
                      value="@samantl.ee"
                      href="#"
                    />

                    <ContactRow
                      label="LinkedIn"
                      value="Samanta Līkanse"
                      href="#"
                    />
                  </div>
                </div>
              </div>
            </div>
          </LiquidGlass>

          {/* Floating liquid-glass actions */}
          <div class={["relative z-20", "mx-auto -mt-6", "flex w-fit gap-2"]}>
            <LiquidGlass
              material="thick"
              radius={999}
              backdrop
              fill={0.07}
              blur={15}
              saturation={1.18}
              thickness={0.72}
              refraction={0.86}
              fresnel={1.05}
              specular={0.85}
              caustic={0.95}
              edge={1.1}
              tint={[0.95, 0.98, 0.92]}
              interactive
              class={[
                "overflow-hidden",
                "shadow-[0_12px_32px_rgba(46,55,38,0.11)]",
              ]}
            >
              <a
                href="mailto:samanta.likanse@gmail.com"
                class={[
                  "group",
                  "flex min-h-13 items-center gap-4 px-7",
                  "font-['Advent_Pro_Local',sans-serif]",
                  "text-[16px] font-light",
                  "text-black/70",
                  "transition-colors duration-200",
                  "hover:text-black",
                ]}
              >
                <span>Rakstīt</span>

                <span
                  aria-hidden="true"
                  class={[
                    "text-[19px]",
                    "transition-transform duration-300",
                    "ease-[cubic-bezier(0.22,1,0.36,1)]",
                    "group-hover:translate-x-0.5",
                    "group-hover:-translate-y-0.5",
                  ]}
                >
                  ↗
                </span>
              </a>
            </LiquidGlass>

            <LiquidGlass
              material="thick"
              radius={999}
              backdrop
              fill={0.055}
              blur={15}
              saturation={1.18}
              thickness={0.72}
              refraction={0.86}
              fresnel={1.05}
              specular={0.85}
              caustic={0.95}
              edge={1.1}
              tint={[0.95, 0.98, 0.92]}
              interactive
              class={[
                "overflow-hidden",
                "shadow-[0_12px_32px_rgba(46,55,38,0.09)]",
              ]}
            >
              <a
                href="tel:+37125750333"
                class={[
                  "group",
                  "flex min-h-13 items-center gap-4 px-7",
                  "font-['Advent_Pro_Local',sans-serif]",
                  "text-[16px] font-light",
                  "text-black/65",
                  "transition-colors duration-200",
                  "hover:text-black",
                ]}
              >
                <span>Zvanīt</span>

                <span
                  aria-hidden="true"
                  class={[
                    "text-[19px]",
                    "transition-transform duration-300",
                    "ease-[cubic-bezier(0.22,1,0.36,1)]",
                    "group-hover:translate-x-0.5",
                    "group-hover:-translate-y-0.5",
                  ]}
                >
                  ↗
                </span>
              </a>
            </LiquidGlass>
          </div>
        </div>

        {/* Footer */}
        <footer
          class={[
            "mt-24",
            "flex items-center justify-between",
            "font-['Advent_Pro_Local',sans-serif]",
            "text-sm text-black/35",
          ]}
        >
          <span>© Samanta Līkanse</span>

          <a
            href="#top"
            class={["transition-colors duration-200", "hover:text-black/70"]}
          >
            Uz augšu ↑
          </a>
        </footer>
      </div>
    </section>
  );
});

interface ContactRowProps {
  label: string;
  value: string;
  href: string;
}

const ContactRow = component$<ContactRowProps>((props) => {
  return (
    <a
      href={props.href}
      class={[
        "group",
        "grid grid-cols-[90px_1fr] items-center gap-5",
        "border-b border-black/[0.08]",
        "py-5",
        "font-['Advent_Pro_Local',sans-serif]",
      ]}
    >
      <span
        class={[
          "text-[11px]",
          "tracking-[0.18em]",
          "text-black/30",
          "uppercase",
        ]}
      >
        {props.label}
      </span>

      <div class="flex min-w-0 items-center justify-between gap-4">
        <span
          class={[
            "truncate",
            "text-[clamp(1rem,2vw,1.3rem)]",
            "font-light",
            "text-black/65",
            "transition-colors duration-200",
            "group-hover:text-black",
          ]}
        >
          {props.value}
        </span>

        <span
          aria-hidden="true"
          class={[
            "shrink-0",
            "-translate-x-1",
            "text-black/30",
            "opacity-0",
            "transition-[transform,opacity,color]",
            "duration-300",
            "ease-[cubic-bezier(0.22,1,0.36,1)]",
            "group-hover:translate-x-0",
            "group-hover:text-black/55",
            "group-hover:opacity-100",
          ]}
        >
          ↗
        </span>
      </div>
    </a>
  );
});
