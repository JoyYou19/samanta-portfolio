mod renderer;
mod shader;
mod shaders;

use renderer::Renderer;

use wasm_bindgen::{prelude::wasm_bindgen, JsValue};

use web_sys::HtmlCanvasElement;

#[wasm_bindgen]
pub struct LiquidGlassRenderer {
    renderer: Renderer,
}

#[wasm_bindgen]
impl LiquidGlassRenderer {
    #[wasm_bindgen(constructor)]
    pub fn new(canvas: HtmlCanvasElement) -> Result<Self, JsValue> {
        console_error_panic_hook::set_once();

        Ok(Self {
            renderer: Renderer::new(canvas)?,
        })
    }

    pub fn resize(&mut self, width: f32, height: f32, device_pixel_ratio: f32) {
        self.renderer.resize(width, height, device_pixel_ratio);
    }

    pub fn render(&mut self, elapsed_seconds: f32) {
        self.renderer.render(elapsed_seconds);
    }

    pub fn set_pointer(&mut self, x: f32, y: f32) {
        self.renderer.set_pointer(x, y);
    }

    pub fn set_hovered(&mut self, hovered: bool) {
        self.renderer.set_hovered(hovered);
    }

    pub fn set_pressed(&mut self, pressed: bool) {
        self.renderer.set_pressed(pressed);
    }

    pub fn set_radius(&mut self, radius: f32) {
        self.renderer.set_radius(radius);
    }

    pub fn set_refraction(&mut self, refraction: f32) {
        self.renderer.set_refraction(refraction);
    }

    pub fn set_motion(&mut self, amount: f32) {
        self.renderer.set_motion(amount);
    }

    pub fn set_velocity(&mut self, x: f32, y: f32) {
        self.renderer.set_velocity(x, y);
    }

    pub fn set_thickness(&mut self, value: f32) {
        self.renderer.set_thickness(value);
    }

    pub fn set_fresnel_strength(&mut self, value: f32) {
        self.renderer.set_fresnel_strength(value);
    }

    pub fn set_specular_strength(&mut self, value: f32) {
        self.renderer.set_specular_strength(value);
    }

    pub fn set_caustic_strength(&mut self, value: f32) {
        self.renderer.set_caustic_strength(value);
    }

    pub fn set_edge_strength(&mut self, value: f32) {
        self.renderer.set_edge_strength(value);
    }

    pub fn set_tint(&mut self, r: f32, g: f32, b: f32) {
        self.renderer.set_tint(r, g, b);
    }

    pub fn needs_animation(&self) -> bool {
        self.renderer.needs_animation()
    }

    pub fn set_visibility(&mut self, value: f32) {
        self.renderer.set_visibility(value);
    }

    pub fn set_target_x(&mut self, value: f32) {
        self.renderer.set_target_x(value);
    }

    pub fn position_x(&self) -> f32 {
        self.renderer.position_x()
    }

    pub fn snap_x(&mut self, value: f32) {
        self.renderer.snap_x(value);
    }

    pub fn set_present(&mut self, present: bool) {
        self.renderer.set_present(present);
    }

    pub fn snap_presence(&mut self, value: f32) {
        self.renderer.snap_presence(value);
    }
}
