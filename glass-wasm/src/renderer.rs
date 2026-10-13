use js_sys::{Float32Array, Object, Reflect};

use wasm_bindgen::{JsCast, JsValue};

use web_sys::{HtmlCanvasElement, WebGl2RenderingContext as Gl, WebGlBuffer, WebGlUniformLocation};

use crate::{
    shader::ShaderProgram,
    shaders::{GLASS_FRAGMENT_SHADER, GLASS_VERTEX_SHADER},
};

pub struct Renderer {
    gl: Gl,

    shader: ShaderProgram,

    vertex_buffer: WebGlBuffer,

    resolution_uniform: WebGlUniformLocation,
    pointer_uniform: WebGlUniformLocation,

    hover_uniform: WebGlUniformLocation,
    pressed_uniform: WebGlUniformLocation,

    radius_uniform: WebGlUniformLocation,
    refraction_uniform: WebGlUniformLocation,

    presence_uniform: WebGlUniformLocation,
    presence_velocity_uniform: WebGlUniformLocation,

    visibility_uniform: WebGlUniformLocation,
    visibility: f32,

    width: f32,
    height: f32,

    pointer_x: f32,
    pointer_y: f32,

    pointer_target_x: f32,
    pointer_target_y: f32,

    hover: f32,
    hover_target: f32,

    pressed: f32,
    pressed_target: f32,

    radius: f32,
    refraction: f32,

    last_render_time: Option<f32>,

    motion_uniform: WebGlUniformLocation,
    velocity_uniform: WebGlUniformLocation,
    thickness_uniform: WebGlUniformLocation,
    fresnel_strength_uniform: WebGlUniformLocation,
    specular_strength_uniform: WebGlUniformLocation,
    caustic_strength_uniform: WebGlUniformLocation,
    tint_uniform: WebGlUniformLocation,
    edge_strength_uniform: WebGlUniformLocation,

    motion: f32,
    motion_target: f32,

    velocity_x: f32,
    velocity_y: f32,

    position_x: f32,
    position_target_x: f32,
    position_velocity_x: f32,

    presence: f32,
    presence_target: f32,
    presence_velocity: f32,

    thickness: f32,
    fresnel_strength: f32,
    specular_strength: f32,
    caustic_strength: f32,
    edge_strength: f32,

    tint_r: f32,
    tint_g: f32,
    tint_b: f32,
}

impl Renderer {
    pub fn new(canvas: HtmlCanvasElement) -> Result<Self, JsValue> {
        let context_options = Object::new();

        Reflect::set(
            &context_options,
            &JsValue::from_str("alpha"),
            &JsValue::TRUE,
        )?;

        Reflect::set(
            &context_options,
            &JsValue::from_str("premultipliedAlpha"),
            &JsValue::TRUE,
        )?;

        Reflect::set(
            &context_options,
            &JsValue::from_str("antialias"),
            &JsValue::TRUE,
        )?;

        let gl = canvas
            .get_context_with_context_options("webgl2", &context_options.into())?
            .ok_or_else(|| JsValue::from_str("WebGL2 is not available"))?
            .dyn_into::<Gl>()?;

        let shader = ShaderProgram::new(&gl, GLASS_VERTEX_SHADER, GLASS_FRAGMENT_SHADER)?;

        let vertices: [f32; 8] = [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0];

        let vertex_buffer = gl
            .create_buffer()
            .ok_or_else(|| JsValue::from_str("Could not create glass vertex buffer"))?;

        gl.bind_buffer(Gl::ARRAY_BUFFER, Some(&vertex_buffer));

        unsafe {
            let data = Float32Array::view(&vertices);

            gl.buffer_data_with_array_buffer_view(Gl::ARRAY_BUFFER, &data, Gl::STATIC_DRAW);
        }

        let resolution_uniform = get_uniform(&gl, &shader, "u_resolution")?;

        let pointer_uniform = get_uniform(&gl, &shader, "u_pointer")?;

        let hover_uniform = get_uniform(&gl, &shader, "u_hover")?;

        let pressed_uniform = get_uniform(&gl, &shader, "u_pressed")?;

        let radius_uniform = get_uniform(&gl, &shader, "u_radius")?;

        let refraction_uniform = get_uniform(&gl, &shader, "u_refraction")?;

        let motion_uniform = get_uniform(&gl, &shader, "u_motion")?;

        let velocity_uniform = get_uniform(&gl, &shader, "u_velocity")?;

        let thickness_uniform = get_uniform(&gl, &shader, "u_thickness")?;

        let fresnel_strength_uniform = get_uniform(&gl, &shader, "u_fresnel_strength")?;

        let specular_strength_uniform = get_uniform(&gl, &shader, "u_specular_strength")?;

        let caustic_strength_uniform = get_uniform(&gl, &shader, "u_caustic_strength")?;

        let tint_uniform = get_uniform(&gl, &shader, "u_tint")?;

        let edge_strength_uniform = get_uniform(&gl, &shader, "u_edge_strength")?;

        let visibility_uniform = get_uniform(&gl, &shader, "u_visibility")?;

        let presence_uniform = get_uniform(&gl, &shader, "u_presence")?;

        let presence_velocity_uniform = get_uniform(&gl, &shader, "u_presence_velocity")?;

        /*
         * UI glass does not need a depth buffer.
         */
        gl.disable(Gl::DEPTH_TEST);

        gl.disable(Gl::CULL_FACE);

        /*
         * Transparent WebGL compositing.
         */
        // gl.enable(Gl::BLEND);
        //
        // gl.blend_func(Gl::SRC_ALPHA, Gl::ONE_MINUS_SRC_ALPHA);
        //
        /*
         * We render one full-screen transparent surface.
         *
         * Do not alpha-blend into the transparent WebGL framebuffer.
         * The browser will composite the canvas itself.
         */
        gl.disable(Gl::BLEND);

        gl.clear_color(0.0, 0.0, 0.0, 0.0);

        Ok(Self {
            gl,

            shader,

            vertex_buffer,

            resolution_uniform,
            pointer_uniform,

            hover_uniform,
            pressed_uniform,

            radius_uniform,
            refraction_uniform,

            presence_uniform,
            presence_velocity_uniform,

            visibility_uniform,
            visibility: 1.0,

            width: 1.0,
            height: 1.0,

            pointer_x: 0.5,
            pointer_y: 0.5,

            pointer_target_x: 0.5,
            pointer_target_y: 0.5,

            hover: 0.0,
            hover_target: 0.0,

            pressed: 0.0,
            pressed_target: 0.0,

            radius: 24.0,
            refraction: 0.55,

            last_render_time: None,

            position_x: 0.0,
            position_target_x: 0.0,
            position_velocity_x: 0.0,

            presence: 1.0,
            presence_target: 1.0,
            presence_velocity: 0.0,

            motion: 0.0,
            motion_target: 0.0,

            velocity_x: 0.0,
            velocity_y: 0.0,

            thickness: 0.55,
            fresnel_strength: 1.0,
            specular_strength: 1.0,
            caustic_strength: 1.0,
            edge_strength: 1.0,

            tint_r: 0.94,
            tint_g: 0.97,
            tint_b: 1.0,

            motion_uniform,

            velocity_uniform,

            thickness_uniform,

            fresnel_strength_uniform,

            specular_strength_uniform,

            caustic_strength_uniform,

            tint_uniform,

            edge_strength_uniform,
        })
    }

    pub fn resize(&mut self, width: f32, height: f32, device_pixel_ratio: f32) {
        /*
         * Keep optical calculations in CSS pixels.
         */
        self.width = width.max(1.0);

        self.height = height.max(1.0);

        let dpr = device_pixel_ratio.clamp(1.0, 2.0);

        let render_width = (self.width * dpr).round().max(1.0) as i32;

        let render_height = (self.height * dpr).round().max(1.0) as i32;

        self.gl.viewport(0, 0, render_width, render_height);
    }

    pub fn set_pointer(&mut self, x: f32, y: f32) {
        self.pointer_target_x = x.clamp(0.0, 1.0);

        self.pointer_target_y = y.clamp(0.0, 1.0);
    }

    pub fn set_hovered(&mut self, hovered: bool) {
        self.hover_target = if hovered { 1.0 } else { 0.0 };
    }

    pub fn set_pressed(&mut self, pressed: bool) {
        self.pressed_target = if pressed { 1.0 } else { 0.0 };
    }

    pub fn set_radius(&mut self, radius: f32) {
        self.radius = radius.max(0.0);
    }

    pub fn set_refraction(&mut self, refraction: f32) {
        self.refraction = refraction.clamp(0.0, 1.0);
    }

    pub fn needs_animation(&self) -> bool {
        const EPSILON: f32 = 0.001;

        (self.pointer_x - self.pointer_target_x).abs() > EPSILON
            || (self.pointer_y - self.pointer_target_y).abs() > EPSILON
            || (self.hover - self.hover_target).abs() > EPSILON
            || (self.pressed - self.pressed_target).abs() > EPSILON
            || (self.motion - self.motion_target).abs() > EPSILON
            || (self.position_x - self.position_target_x).abs() > EPSILON
            || self.position_velocity_x.abs() > EPSILON
            || (self.presence - self.presence_target).abs() > EPSILON
            || self.presence_velocity.abs() > EPSILON
    }

    pub fn render(&mut self, elapsed_seconds: f32) {
        let delta_time = self
            .last_render_time
            .map(|previous| (elapsed_seconds - previous).clamp(0.0, 0.05))
            .unwrap_or(1.0 / 60.0);

        self.last_render_time = Some(elapsed_seconds);

        self.pointer_x = damp(self.pointer_x, self.pointer_target_x, 18.0, delta_time);

        self.pointer_y = damp(self.pointer_y, self.pointer_target_y, 18.0, delta_time);

        self.hover = damp(self.hover, self.hover_target, 14.0, delta_time);

        self.pressed = damp(self.pressed, self.pressed_target, 24.0, delta_time);

        spring_step(
            &mut self.position_x,
            &mut self.position_velocity_x,
            self.position_target_x,
            180.0,
            24.0,
            delta_time,
        );

        spring_step(
            &mut self.presence,
            &mut self.presence_velocity,
            self.presence_target,
            260.0,
            15.0,
            delta_time,
        );

        self.velocity_x = (self.position_velocity_x / 600.0).clamp(-1.0, 1.0);

        self.velocity_y = 0.0;

        self.motion_target = (self.position_velocity_x.abs() / 500.0).clamp(0.0, 1.0);

        self.motion = damp(self.motion, self.motion_target, 12.0, delta_time);

        self.gl.clear(Gl::COLOR_BUFFER_BIT);

        self.gl.use_program(Some(&self.shader.program));

        self.gl
            .bind_buffer(Gl::ARRAY_BUFFER, Some(&self.vertex_buffer));

        self.gl.enable_vertex_attrib_array(0);

        self.gl.vertex_attrib_pointer_with_i32(
            0,
            2,
            Gl::FLOAT,
            false,
            2 * std::mem::size_of::<f32>() as i32,
            0,
        );

        self.gl
            .uniform2f(Some(&self.resolution_uniform), self.width, self.height);

        self.gl
            .uniform2f(Some(&self.pointer_uniform), self.pointer_x, self.pointer_y);

        self.gl.uniform1f(Some(&self.hover_uniform), self.hover);

        self.gl.uniform1f(Some(&self.pressed_uniform), self.pressed);

        self.gl.uniform1f(Some(&self.radius_uniform), self.radius);

        self.gl
            .uniform1f(Some(&self.refraction_uniform), self.refraction);

        self.gl.uniform1f(Some(&self.motion_uniform), self.motion);

        self.gl.uniform2f(
            Some(&self.velocity_uniform),
            self.velocity_x,
            self.velocity_y,
        );

        self.gl
            .uniform1f(Some(&self.thickness_uniform), self.thickness);

        self.gl
            .uniform1f(Some(&self.fresnel_strength_uniform), self.fresnel_strength);

        self.gl.uniform1f(
            Some(&self.specular_strength_uniform),
            self.specular_strength,
        );

        self.gl
            .uniform1f(Some(&self.caustic_strength_uniform), self.caustic_strength);

        self.gl
            .uniform1f(Some(&self.edge_strength_uniform), self.edge_strength);

        self.gl.uniform3f(
            Some(&self.tint_uniform),
            self.tint_r,
            self.tint_g,
            self.tint_b,
        );

        self.gl
            .uniform1f(Some(&self.visibility_uniform), self.visibility);

        self.gl
            .uniform1f(Some(&self.presence_uniform), self.presence);

        let normalized_presence_velocity = (self.presence_velocity / 10.0).clamp(-1.0, 1.0);

        self.gl.uniform1f(
            Some(&self.presence_velocity_uniform),
            normalized_presence_velocity,
        );

        /*
         * Must come AFTER every uniform used
         * by this frame has been uploaded.
         */
        self.gl.draw_arrays(Gl::TRIANGLE_STRIP, 0, 4);
    }

    pub fn set_motion(&mut self, amount: f32) {
        self.motion_target = amount.clamp(0.0, 1.0);
    }

    pub fn set_velocity(&mut self, x: f32, y: f32) {
        self.velocity_x = x.clamp(-1.0, 1.0);

        self.velocity_y = y.clamp(-1.0, 1.0);
    }

    pub fn set_thickness(&mut self, value: f32) {
        self.thickness = value.clamp(0.0, 1.0);
    }

    pub fn set_fresnel_strength(&mut self, value: f32) {
        self.fresnel_strength = value.max(0.0);
    }

    pub fn set_specular_strength(&mut self, value: f32) {
        self.specular_strength = value.max(0.0);
    }

    pub fn set_caustic_strength(&mut self, value: f32) {
        self.caustic_strength = value.max(0.0);
    }

    pub fn set_edge_strength(&mut self, value: f32) {
        self.edge_strength = value.max(0.0);
    }

    pub fn set_visibility(&mut self, value: f32) {
        self.visibility = value.max(0.0);
    }

    pub fn set_tint(&mut self, r: f32, g: f32, b: f32) {
        self.tint_r = r.clamp(0.0, 1.0);

        self.tint_g = g.clamp(0.0, 1.0);

        self.tint_b = b.clamp(0.0, 1.0);
    }

    pub fn set_target_x(&mut self, value: f32) {
        self.position_target_x = value;
    }

    pub fn position_x(&self) -> f32 {
        self.position_x
    }

    pub fn snap_x(&mut self, value: f32) {
        self.position_x = value;
        self.position_target_x = value;
        self.position_velocity_x = 0.0;
    }

    pub fn set_present(&mut self, present: bool) {
        self.presence_target = if present { 1.0 } else { 0.0 };
    }

    pub fn snap_presence(&mut self, value: f32) {
        let value = value.clamp(0.0, 1.0);

        self.presence = value;
        self.presence_target = value;
        self.presence_velocity = 0.0;
    }
}

fn damp(current: f32, target: f32, speed: f32, delta_time: f32) -> f32 {
    current + (target - current) * (1.0 - (-speed * delta_time).exp())
}

fn get_uniform(
    gl: &Gl,
    shader: &ShaderProgram,
    name: &str,
) -> Result<WebGlUniformLocation, JsValue> {
    gl.get_uniform_location(&shader.program, name)
        .ok_or_else(|| JsValue::from_str(&format!("Shader uniform `{name}` was not found",)))
}

fn spring_step(
    value: &mut f32,
    velocity: &mut f32,
    target: f32,
    stiffness: f32,
    damping: f32,
    dt: f32,
) {
    let displacement = target - *value;

    let spring_force = displacement * stiffness;
    let damping_force = -*velocity * damping;

    let acceleration = spring_force + damping_force;

    *velocity += acceleration * dt;
    *value += *velocity * dt;
}
