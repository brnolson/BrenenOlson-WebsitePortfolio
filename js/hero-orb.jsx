/* global React, THREE */
// NOTE: this file is JSX source. If you edit it, re-run `node compile.cjs`
// to regenerate js/hero-orb.js — the browser loads the compiled .js directly.
//
// Raymarched/displaced shader orb — globally cursor-reactive across the whole page.
// - Bulges toward cursor (shader displacement on the face of the orb pointing at the cursor)
// - Parallax-tilts toward cursor (three-axis rotation follows cursor direction)
// - Intensity falls off softly with distance so the orb reacts even when cursor is far away
// - Pauses its render loop when scrolled out of view
// - Respects window.__QUALITY__ ("low" | "high") and prefers-reduced-motion
const HeroOrb = () => {
  const mountRef = React.useRef(null);

  React.useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const LOW     = (typeof window !== "undefined" && window.__QUALITY__ === "low");
    const REDUCED = (typeof window !== "undefined" && window.__REDUCED_MOTION__);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({ antialias: !LOW, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, LOW ? 1.25 : 2));
    mount.appendChild(renderer.domElement);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // ---- Shader uniforms ----
    // uMouseDir: 2D direction vector (xy) pointing from orb center to cursor.
    //   Magnitude encodes distance in orb-radius units (clamped to ~2.5).
    // uHover:    always-on intensity (0..1), decays softly with distance so the orb stays reactive.
    const uniforms = {
      uTime:     { value: 0 },
      uMouseDir: { value: new THREE.Vector2(0, 0) },
      uHover:    { value: 0.4 },
    };

    const vert = /* glsl */ `
      uniform float uTime;
      uniform vec2 uMouseDir;
      uniform float uHover;
      varying vec3 vNormal;
      varying vec3 vPos;
      varying float vDisp;

      // 3D simplex noise (Ian McEwan / Ashima)
      vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
      float snoise(vec3 v){
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + 2.0 * C.xxx;
        vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
        i = mod(i, 289.0);
        vec4 p = permute(permute(permute(
                  i.z + vec4(0.0, i1.z, i2.z, 1.0))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 1.0/7.0;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m*m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      void main() {
        vNormal = normalize(normalMatrix * normal);
        float t = uTime * 0.35;
        float n  = snoise(position * 1.6 + vec3(t, t*0.8, -t*0.5));
        float n2 = snoise(position * 3.5 - vec3(t*1.3, -t, t*0.6));
        float disp = n * 0.28 + n2 * 0.08;

        // Cursor-directed bulge: the face of the orb pointing toward the cursor
        // swells outward; the strength falls off with the cursor's distance from the orb center.
        vec3 cursorDir = normalize(vec3(uMouseDir, 0.9));
        float align = max(0.0, dot(normalize(position), cursorDir));
        float proximity = 1.0 / (1.0 + length(uMouseDir) * 0.6);
        float bulge = pow(align, 2.5) * uHover * proximity * 0.42;
        disp += bulge;

        vDisp = disp;
        vec3 pos = position + normal * disp;
        vPos = pos;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const frag = /* glsl */ `
      precision highp float;
      uniform float uTime;
      uniform vec2 uMouseDir;
      uniform float uHover;
      varying vec3 vNormal;
      varying vec3 vPos;
      varying float vDisp;

      vec3 palette(float t) {
        // violet -> cyan -> magenta iridescent
        vec3 a = vec3(0.45, 0.20, 0.75);
        vec3 b = vec3(0.25, 0.75, 1.00);
        vec3 c = vec3(1.00, 0.30, 0.95);
        vec3 d = vec3(0.55, 0.35, 0.90);
        return a + b * cos(6.28318 * (c * t + d));
      }

      void main() {
        vec3 viewDir = normalize(-vPos);
        float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.2);
        vec3 base = palette(vDisp * 2.0 + uTime * 0.05);
        vec3 rim  = vec3(0.55, 0.75, 1.0) * fresnel * 1.4;
        vec3 color = mix(base * 0.35, base, fresnel * 0.9);
        color += rim;

        // cursor-tinted highlight on the bulging face
        vec3 cursorDir = normalize(vec3(uMouseDir, 0.9));
        float align = max(0.0, dot(normalize(vPos), cursorDir));
        color += vec3(0.45, 0.35, 0.85) * pow(align, 4.0) * 0.6 * uHover;

        // subtle scan lines
        color += 0.03 * sin(vPos.y * 80.0 + uTime * 2.0);
        gl_FragColor = vec4(color, 0.95);
      }
    `;

    const MAIN_SUB = LOW ? 32 : 64;
    const WIRE_SUB = LOW ? 10 : 16;
    const geo = new THREE.IcosahedronGeometry(1, MAIN_SUB);
    const mat = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms, transparent: true });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.08 });
    const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.02, WIRE_SUB), wireMat);
    scene.add(wire);

    // particle halo
    const pCount = LOW ? 150 : 400;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const r = 1.6 + Math.random() * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPos[i * 3 + 2] = r * Math.cos(phi);
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x9bc8ff, size: 0.015, transparent: true, opacity: 0.7 });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    // ---- GLOBAL cursor tracking ----
    // Convert page-wide cursor coords into orb-local units (where 1 == orb radius).
    const targetDir = new THREE.Vector2(0, 0);    // smoothed target for shader
    const rawDir = new THREE.Vector2(0, 0);       // latest raw dir
    const parallaxTarget = { x: 0, y: 0 };        // target tilt in radians
    const parallaxCurrent = { x: 0, y: 0 };       // smoothed tilt

    const onMove = (e) => {
      const rect = mount.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      // Normalize by the orb's half-width so "1 unit" == one orb-radius on screen.
      const r = Math.max(1, rect.width / 2);
      const dx = (e.clientX - cx) / r;
      const dy = -(e.clientY - cy) / r;
      // Clamp so far-off cursors don't blow up bulge math
      const m = Math.hypot(dx, dy);
      const maxM = 5.5;
      const k = m > maxM ? maxM / m : 1;
      rawDir.set(dx * k, dy * k);
      // Parallax tilt: small rotation toward the cursor, attenuated by distance.
      const falloff = 1 / (1 + m * 0.7);
      parallaxTarget.y = Math.max(-0.4, Math.min(0.4, dx * 0.25 * falloff));
      parallaxTarget.x = Math.max(-0.4, Math.min(0.4, -dy * 0.25 * falloff));
      // Hover intensity: strong near, still visible far
      uniforms.uHover.value = 0.35 + 0.65 * falloff;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    // Touch: use the first touch for mobile
    const onTouch = (e) => {
      if (e.touches && e.touches[0]) {
        onMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
      }
    };
    window.addEventListener("touchmove", onTouch, { passive: true });

    // --- Visibility: pause rendering when the hero is off-screen ---
    let visible = true;
    const vio = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    vio.observe(mount);

    let raf, last = performance.now();
    const loop = (t) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;

      // If scrolled off, skip render work entirely
      if (!visible) {
        raf = requestAnimationFrame(loop);
        return;
      }

      uniforms.uTime.value += dt;

      // Smooth the shader direction toward the raw cursor target
      targetDir.x += (rawDir.x - targetDir.x) * Math.min(1, dt * 8);
      targetDir.y += (rawDir.y - targetDir.y) * Math.min(1, dt * 8);
      uniforms.uMouseDir.value.copy(targetDir);

      // Smooth parallax tilt
      parallaxCurrent.x += (parallaxTarget.x - parallaxCurrent.x) * Math.min(1, dt * 5);
      parallaxCurrent.y += (parallaxTarget.y - parallaxCurrent.y) * Math.min(1, dt * 5);

      mesh.rotation.y += dt * 0.18;
      mesh.rotation.x += dt * 0.08;
      // Apply parallax as an additional rotation on top of the idle spin
      mesh.rotation.x += parallaxCurrent.x * dt * 4;
      mesh.rotation.y += parallaxCurrent.y * dt * 4;

      wire.rotation.y -= dt * 0.12;
      wire.rotation.x += dt * 0.05;
      points.rotation.y += dt * 0.06;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };

    if (REDUCED) {
      // Render a single static frame, then stop.
      renderer.render(scene, camera);
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      vio.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      wireMat.dispose();
      pGeo.dispose();
      pMat.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />;
};

window.HeroOrb = HeroOrb;
