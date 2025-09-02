#include "../_chunks/rgb.glsl"

uniform sampler2D tScene;
uniform sampler2D tFlow;

in vec2 vUv;

out vec4 FragColor;

void main() {
    // R and G values are velocity in the X and Y direction
    // B value is the velocity length
    vec3 flow = texture2D(tFlow, vUv).rgb;

    // Use flow to adjust the UV lookup of a texture
    vec2 uv = vUv - flow.rg * 0.05;

    float angle = length(vUv - 0.5);
    float amount = length(flow.rg) * 0.025;

    vec4 color = getRGB(tScene, uv, angle, amount);

    FragColor = color;
}