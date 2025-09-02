#define M_PI 3.14159265358

uniform float uTime;
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uScale;
uniform vec2 uViewport;
uniform float uAlpha;

varying vec2 vUv;

// chunk.
#include "../_chunks/imageuv.glsl"
#include "../_chunks/uv.glsl"

void main(){
  vec2 uv=vUv;
  vec4 color=vec4(0.0);

  vec2 coverUv=coverTexture(uv, uResolution, uScale, false);
  vec4 texCoord=texture2D(uTexture, coverUv);

  gl_FragColor = vec4(texCoord.rgb, uAlpha);
}
