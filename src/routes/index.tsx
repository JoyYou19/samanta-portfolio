import { component$, Slot } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Navbar } from "~/components/navbar/navbar";
import { WorkSection } from "~/components/work/work-section";
import { ContactSection } from "~/components/contact/contact_section";
import { HeroSection } from "~/components/hero/hero-section";

export default component$(() => {
  return (
    <main class="relative min-h-screen overflow-x-hidden bg-[#fafaf8] text-black">
      <Navbar />

      <HeroSection />

      <section
        id="about"
        class="mx-auto max-w-[1440px] px-6 py-24 lg:px-10 xl:px-12 xl:py-28"
      >
        <div
          class={[
            "grid items-start",
            "gap-12 lg:gap-10 xl:gap-14",
            "lg:grid-cols-[300px_minmax(420px,1fr)_360px]",
            "xl:grid-cols-[330px_minmax(480px,1fr)_380px]",
          ]}
        >
          {/* Portrait */}
          <div class="relative h-[650px] lg:h-[690px]">
            <div
              class={[
                "absolute inset-0",
                "bg-[#b1baa2]",
                "shadow-[0_18px_35px_rgba(0,0,0,0.18)]",
              ]}
            />

            <div
              aria-hidden="true"
              class={[
                "absolute",
                "top-[82px] right-[22px] bottom-[20px] left-[22px]",
                "bg-[#fffce7]/55 blur-2xl",
              ]}
            />

            <img
              src="/samanta.png"
              alt="Samanta Likanse"
              width="700"
              height="900"
              class={[
                "absolute z-10",
                "top-[62px] bottom-0",
                "left-1/2 -translate-x-1/2",
                "h-[calc(100%-62px)] w-auto max-w-none",
              ]}
            />
          </div>

          {/* About copy */}
          <div class="pt-2">
            <h2
              class={[
                "mb-10",
                "font-['Caveat',cursive]",
                "text-[clamp(3.5rem,4.5vw,5rem)]",
                "leading-[0.9]",
              ]}
            >
              Par mani
            </h2>

            <div
              class={[
                "max-w-[590px]",
                "space-y-8",
                "font-['Advent_Pro_Local',sans-serif]",
                "text-[clamp(20px,1.55vw,25px)]",
                "leading-[1.4] font-normal",
              ]}
            >
              <p>
                Mans vārds ir Samanta Līkanse, esmu vides dizainera asistente.
                Esmu absolvējusi Ogres tehnikumu, un mans mērķis ir sadarboties
                ar uzņēmumiem, kas darbojas cilvēku un dabas labā, vienlaikus
                veicinot arī manu personīgo izaugsmi.
              </p>

              <p>
                Teiktu, ka ar mani ir viegli un patīkami strādāt, jo spēju
                pielāgoties jebkādiem apstākļiem un jebkurai videi. Vajadzības
                gadījumā protu paust savu viedokli par konkrētām lietām, kā arī
                pieņemt citu ieteikumus.
              </p>

              <p>
                Esmu atvērta jaunām iespējām, vēlos mācīties un kādu dienu
                īstenot ko tādu, kas saistīts ar manu pašas dizaina līniju, vai
                arī ļauties tam, kur dzīve mani šajā ceļā aizvedīs.
              </p>
            </div>
          </div>

          {/* Information */}
          <div class="font-['Advent_Pro_Local',sans-serif] lg:pt-1">
            <InfoBlock title="Prasmes" icon="✎" large>
              <p class="max-w-[285px] text-[19px] leading-[1.4]">
                Mākslas paņēmieni — gleznošana, zīmēšana, maketēšana u.c.
              </p>

              <div class="mt-7">
                <p class="mb-3 text-[19px]">Digitālās iemaņas</p>

                <div class="grid grid-cols-2 gap-x-6 text-[19px] leading-[1.55]">
                  <div>
                    <p>• Adobe Illustrator</p>
                    <p>• Adobe Photoshop</p>
                    <p>• AutoCAD</p>
                  </div>

                  <div>
                    <p>• SketchUp</p>
                    <p>• Canva</p>
                  </div>
                </div>
              </div>
            </InfoBlock>

            <div class="mt-7 flex items-stretch gap-3">
              <div class="w-[145px] shrink-0">
                <InfoBlock title="Valodas" icon="文">
                  <div class="mt-[15px] text-[19px] leading-[1.45] whitespace-nowrap">
                    <p>Latviešu C1</p>
                    <p>Angļu C1</p>
                    <p>Krievu A2</p>
                  </div>
                </InfoBlock>
              </div>

              <div class="min-w-0 flex-1">
                <InfoBlock title="Izglītība" icon="♙">
                  <div class="text-[18px] leading-[1.35]">
                    <p>Jelgavas Spīdolas Valsts ģimnāzija</p>
                    <p>Ogres Tehnikums Vides - dizainera asistente</p>
                  </div>
                </InfoBlock>
              </div>
            </div>

            <div class="mt-7">
              <InfoBlock title="Saziņa">
                <div class="text-[19px]">
                  <ContactRow icon="☎">
                    <a href="tel:+37125750333">+371 25750333</a>
                  </ContactRow>

                  <ContactRow icon="✉">
                    <a href="mailto:samanta.likanse@gmail.com">
                      samanta.likanse@gmail.com
                    </a>
                  </ContactRow>

                  <ContactRow icon="●">
                    <span>Rīga, LV-3001, Latvija</span>
                  </ContactRow>
                </div>
              </InfoBlock>
            </div>
          </div>
        </div>
      </section>

      <WorkSection />
      <ContactSection />
    </main>
  );
});

interface InfoBlockProps {
  title: string;
  icon?: string;
  large?: boolean;
}

export const InfoBlock = component$<InfoBlockProps>((props) => {
  return (
    <section>
      <div class="mb-2 flex items-end justify-between gap-4">
        <h3
          class={[
            "font-['Advent_Pro_Local',sans-serif]",
            "text-[28px] leading-none font-light",
            "tracking-[-0.035em]",
            "text-[#747c68]",
          ]}
        >
          {props.title}
        </h3>
      </div>

      <div
        class={[
          "relative overflow-hidden",
          "bg-[#aab398]",
          "px-3 py-5",
          "text-[#58472d]",
          props.large && "min-h-[205px]",
        ]}
      >
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/35"
        />

        {props.icon && (
          <div
            aria-hidden="true"
            class={[
              "absolute top-1 right-1",
              "flex h-8 w-8 items-center justify-center",
              "text-[22px] leading-none",
              "text-[#f0f4c5]/90",
            ]}
          >
            {props.icon}
          </div>
        )}

        <div class={["relative", props.icon && "pr-7"]}>
          <Slot />
        </div>
      </div>
    </section>
  );
});

interface ContactRowProps {
  icon: string;
}

export const ContactRow = component$<ContactRowProps>((props) => {
  return (
    <div class="grid grid-cols-[28px_1fr] items-center gap-3">
      <span
        aria-hidden="true"
        class={[
          "flex h-7 w-7 items-center justify-center",
          "text-[18px] text-[#edf2bd]",
        ]}
      >
        {props.icon}
      </span>

      <div class="min-w-0">
        <Slot />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Samanta Likanse — Portfolio",
  meta: [
    {
      name: "description",
      content: "Samanta Likanse portfolio.",
    },
  ],
  links: [
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Advent+Pro:wght@200;300;400;500&family=Caveat:wght@400;500&family=Yanone+Kaffeesatz:wght@300;400;500&display=swap",
    },
  ],
};
