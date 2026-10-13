export interface LiquidGlassRendererInstance {
  resize(width: number, height: number, devicePixelRatio: number): void;

  render(elapsedSeconds: number): void;

  set_pointer(x: number, y: number): void;

  set_hovered(hovered: boolean): void;

  set_pressed(pressed: boolean): void;

  set_radius(radius: number): void;

  set_refraction(refraction: number): void;

  set_motion(amount: number): void;

  set_velocity(x: number, y: number): void;

  set_thickness(value: number): void;

  set_fresnel_strength(value: number): void;

  set_specular_strength(value: number): void;

  set_caustic_strength(value: number): void;

  set_edge_strength(value: number): void;

  set_tint(r: number, g: number, b: number): void;

  needs_animation(): boolean;

  set_visibility(value: number): void;

  set_target_x(value: number): void;

  position_x(): number;

  snap_x(value: number): void;

  set_present(present: boolean): void;

  snap_presence(value: number): void;

  free(): void;
}

export interface LiquidGlassWasmModule {
  default(): Promise<unknown>;

  LiquidGlassRenderer: new (
    canvas: HTMLCanvasElement,
  ) => LiquidGlassRendererInstance;
}
