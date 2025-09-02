#define M_PI 3.14159265358

uniform float uTime;
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uScale;
uniform vec2 uViewport;
uniform float uProgressAlpha;

varying vec2 vUv;

// chunk.
#include "../_chunks/imageuv.glsl"
#include "../_chunks/uv.glsl"

float r(float s, float t) {
  float u = fwidth(t);
  return smoothstep(s-u, s+u, t);
}

void main(){
  vec2 uv=vUv;
  vec4 color=vec4(0.0);

  vec2 coverUv=coverTexture(uv, uResolution, uScale, false);
  vec4 txt=texture2D(uTexture, coverUv);

  float opacity = uProgressAlpha;
  vec2 area = vec2(1.0, 1.0);
  float hoverZone = r(area.x, 1.-uv.y)*r(area.y, uv.y);
  hoverZone *= r(area.x, uv.x)*r(area.y, 1.-uv.x);
  opacity *= hoverZone;

  gl_FragColor = vec4(txt.rgb, uProgressAlpha);
}
