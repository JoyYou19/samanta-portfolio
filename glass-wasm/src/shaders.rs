pub const GLASS_VERTEX_SHADER: &str = r#"#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;

out vec2 v_uv;

void main() {
    v_uv =
        a_position * 0.5 + 0.5;

    gl_Position =
        vec4(
            a_position,
            0.0,
            1.0
        );
}
"#;

pub const GLASS_FRAGMENT_SHADER: &str = r#"#version 300 es
precision highp float;

in vec2 v_uv;


/*
 * Geometry / interaction.
 */
uniform vec2 u_resolution;
uniform vec2 u_pointer;

uniform float u_hover;
uniform float u_pressed;

uniform float u_radius;
uniform float u_refraction;

uniform float u_visibility;

uniform float u_presence;
uniform float u_presence_velocity;


/*
 * Motion.
 *
 * u_motion:
 *   0 = stationary
 *   1 = strongly moving
 *
 * u_velocity:
 *   normalized-ish movement vector
 *   in component-local screen space.
 *
 *   x:
 *     -1 = left
 *      1 = right
 *
 *   y:
 *     -1 = up
 *      1 = down
 */
uniform float u_motion;
uniform vec2 u_velocity;


/*
 * Material controls.
 */
uniform float u_thickness;

uniform float u_fresnel_strength;
uniform float u_specular_strength;
uniform float u_caustic_strength;
uniform float u_edge_strength;

uniform vec3 u_tint;


out vec4 out_color;


/*
 * Signed distance to a rounded rectangle.
 *
 * Negative = inside.
 * Zero     = exact surface edge.
 * Positive = outside.
 */
float rounded_box_sdf(
    vec2 point,
    vec2 half_size,
    float radius
) {
    vec2 q =
        abs(point) -
        half_size +
        radius;

    return
        min(
            max(q.x, q.y),
            0.0
        ) +
        length(
            max(q, 0.0)
        ) -
        radius;
}


/*
 * Safe 2D normalization.
 */
vec2 safe_normalize(
    vec2 value
) {
    float magnitude =
        length(value);

    if (magnitude < 0.0001) {
        return vec2(0.0);
    }

    return
        value /
        magnitude;
}


void main() {
    /*
     * ------------------------------------------------------------
     * Component coordinates
     * ------------------------------------------------------------
     */

    vec2 size =
        max(
            u_resolution,
            vec2(1.0)
        );

    vec2 pixel =
        v_uv *
        size;

    vec2 center =
        size *
        0.5;

    vec2 point =
        pixel -
        center;

/*
 * ------------------------------------------------------------
 * Motion state
 * ------------------------------------------------------------
 */

vec2 velocity =
    clamp(
        u_velocity,
        vec2(-1.0),
        vec2(1.0)
    );

float velocity_amount =
    clamp(
        length(velocity),
        0.0,
        1.0
    );

vec2 velocity_direction =
    velocity_amount > 0.001
        ? normalize(velocity)
        : vec2(1.0, 0.0);

float motion_amount =
    clamp(
        u_motion,
        0.0,
        1.0
    );

/*
 * Smooth deformation response.
 */
float deformation =
    smoothstep(
        0.0,
        1.0,
        motion_amount
    );


/*
 * ------------------------------------------------------------
 * Liquid shape
 * ------------------------------------------------------------
 *
 * IMPORTANT:
 *
 * Do not squash fragment coordinates with scaleX/scaleY.
 * Instead change the rounded-box dimensions themselves.
 *
 * This preserves the curved top/bottom and rounded ends.
 */

/*
 * Resting glass dimensions.
 *
 * This assumes the render canvas has transparent padding
 * around a resting 110x76 lens.
 */
vec2 base_half_size =
    size * 0.5;


/*
 * ------------------------------------------------------------
 * Presence / appearance bobble
 * ------------------------------------------------------------
 *
 * Rust drives an underdamped presence spring.
 *
 * Positive spring velocity:
 *     droplet is expanding
 *     -> wider and flatter
 *
 * Negative spring velocity:
 *     spring rebounds
 *     -> narrower and taller
 *
 * This creates:
 *
 * tiny
 *   -> wide splash
 *   -> tall rebound
 *   -> settle
 */

float presence =
    clamp(
        u_presence,
        0.0,
        1.15
    );

float presence_progress =
    smoothstep(
        0.0,
        1.0,
        clamp(
            presence,
            0.0,
            1.0
        )
    );

float presence_velocity =
    clamp(
        u_presence_velocity,
        -1.0,
        1.0
    );

/*
 * Never let the SDF literally collapse to zero.
 *
 * Alpha will hide it at presence = 0.
 */
float base_appear_scale =
    mix(
        0.035,
        1.0,
        presence_progress
    );

/*
 * Exaggerated liquid expansion.
 *
 * While appearing, positive velocity makes
 * the bubble spread sideways.
 *
 * On the spring rebound, negative velocity
 * makes it briefly taller.
 */
float appear_scale_x =
    base_appear_scale *
    (
        1.0 +
        presence_velocity *
        0.34
    );

float appear_scale_y =
    base_appear_scale *
    (
        1.0 -
        presence_velocity *
        0.24
    );

/*
 * Protect against an extreme spring frame.
 */
appear_scale_x =
    max(
        appear_scale_x,
        0.05
    );

appear_scale_y =
    max(
        appear_scale_y,
        0.05
    );

vec2 appearing_half_size =
    base_half_size *
    vec2(
        appear_scale_x,
        appear_scale_y
    );


/*
 * ------------------------------------------------------------
 * Movement deformation
 * ------------------------------------------------------------
 */

float stretch_amount =
    base_half_size.x *
    deformation *
    0.11;

float squash_amount =
    base_half_size.y *
    deformation *
    0.22;

vec2 liquid_half_size =
    vec2(
        appearing_half_size.x +
            stretch_amount,

        appearing_half_size.y -
            squash_amount *
            presence_progress
    );

/*
 * ------------------------------------------------------------
 * Liquid corner roundness
 * ------------------------------------------------------------
 *
 * During appearance/disappearance the shape should
 * behave like a droplet, not a shrinking rectangle.
 *
 * Therefore:
 *
 *   disappearing / appearing -> maximum possible rounding
 *   fully settled            -> requested u_radius
 *
 * Spring velocity also temporarily increases rounding
 * while the bubble is wobbling.
 */

float maximum_liquid_radius =
    max(
        min(
            liquid_half_size.x,
            liquid_half_size.y
        ),
        0.01
    );

/*
 * Normal radius at rest.
 */
float resting_liquid_radius =
    min(
        u_radius,
        maximum_liquid_radius
    );

/*
 * Stay strongly rounded for most of the
 * appearance/disappearance transition.
 *
 * Only near full presence do we transition
 * back toward the normal component radius.
 */
float presence_rounding =
    1.0 -
    smoothstep(
        0.62,
        1.0,
        presence_progress
    );

/*
 * The spring rebound itself also makes the
 * shape temporarily more droplet-like.
 */
float velocity_rounding =
    clamp(
        abs(presence_velocity) *
        0.65,
        0.0,
        1.0
    );

float liquid_rounding =
    max(
        presence_rounding,
        velocity_rounding
    );

float liquid_radius =
    mix(
        resting_liquid_radius,
        maximum_liquid_radius,
        liquid_rounding
    );


/*
 * ------------------------------------------------------------
 * Directional liquid drag
 * ------------------------------------------------------------
 */

vec2 deformed_point =
    point;

float point_length =
    length(point);

vec2 radial_direction_for_shape =
    point_length > 0.001
        ? point / point_length
        : vec2(0.0);

/*
 * Rear side of the moving droplet.
 */
float trailing_shape =
    max(
        dot(
            radial_direction_for_shape,
            -velocity_direction
        ),
        0.0
    );

/*
 * Leading side.
 */
float leading_shape =
    max(
        dot(
            radial_direction_for_shape,
            velocity_direction
        ),
        0.0
    );

/*
 * Rear lag.
 *
 * Squaring trailing_shape concentrates the
 * deformation toward the rear-most part.
 */
deformed_point -=
    velocity_direction *
    trailing_shape *
    trailing_shape *
    deformation *
    7.0;

/*
 * Slight leading bulge.
 */
deformed_point +=
    velocity_direction *
    leading_shape *
    deformation *
    2.5;


/*
 * ------------------------------------------------------------
 * Signed distance
 * ------------------------------------------------------------
 */

float sdf =
    rounded_box_sdf(
        deformed_point,
        liquid_half_size,
        liquid_radius
    );



    /*
     * ------------------------------------------------------------
     * Shape mask
     * ------------------------------------------------------------
     */

    float aa =
        max(
            fwidth(sdf),
            0.65
        );

    float mask =
        1.0 -
        smoothstep(
            -aa,
            aa,
            sdf
        );

    if (mask <= 0.001) {
        discard;
    }


    /*
     * Distance moving inward from the surface.
     */
    float inside_distance =
        max(
            -sdf,
            0.0
        );


    /*
     * ------------------------------------------------------------
     * Surface zones
     * ------------------------------------------------------------
     */


    /*
     * Broad curved edge region.
     *
     * 1 at the outer edge,
     * fading toward 0 deeper inside.
     */
float edge =
    1.0 -
    smoothstep(
        0.0,
        max(
            liquid_radius * 0.95,
            1.0
        ),
        inside_distance
    );


    /*
     * Very narrow polished physical edge.
     */
    float physical_edge =
        1.0 -
        smoothstep(
            0.0,
            1.35,
            abs(sdf)
        );


    /*
     * Wider inner boundary.
     */
    float inner_rim =
        1.0 -
        smoothstep(
            0.0,
            mix(
                5.0,
                10.0,
                u_thickness
            ),
            inside_distance
        );


    /*
     * Secondary interior optical layer.
     *
     * This helps sell the impression that
     * the material has actual thickness,
     * rather than being a simple outline.
     */
    float inner_surface_start =
        mix(
            1.5,
            3.0,
            u_thickness
        );

    float inner_surface_peak =
        mix(
            5.0,
            9.0,
            u_thickness
        );

    float inner_surface_end =
        mix(
            11.0,
            19.0,
            u_thickness
        );


    float inner_surface =
        smoothstep(
            inner_surface_start,
            inner_surface_peak,
            inside_distance
        ) *
        (
            1.0 -
            smoothstep(
                inner_surface_peak,
                inner_surface_end,
                inside_distance
            )
        );


    /*
     * ------------------------------------------------------------
     * Normalized shape position
     * ------------------------------------------------------------
     */

vec2 normalized =
    deformed_point /
    max(
        liquid_half_size,
        vec2(1.0)
    );


    /*
     * Correct horizontal coordinates for
     * strongly non-square components.
     *
     * This avoids a 500×70 navbar behaving
     * optically like a stretched circle.
     */
    float aspect =
        size.x /
        max(
            size.y,
            1.0
        );

    vec2 optical_position =
        vec2(
            normalized.x *
            min(
                aspect,
                4.0
            ) *
            0.34,

            normalized.y
        );


    /*
     * ------------------------------------------------------------
     * Glass curvature
     * ------------------------------------------------------------
     */

    float curvature =
        pow(
            clamp(
                edge,
                0.0,
                1.0
            ),
            mix(
                1.95,
                1.35,
                u_thickness
            )
        );


    /*
     * Base refraction/curvature amount.
     */
    float optical_strength =
        mix(
            0.20,
            1.30,
            clamp(
                u_refraction,
                0.0,
                1.0
            )
        );


    /*
     * Thicker glass bends more strongly.
     */
    optical_strength *=
        mix(
            0.72,
            1.30,
            clamp(
                u_thickness,
                0.0,
                1.0
            )
        );


    /*
     * Moving glass temporarily appears
     * optically denser.
     */
    optical_strength *=
        1.0 +
        motion_amount *
        0.22;


    vec2 surface_offset =
        optical_position *
        curvature *
        optical_strength;


    /*
     * Slight optical drag opposite the
     * direction of movement.
     */
    surface_offset +=
        -velocity_direction *
        edge *
        velocity_amount *
        motion_amount *
        0.12;


    /*
     * Pressing physically flattens the
     * surface a little.
     */
    surface_offset *=
        mix(
            1.0,
            0.90,
            u_pressed
        );


    vec3 normal =
        normalize(
            vec3(
                surface_offset.x,
                -surface_offset.y,
                1.0
            )
        );


    /*
     * ------------------------------------------------------------
     * Light
     * ------------------------------------------------------------
     */

    vec3 view_direction =
        vec3(
            0.0,
            0.0,
            1.0
        );

    /*
     * Base studio/window light.
     */
    vec3 studio_light =
        normalize(
            vec3(
                -0.42,
                0.58,
                1.15
            )
        );

    /*
     * Pointer position in component pixels.
     */
    vec2 pointer_pixel =
        u_pointer *
        size;

    /*
     * Vector from this fragment toward pointer.
     */
    vec2 direction_to_pointer =
        pointer_pixel -
        pixel;

    /*
     * Pretend the pointer light floats above
     * the glass surface rather than lying
     * directly on it.
     */
    float pointer_light_height =
        max(
            min(
                size.x,
                size.y
            ) *
            0.86,
            28.0
        );

    vec3 pointer_light =
        normalize(
            vec3(
                direction_to_pointer,
                pointer_light_height
            )
        );

    /*
     * Stationary surfaces use the broad studio light.
     *
     * Interactive surfaces gradually bend the light
     * toward the pointer while hovered.
     */
    vec3 light_direction =
        normalize(
            mix(
                studio_light,
                pointer_light,
                u_hover * 0.35
            )
        );

    /*
     * ------------------------------------------------------------
     * Fresnel
     * ------------------------------------------------------------
     */

    float facing =
        clamp(
            dot(
                normal,
                view_direction
            ),
            0.0,
            1.0
        );


    float fresnel =
        pow(
            1.0 -
            facing,
            mix(
                4.0,
                2.7,
                u_thickness
            )
        );


    /*
     * Fresnel is strengthened slightly around
     * the physical boundary.
     */
    fresnel =
        max(
            fresnel,
            physical_edge *
            0.20 *
            u_thickness
        );


    /*
     * ------------------------------------------------------------
     * Specular reflections
     * ------------------------------------------------------------
     */

    vec3 half_direction =
        normalize(
            light_direction +
            view_direction
        );


    float n_dot_h =
        max(
            dot(
                normal,
                half_direction
            ),
            0.0
        );


    /*
     * Tight polished highlight.
     */
    float specular =
        pow(
            n_dot_h,
            mix(
                92.0,
                58.0,
                u_thickness
            )
        );


    /*
     * Broad reflection.
     */
    float soft_specular =
        pow(
            n_dot_h,
            14.0
        );


    /*
     * Extremely broad sheen.
     */
    float sheen =
        pow(
            n_dot_h,
            8.0
        );


    /*
     * ------------------------------------------------------------
     * Caustics
     * ------------------------------------------------------------
     */

    float caustic =
        pow(
            clamp(
                edge,
                0.0,
                1.0
            ),
            mix(
                4.3,
                3.0,
                u_thickness
            )
        );


    vec2 radial_direction =
        safe_normalize(
            optical_position
        );


    /*
     * Trailing side receives compressed
     * warm light during movement.
     */
    float trailing_edge =
        max(
            dot(
                radial_direction,
                -velocity_direction
            ),
            0.0
        );


    /*
     * Leading side receives a cooler
     * stretched reflection.
     */
    float leading_edge =
        max(
            dot(
                radial_direction,
                velocity_direction
            ),
            0.0
        );


    float directional_caustic =
        trailing_edge *
        velocity_amount *
        motion_amount;


    float directional_leading =
        leading_edge *
        velocity_amount *
        motion_amount;


    /*
     * ------------------------------------------------------------
     * Top / bottom asymmetry
     * ------------------------------------------------------------
     *
     * Perfectly symmetrical glass often
     * looks computer-generated.
     */

    float top_bias =
        clamp(
            0.5 -
            normalized.y *
            0.5,
            0.0,
            1.0
        );


    float bottom_bias =
        1.0 -
        top_bias;


    /*
     * Slight directional lighting from
     * upper-left independent of pointer.
     */
    float upper_left =
        clamp(
            (
                1.0 -
                normalized.x
            ) *
            (
                1.0 -
                normalized.y
            ) *
            0.25,
            0.0,
            1.0
        );


    /*
     * ------------------------------------------------------------
     * Interactive material response
     * ------------------------------------------------------------
     */

    float interactive_strength =
        1.0 +
        u_hover *
        0.18 +
        u_pressed *
        0.08;


    /*
     * ------------------------------------------------------------
     * Colors
     * ------------------------------------------------------------
     */

    vec3 white =
        vec3(1.0);


    vec3 cool_reflection =
        mix(
            vec3(
                0.80,
                0.90,
                1.00
            ),
            u_tint,
            0.18
        );


    vec3 warm_reflection =
        vec3(
            1.00,
            0.94,
            0.84
        );


    vec3 neutral_reflection =
        vec3(
            0.94,
            0.97,
            0.99
        );


    /*
     * ------------------------------------------------------------
     * Body
     * ------------------------------------------------------------
     *
     * Keep this weak.
     *
     * CSS backdrop-filter is responsible for
     * the actual background material.
     */

    vec3 base_color =
        u_tint *
        mix(
            0.009,
            0.022,
            u_thickness
        );

    vec3 color =
        base_color;


    /*
     * Very soft overall sheen.
     */
    color +=
        neutral_reflection *
        sheen *
        0.004 *
        u_specular_strength;


    /*
     * ------------------------------------------------------------
     * Fresnel edge
     * ------------------------------------------------------------
     */

    color +=
        cool_reflection *
        fresnel *
        0.18 *
        interactive_strength *
        u_fresnel_strength;


    /*
     * ------------------------------------------------------------
     * Sharp specular highlight
     * ------------------------------------------------------------
     */

    color +=
        white *
        specular *
        mix(
            0.13,
            0.29,
            u_hover
        ) *
        u_specular_strength;


    /*
     * Motion increases sharp highlight
     * without blowing it out.
     */
    color +=
        white *
        specular *
        motion_amount *
        0.055 *
        u_specular_strength;


    /*
     * ------------------------------------------------------------
     * Broad reflection
     * ------------------------------------------------------------
     */

    color +=
        white *
        soft_specular *
        0.024 *
        u_specular_strength;


    /*
     * ------------------------------------------------------------
     * Warm edge caustic
     * ------------------------------------------------------------
     */

    color +=
        warm_reflection *
        caustic *
        (
            0.045 +
            directional_caustic *
            0.095
        ) *
        u_caustic_strength;


    /*
     * ------------------------------------------------------------
     * Cool leading movement edge
     * ------------------------------------------------------------
     */

    color +=
        cool_reflection *
        directional_leading *
        edge *
        0.060 *
        u_caustic_strength;


    /*
     * ------------------------------------------------------------
     * Physical polished boundary
     * ------------------------------------------------------------
     */

    color +=
        white *
        physical_edge *
        (
            0.19 +
            top_bias *
            0.15
        ) *
        u_edge_strength;


    /*
     * Cooler lower edge keeps the material
     * from looking like a flat white border.
     */
    color +=
        cool_reflection *
        physical_edge *
        bottom_bias *
        0.042 *
        u_edge_strength;


    /*
     * ------------------------------------------------------------
     * Inner refraction boundary
     * ------------------------------------------------------------
     */

    color +=
        cool_reflection *
        inner_rim *
        edge *
        0.050 *
        u_edge_strength *
        mix(
            0.7,
            1.2,
            u_thickness
        );


    /*
     * ------------------------------------------------------------
     * Secondary inner surface
     * ------------------------------------------------------------
     */

    color +=
        cool_reflection *
        inner_surface *
        0.034 *
        u_thickness *
        u_edge_strength;


    /*
     * Slight warm counterpart below.
     */
    color +=
        warm_reflection *
        inner_surface *
        bottom_bias *
        0.014 *
        u_thickness *
        u_caustic_strength;


    /*
     * ------------------------------------------------------------
     * Fixed upper-left reflection
     * ------------------------------------------------------------
     */

    color +=
        white *
        upper_left *
        edge *
        0.028 *
        u_specular_strength;


    /*
     * ------------------------------------------------------------
     * Press response
     * ------------------------------------------------------------
     */

    color +=
        white *
        u_pressed *
        0.016;


    /*
     * Press creates a little more light
     * around the internal boundary.
     */
    color +=
        cool_reflection *
        inner_rim *
        u_pressed *
        0.025;

    /*
     * ------------------------------------------------------------
     * Overall optical visibility
     * ------------------------------------------------------------
     *
     * Keep the base material unchanged, but scale
     * all reflected/refractive-looking contributions together.
     */
    vec3 optical_color =
        color -
        base_color;

    color =
        base_color +
        optical_color *
        u_visibility;

    /*
     * ------------------------------------------------------------
     * Alpha
     * ------------------------------------------------------------
     *
     * The material should remain relatively
     * clear. Most opacity lives in its optical
     * boundaries rather than in the center.
     */

    float base_alpha =
        mix(
            0.008,
            0.020,
            u_thickness
        );

    float alpha =
        base_alpha;


    alpha +=
        fresnel *
        0.105 *
        u_fresnel_strength;


    alpha +=
        specular *
        0.16 *
        u_specular_strength;


    alpha +=
        soft_specular *
        0.012 *
        u_specular_strength;


    alpha +=
        physical_edge *
        0.18 *
        u_edge_strength;


    alpha +=
        inner_rim *
        edge *
        0.030 *
        u_edge_strength;


    alpha +=
        inner_surface *
        0.022 *
        u_thickness *
        u_edge_strength;


    alpha +=
        directional_caustic *
        edge *
        0.030 *
        u_caustic_strength;


    alpha +=
        u_pressed *
        0.008;

    float optical_alpha =
        alpha -
        base_alpha;

    alpha =
        base_alpha +
        optical_alpha *
        u_visibility;


    /*
     * Final shape clipping.
     */
    alpha *=
        mask;

/*
 * Presence controls actual material visibility.
 *
 * Geometry performs the bobble,
 * while alpha cleanly fades the final remnants.
 */
alpha *=
    smoothstep(
        0.0,
        0.22,
        clamp(
            u_presence,
            0.0,
            1.0
        )
    );


    /*
     * Avoid overly bright RGB values from
     * stacking multiple reflections.
     */
    alpha =
        clamp(
            alpha,
            0.0,
            1.0
        );

    /*
     * The lighting equations above accumulate something
     * much closer to premultiplied light energy.
     *
     * Our WebGL context uses premultipliedAlpha=false,
     * so convert it back to a straight-alpha color
     * before giving it to the browser compositor.
     */
/*
 * Browser compositing uses premultiplied alpha.
 *
 * Keep RGB bounded by alpha so transparent pixels
 * cannot contain bright RGB energy. This is especially
 * important for Safari/WebKit compositing.
 */
vec3 premultiplied_color =
    clamp(
        color,
        vec3(0.0),
        vec3(alpha)
    );

out_color =
    vec4(
        premultiplied_color,
        alpha
    );
}
"#;
