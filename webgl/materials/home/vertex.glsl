#define PI 3.1415926538

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uViewport;
uniform vec2 uScale;

varying vec2 vUv;

void main(){
  vec4 mvPosition=modelViewMatrix*vec4(position,1.);
  
  gl_Position=projectionMatrix*mvPosition;
  
  vUv=uv;
}
