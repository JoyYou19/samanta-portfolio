export type LiquidGlassMaterial =
  | "thin"
  | "regular"
  | "thick"
  | "contact"
  | "button"
  | "navigation"
  | "mobileNavigation"
  | "selection"
  | "lens"
  | "touchLens"
  | "projectCursor";

export interface LiquidGlassMaterialConfig {
  blur: number;
  saturation: number;

  refraction: number;
  thickness: number;

  fresnel: number;
  specular: number;
  caustic: number;
  edge: number;

  visibility: number;

  tint: [number, number, number];
}

export const LIQUID_GLASS_MATERIALS: Record<
  LiquidGlassMaterial,
  LiquidGlassMaterialConfig
> = {
  thin: {
    blur: 8,
    saturation: 1.08,

    refraction: 0.26,
    thickness: 0.24,

    fresnel: 0.72,
    specular: 0.68,
    caustic: 0.52,
    edge: 0.62,

    visibility: 1.0,

    tint: [0.96, 0.98, 1.0],
  },

  regular: {
    blur: 12,
    saturation: 1.15,

    refraction: 0.52,
    thickness: 0.5,

    fresnel: 1,
    specular: 1,
    caustic: 1,
    edge: 1,

    visibility: 1.0,

    tint: [0.94, 0.97, 1.0],
  },

  thick: {
    blur: 16,
    saturation: 1.24,

    refraction: 0.72,
    thickness: 0.78,

    fresnel: 1.18,
    specular: 1.12,
    caustic: 1.25,
    edge: 1.12,

    visibility: 1.0,

    tint: [0.93, 0.97, 1.0],
  },

  navigation: {
    blur: 14,
    saturation: 1.16,

    refraction: 0.99,
    thickness: 0.52,

    fresnel: 0.9,
    specular: 0.75,
    caustic: 0.9,
    edge: 1.15,

    visibility: 1.0,

    tint: [0.97, 0.985, 1.0],
  },

  lens: {
    blur: 0,
    saturation: 1,

    refraction: 1.0,
    thickness: 1.0,

    fresnel: 0.8,
    specular: 0.1,
    caustic: 1.0,
    edge: 0.2,

    visibility: 20.0,

    tint: [0.97, 0.985, 1.0],
  },

  selection: {
    blur: 18,
    saturation: 1.12,

    refraction: 0.22,
    thickness: 0.34,

    fresnel: 0.72,
    specular: 0.68,
    caustic: 0.48,
    edge: 0.78,

    visibility: 1.0,

    tint: [0.98, 0.99, 1.0],
  },

  mobileNavigation: {
    blur: 18,
    saturation: 1.24,

    refraction: 0.82,
    thickness: 0.58,

    fresnel: 1.05,
    specular: 0.2,
    caustic: 0.82,
    edge: 1.22,

    visibility: 1.1,

    tint: [0.97, 0.985, 1.0],
  },

  touchLens: {
    blur: 0,
    saturation: 1,

    refraction: 0.9,
    thickness: 0.85,

    fresnel: 0.65,
    specular: 0.1,
    caustic: 0.9,
    edge: 0.45,

    visibility: 4.0,

    tint: [0.97, 0.99, 1.0],
  },

  contact: {
    blur: 20,
    saturation: 1.16,

    refraction: 0.46,
    thickness: 0.48,

    fresnel: 0.92,
    specular: 0.7,
    caustic: 0.7,
    edge: 0.9,

    visibility: 1.0,

    // Slight warm/sage cast rather than blue-white.
    tint: [0.95, 0.97, 0.92],
  },

  button: {
    blur: 14,
    saturation: 1.18,

    refraction: 0.82,
    thickness: 0.72,

    fresnel: 1.05,
    specular: 0.82,
    caustic: 0.95,
    edge: 1.08,

    visibility: 1.15,

    tint: [0.95, 0.98, 0.92],
  },

  projectCursor: {
    blur: 10,
    saturation: 1.18,

    refraction: 0.9,
    thickness: 0.82,

    fresnel: 1.05,
    specular: 0.72,
    caustic: 1.05,
    edge: 1.08,

    visibility: 1.3,

    // Very subtle sage tint.
    tint: [0.94, 0.98, 0.91],
  },
};
