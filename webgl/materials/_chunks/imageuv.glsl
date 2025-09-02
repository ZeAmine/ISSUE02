/*
Resize image to Cover
uv : uv coord
size : image size
resolution : plane resolution | screen resolution
*/

vec2 coverTexture(vec2 uv,vec2 imageSize,vec2 planeSize,bool fitHeight){
  float imgAsp=imageSize.x/imageSize.y;
  float plnAsp=planeSize.x/planeSize.y;
  bool match=imgAsp>plnAsp;
  if(fitHeight){
    match=imgAsp<plnAsp;
  }
  if(match){
    uv.x=uv.x*plnAsp/imgAsp+(1.-plnAsp/imgAsp)*.5;
  }
  else{
    uv.y=uv.y*imgAsp/plnAsp+(1.-imgAsp/plnAsp)*.5;
  }
  return uv;
}

vec2 imageUV(vec2 uv,vec2 size,vec2 resolution){
  vec2 ratio=vec2(
    min((resolution.x/resolution.y)/(size.x/size.y),1.),
    min((resolution.y/resolution.x)/(size.y/size.x),1.)
  );
  
  return vec2(
    uv.x*ratio.x+(1.-ratio.x)*.5,
    uv.y*ratio.y+(1.-ratio.y)*.5
  );
}

vec2 gu(vec2 uv,vec2 ns,vec2 ps){
  vec2 tu=uv-vec2(.5);
  float pa=ps.x/ps.y;
  float ta=ns.x/ns.y;
  if(pa<ta){
    tu*=vec2(ta/pa,1.);
  }else{
    tu*=vec2(1.,pa/ta);
  }
  tu+=vec2(.5);
  return tu;
}

// contain
vec2 getContainUv(vec2 uv,vec2 textureSize,vec2 quadSize){
  vec2 tempUv=uv-vec2(.5);
  
  float quadAspect=quadSize.x/quadSize.y;
  float textureAspect=textureSize.x/textureSize.y;
  
  if(quadAspect>textureAspect){
    tempUv*=vec2(quadAspect/textureAspect,1.);
  }else{
    tempUv*=vec2(1.,textureAspect/quadAspect);
  }
  
  tempUv+=vec2(.5);
  
  return tempUv;
}

// cover
vec2 getCoverUvVert(vec2 uv,vec2 textureSize,vec2 quadSize){
  vec2 ratio=vec2(
    min((quadSize.x/quadSize.y)/(textureSize.x/textureSize.y),1.),
    min((quadSize.y/quadSize.x)/(textureSize.y/textureSize.x),1.)
  );
  
  return vec2(
    uv.x*ratio.x+(1.-ratio.x)*.5,
    uv.y*ratio.y+(1.-ratio.y)*.5
  );
}

vec2 getCoverUvFrag(vec2 uv,vec2 textureSize,vec2 quadSize){
  vec2 tempUv=uv-vec2(.5);
  
  float quadAspect=quadSize.x/quadSize.y;
  float textureAspect=textureSize.x/textureSize.y;
  
  if(quadAspect<textureAspect){
    tempUv*=vec2(quadAspect/textureAspect,1.);
  }else{
    tempUv*=vec2(1.,textureAspect/quadAspect);
  }
  
  tempUv+=vec2(.5);
  
  return tempUv;
}
