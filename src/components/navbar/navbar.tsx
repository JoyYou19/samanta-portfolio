import {
  component$,
  useSignal,
  useVisibleTask$,
  type Signal,
} from "@builder.io/qwik";

import { MobileNavbar } from "./mobile-navbar";
import { DesktopNavbar } from "./desktop-navbar";

export const NAV_LINKS = [
  { label: "Sākums", href: "#top", id: "top" },
  { label: "Par", href: "#about", id: "about" },
  { label: "Darbi", href: "#work", id: "work" },
  { label: "Kontakti", href: "#contact", id: "contact" },
] as const;

export interface NavbarChildProps {
  selectedIndex: Signal<number>;
}

export const Navbar = component$(() => {
  const selectedIndex = useSignal(0);

  useVisibleTask$(({ cleanup }) => {
    const sections = NAV_LINKS.map((link) =>
      document.getElementById(link.id),
    ).filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) {
      return;
    }

    let frameId = 0;

    const updateActiveSection = () => {
      frameId = 0;

      const activationY = window.innerHeight * 0.28;

      let nextIndex = 0;

      for (let index = 0; index < sections.length; index++) {
        const bounds = sections[index].getBoundingClientRect();

        if (bounds.top <= activationY) {
          nextIndex = index;
        }
      }

      const documentHeight = document.documentElement.scrollHeight;
      const viewportBottom = window.scrollY + window.innerHeight;

      if (viewportBottom >= documentHeight - 4) {
        nextIndex = sections.length - 1;
      }

      if (selectedIndex.value !== nextIndex) {
        selectedIndex.value = nextIndex;
      }
    };

    const requestUpdate = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = requestAnimationFrame(updateActiveSection);
    };

    window.addEventListener("scroll", requestUpdate, {
      passive: true,
    });

    window.addEventListener("resize", requestUpdate, {
      passive: true,
    });

    /*
     * Deliberately DON'T call requestUpdate() here.
     *
     * selectedIndex starts at 0, so Intro is always the
     * initial navbar state. The first actual scroll event
     * lets the scroll spy take over.
     */

    cleanup(() => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);

      if (frameId !== 0) {
        cancelAnimationFrame(frameId);
      }
    });
  });

  return (
    <>
      <DesktopNavbar selectedIndex={selectedIndex} />
      <MobileNavbar selectedIndex={selectedIndex} />
    </>
  );
});
