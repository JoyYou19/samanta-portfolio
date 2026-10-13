import { Slot, component$, type ClassList } from "@builder.io/qwik";
import { LiquidGlass } from "./liquid-glass";

interface LiquidGlassButtonProps {
  href: string;
  class?: ClassList;
  ariaLabel?: string;
  selected?: boolean;
}

export const LiquidGlassButton = component$<LiquidGlassButtonProps>((props) => {
  const selected = props.selected ?? false;

  return (
    <LiquidGlass
      material={selected ? "thick" : "regular"}
      radius={999}
      class={[
        "rounded-full",
        selected ? "shadow-[0_8px_26px_rgba(16,43,62,0.10)]" : undefined,
        props.class,
      ]}
    >
      <a
        href={props.href}
        aria-label={props.ariaLabel}
        aria-current={selected ? "location" : undefined}
        class={[
          "relative inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-200",
          selected
            ? "text-[#102b3e]"
            : "text-[#102b3e]/76 hover:text-[#102b3e]",
        ]}
      >
        <Slot />
      </a>
    </LiquidGlass>
  );
});
