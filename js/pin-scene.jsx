/* global React, THREE */
// NOTE: this file is JSX source. If you edit it, re-run `node compile.cjs`
// to regenerate js/pin-scene.js — the browser loads the compiled .js directly.
//
// Pinned-scroll anatomy journey (graphics demo, not a claim about medical expertise).
// Six chapters mapped across progress 0..6:
//   0-1: eukaryotic cell overview — membrane, nucleus, mitochondria, ER, ribosomes
//   1-2: zoom into the nucleus; cell fades out, DNA helix fades in
//   2-3: helix → focus on one ladder rung
//   3-4: rung splits into labeled Adenine / Thymine halves (real cylindrical ladder rungs)
//   4-5: zoom further into a single nucleotide — phosphate, sugar, base labeled
//   5-6: reassemble back to the full double helix
//
// Every rung is a real 3D cylinder (not a line), wired between the two backbone strands.

const PinScene = ({ progress }) => {
  const mountRef = React.useRef(null);
  const pRef = React.useRef(progress);
  React.useEffect(() => { pRef.current = progress; }, [progress]);

  React.useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const LOW     = (typeof window !== "undefined" && window.__QUALITY__ === "low");
    const REDUCED = (typeof window !== "undefined" && window.__REDUCED_MOTION__);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 400);
    camera.position.set(0, 0, 6);

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

    const clamp01 = (x) => Math.max(0, Math.min(1, x));
    const ss = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
    const setOpacity = (mat, v) => { if (mat) { mat.opacity = v; mat.visible = v > 0.01; } };
    const disposables = [];
    const track = (x) => { disposables.push(x); return x; };

    // ==========================================================
    //   CELL GROUP
    //   ---------------------------------------------------------
    //   TWEAK ME — cell color palette (hex colors). To change the
    //   look, edit these. Designed to evoke immunofluorescence
    //   microscopy staining while matching the site palette.
    // ==========================================================
    const CELL_COLORS = {
      cyto:           0x2a1840, // cytoplasm deep violet glow
      membrane:       0x5eb5ff, // plasma membrane — cyan
      membraneWire:   0x8bd4ff, // phospholipid bilayer lines
      bilayerDots:    0xc8eaff, // phospholipid head particles
      nucleus:        0x4060e8, // DAPI-like deep blue
      nucleusWire:    0x7aa0ff, // nuclear envelope wire
      nucleolus:      0x2038a8, // dense nucleolus core
      chromatin:      0xb8c8ff, // chromatin strand highlight
      nuclearPore:    0xd0e0ff, // pores studding the envelope
      mitoOuter:      0xff6a48, // MitoTracker orange-red
      mitoWire:       0xffaa80, // mitochondrial cristae
      er:             0x67e8c5, // ER-tracker mint/green
      erWire:         0xb8ffe4, // ER membrane wire
      golgi:          0xffc14d, // Golgi apparatus — warm yellow
      golgiWire:      0xffe0a0, // Golgi wire
      ribosomes:      0xe879f9, // ribosomes — bright magenta
      vesicles:       0xffd080, // transport vesicles
      cytoskeleton:   0x9080a8, // microtubule lines
    };

    const cellGroup = new THREE.Group();
    scene.add(cellGroup);

    // Cytoplasm glow — very faint warm fill + faint outer wireframe
    const cytoGeo = track(new THREE.SphereGeometry(2.4, 32, 32));
    const cytoMat = track(new THREE.MeshBasicMaterial({ color: CELL_COLORS.cyto, transparent: true, opacity: 0.14, depthWrite: false, side: THREE.BackSide }));
    cellGroup.add(new THREE.Mesh(cytoGeo, cytoMat));
    const cytoWireMat = track(new THREE.MeshBasicMaterial({ color: CELL_COLORS.cyto, wireframe: true, transparent: true, opacity: 0.09 }));
    cellGroup.add(new THREE.Mesh(cytoGeo, cytoWireMat));

    // Plasma membrane — translucent sphere + wireframe (phospholipid bilayer look)
    const memGeo = track(new THREE.SphereGeometry(2.5, 52, 52));
    const memMat = track(new THREE.MeshBasicMaterial({ color: CELL_COLORS.membrane, transparent: true, opacity: 0.10, depthWrite: false }));
    cellGroup.add(new THREE.Mesh(memGeo, memMat));
    const memWireMat = track(new THREE.MeshBasicMaterial({ color: CELL_COLORS.membraneWire, wireframe: true, transparent: true, opacity: 0.22 }));
    cellGroup.add(new THREE.Mesh(memGeo, memWireMat));

    // Phospholipid bilayer: points studded along the membrane surface (both layers)
    const bilayerN = LOW ? 280 : 900;
    const bilayerGeo = track(new THREE.BufferGeometry());
    const bilayerPos = new Float32Array(bilayerN * 3);
    for (let i = 0; i < bilayerN; i++) {
      // Two layers — inner at 2.44, outer at 2.56 — gives a real bilayer thickness
      const r = (Math.random() < 0.5 ? 2.44 : 2.56) + (Math.random() - 0.5) * 0.04;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      bilayerPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      bilayerPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      bilayerPos[i * 3 + 2] = r * Math.cos(phi);
    }
    bilayerGeo.setAttribute("position", new THREE.BufferAttribute(bilayerPos, 3));
    const bilayerMat = track(new THREE.PointsMaterial({ color: CELL_COLORS.bilayerDots, size: 0.032, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false }));
    cellGroup.add(new THREE.Points(bilayerGeo, bilayerMat));

    // Nucleus — deep blue sphere + wireframe envelope + internal chromatin strands
    const nucleusGroup = new THREE.Group();
    cellGroup.add(nucleusGroup);
    const nucGeo = track(new THREE.SphereGeometry(0.95, 42, 42));
    const nucMat = track(new THREE.MeshBasicMaterial({ color: CELL_COLORS.nucleus, transparent: true, opacity: 0.55, depthWrite: false }));
    nucleusGroup.add(new THREE.Mesh(nucGeo, nucMat));
    const nucWireMat = track(new THREE.MeshBasicMaterial({ color: CELL_COLORS.nucleusWire, wireframe: true, transparent: true, opacity: 0.4 }));
    nucleusGroup.add(new THREE.Mesh(nucGeo, nucWireMat));

    // Nucleolus
    const nucleolusGeo = track(new THREE.SphereGeometry(0.32, 20, 20));
    const nucleolusMat = track(new THREE.MeshBasicMaterial({ color: CELL_COLORS.nucleolus, transparent: true, opacity: 0.85 }));
    const nucleolus = new THREE.Mesh(nucleolusGeo, nucleolusMat);
    nucleolus.position.set(0.2, -0.1, 0.25);
    nucleusGroup.add(nucleolus);
    const nucleolusWireMat = track(new THREE.MeshBasicMaterial({ color: CELL_COLORS.nucleusWire, wireframe: true, transparent: true, opacity: 0.5 }));
    const nucleolusWire = new THREE.Mesh(nucleolusGeo, nucleolusWireMat);
    nucleolusWire.position.copy(nucleolus.position);
    nucleusGroup.add(nucleolusWire);

    // Chromatin — 3 curved lines coiling inside the nucleus (tiny DNA hint)
    const chromatinMats = [];
    for (let ci = 0; ci < 3; ci++) {
      const pts = [];
      const turns = 2 + ci;
      for (let t = 0; t <= 64; t++) {
        const u = t / 64;
        const a = u * Math.PI * 2 * turns + ci * 2;
        const r = 0.7 - u * 0.15;
        pts.push(new THREE.Vector3(
          Math.cos(a) * r + ci * 0.1 - 0.1,
          (u - 0.5) * 1.4,
          Math.sin(a) * r * 0.7
        ));
      }
      const g = track(new THREE.BufferGeometry().setFromPoints(pts));
      const m = track(new THREE.LineBasicMaterial({ color: CELL_COLORS.chromatin, transparent: true, opacity: 0.5 }));
      chromatinMats.push(m);
      nucleusGroup.add(new THREE.Line(g, m));
    }

    // Nuclear pores — small bright dots studding the envelope
    const poreCount = LOW ? 18 : 30;
    const poreGeo = track(new THREE.BufferGeometry());
    const porePos = new Float32Array(poreCount * 3);
    for (let i = 0; i < poreCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      porePos[i * 3]     = 0.97 * Math.sin(phi) * Math.cos(theta);
      porePos[i * 3 + 1] = 0.97 * Math.sin(phi) * Math.sin(theta);
      porePos[i * 3 + 2] = 0.97 * Math.cos(phi);
    }
    poreGeo.setAttribute("position", new THREE.BufferAttribute(porePos, 3));
    const poreMat = track(new THREE.PointsMaterial({ color: CELL_COLORS.nuclearPore, size: 0.07, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }));
    nucleusGroup.add(new THREE.Points(poreGeo, poreMat));

    // Mitochondria — MitoTracker-orange oblong bodies with cristae wireframe overlay
    const mitoMats = [];
    const mitoInnerMats = [];
    const mitoPositions = [
      [ 1.25,  0.70,  0.90],
      [-1.40,  0.35, -0.85],
      [ 0.85, -1.30,  0.65],
      [-0.95, -1.10,  1.10],
      [ 1.60, -0.60, -0.40],
      [-0.50,  1.55,  0.40],
    ];
    mitoPositions.forEach((p, i) => {
      const g = track(new THREE.SphereGeometry(0.28, 20, 18));
      const m = track(new THREE.MeshBasicMaterial({ color: CELL_COLORS.mitoOuter, transparent: true, opacity: 0.86 }));
      mitoMats.push(m);
      const mesh = new THREE.Mesh(g, m);
      mesh.position.set(p[0], p[1], p[2]);
      mesh.scale.set(1.6, 0.7, 0.7);
      mesh.rotation.z = (i / mitoPositions.length) * Math.PI;
      mesh.rotation.y = i * 0.8;
      cellGroup.add(mesh);
      // cristae — inner wireframe, slightly scaled down
      const iMat = track(new THREE.MeshBasicMaterial({ color: CELL_COLORS.mitoWire, wireframe: true, transparent: true, opacity: 0.55 }));
      mitoInnerMats.push(iMat);
      const inner = new THREE.Mesh(g, iMat);
      inner.position.copy(mesh.position);
      inner.scale.copy(mesh.scale).multiplyScalar(0.78);
      inner.rotation.copy(mesh.rotation);
      cellGroup.add(inner);
    });

    // Endoplasmic reticulum — torus-knot + wireframe overlay for reticular detail
    const erGeo = track(new THREE.TorusKnotGeometry(0.75, 0.09, 110, 10, 2, 3));
    const erMat = track(new THREE.MeshBasicMaterial({ color: CELL_COLORS.er, transparent: true, opacity: 0.55 }));
    const er = new THREE.Mesh(erGeo, erMat);
    er.position.set(1.15, -0.1, -0.9);
    er.rotation.set(0.6, 0.8, 0);
    cellGroup.add(er);
    const erWireMat = track(new THREE.MeshBasicMaterial({ color: CELL_COLORS.erWire, wireframe: true, transparent: true, opacity: 0.35 }));
    const erWire = new THREE.Mesh(erGeo, erWireMat);
    erWire.position.copy(er.position);
    erWire.rotation.copy(er.rotation);
    erWire.scale.setScalar(1.03);
    cellGroup.add(erWire);

    // Golgi apparatus — stacked flat disks (cisternae)
    const golgiMats = [];
    const golgiWireMats = [];
    const golgiGroup = new THREE.Group();
    golgiGroup.position.set(-1.3, 0.85, 0.6);
    golgiGroup.rotation.set(0.4, -0.3, 0.6);
    cellGroup.add(golgiGroup);
    for (let gi = 0; gi < 4; gi++) {
      const r = 0.48 - gi * 0.06;
      const g = track(new THREE.CylinderGeometry(r, r, 0.04, 28, 1, true));
      const m = track(new THREE.MeshBasicMaterial({ color: CELL_COLORS.golgi, transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
      golgiMats.push(m);
      const disk = new THREE.Mesh(g, m);
      disk.position.y = gi * 0.1 - 0.15;
      golgiGroup.add(disk);
      const wm = track(new THREE.MeshBasicMaterial({ color: CELL_COLORS.golgiWire, wireframe: true, transparent: true, opacity: 0.35 }));
      golgiWireMats.push(wm);
      const wire = new THREE.Mesh(g, wm);
      wire.position.copy(disk.position);
      wire.scale.setScalar(1.05);
      golgiGroup.add(wire);
    }

    // Transport vesicles — small glowing spheres near the Golgi
    const vesicleN = LOW ? 10 : 22;
    const vesicleGeo = track(new THREE.BufferGeometry());
    const vesiclePos = new Float32Array(vesicleN * 3);
    for (let i = 0; i < vesicleN; i++) {
      // Clustered around Golgi position (-1.3, 0.85, 0.6)
      vesiclePos[i * 3]     = -1.3 + (Math.random() - 0.5) * 1.4;
      vesiclePos[i * 3 + 1] =  0.85 + (Math.random() - 0.5) * 1.2;
      vesiclePos[i * 3 + 2] =  0.6 + (Math.random() - 0.5) * 1.2;
    }
    vesicleGeo.setAttribute("position", new THREE.BufferAttribute(vesiclePos, 3));
    const vesicleMat = track(new THREE.PointsMaterial({ color: CELL_COLORS.vesicles, size: 0.08, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }));
    cellGroup.add(new THREE.Points(vesicleGeo, vesicleMat));

    // Cytoskeleton — a handful of microtubule-like lines radiating through the cytoplasm
    const cytoskeletonMats = [];
    const microtubuleCount = LOW ? 6 : 12;
    for (let mi = 0; mi < microtubuleCount; mi++) {
      const theta = (mi / microtubuleCount) * Math.PI * 2 + Math.random() * 0.5;
      const phi = (Math.random() - 0.5) * 0.8;
      const r1 = 1.0, r2 = 2.35;
      const a = new THREE.Vector3(
        r1 * Math.cos(theta) * Math.cos(phi),
        r1 * Math.sin(phi),
        r1 * Math.sin(theta) * Math.cos(phi)
      );
      const b = new THREE.Vector3(
        r2 * Math.cos(theta + 0.3) * Math.cos(phi + 0.2),
        r2 * Math.sin(phi + 0.2),
        r2 * Math.sin(theta + 0.3) * Math.cos(phi + 0.2)
      );
      // Curved path with 3 intermediate points
      const curve = new THREE.CatmullRomCurve3([a, a.clone().lerp(b, 0.33).add(new THREE.Vector3(0.1, 0.1, 0.05)), a.clone().lerp(b, 0.66), b]);
      const g = track(new THREE.BufferGeometry().setFromPoints(curve.getPoints(24)));
      const m = track(new THREE.LineBasicMaterial({ color: CELL_COLORS.cytoskeleton, transparent: true, opacity: 0.25 }));
      cytoskeletonMats.push(m);
      cellGroup.add(new THREE.Line(g, m));
    }

    // Ribosomes — vivid magenta dots scattered in cytoplasm (avoid the nucleus region)
    const riboN = LOW ? 80 : 260;
    const riboGeo = track(new THREE.BufferGeometry());
    const riboPos = new Float32Array(riboN * 3);
    let placed = 0;
    while (placed < riboN) {
      const x = (Math.random() - 0.5) * 4.4;
      const y = (Math.random() - 0.5) * 4.4;
      const z = (Math.random() - 0.5) * 4.4;
      const r = Math.sqrt(x * x + y * y + z * z);
      if (r > 1.2 && r < 2.35) {
        riboPos[placed * 3] = x;
        riboPos[placed * 3 + 1] = y;
        riboPos[placed * 3 + 2] = z;
        placed++;
      }
    }
    riboGeo.setAttribute("position", new THREE.BufferAttribute(riboPos, 3));
    const riboMat = track(new THREE.PointsMaterial({ color: CELL_COLORS.ribosomes, size: 0.05, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
    cellGroup.add(new THREE.Points(riboGeo, riboMat));

    // Diagonal rotation axis — gives the cell a tumbling, off-axis spin
    // TWEAK ME — change the components of this axis to alter the tumble direction.
    const CELL_ROT_AXIS = new THREE.Vector3(1, 1.3, 0.5).normalize();
    const CELL_ROT_Q = new THREE.Quaternion();

    // ==========================================================
    //   DNA GROUP
    //   ---------------------------------------------------------
    //   TWEAK ME — DNA color palette. Base colors follow the
    //   standard PyMOL / molecular-viewer convention so the helix
    //   reads as anatomically accurate to anyone with bio training.
    // ==========================================================
    const DNA_COLORS = {
      strand0:      0x5eb5ff, // sugar-phosphate backbone, strand 1 — cyan
      strand1:      0xa78bfa, // sugar-phosphate backbone, strand 2 — violet
      phosphate:    0xffb84d, // phosphate atom beads — warm orange
      phosphateWire:0xffe0a0, // phosphate wireframe edge
      // Standard nucleobase colors (PyMOL convention)
      baseA:        0x66d466, // Adenine   — green
      baseT:        0xe06666, // Thymine   — red
      baseG:        0x6691ff, // Guanine   — blue
      baseC:        0xe8dc66, // Cytosine  — yellow
      sugar:        0x67e8c5, // Deoxyribose — mint
      rungWire:     0xffffff, // wireframe edge over rung bodies
      hbond:        0xb0d0ff, // hydrogen bonds — light blue
    };

    const dnaGroup = new THREE.Group();
    scene.add(dnaGroup);

    // Real DNA is ~10.5 base pairs per helical turn. With TURNS=3 that gives ~31 rungs;
    // we use 24 for a slightly cleaner look while still reading as "dense" DNA.
    const DNA_HEIGHT = 4.2, TURNS = 3, DNA_RADIUS = 0.6, SEG = 160;
    const RUNG_COUNT = 24;
    const FOCUS_RUNG_IDX = 12; // middle rung
    const BACKBONE_BEAD_EVERY = 5; // phosphate bead every Nth segment

    const strandPoint = (i, s, p) => {
      const u = i / (SEG - 1);
      const y = (u - 0.5) * DNA_HEIGHT;
      const baseSpin = p * 0.8;
      const angle = u * Math.PI * 2 * TURNS + baseSpin + (s ? Math.PI : 0);
      return [Math.cos(angle) * DNA_RADIUS, y, Math.sin(angle) * DNA_RADIUS];
    };
    const rungEndpoints = (ri, p) => {
      const segI = Math.floor((ri / (RUNG_COUNT - 1)) * (SEG - 1));
      return [strandPoint(segI, 0, p), strandPoint(segI, 1, p)];
    };

    // Shared scratch vectors + the cylinder-alignment helper. Defined up here
    // (above the rung setup) so the one-shot setup pass can use alignCylinder.
    const tmp  = new THREE.Vector3();
    const tmpUp = new THREE.Vector3(0, 1, 0);
    const tmpA = new THREE.Vector3();
    const tmpB = new THREE.Vector3();
    const alignCylinder = (mesh, a, b, radius = 1) => {
      tmpA.set(a[0], a[1], a[2]);
      tmpB.set(b[0], b[1], b[2]);
      mesh.position.copy(tmpA).add(tmpB).multiplyScalar(0.5);
      const dir = tmp.copy(tmpB).sub(tmpA);
      const len = dir.length();
      dir.normalize();
      mesh.quaternion.setFromUnitVectors(tmpUp, dir);
      mesh.scale.set(radius, len, radius);
    };

    // The helix itself is static geometry, but rotates as a single group. Cheaper
    // and cleaner than rebuilding strand/rung positions every frame. Only the
    // focus rung (which splits / zooms) lives outside this rotation group.
    const helixRotationGroup = new THREE.Group();
    dnaGroup.add(helixRotationGroup);

    // --- Strands as thick tubes (no more 1px lines) ---
    // Backbone tube radius is matched to the rung radius so the ladder "frame"
    // reads as one coherent structure.
    const STRAND_RADIUS = 0.05;
    const RUNG_RADIUS = 0.045;
    const strandColors = [DNA_COLORS.strand0, DNA_COLORS.strand1];
    const strandTubes = [];
    [0, 1].forEach(s => {
      const pts = [];
      for (let i = 0; i < SEG; i++) {
        const [x, y, z] = strandPoint(i, s, 0); // build at p=0; group rotation drives animation
        pts.push(new THREE.Vector3(x, y, z));
      }
      const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.1);
      const tubeGeo = track(new THREE.TubeGeometry(curve, LOW ? 140 : 260, STRAND_RADIUS, LOW ? 10 : 14, false));
      const tubeMat = track(new THREE.MeshBasicMaterial({ color: strandColors[s], transparent: true, opacity: 0.92 }));
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      helixRotationGroup.add(tube);
      // Wireframe overlay — low opacity mesh-wireframe (EdgesGeometry on tubes is
      // too sparse to read; full wireframe at low opacity gives a nice "cage").
      const tubeWireMat = track(new THREE.MeshBasicMaterial({ color: DNA_COLORS.rungWire, wireframe: true, transparent: true, opacity: 0.18 }));
      const tubeWire = new THREE.Mesh(tubeGeo, tubeWireMat);
      helixRotationGroup.add(tubeWire);
      strandTubes.push({ tube, tubeMat, tubeWireMat });

      // Phosphate beads — small spheres every Nth segment (ball-and-stick look)
      const beadCount = Math.floor(SEG / BACKBONE_BEAD_EVERY);
      const bpGeo = track(new THREE.BufferGeometry());
      const bpPos = new Float32Array(beadCount * 3);
      for (let bi = 0; bi < beadCount; bi++) {
        const segI = Math.min(SEG - 1, bi * BACKBONE_BEAD_EVERY);
        const [x, y, z] = strandPoint(segI, s, 0);
        bpPos[bi*3] = x; bpPos[bi*3+1] = y; bpPos[bi*3+2] = z;
      }
      bpGeo.setAttribute("position", new THREE.BufferAttribute(bpPos, 3));
      const bpMat = track(new THREE.PointsMaterial({ color: DNA_COLORS.phosphate, size: 0.14, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }));
      helixRotationGroup.add(new THREE.Points(bpGeo, bpMat));
      strandTubes[s].bpMat = bpMat;
    });

    // --- Background ladder rungs — static, placed once at p=0, rotate with the group ---
    const rungMeshes = [];
    const rungWireMeshes = [];
    const rungMats = [];
    const rungWireMats = [];
    const basePairTypes = ["AT", "TA", "GC", "CG"];
    const rungColorForPair = (type) => {
      if (type === "AT") return DNA_COLORS.baseA;
      if (type === "TA") return DNA_COLORS.baseT;
      if (type === "GC") return DNA_COLORS.baseG;
      return DNA_COLORS.baseC;
    };
    for (let i = 0; i < RUNG_COUNT; i++) {
      const type = basePairTypes[i % basePairTypes.length];
      const color = rungColorForPair(type);
      const g = track(new THREE.CylinderGeometry(RUNG_RADIUS, RUNG_RADIUS, 1, 12, 1, false));
      const m = track(new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85 }));
      const mesh = new THREE.Mesh(g, m);
      rungMeshes.push(mesh);
      rungMats.push(m);
      helixRotationGroup.add(mesh);
      const edgesGeo = track(new THREE.EdgesGeometry(g, 1));
      const wm = track(new THREE.LineBasicMaterial({ color: DNA_COLORS.rungWire, transparent: true, opacity: 0.55 }));
      const wmesh = new THREE.LineSegments(edgesGeo, wm);
      rungWireMeshes.push(wmesh);
      rungWireMats.push(wm);
      helixRotationGroup.add(wmesh);
      // Place once at p=0 — rotation of the parent group drives the animation.
      const [a, b] = rungEndpoints(i, 0);
      alignCylinder(mesh, a, b, 1);
      alignCylinder(wmesh, a, b, 1.12);
    }

    // --- Focus ladder rung: the zoom-in target. Anatomically-styled nucleotide:
    //     BASE (hexagonal cylinder — purine/pyrimidine ring shape) → SUGAR
    //     (pentagonal cylinder — deoxyribose pentose ring) → PHOSPHATE sphere.
    //     Every piece carries a wireframe overlay to match the cell's look.
    //     Hydrogen bonds between A and T are two short cylinders at the pair centre.
    const focusGroup = new THREE.Group();
    dnaGroup.add(focusGroup);

    // ==========================================================
    //  REALISM DESIGN CHOICES (for the focus rung / nucleotide)
    //  ---------------------------------------------------------
    //  · Purine vs. pyrimidine ring shapes are anatomically distinct.
    //    Adenine & Guanine are PURINES — fused 9-atom bicyclic ring
    //    (6-membered + 5-membered). Thymine & Cytosine are PYRIMIDINES
    //    — single 6-membered ring. We build them with real fused geometry.
    //
    //  · Deoxyribose is a PENTOSE SUGAR — a 5-membered ring, rendered as
    //    a pentagonal prism (5 radial segments on a CylinderGeometry).
    //
    //  · Phosphate (PO₄) is TETRAHEDRAL — one central phosphorus atom
    //    with four oxygens at tetrahedral bond angles (~109.5°). Shown
    //    as 1 + 4 icosahedral atoms + 4 P–O bond sticks (ball-and-stick
    //    diagram, standard in chemistry textbooks).
    //
    //  · CPK-style atom colors: P = orange (per PyMOL), O = red (per
    //    CPK/IUPAC). The atoms are distinct sizes because real atomic
    //    radii differ (P ~1.00 Å, O ~0.66 Å).
    //
    //  · Ring sizes are proportional: the base ring is the largest piece
    //    (real nucleobase ~0.5 nm across), the sugar is intermediate, and
    //    each phosphate oxygen is small. Matches real molecular scale.
    //
    //  · Every solid piece has an EdgesGeometry wireframe parented to it
    //    so the overlay moves with the mesh without per-frame sync code.
    // ==========================================================
    const CPK_OXYGEN = 0xff5252; // CPK red
    const PO_BOND    = 0xe8ecff; // bright white-blue bond stick
    const GLYC_BOND  = 0x9fb0d8; // glycosidic C–N bond stick

    const makeHalfRung = (type /* "A" | "T" */) => {
      const grp = new THREE.Group();
      const baseColor = type === "A" ? DNA_COLORS.baseA : DNA_COLORS.baseT;
      const solidMats = [];
      const wireMats = [];

      // --- Helper: build a flat-prism "ring" with its own parented wireframe ---
      const addRing = (parent, radius, segs, localX = 0, rotZ = 0, thickness = 0.05) => {
        const geo = track(new THREE.CylinderGeometry(radius, radius, thickness, segs, 1, false));
        const mat = track(new THREE.MeshBasicMaterial({ color: baseColor, transparent: true, opacity: 0.9 }));
        solidMats.push(mat);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = Math.PI / 2;
        mesh.rotation.z = rotZ;
        mesh.position.x = localX;
        parent.add(mesh);
        const edgesGeo = track(new THREE.EdgesGeometry(geo, 1));
        const wireMat = track(new THREE.LineBasicMaterial({ color: DNA_COLORS.rungWire, transparent: true, opacity: 0.7 }));
        wireMats.push(wireMat);
        const wire = new THREE.LineSegments(edgesGeo, wireMat);
        wire.scale.setScalar(1.04); // slight outward scale
        mesh.add(wire); // parent to mesh → inherits rotation
        return mesh;
      };

      // --- BASE ASSEMBLY ---
      // Adenine = purine: 6-ring + fused 5-ring (imidazole).
      // Thymine = pyrimidine: single 6-ring.
      const baseAssembly = new THREE.Group();
      grp.add(baseAssembly);
      if (type === "A") {
        addRing(baseAssembly, 0.11,  6, 0, 0);               // 6-membered ring
        addRing(baseAssembly, 0.085, 5, 0.165, Math.PI / 5); // 5-membered ring fused on the right
      } else {
        addRing(baseAssembly, 0.13, 6, 0, 0);                // single pyrimidine ring
      }

      // --- SUGAR (deoxyribose, 5-ring pentagonal prism) ---
      const sugGeo = track(new THREE.CylinderGeometry(0.10, 0.10, 0.04, 5, 1, false));
      const sugMat = track(new THREE.MeshBasicMaterial({ color: DNA_COLORS.sugar, transparent: true, opacity: 0.9 }));
      solidMats.push(sugMat);
      const sugar = new THREE.Mesh(sugGeo, sugMat);
      sugar.rotation.x = Math.PI / 2;
      sugar.rotation.z = Math.PI / 5;
      grp.add(sugar);
      const sugEdges = track(new THREE.EdgesGeometry(sugGeo, 1));
      const sugWireMat = track(new THREE.LineBasicMaterial({ color: DNA_COLORS.rungWire, transparent: true, opacity: 0.7 }));
      wireMats.push(sugWireMat);
      const sugWire = new THREE.LineSegments(sugEdges, sugWireMat);
      sugWire.scale.setScalar(1.04);
      sugar.add(sugWire); // parented → inherits sugar's rotation

      // --- PHOSPHATE AS TETRAHEDRAL PO₄ ---
      // Central phosphorus + 4 oxygens at tetrahedral corners + 4 P–O bonds.
      // Standard ball-and-stick representation used in chemistry courses.
      const phosAssembly = new THREE.Group();
      grp.add(phosAssembly);

      // Central P atom
      const pGeo = track(new THREE.IcosahedronGeometry(0.032, 1));
      const pMat = track(new THREE.MeshBasicMaterial({ color: DNA_COLORS.phosphate, transparent: true, opacity: 0.95 }));
      solidMats.push(pMat);
      const pAtom = new THREE.Mesh(pGeo, pMat);
      phosAssembly.add(pAtom);
      const pEdges = track(new THREE.EdgesGeometry(pGeo, 1));
      const pWireMat = track(new THREE.LineBasicMaterial({ color: DNA_COLORS.phosphateWire, transparent: true, opacity: 0.7 }));
      wireMats.push(pWireMat);
      const pWire = new THREE.LineSegments(pEdges, pWireMat);
      pWire.scale.setScalar(1.12);
      pAtom.add(pWire);

      // 4 O atoms at tetrahedral vertices + P-O bond sticks
      const oGeo = track(new THREE.IcosahedronGeometry(0.024, 1));
      const oMat = track(new THREE.MeshBasicMaterial({ color: CPK_OXYGEN, transparent: true, opacity: 0.95 }));
      solidMats.push(oMat);
      const bondGeo = track(new THREE.CylinderGeometry(0.006, 0.006, 1, 6));
      const bondMat = track(new THREE.MeshBasicMaterial({ color: PO_BOND, transparent: true, opacity: 0.7 }));
      solidMats.push(bondMat);
      const oEdges = track(new THREE.EdgesGeometry(oGeo, 1));
      const oWireMat = track(new THREE.LineBasicMaterial({ color: 0xffdada, transparent: true, opacity: 0.6 }));
      wireMats.push(oWireMat);
      // Tetrahedral vertex directions
      const tetra = [
        new THREE.Vector3( 1,  1,  1),
        new THREE.Vector3(-1, -1,  1),
        new THREE.Vector3(-1,  1, -1),
        new THREE.Vector3( 1, -1, -1),
      ];
      const BOND_LEN = 0.075;
      tetra.forEach(v => {
        const dir = v.clone().normalize();
        const tip = dir.clone().multiplyScalar(BOND_LEN);
        const o = new THREE.Mesh(oGeo, oMat);
        o.position.copy(tip);
        phosAssembly.add(o);
        // O wireframe parented to the O atom
        const oWire = new THREE.LineSegments(oEdges, oWireMat);
        oWire.scale.setScalar(1.12);
        o.add(oWire);
        // P-O bond stick: centered between P and O, oriented along dir, scaled to length
        const bond = new THREE.Mesh(bondGeo, bondMat);
        bond.position.copy(tip).multiplyScalar(0.5);
        bond.quaternion.setFromUnitVectors(tmpUp, dir);
        bond.scale.set(1, BOND_LEN, 1);
        phosAssembly.add(bond);
      });

      // --- GLYCOSIDIC BOND (base ↔ sugar) ---
      const gbondGeo = track(new THREE.CylinderGeometry(0.013, 0.013, 0.07, 6));
      const gbondMat = track(new THREE.MeshBasicMaterial({ color: GLYC_BOND, transparent: true, opacity: 0.75 }));
      solidMats.push(gbondMat);
      const gbond = new THREE.Mesh(gbondGeo, gbondMat);
      gbond.rotation.x = Math.PI / 2;
      grp.add(gbond);

      return {
        group: grp, type,
        baseAssembly, sugar, phosAssembly, gbond,
        solidMats, wireMats,
      };
    };

    const half0 = makeHalfRung("A"); // Adenine — purine
    const half1 = makeHalfRung("T"); // Thymine — pyrimidine
    focusGroup.add(half0.group);
    focusGroup.add(half1.group);
    half0.group.rotation.y = Math.PI; // flip so its base points outward toward strand 0

    // Hydrogen bonds between A and T — 2 bonds per pair (A-T forms exactly 2 H-bonds)
    const hbondMat = track(new THREE.MeshBasicMaterial({ color: DNA_COLORS.hbond, transparent: true, opacity: 0.6 }));
    const hbondGeo = track(new THREE.CylinderGeometry(0.01, 0.01, 1, 6));
    const hbond0 = new THREE.Mesh(hbondGeo, hbondMat);
    const hbond1 = new THREE.Mesh(hbondGeo, hbondMat);
    focusGroup.add(hbond0);
    focusGroup.add(hbond1);

    // --- Sparkly starfield behind everything ---
    // Three layers of twinkling stars at different depths. Each star has its own
    // phase so they twinkle asynchronously. Draws additively for a bright glow.
    const starLayers = [];
    const makeStarLayer = (count, zNear, zFar, size, baseColor) => {
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      const phase = new Float32Array(count);
      const r = ((baseColor >> 16) & 0xff) / 255;
      const g = ((baseColor >> 8) & 0xff) / 255;
      const b = (baseColor & 0xff) / 255;
      for (let i = 0; i < count; i++) {
        pos[i*3]   = (Math.random()-0.5) * 24;
        pos[i*3+1] = (Math.random()-0.5) * 18;
        pos[i*3+2] = zNear - Math.random() * (zFar - zNear);
        // Slight color variation per star
        const tint = 0.7 + Math.random() * 0.3;
        col[i*3]   = r * tint;
        col[i*3+1] = g * tint;
        col[i*3+2] = b * tint;
        phase[i] = Math.random() * Math.PI * 2;
      }
      const geo = track(new THREE.BufferGeometry());
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color",    new THREE.BufferAttribute(col, 3));
      const mat = track(new THREE.PointsMaterial({
        vertexColors: true, size, transparent: true, opacity: 0.9,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      const points = new THREE.Points(geo, mat);
      scene.add(points);
      starLayers.push({ points, geo, mat, count, phase, col });
    };
    // Far layer (dim, many, bluish)
    makeStarLayer(LOW ? 200 : 500, -14, -24, 0.025, 0x8090c8);
    // Mid layer (medium, pinkish)
    makeStarLayer(LOW ? 80 : 200,  -6,  -14, 0.04,  0xb890e0);
    // Near sparkle layer (few, bright white)
    makeStarLayer(LOW ? 30 : 80,   -2,  -8,  0.065, 0xffffff);

    // ==========================================================
    //   ANIMATION LOOP
    // ==========================================================
    const cellWorldPos = new THREE.Vector3();
    const nucleusWorldPos = new THREE.Vector3();
    const focusWorldPos = new THREE.Vector3();
    const half0BaseWorldPos = new THREE.Vector3();
    const half0SugarWorldPos = new THREE.Vector3();
    const half0PhosWorldPos = new THREE.Vector3();
    const half1BaseWorldPos = new THREE.Vector3();
    const tmpQ = new THREE.Quaternion();

    // --- Visibility: pause rendering when the pinned section is off-screen ---
    let visible = true;
    const vio = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    vio.observe(mount);

    let raf, last = performance.now();
    const loop = (t) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;

      // Skip render + heavy per-frame updates when section is scrolled out of view.
      if (!visible) {
        raf = requestAnimationFrame(loop);
        return;
      }

      const p = pRef.current; // 0..4  (4 chapters: cell → helix → pair → reassemble)

      // ============================================================
      //  PHASE VISIBILITY
      // ============================================================
      const cellFade = 1 - ss(0.7, 1.4, p); // cell fades out entering helix
      const dnaFade  = ss(0.7, 1.5, p);      // helix fades in

      // Tumbling diagonal rotation — quaternion around an off-axis vector
      CELL_ROT_Q.setFromAxisAngle(CELL_ROT_AXIS, dt * 0.18);
      cellGroup.quaternion.multiply(CELL_ROT_Q);
      // Slight pulsing of nucleus draws the eye before zoom-in
      const nucPulse = 1 + 0.04 * Math.sin(t * 0.002);
      nucleusGroup.scale.setScalar(nucPulse);

      // Apply cell fade per-material (all tracked here so fade-out stays uniform)
      setOpacity(cytoMat,       0.14 * cellFade);
      setOpacity(cytoWireMat,   0.09 * cellFade);
      setOpacity(memMat,        0.10 * cellFade);
      setOpacity(memWireMat,    0.22 * cellFade);
      setOpacity(bilayerMat,    0.75 * cellFade);
      setOpacity(nucMat,        0.55 * cellFade);
      setOpacity(nucWireMat,    0.40 * cellFade);
      setOpacity(nucleolusMat,  0.85 * cellFade);
      setOpacity(nucleolusWireMat, 0.50 * cellFade);
      setOpacity(poreMat,       0.95 * cellFade);
      setOpacity(erMat,         0.55 * cellFade);
      setOpacity(erWireMat,     0.35 * cellFade);
      setOpacity(riboMat,       0.90 * cellFade);
      setOpacity(vesicleMat,    0.85 * cellFade);
      mitoMats.forEach(m => setOpacity(m,       0.86 * cellFade));
      mitoInnerMats.forEach(m => setOpacity(m,  0.55 * cellFade));
      golgiMats.forEach(m => setOpacity(m,      0.55 * cellFade));
      golgiWireMats.forEach(m => setOpacity(m,  0.35 * cellFade));
      chromatinMats.forEach(m => setOpacity(m,  0.50 * cellFade));
      cytoskeletonMats.forEach(m => setOpacity(m, 0.25 * cellFade));

      // ============================================================
      //  DNA — drive the whole helix by rotating its group.
      //  Strands + rungs are static geometry built at p=0; rotating the group
      //  is equivalent to the old per-frame position updates but far cheaper.
      // ============================================================
      helixRotationGroup.rotation.y = p * 0.8;

      // Strand tube + wireframe + bead opacities (shared dnaFade)
      for (const S of strandTubes) {
        setOpacity(S.tubeMat,     0.92 * dnaFade);
        setOpacity(S.tubeWireMat, 0.18 * dnaFade);
        setOpacity(S.bpMat,       0.95 * dnaFade);
      }

      // Rung opacities — hide the focus rung's static copy while the detailed
      // focus-rung assembly takes over (chapter 2), and dim all non-focus rungs
      // during that examination so the eye tracks the active pair.
      const nonFocusFade = 1 - (ss(1.9, 2.2, p) - ss(3.1, 3.6, p));
      for (let i = 0; i < RUNG_COUNT; i++) {
        const hideFocus = i === FOCUS_RUNG_IDX && p > 1.8 && p < 3.4;
        if (hideFocus) {
          setOpacity(rungMats[i], 0);
          setOpacity(rungWireMats[i], 0);
        } else {
          setOpacity(rungMats[i],     0.85 * dnaFade * nonFocusFade);
          setOpacity(rungWireMats[i], 0.55 * dnaFade * nonFocusFade);
        }
      }

      // ============================================================
      //  Focus ladder rung — appears during chapter 2 (progress 1.6..3.4)
      // ============================================================
      const focusAppear = ss(1.6, 2.1, p) * (1 - ss(3.1, 3.6, p));
      const [fa, fb] = rungEndpoints(FOCUS_RUNG_IDX, p);
      const midX = (fa[0] + fb[0]) / 2;
      const midY = (fa[1] + fb[1]) / 2;
      const midZ = (fa[2] + fb[2]) / 2;
      focusGroup.position.set(midX, midY, midZ);
      focusWorldPos.set(midX, midY, midZ);
      const dir = tmp.set(fb[0]-fa[0], fb[1]-fa[1], fb[2]-fa[2]);
      const len = dir.length();
      dir.normalize();
      // Rotate the focus group so its z-axis aligns with the rung direction.
      focusGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);

      // Split factor — pair opens up during chapter 2, rejoins at chapter 3.
      const splitFactor = ss(1.9, 2.4, p) * (1 - ss(3.0, 3.5, p));
      const halfBaseLen = len / 2;
      const pushAmt = halfBaseLen + splitFactor * 0.55;

      // Position half0 at -Z, half1 at +Z (focusGroup points +Z along the rung direction)
      half0.group.position.set(0, 0, -pushAmt * 0.45);
      half1.group.position.set(0, 0,  pushAmt * 0.45);

      // Within each half, arrange: base ring(s) → glycosidic bond → sugar → phosphate.
      // Local +Z is "outward" toward the strand (half0 is flipped via rotation.y = PI).
      const Z_BASE   = 0.05;   // base ring(s) center
      const Z_BOND   = 0.12;   // glycosidic bond center
      const Z_SUGAR  = 0.19;   // deoxyribose pentagon center
      const Z_PHOS   = 0.30;   // phosphate tetrahedron center
      [half0, half1].forEach(h => {
        h.baseAssembly.position.set(0, 0, Z_BASE);
        h.gbond.position.set(0, 0, Z_BOND);
        h.sugar.position.set(0, 0, Z_SUGAR);
        h.phosAssembly.position.set(0, 0, Z_PHOS);
      });

      // Both halves stay fully visible during the base-pair chapter — we label
      // everything at once. Opacity comes from the collected material arrays.
      half0.group.scale.setScalar(1 + focusAppear * 0.2);
      const half1Dim = 1;
      half0.solidMats.forEach(m => setOpacity(m, 0.92 * focusAppear));
      half0.wireMats.forEach(m  => setOpacity(m, 0.7  * focusAppear));
      half1.solidMats.forEach(m => setOpacity(m, 0.92 * focusAppear * half1Dim));
      half1.wireMats.forEach(m  => setOpacity(m, 0.7  * focusAppear * half1Dim));

      // Hydrogen bonds — two short cylinders between the inner faces of the two bases.
      // They fade as the pair splits.
      const hbondAlive = focusAppear * (1 - splitFactor * 0.9);
      setOpacity(hbondMat, 0.6 * hbondAlive);
      const hbondLen = Math.max(0.05, pushAmt * 0.9 - Z_BASE * 2);
      [[hbond0, 0.035], [hbond1, -0.035]].forEach(([hb, yOff]) => {
        hb.scale.set(1, hbondLen, 1);
        hb.position.set(0, yOff, 0);
        hb.quaternion.setFromUnitVectors(tmpUp, new THREE.Vector3(0, 0, 1));
      });

      // ============================================================
      //  CAMERA PATH — six chapter waypoints
      // ============================================================
      // cell overview → into nucleus → helix mid-view → focus rung → zoom into nucleotide → back out
      cellGroup.getWorldPosition(cellWorldPos);
      nucleusGroup.getWorldPosition(nucleusWorldPos);

      // Recompute dynamic "look targets" — use the assembly groups so labels track
      // the averaged center of each nucleotide piece.
      half0.baseAssembly.getWorldPosition(half0BaseWorldPos);
      half0.sugar.getWorldPosition(half0SugarWorldPos);
      half0.phosAssembly.getWorldPosition(half0PhosWorldPos);
      half1.baseAssembly.getWorldPosition(half1BaseWorldPos);

      // --- Compute a perpendicular side-view for the nucleotide close-up ---
      // The nucleotide axis runs from base → sugar → phosphate. Looking down that
      // axis hides everything behind the phosphate, so we place the camera off to
      // one side of the axis so base, sugar, and phosphate are visible in a row.
      const nucAxis = tmpA.copy(half0PhosWorldPos).sub(half0BaseWorldPos).normalize();
      const upRef = Math.abs(nucAxis.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : tmpUp;
      const nucPerp = tmpB.crossVectors(nucAxis, upRef).normalize();
      const nucMid = new THREE.Vector3().addVectors(half0BaseWorldPos, half0PhosWorldPos).multiplyScalar(0.5);
      const nucleotideCamPos = nucMid.clone()
        .add(nucPerp.clone().multiplyScalar(0.7))
        .add(new THREE.Vector3(0, 0.14, 0));

      // ----------------------------------------------------------------
      //  Four-chapter camera path — fewer waypoints, each phase holds more.
      //  Cell (0..1) → Helix reveal + rotate (1..2) → Base pair labeled
      //  from a perpendicular angle (2..3) → Pull back to full helix (3..4).
      // ----------------------------------------------------------------
      const camPos = new THREE.Vector3();
      const lookAt = new THREE.Vector3();
      const WP = {
        cellOverview: new THREE.Vector3(0, 0.2, 9),
        cellClose:    new THREE.Vector3(0, 0.0, 4.2),
        helixEst:     new THREE.Vector3(0.2, 0, 6.0),
        rungSide:     nucleotideCamPos,           // perpendicular side view of focus rung
        finalOut:     new THREE.Vector3(0, 0.2, 6.5),
      };
      const LP = {
        cellCenter:    new THREE.Vector3(0, 0, 0),
        origin:        new THREE.Vector3(0, 0, 0),
        rungMid:       focusWorldPos.clone(),
        nucleotideMid: nucMid.clone(),
      };

      if (p < 1) {
        // Chapter 0: cell overview — slow push in
        const k = ss(0, 1, p);
        camPos.copy(WP.cellOverview).lerp(WP.cellClose, k);
        lookAt.copy(LP.cellCenter);
      } else if (p < 2) {
        // Chapter 1: zoom into nucleus → helix reveal (with rotation continuing)
        const k = ss(1, 2, p);
        camPos.copy(WP.cellClose).lerp(WP.helixEst, k);
        lookAt.copy(LP.cellCenter).lerp(LP.origin, k);
      } else if (p < 3) {
        // Chapter 2: two-stage zoom for a natural approach.
        //   Stage A (2.0 → 2.4): pull in toward the rung from the helix view.
        //   Stage B (2.4 → 2.7): arc around to a perpendicular side view.
        //   Hold  (2.7 → 3.0):   camera stops so the labels are readable.
        // Intermediate "approach" waypoint is computed from the focus rung's
        // live world position so it moves with the rotating helix.
        const approach = new THREE.Vector3(
          focusWorldPos.x * 0.35,
          focusWorldPos.y * 0.3,
          3.4
        );
        if (p < 2.4) {
          const k = ss(2.0, 2.4, p);
          camPos.copy(WP.helixEst).lerp(approach, k);
          lookAt.copy(LP.origin).lerp(LP.rungMid, k);
        } else {
          const k = ss(2.4, 2.7, p);
          camPos.copy(approach).lerp(WP.rungSide, k);
          lookAt.copy(LP.rungMid).lerp(LP.nucleotideMid, k);
        }
      } else {
        // Chapter 3: pull back to the full helix (reassemble)
        const k = ss(3, 4, p);
        camPos.copy(WP.rungSide).lerp(WP.finalOut, k);
        lookAt.copy(LP.nucleotideMid).lerp(LP.origin, k);
      }
      camera.position.copy(camPos);
      camera.lookAt(lookAt);

      // ============================================================
      //  LABEL OVERLAY UPDATES
      // ============================================================
      const labels = [];
      const project = (v) => {
        tmp.copy(v).project(camera);
        if (tmp.z > 1) return null;
        return { x: (tmp.x * 0.5 + 0.5) * 100, y: (-tmp.y * 0.5 + 0.5) * 100 };
      };

      // Cell label phase (0..1): show an "Eukaryotic cell" callout
      const cellLabelFade = ss(0.1, 0.5, p) * (1 - ss(1.1, 1.5, p));
      if (cellLabelFade > 0.02) {
        const pN = project(nucleusWorldPos);
        if (pN) labels.push({ id: "N", title: "Nucleus", subtitle: "Holds the DNA", x: pN.x, y: pN.y, fade: cellLabelFade });
        // One additional callout for the membrane
        const memWP = new THREE.Vector3(2.5, 0, 0).applyMatrix4(cellGroup.matrixWorld);
        const pM = project(memWP);
        if (pM) labels.push({ id: "M", title: "Plasma Membrane", subtitle: "Phospholipid Bilayer", x: pM.x, y: pM.y, fade: cellLabelFade });
        // And mitochondria
        const mitoWP = new THREE.Vector3(1.25, 0.70, 0.90).applyMatrix4(cellGroup.matrixWorld);
        const pMi = project(mitoWP);
        if (pMi) labels.push({ id: "Mi", title: "Mitochondrion", subtitle: "Powerhouse", x: pMi.x, y: pMi.y, fade: cellLabelFade });
      }

      // All nucleotide callouts appear together during chapter 2 (progress 2..3):
      // both bases (A / T) AND the three nucleotide components (P / S / B) of the
      // A-half are labeled in a single shot, so the reader sees the whole picture.
      const pairFade = ss(2.0, 2.5, p) * (1 - ss(3.0, 3.4, p));
      if (pairFade > 0.02) {
        const pA = project(half0BaseWorldPos);
        const pT = project(half1BaseWorldPos);
        const pP = project(half0PhosWorldPos);
        const pS = project(half0SugarWorldPos);
        if (pA) labels.push({ id: "A", title: "Adenine",      subtitle: "Nitrogenous base · purine", x: pA.x, y: pA.y, fade: pairFade });
        if (pT) labels.push({ id: "T", title: "Thymine",      subtitle: "Nitrogenous base · pyrimidine", x: pT.x, y: pT.y, fade: pairFade });
        if (pS) labels.push({ id: "S", title: "Deoxyribose",  subtitle: "Pentose sugar (5-ring)", x: pS.x, y: pS.y, fade: pairFade });
        if (pP) labels.push({ id: "P", title: "Phosphate",    subtitle: "PO₄ backbone unit", x: pP.x, y: pP.y, fade: pairFade });
      }

      window.dispatchEvent(new CustomEvent("pin-labels-update", { detail: labels }));

      // Twinkle star layers — per-layer opacity breathing. Per-star color jitter
      // via the `color` attribute would also work but costs a buffer upload every
      // frame; opacity-modulated additive points read as twinkling well enough.
      const tsec = t * 0.001;
      for (let li = 0; li < starLayers.length; li++) {
        const L = starLayers[li];
        // Each layer breathes at slightly different rates/phases for variety
        const k = 0.75 + 0.25 * Math.sin(tsec * (0.6 + li * 0.25) + li * 1.3);
        L.mat.opacity = (li === starLayers.length - 1 ? 0.9 : 0.65) * k;
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };

    if (REDUCED) {
      // Render a single static frame and stop the loop; scroll still works but nothing animates.
      renderer.render(scene, camera);
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      vio.disconnect();
      renderer.dispose();
      disposables.forEach(d => { try { d.dispose && d.dispose(); } catch (e) {} });
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />;
};

// ---------- LABEL OVERLAY ----------
const PinLabels = () => {
  const [labels, setLabels] = React.useState([]);
  React.useEffect(() => {
    const onUpdate = (e) => setLabels(e.detail);
    window.addEventListener("pin-labels-update", onUpdate);
    return () => window.removeEventListener("pin-labels-update", onUpdate);
  }, []);
  return (
    <div className="pin-labels">
      {labels.map(L => (
        <div key={L.id} className="pin-label" style={{
          left: `${L.x}%`, top: `${L.y}%`, opacity: L.fade,
        }}>
          <div className="pin-label-dot" />
          <div className="pin-label-line" />
          <div className="pin-label-box">
            <div className="pin-label-id">{L.id}</div>
            <div>
              <div className="pin-label-title">{L.title}</div>
              <div className="pin-label-sub">{L.subtitle}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

window.PinScene = PinScene;
window.PinLabels = PinLabels;
