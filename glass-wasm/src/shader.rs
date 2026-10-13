use wasm_bindgen::JsValue;
use web_sys::{
    WebGl2RenderingContext as Gl,
    WebGlProgram,
    WebGlShader,
};

pub struct ShaderProgram {
    pub program: WebGlProgram,
}

impl ShaderProgram {
    pub fn new(
        gl: &Gl,
        vertex_source: &str,
        fragment_source: &str,
    ) -> Result<Self, JsValue> {
        let vertex_shader =
            compile_shader(
                gl,
                Gl::VERTEX_SHADER,
                vertex_source,
            )?;

        let fragment_shader =
            compile_shader(
                gl,
                Gl::FRAGMENT_SHADER,
                fragment_source,
            )?;

        let program =
            link_program(
                gl,
                &vertex_shader,
                &fragment_shader,
            )?;

        gl.delete_shader(Some(&vertex_shader));
        gl.delete_shader(Some(&fragment_shader));

        Ok(Self { program })
    }
}

fn compile_shader(
    gl: &Gl,
    shader_type: u32,
    source: &str,
) -> Result<WebGlShader, JsValue> {
    let shader = gl
        .create_shader(shader_type)
        .ok_or_else(|| {
            JsValue::from_str(
                "Could not create WebGL shader",
            )
        })?;

    gl.shader_source(
        &shader,
        source,
    );

    gl.compile_shader(
        &shader,
    );

    let compiled = gl
        .get_shader_parameter(
            &shader,
            Gl::COMPILE_STATUS,
        )
        .as_bool()
        .unwrap_or(false);

    if compiled {
        return Ok(shader);
    }

    let log = gl
        .get_shader_info_log(&shader)
        .unwrap_or_else(|| {
            "Unknown shader compilation error".into()
        });

    gl.delete_shader(Some(&shader));

    Err(
        JsValue::from_str(&log)
    )
}

fn link_program(
    gl: &Gl,
    vertex_shader: &WebGlShader,
    fragment_shader: &WebGlShader,
) -> Result<WebGlProgram, JsValue> {
    let program = gl
        .create_program()
        .ok_or_else(|| {
            JsValue::from_str(
                "Could not create WebGL program",
            )
        })?;

    gl.attach_shader(
        &program,
        vertex_shader,
    );

    gl.attach_shader(
        &program,
        fragment_shader,
    );

    gl.link_program(
        &program,
    );

    let linked = gl
        .get_program_parameter(
            &program,
            Gl::LINK_STATUS,
        )
        .as_bool()
        .unwrap_or(false);

    if linked {
        return Ok(program);
    }

    let log = gl
        .get_program_info_log(&program)
        .unwrap_or_else(|| {
            "Unknown WebGL linking error".into()
        });

    gl.delete_program(Some(&program));

    Err(
        JsValue::from_str(&log)
    )
}
